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

// Function to update last login
const lastLoginUser = async (email) => {
    const [rows] = await pool.query('SELECT user_id FROM Users WHERE email = ?', [email]);

    if (rows.length > 0) {
        const userId = rows[0].user_id;
        await pool.query('UPDATE Users SET last_login = ? WHERE user_id = ?', [new Date(), userId]);
    } else {
        throw new Error('User not found');
    }
};
const fetchUserById = async (id) => {
    const [rows] = await pool.query('SELECT * FROM Users WHERE user_id = ?', [id]);
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

const deleteUserById = async (userId) => {
    try {
        const [result] = await pool.query('DELETE FROM Users WHERE user_id = ?', [userId]);
        return result;
    } catch (error) {
        console.error('Error deleting user:', error);
        throw error;
    }
};


export { fetchUsers, fetchUser, lastLoginUser, createUser, deleteUserById, fetchUserById } 