import express from 'express';
import { json } from 'body-parser';
import path from 'path';
import fs from 'fs';
import generateOGImage from './utils/og';

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(json());
// app.use('/og-images', express.static(path.join(__dirname, 'public', 'og-images')));

// Types
interface PostData {
  id: string;
  title: string;
  content: string;
  image?: string;
}

// Route to generate OG image
app.post('/api/generate-og-image', async (req, res) => {
  try {
    const postData: PostData = req.body;
    
    if (!postData.id || !postData.title || !postData.content) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const imageBuffer = await generateOGImage(postData);

    res.set('Transfer-Encoding','chunked')
    res.set('Content-Type', 'image/png');
    res.send(imageBuffer);

  } catch (error) {
    console.error('Error generating OG image:', error);
    res.status(500).json({ error: 'Failed to generate OG image' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

export default app;