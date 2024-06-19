import pool from '../config/db.js';

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
    console.log(equipmentData)
    try {
        // Create data review entry with status 'Pending'
        await queryDatabase(
            `INSERT INTO Data_Review (equipment_id, reviewer_id, review_date, reviewed_data, status)
            VALUES (?, ?, NOW(), ?, 'Pending')`,
            [equipmentData.equipment_id, null, JSON.stringify(equipmentData)]
        );

        return {
            success: true,
            equipment_id: equipmentData.equipment_id
        };
    } catch (error) {
        console.error('Error adding equipment data review:', error);
        throw error;
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

export const getAllReviews = async () => {
    const query = `
    SELECT 
        e.equipment_id, 
        e.barcode, 
        u.username AS created_by, 
        e.created_at, 
        r.review_id AS review_id,
        r.review_date AS reviewed_at, 
        r.status
    FROM 
        Equipments e
    LEFT JOIN 
        Data_Review r ON e.equipment_id = r.equipment_id
    INNER JOIN 
        user_equipment ue on ue.equipment_id = e.equipment_id
    LEFT JOIN 
        Users u ON ue.user_id = u.user_id
    order by r.review_date ,e.created_at
`;
    const result = queryDatabase(query)
    console.log(result)
    return await result;
};
