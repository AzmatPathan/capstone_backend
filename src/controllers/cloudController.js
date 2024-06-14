
import { getImageText } from '../helpers/cloud/google/ocr.js';
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

const USE_CLOUD = false;

export const getImageTranslation = async (req, res) => {
  //set Image Path
  const imagePath = path.join(__dirname, `../../assets/images/${req.query.ImageName}`);

  try {
    if (USE_CLOUD) {
      await getImageText(imagePath);
    } else {
      Tesseract.recognize(imagePath)
      .then(function(result) {
        console.log("=======result - text", result.data.text);
      });
    }
    res.status(201).json({ message: 'Image processed successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error while processing image' });
  }
};
