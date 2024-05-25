import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import userRoutes from './routes/userRoutes.js';
import equipmentRoutes from './routes/equipmentRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';
import { connectRabbitMQ, consumeQueue } from './config/rabbitmq.js';
import { insertUserEquipment } from './controllers/userEquipmentController.js';

dotenv.config();

const PORT = process.env.PORT || 5000;

const app = express();

app.use(bodyParser.json());
app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/api/users', userRoutes);
app.use('/api/equipments', equipmentRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/upload', uploadRoutes);

app.use(notFound);
app.use(errorHandler);

// Start the server and connect to RabbitMQ
const startServer = async () => {
  try {
    // Connect to RabbitMQ
    await connectRabbitMQ();

    // Consume messages from the queue
    await consumeQueue('userEquipmentQueue', async (data) => {
     
      const {  user_id, equipment_id  } = data;
      await insertUserEquipment(user_id, equipment_id);
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
