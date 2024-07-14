import { createPool } from 'mysql2/promise'; 

const pool = createPool({
  host: 'localhost',
  user: 'root', 
  password: 'S@ieswaran03', 
  database: 'N01656509W24',
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
