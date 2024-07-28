import vision from '@google-cloud/vision';
import path from 'path';
import { fileURLToPath } from 'url';
import { VertexAI }  from '@google-cloud/vertexai';

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

  const randomText = detections.map(text =>  {
    return text?.description;
  });

  return generateTextFromInput(JSON.stringify(randomText));
};


export async function generateTextFromInput(text) {
  const vertexAI = new VertexAI({project: "x-plateau-426019-j9", location: 'us-central1'});

  const generativeModel = vertexAI.getGenerativeModel({
    model: 'gemini-1.5-flash-001',
  });

  const result = await generativeModel.generateContent(`return me json data after normalizing below raw data \n` + text);
  const contentResponse = await result.response;
  return contentResponse?.candidates[0]?.content?.parts[0];
}
