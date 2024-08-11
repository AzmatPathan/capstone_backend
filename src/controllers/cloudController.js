
import { getImageText, generateTextFromInput } from '../helpers/cloud/google/ocr.js';
import { getImageTextFromAws } from '../helpers/cloud/aws/rekognition.js';
import { processGcpVertexData } from '../helpers/image/imageDataHandler.js';
import Tesseract from 'tesseract.js';
import path from 'path';
import { fileURLToPath } from 'url';

// Path setting
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const USE_GCP_CLOUD = true;
const USE_AWS_CLOUD = false;

export const getImageTranslation = async (req, res) => {
  //set Image Path
  const imagePath = path.join(__dirname, `../../assets/images/${req.query.ImageName}`);

  try {
    let imageData = null;
    let resultData = {};
    if (USE_GCP_CLOUD) {
      imageData = await getImageText(imagePath);
      resultData = processGcpVertexData(imageData);
    } else if (USE_AWS_CLOUD) {
      await getImageTextFromAws(req.query.ImageName);
    } else {
      Tesseract.recognize(imagePath)
      .then(function(result) {
        generateTextFromInput(result.data.text)
      });
    }
    res.status(201).json({ data: resultData, message: 'Image processed successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error while processing image' });
  }
};
