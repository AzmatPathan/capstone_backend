CREATE DATABASE itms;

USE itms;

CREATE TABLE Users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('admin', 'user') NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    last_login DATETIME DEFAULT NULL,
    is_active BOOLEAN DEFAULT TRUE
);

CREATE TABLE Equipments (
    equipment_id INT PRIMARY KEY,
    barcode VARCHAR(50),
    manufacturer VARCHAR(100),
    model_number VARCHAR(100),
    serial_number VARCHAR(100),
    capacity DECIMAL(10,2),
    date DATE,
    speed DECIMAL(10,2),
    voltage DECIMAL(10,2),
    additional_details TEXT
);

CREATE TABLE Images (
    image_id INT PRIMARY KEY,
    equipment_id INT,
    image_url VARCHAR(255),
    description VARCHAR(255),
    FOREIGN KEY (equipment_id) REFERENCES Equipments(equipment_id)
);

CREATE TABLE Data_Review (
    review_id INT AUTO_INCREMENT PRIMARY KEY,
    equipment_id INT,
    reviewer_id INT,
    review_date DATETIME,
    reviewed_data TEXT,
    status VARCHAR(50) NOT NULL DEFAULT 'Pending',
    FOREIGN KEY (equipment_id) REFERENCES Equipments(equipment_id),
    FOREIGN KEY (reviewer_id) REFERENCES Users(user_id)
);