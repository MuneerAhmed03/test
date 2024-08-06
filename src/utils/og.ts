import { createCanvas, loadImage, CanvasRenderingContext2D, Image } from 'canvas';

interface Post {
  id: string;
  title: string;
  content: string;
  image?: string;
}

interface OGImageOptions {
  width: number;
  height: number;
  backgroundColor: string;
  titleColor: string;
  contentColor: string;
  titleFont: string;
  contentFont: string;
  logoPath: string;
}

const defaultOptions: OGImageOptions = {
  width: 1200,
  height: 630,
  backgroundColor: '#f0f0f0',
  titleColor: '#333333',
  contentColor: '#666666',
  titleFont: 'bold 40px Arial',
  contentFont: '24px Arial',
  logoPath: '',
};

async function generateOGImage(post: Post, options: Partial<OGImageOptions> = {}): Promise<Buffer> {
  const opts: OGImageOptions = { ...defaultOptions, ...options };
  const canvas = createCanvas(opts.width, opts.height);
  const ctx = canvas.getContext('2d');

  // Set background
  ctx.fillStyle = opts.backgroundColor;
  ctx.fillRect(0, 0, opts.width, opts.height);

  // Add logo
//   await addLogo(ctx, opts.logoPath);

  // Add title
  addText(ctx, post.title, 50, 200, opts.titleFont, opts.titleColor, 1100);

  // Add content snippet
  const contentSnippet = post.content.substring(0, 100) + '...';
  addText(ctx, contentSnippet, 50, 250, opts.contentFont, opts.contentColor, 1100);

  // Add image if available
  if (post.image) {
    await addPostImage(ctx, post.image);
  }

  // Return the buffer
  return canvas.toBuffer('image/png');
}

async function addLogo(ctx: CanvasRenderingContext2D, logoPath: string): Promise<void> {
  const logo = await loadImage(logoPath);
  ctx.drawImage(logo, 50, 50, 100, 100);
}

function addText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  font: string,
  color: string,
  maxWidth: number
): void {
  ctx.font = font;
  ctx.fillStyle = color;
  ctx.fillText(text, x, y, maxWidth);
}

async function addPostImage(ctx: CanvasRenderingContext2D, imagePath: string): Promise<void> {
  const image = await loadImage(imagePath);
  ctx.drawImage(image, 600, 300, 550, 280);
}

export default generateOGImage;