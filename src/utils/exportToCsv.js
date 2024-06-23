import { createObjectCsvWriter } from 'csv-writer';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';

// Get the current module's file path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Utility function to export data as CSV
 * @param {Object[]} data - Array of objects containing data to export
 * @param {Object[]} fields - Array of field definitions for CSV columns
 * @param {string} filename - Filename for the exported CSV file
 * @returns {Promise<string>} - File path where the CSV is saved
 */
export const exportToCSV = async (data, fields, filename, res) => {
    try {
        // Ensure the exports directory exists
        const exportDir = path.join(__dirname, '..', 'exports');
        if (!fs.existsSync(exportDir)) {
            fs.mkdirSync(exportDir, { recursive: true });
        }

        // Create a CSV writer instance
        const csvWriter = createObjectCsvWriter({
            path: path.join(exportDir, filename), // Save CSV file locally
            header: fields,
        });

        // Define the full path where the CSV will be saved
        const filePath = path.join(exportDir, filename);

        // Write data to CSV
        await csvWriter.writeRecords(data);
        console.log('CSV written successfully');

        // Send the CSV file as a download
        res.download(filePath, 'equipments.csv', (err) => {
            if (err) {
                console.error('Error downloading file:', err);
                res.status(500).json({ message: 'Failed to download file' });
            } else {
                console.log('File downloaded successfully');
            }
        });
    } catch (error) {
        console.error('Error exporting data:', error);
        throw new Error('Failed to export data as CSV');
    }
};



