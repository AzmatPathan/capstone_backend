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

export const addEquipment = async (equipmentData) => {
    const { equipment_id } = equipmentData;

    try {
        // Check if equipment_id already exists
        const existingEquipment = await getEquipmentById(equipment_id);
        if (existingEquipment) {
            return {
                success: false,
                message: `Equipment with ID ${equipment_id} already exists.`,
            };
        }


        await queryDatabase(
            `INSERT INTO Equipments SET ?`,
            equipmentData
        );

        return equipment_id;
    } catch (error) {
        console.error('Error adding equipment:', error);
        throw error;
    }
};

export const getEquipmentById = async (equipmentId) => {
    try {
        const rows = await queryDatabase('SELECT * FROM Equipments WHERE equipment_id = ?', [equipmentId]);
        return rows.length > 0 ? rows[0] : null;
    } catch (error) {
        console.error('Error fetching equipment:', error);
        throw error;
    }
};

export const updateEquipment = async (equipmentId, updateData) => {
    const updateQuery = `
        UPDATE Equipments
        SET ?
        WHERE equipment_id = ?
    `;

    try {
        await pool.query(updateQuery, [updateData, equipmentId]);
        return getEquipmentById(equipmentId);
    } catch (error) {
        console.error('Error updating equipment by ID:', error);
        throw error;
    }
};
