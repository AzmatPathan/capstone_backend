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

  const meaningfulDataQuery = "3 keys model_number, serial_number and manufacturer must have values ";
  const convertTextQuery = "Convert below raw text to meaningful JSON object representation of the text, with no formatting, escaping, or additional characters. Output should be a single valid JSON object with syntax correct."

  const requiredData = await generativeModel.generateContent(meaningfulDataQuery + convertTextQuery + `\n` + text);
  const rawData = await generativeModel.generateContent(convertTextQuery + `\n` + text);
  const cleanedRequiredDataString = requiredData?.response?.candidates[0]?.content?.parts[0]?.text?.trim();
  return {
    requiredData: JSON.parse(cleanedRequiredDataString),
    rawData: rawData?.response?.candidates[0]?.content?.parts[0].text,
  };
}
