import pool from '../config/db.js';

const fetchUsers = async () => {
    const [rows] = await pool.query('SELECT * FROM users');
    return rows;
};

export default fetchUsers;