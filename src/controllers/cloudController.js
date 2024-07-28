
import { getImageText, generateTextFromInput } from '../helpers/cloud/google/ocr.js';
import {getImageTextFromAws} from '../helpers/cloud/aws/rekognition.js';
import Tesseract from 'tesseract.js';
import path from 'path';
import { fileURLToPath } from 'url';

// Path setting
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Change flag to true to use GCP image processing
// NOTE: Please create key file from google project
//       enable cloud vision API. Paste you keys to 
//       file keys.json.

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
      resultData.data = imageData;
      const regex = /```json\n([\s\S]*?)\n```/;
      const match = imageData?.text?.match(regex);

      if (match) {
        try {
          const text = imageData?.text?.replace('```json\n', '').replace('\n```', '');
          const parsedData = JSON.parse(text);
          const jsonString = match[1];
          resultData = JSON.parse(jsonString);
        } catch (error) {
          console.error('Failed to parse JSON:', error);
        }
      } else {
        console.error('No JSON data found.');
      }
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
