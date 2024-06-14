import vision from '@google-cloud/vision';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Adjust the path to your JSON key file
const keyFilePath = path.join(__dirname, '../../../../keys.json');

// Creates a client
const client = new vision.ImageAnnotatorClient({
  keyFilename: keyFilePath
});

export const getImageText = async (imagePath) => {
  const [result] = await client.textDetection(imagePath);
  const detections = result.textAnnotations;
  console.log('Text:');
  detections.forEach(text => {
    if (text?.description) {
      console.log(text?.description);
    }
  });
};
