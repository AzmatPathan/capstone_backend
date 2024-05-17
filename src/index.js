import express from 'express';
import userRoutes from './routes/userRoutes.js';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 5000;

const app = express();

app.use(bodyParser.json());
app.use(express.json());
app.use(cookieParser());

//Routes
app.use('/api/users', userRoutes);

//start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});



