import express from 'express';
import { json } from 'body-parser';
import path from 'path';
import fs from 'fs';
import generateOGImage from './utils/og';
import NodeCache from 'node-cache';

const cache = new NodeCache({ stdTTL: 3600 });

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(json());
// app.use('/og-images', express.static(path.join(__dirname, 'public', 'og-images')));

// Types
interface PostData {
  title: string;
  content: string;
  image?: string;
}

// Route to generate OG image
app.post('/api/generate-og-image', async (req, res) => {
  try {
    const postData: PostData = {
        title: req.query.title as string,
        content: req.query.content as string,
        image: req.query.image as string | undefined,
      };
    
    if (!postData.title || !postData.content) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    const cacheKey = `og-image-${postData.title}-${postData.content}-${postData.image}`;
    let imageBuffer = cache.get(cacheKey) as Buffer | undefined;
    
    if (!imageBuffer) {
        imageBuffer = await generateOGImage(postData);
        cache.set(cacheKey, imageBuffer);
      }
    res.set('Transfer-Encoding','chunked')
    res.set('Content-Type', 'image/png');
    res.send(imageBuffer);

  } catch (error) {
    console.error('Error generating OG image:', error);
    res.status(500).json({ error: 'Failed to generate OG image' });
  }
});

app.get('/ping', (req, res) => {
  console.log('Ping received at', new Date().toISOString());
  res.status(200).send('pong');
});


// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

export default app;