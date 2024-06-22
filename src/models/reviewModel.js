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
    try {
        const equipment_id = parseInt(equipmentData.equipment_id);
        await queryDatabase(
            `INSERT INTO Data_Review (equipment_id, reviewer_id, review_date, reviewed_data, status)
            VALUES (?, ?, ?, ?, 'Pending')`,
            [equipment_id, null, null, JSON.stringify(equipmentData)]
        );

        return { success: true, equipment_id: equipment_id };

    } catch (error) {
        console.error('Error adding equipment data review:', error);
        throw new Error('Failed to add equipment data review');
    }
};

export const assignReview = async (reviewId, adminId, res) => {
    try {
        const result = await queryDatabase(
            `UPDATE Data_Review SET reviewer_id = ? WHERE review_id = ? AND reviewer_id IS NULL`,
            [adminId, reviewId]
        );

        if (result.affectedRows === 0) {
            res.json({
                success: false,
                message: `Review with ID ${reviewId} is already assigned or does not exist.`
            });
        } else {
            res.json({
                success: true,
                message: `Review with ID ${reviewId} assigned to admin ${adminId}.`
            });
        }
    } catch (error) {
        console.error('Error assigning review:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const updateReviewStatus = async (reviewId, adminId, status) => {
    try {
        const validStatuses = ['Approved', 'Rejected'];
        if (!validStatuses.includes(status)) {
            throw new Error(`Invalid status: ${status}. Must be 'Approved' or 'Rejected'.`);
        }

        const result = await queryDatabase(
            `UPDATE Data_Review SET status = ?, review_date = NOW() WHERE review_id = ? AND reviewer_id = ?`,
            [status, reviewId, adminId]
        );

        if (result.affectedRows === 0) {
            throw new Error(`Review with ID ${reviewId} could not be updated or does not exist.`);
        }

        return {
            success: true,
            message: `Review with ID ${reviewId} has been ${status.toLowerCase()}.`
        };

    } catch (error) {
        console.error('Error updating review status:', error);
        throw error; // Re-throw the error to propagate it upwards
    }
};

export const getAllReviews = async (req, res) => {
    const query = `
        SELECT 
    e.equipment_id, 
    e.barcode, 
    u_created.username AS created_by, 
    e.created_at, 
    r.review_id AS review_id,
    r.review_date AS reviewed_at, 
    r.status,
    u_reviewer.username AS reviewed_by
FROM 
    Equipments e
LEFT JOIN 
    Data_Review r ON e.equipment_id = r.equipment_id
LEFT JOIN 
    User_Equipment ue ON e.equipment_id = ue.equipment_id
LEFT JOIN 
    Users u_created ON ue.user_id = u_created.user_id
LEFT JOIN 
    Users u_reviewer ON r.reviewer_id = u_reviewer.user_id
ORDER BY 
    r.review_date, e.created_at;

    `;

    try {
        const result = await queryDatabase(query);
        return result;
    } catch (error) {
        console.error('Error fetching all reviews:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const getReviewDetailsById = async (reviewId) => {

    const query = `
        SELECT 
            e.equipment_id, 
            e.barcode, 
            e.manufacturer, 
            e.model_number, 
            e.serial_number, 
            e.capacity, 
            e.date, 
            e.speed, 
            e.voltage, 
            e.additional_details, 
            e.created_at, 
            u.username AS created_by, 
            img.image_url, 
            img.description AS image_description,
            r.reviewer_id AS reviewed_by, 
            r.review_date AS reviewed_at, 
            r.reviewed_data, 
            r.status
        FROM 
            Equipments e
        LEFT JOIN 
            User_Equipment ue ON e.equipment_id = ue.equipment_id
        LEFT JOIN 
            Users u ON ue.user_id = u.user_id
        LEFT JOIN 
            Images img ON e.equipment_id = img.equipment_id
        LEFT JOIN 
            Data_Review r ON e.equipment_id = r.equipment_id
        WHERE 
            r.review_id = ?
    `;

    try {
        const result = await queryDatabase(query, [reviewId]);
        return result[0]
    } catch (error) {
        console.error('Error fetching review details:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
