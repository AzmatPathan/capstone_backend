import path from 'path';
import express from 'express';
import multer from 'multer';
import db from '../config/db.js';

const router = express.Router();

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'uploads/');
  },
  filename(req, file, cb) {
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

function fileFilter(req, file, cb) {
  const filetypes = /jpe?g|png|webp/;
  const mimetypes = /image\/jpe?g|image\/png|image\/webp/;

  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = mimetypes.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error('Images only!'), false);
  }
}

const upload = multer({ storage, fileFilter });
const uploadSingleImage = upload.single('image');


/**
 * @typedef ImageUploadResponse
 * @property {string} message
 * @property {integer} imageId
 * @property {object} imageData
 * @property {string} imageData.modelNumber
 * @property {string} imageData.serialNumber
 */

/**
 * @typedef Image
 * @property {integer} id
 * @property {integer} equipment_id
 * @property {string} image_url
 * @property {string} description
 * @property {string} created_at
 * @property {string} equipment_created_at
 * @property {string} review_status
 */

/**
 * @route POST /api/images
 * @group Images - Operations about image upload
 * @param {file} image.formData.required - The image file to upload
 * @param {integer} equipment_id.formData.required - The ID of the equipment associated with the image
 * @param {string} description.formData - The description of the image
 * @produces application/json
 * @returns {ImageUploadResponse.model} 200 - Image uploaded and saved to database
 * @returns {Error} 400 - Bad request
 * @returns {Error} 500 - Internal server error
 * @consumes multipart/form-data
 */
router.post('/', (req, res) => {
  uploadSingleImage(req, res, async function (err) {
    if (err) {
      res.status(400).send({ message: err.message });
      return;
    }

    const { equipment_id, description, image } = req.body;
    const imageUrl = `/uploads/${image}`;

    try {
      // Save the image details to the database
      const result = await db.query('INSERT INTO Images (equipment_id, image_url, description) VALUES (?, ?, ?)', [equipment_id, imageUrl, description]);
      res.status(200).send({
        message: 'Image uploaded and saved to database',
        imageId: result.insertId,
        // Adding temporary dummy data for Front-End Devs for image processing
        imageData: {
          modelNumber: "DUMMY-6234545",
          serialNumber: "DUMMY-1239864",
        }
      });
    } catch (error) {
      console.error('Error saving image to database:', error);
      res.status(500).send('Internal server error');
    }
  });
});

const getAllUploadedImages = async (req, res) => {
  try {
    const images = await getAllImages();
    res.status(200).send(images);
  } catch (error) {
    console.error('Error retrieving images:', error);
    res.status(500).send('Internal server error');
  }
};

const getAllImages = async () => {
  try {
    const [results] = await db.query(`
     SELECT 
    Images.*, 
    Equipments.created_at AS equipment_created_at,
    Data_Review.status AS review_status
FROM 
    Images
JOIN 
    Equipments ON Images.equipment_id = Equipments.equipment_id
LEFT JOIN 
    Data_Review ON Images.equipment_id = Data_Review.equipment_id;

    `);
    return results;
  } catch (error) {
    throw new Error('Database query failed');
  }
};

/**
 * @route GET /api/images
 * @group Images - Operations about image retrieval
 * @summary Retrieve all uploaded images
 * @returns {Array.<Image>} 200 - An array of uploaded images
 * @returns {Error} 500 - Internal server error
 */
router.get('/', getAllUploadedImages);



export default router;
