import { createPool } from 'mysql2/promise'; 

const pool = createPool({
  host: '34.170.146.157',
  user: 'user',
  password: 'password',
  database: 'itms',
  connectionLimit: 10,
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
