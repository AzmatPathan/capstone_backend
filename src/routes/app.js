// routes/index.js
const express = require('express');
const router = express.Router();

// Define routes
router.get('/', (req, res) => {
    res.send('Hello, Humber!');
});
 
module.exports = router;
