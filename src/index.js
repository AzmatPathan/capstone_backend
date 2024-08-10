import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import cors from 'cors';
import userRoutes from './routes/userRoutes.js';
import equipmentRoutes from './routes/equipmentRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import cloudRoutes from './routes/cloudRoutes.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';
import { connectRabbitMQ, consumeQueue } from './config/rabbitmq.js';
import { insertUserEquipment } from './controllers/userEquipmentController.js';
import { addEquipmentDataReview } from './models/reviewModel.js';
import swaggerGenerator from 'express-swagger-generator';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const PORT = process.env.PORT || 5000;
const app = express();

app.use(bodyParser.json());
app.use(express.json());
app.use(cookieParser());

const swaggerOptions = {
  swaggerDefinition: {
    info: {
      description: 'APIs to manage the Dashboard Microservice',
      title: 'Telus ITMS',
      version: '1.0.0',
    },
    host: 'frontend-service-ew53cd6u7q-uc.a.run.app',
    basePath: '/',
    produces: [
      "application/json",
      "application/xml"
    ],
    schemes: ['https'] // Include HTTPS scheme
  },
  basedir: __dirname, // App absolute path
  files: ['./routes/*.js'] // Path to the API handle folder
};

// CORS configuration
const corsOptions = {
  origin: 'https://app.telus-itms.com', // Allow requests from this origin
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true, // Allow credentials such as cookies and HTTP authentication
  optionsSuccessStatus: 204, // Some legacy browsers choke on status 204
  allowedHeaders: ['Content-Type', 'Authorization'] 
};

app.use(cors(corsOptions)); // Use CORS middleware with the specified options

console.log('UI_URL:', process.env.UI_URL);

const expressSwagger = swaggerGenerator(app);
expressSwagger(swaggerOptions);

// Simple test endpoint
app.options('/test', cors(corsOptions), (req, res) => {
  res.sendStatus(204);
});

app.get('/test', cors(corsOptions), (req, res) => {
  res.json({ message: 'CORS is working' });
});

// Routes
app.use('/api/users', userRoutes);
app.use('/api/equipments', equipmentRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/clouds', cloudRoutes);

app.use(notFound);
app.use(errorHandler);

// Start the server and connect to RabbitMQ
const startServer = async () => {
  try {
    // Connect to RabbitMQ
    await connectRabbitMQ();

    // Consume messages from the queue
    await consumeQueue('equipmentDataQueue', async (data) => {
      const { user_id, equipment_id, equipmentData } = data;
      await insertUserEquipment(user_id, equipment_id);
      console.log(equipmentData);
      await addEquipmentDataReview(equipmentData);
    });

    // Start the Express server
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start the server:', error);
    process.exit(1);
  }
};

startServer();
