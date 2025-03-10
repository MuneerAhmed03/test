import { createCanvas, loadImage, CanvasRenderingContext2D, Image } from 'canvas';

interface Post {
  title: string;
  content: string;
  image?: string;
}

interface OGImageOptions {
  width: number;
  height: number;
  gradientStart: string;
  gradientEnd: string;
  titleColor: string;
  contentColor: string;
  titleFont: string;
  contentFont: string;
  logoPath: string;
}

const defaultOptions: OGImageOptions = {
  width: 1200,
  height: 630,
  gradientStart: '#1c1917',
  gradientEnd: '#172554',
  titleColor: '#ffffff',
  contentColor: '#e5e7eb',
  titleFont: 'bold 40px Arial',
  contentFont: '24px Arial',
  logoPath: `https://avatars.githubusercontent.com/u/97833696?v=4`,
};

// Preload logo
const logoPromise = loadImage(defaultOptions.logoPath);

// Pre-create gradient
const gradientCanvas = createCanvas(1, 1);
const gradientCtx = gradientCanvas.getContext('2d');
const gradient = gradientCtx.createLinearGradient(0, 0, defaultOptions.width, defaultOptions.height);
gradient.addColorStop(0, defaultOptions.gradientStart);
gradient.addColorStop(1, defaultOptions.gradientEnd);

async function generateOGImage(post: Post): Promise<Buffer> {
  const opts: OGImageOptions = { ...defaultOptions};
  const canvas = createCanvas(opts.width, opts.height);
  const ctx = canvas.getContext('2d');


  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, opts.width, opts.height);

  const topRowY = 50;
  const logo = await logoPromise;
  ctx.drawImage(logo, 50, 50, 80, 80);
  await addLogo(ctx, logo, 50, topRowY, 80, 80);
  addText(ctx, "Medial", 150, topRowY + 50, opts.titleFont, '#666666', 1000);

  if(post.title.length >50){
    post.title = post.title.substring(0, 47) + ' ..';
  }
  addText(ctx, post.title, 50, 200, opts.titleFont, opts.titleColor, 1100);

  // Content row: Image (if available) and Content (flex-r  ow, justify-start)
  const contentRowY =250;
  const contentX = post.image ? 600 :50 ;
  const contentWidth = post.image ? 500:1100;

  if (post.image) {
    await addPostImage(ctx, post.image, 50, 230, contentWidth - 50, 400);
  }

  const contentSnippet = post.content.substring(0, 400) + '...';
  addText(ctx, contentSnippet, contentX, contentRowY + 20, opts.contentFont, opts.contentColor, contentWidth);

  // Return the buffer
  return canvas.toBuffer('image/png');

}

async function addLogo(
  ctx: CanvasRenderingContext2D, 
  logo: Image, 
  x: number, 
  y: number, 
  width: number, 
  height: number
): Promise<void> {
;
  ctx.save();
  ctx.beginPath();
  ctx.arc(x + width / 2, y + height / 2, width / 2, 0, Math.PI * 2);
  ctx.closePath();
  ctx.clip();
  ctx.drawImage(logo, x, y, width, height);
  ctx.restore();
}



function addText(
    ctx: CanvasRenderingContext2D,
    text: string,
    x: number,
    y: number,
    font: string,
    color: string,
    maxWidth: number,
  ): number {
    ctx.font = font;
    ctx.fillStyle = color;
  
    const words = text.split(' ');
    let line = '';
    let currentY = y;
  
    for (const word of words) {
      const testLine = line + word + ' ';
      const metrics = ctx.measureText(testLine);
      const testWidth = metrics.width;
  
      if (testWidth > maxWidth && line !== '') {
        ctx.fillText(line, x, currentY);
        line = word + ' ';
        currentY += parseInt(font, 10) * 1.5;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line, x, currentY);
  
    return currentY;
  }

async function addPostImage(
    ctx: CanvasRenderingContext2D,
    imagePath: string,
    containerX: number,
    containerY: number,
    containerWidth: number,
    containerHeight: number,
    cornerRadius: number = 20
  ): Promise<void> {
    const image = await loadImage(imagePath);

    const containerAspectRatio = containerWidth / containerHeight;
    const imageAspectRatio = image.width / image.height;

    let drawWidth, drawHeight, drawX, drawY;
    
    if (imageAspectRatio > containerAspectRatio) {

      drawWidth = containerWidth;
      drawHeight = containerWidth / imageAspectRatio;
      drawX = containerX;
      drawY = containerY + (containerHeight - drawHeight) / 2;
    } else {

      drawHeight = containerHeight;
      drawWidth = containerHeight * imageAspectRatio;
      drawX = containerX + (containerWidth - drawWidth) / 2;
      drawY = containerY;
    }
  

    ctx.save();
    
    // Create a rounded rectangle path
    ctx.beginPath();
    ctx.moveTo(drawX + cornerRadius, drawY);
    ctx.lineTo(drawX + drawWidth - cornerRadius, drawY);
    ctx.quadraticCurveTo(drawX + drawWidth, drawY, drawX + drawWidth, drawY + cornerRadius);
    ctx.lineTo(drawX + drawWidth, drawY + drawHeight - cornerRadius);
    ctx.quadraticCurveTo(drawX + drawWidth, drawY + drawHeight, drawX + drawWidth - cornerRadius, drawY + drawHeight);
    ctx.lineTo(drawX + cornerRadius, drawY + drawHeight);
    ctx.quadraticCurveTo(drawX, drawY + drawHeight, drawX, drawY + drawHeight - cornerRadius);
    ctx.lineTo(drawX, drawY + cornerRadius);
    ctx.quadraticCurveTo(drawX, drawY, drawX + cornerRadius, drawY);
    ctx.closePath();
    
    // Clip to the current path
    ctx.clip();
  
    // Draw the image
    ctx.drawImage(image, drawX, drawY, drawWidth, drawHeight);
    
    // Restore the context state
    ctx.restore();
  }
export default generateOGImage;