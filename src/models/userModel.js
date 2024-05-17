import pool from '../config/db.js';
import bcrypt from 'bcryptjs';

// Hash password using bcryptjs
const hashPassword = async (password) => {
    return await bcrypt.hash(password, 10);
};

const fetchUsers = async () => {
    const [rows] = await pool.query('SELECT * FROM users');
    return rows;
};

const fetchUser = async (email) => {
    const [rows] = await pool.query('SELECT * FROM Users WHERE email = ?', [email]);
    return rows[0];
};

const createUser = async (name, email, password, role) => {

    try {
        const hashedPassword = await hashPassword(password);
        const [result] = await pool.query(
            'INSERT INTO Users (username, email, password_hash, role) VALUES (?, ?, ?, ?)',
            [name, email, hashedPassword, role]
        );

        if (result.affectedRows === 0) {
            throw new Error('Error creating user');
        }

        // Fetch and return the newly created user
        const [rows] = await pool.query('SELECT * FROM Users WHERE user_id = ?', [result.insertId]);
        return rows[0];
    } catch (error) {
        throw new Error(error.message);
    }
}


export { fetchUsers, fetchUser, createUser } 