import express from 'express';
import userRoutes from './routes/userRoutes.js';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import equipmentRoutes from './routes/equipmentRoutes.js';


dotenv.config();

const PORT = process.env.PORT || 5000;

const app = express();

app.use(bodyParser.json());
app.use(express.json());
app.use(cookieParser());

//Routes
app.use('/api/users', userRoutes);
app.use('/api/equipments', equipmentRoutes);

//start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});



