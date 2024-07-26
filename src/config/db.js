import { createPool } from 'mysql2/promise'; 

const pool = createPool({
  
  host: 'mysql', // Kubernetes service name for MySQL
  user: 'myuser', // Your MySQL username
  password: 'mypassword', // Your MySQL password
  database: 'mydatabase', // Your database name
  connectionLimit: 10,

  // host: '34.170.146.157', // Replace with the external IP address of your VM
  // // host: '127.0.0.1', // Use localhost or 127.0.0.1 if connecting through Cloud SQL Proxy
  // user: 'user', // Replace with your Cloud SQL username
  // password: 'password', // Replace with your Cloud SQL password
  // database: 'itms', // Replace with your database name
  // connectionLimit: 10,
});

(async () => {
  try {
    const connection = await pool.getConnection();
    console.log('Connected to the MySQL database');
    connection.release();
  } catch (err) {
    console.error('Error connecting to the database:', err);
  }
})();

export default pool;
