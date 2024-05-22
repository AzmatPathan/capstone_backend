import pool from '../config/db.js';
import { addEquipment } from './equipmentModel.js';

// Reusable function for querying the database
const queryDatabase = async (query, values = []) => {
    try {
        const [rows] = await pool.query(query, values);
        return rows;
    } catch (error) {
        console.error('Database query error:', error);
        throw error;
    }
};


export const addEquipmentDataReview = async (equipmentData) => {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        // Add the equipment
        await addEquipment(equipmentData);

        console.log(equipmentData);

        // Create data review entry with status 'Pending'
        await queryDatabase(
            `INSERT INTO Data_Review (equipment_id, reviewer_id, review_date, reviewed_data, status)
            VALUES (?, ?, NOW(), ?, 'Pending')`,
            [equipmentData.equipment_id, null, JSON.stringify(equipmentData)]
        );

        await connection.commit();

        return {
            success: true,
            equipment_id: equipmentData.equipment_id
        };
    } catch (error) {
        await connection.rollback();
        console.error('Error adding equipment:', error);
        throw error;
    } finally {
        connection.release();
    }
};


export const assignReview = async (reviewId, adminId) => {
    try {
        const result = await queryDatabase(
            `UPDATE Data_Review SET reviewer_id = ? WHERE review_id = ? AND reviewer_id IS NULL`,
            [adminId, reviewId]
        );

        if (result.affectedRows === 0) {
            return {
                success: false,
                message: `Review with ID ${reviewId} is already assigned or does not exist.`
            };
        }

        return {
            success: true,
            message: `Review with ID ${reviewId} assigned to admin ${adminId}.`
        };
    } catch (error) {
        console.error('Error assigning review:', error);
        throw error;
    }
}


export const updateReviewStatus = async (reviewId, adminId, status) => {
    try {
        const validStatuses = ['Approved', 'Rejected'];
        if (!validStatuses.includes(status)) {
            return {
                success: false,
                message: `Invalid status: ${status}. Must be 'Approved' or 'Rejected'.`
            };
        }

        const result = await queryDatabase(
            `UPDATE Data_Review SET status = ?, review_date = NOW() WHERE review_id = ? AND reviewer_id = ?`,
            [status, reviewId, adminId]
        );

        if (result.affectedRows === 0) {
            return {
                success: false,
                message: `Review with ID ${reviewId} could not be updated.`
            };
        }

        return {
            success: true,
            message: `Review with ID ${reviewId} has been ${status.toLowerCase()}.`
        };
    } catch (error) {
        console.error('Error updating review status:', error);
        throw error;
    }
}