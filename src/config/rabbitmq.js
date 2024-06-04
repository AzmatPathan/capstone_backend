import amqp from 'amqplib';

const RABBITMQ_URL = 'amqp://localhost'; // RabbitMQ server URL

let connection, channel;

const connectRabbitMQ = async () => {
    try {
        connection = await amqp.connect(RABBITMQ_URL);
        channel = await connection.createChannel();
        await channel.assertQueue('equipmentDataQueue', { durable: true });

        console.log('Connected to RabbitMQ');
    } catch (error) {
        console.error('Error connecting to RabbitMQ:', error);
    }
};

const publishToQueue = async (queueName, message) => {
    try {
        await channel.sendToQueue(queueName, Buffer.from(message), { persistent: true });
    } catch (error) {
        console.error('Error publishing to queue:', error);
    }
};

const consumeQueue = async (queue, callback) => {
    try {
        await channel.assertQueue(queue, { durable: true });
        console.log(`Consuming messages from ${queue}`);

        channel.consume(queue, async (message) => {
            if (message !== null) {
                try {
                    const content = message.content.toString();
                    const data = JSON.parse(content);
                    await callback(data);
                    channel.ack(message);
                } catch (err) {
                    console.error(`Error processing message: ${err.message}`, message.content.toString());
                    channel.nack(message, false, false); // Reject message without requeue
                }
            }
        });
    } catch (error) {
        console.error('Error consuming messages from RabbitMQ:', error.message);
        throw error;
    }
};

export { connectRabbitMQ, publishToQueue, consumeQueue };
