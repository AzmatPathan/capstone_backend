CREATE TABLE `itms`.Users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('admin', 'user') NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    last_login DATETIME DEFAULT NULL,
    is_active BOOLEAN DEFAULT TRUE
);

CREATE TABLE `itms`.Equipments (
    equipment_id INT PRIMARY KEY,
    barcode VARCHAR(50),
    manufacturer VARCHAR(100),
    model_number VARCHAR(100),
    serial_number VARCHAR(100),
    capacity DECIMAL(10,2),
    date DATE,
    speed DECIMAL(10,2),
    voltage DECIMAL(10,2),
    additional_details TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE `itms`.Images (
    image_id INT AUTO_INCREMENT PRIMARY KEY,
    equipment_id INT,
    image_url VARCHAR(255),
    description VARCHAR(255),
    FOREIGN KEY (equipment_id) REFERENCES `itms`.Equipments(equipment_id)
);

CREATE TABLE `itms`.Data_Review (
    review_id INT AUTO_INCREMENT PRIMARY KEY,
    equipment_id INT,
    reviewer_id INT,
    review_date DATETIME,
    reviewed_data TEXT,
    status VARCHAR(50) NOT NULL DEFAULT 'Pending',
    FOREIGN KEY (equipment_id) REFERENCES `itms`.Equipments(equipment_id),
    FOREIGN KEY (reviewer_id) REFERENCES `itms`.Users(user_id)
);

CREATE TABLE `itms`.User_Equipment (
    user_equipment_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    equipment_id INT,
    FOREIGN KEY (user_id) REFERENCES `itms`.Users(user_id),
    FOREIGN KEY (equipment_id) REFERENCES `itms`.Equipments(equipment_id)
);
