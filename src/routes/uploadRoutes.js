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

router.post('/', (req, res) => {
  uploadSingleImage(req, res, async function (err) {
    if (err) {
      res.status(400).send({ message: err.message });
      return;
    }

    const { equipment_id, description,image } = req.body;
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

export default router;
