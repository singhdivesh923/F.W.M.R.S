-- ============================================================
-- EcoWaste Pro - Food Waste Deduction Management System Database Schema
-- Database Target: MySQL 5.7+ / 8.0+
-- ============================================================

CREATE DATABASE IF NOT EXISTS `food_waste_db` 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

USE `food_waste_db`;

-- ------------------------------------------------------------
-- 1. Departments / Locations Table
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `departments` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL,
  `code` VARCHAR(20) NOT NULL UNIQUE,
  `description` VARCHAR(255) DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ------------------------------------------------------------
-- 2. Food Categories Table
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `categories` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL,
  `default_cost_per_kg` DECIMAL(10,2) DEFAULT 0.00,
  `color_code` VARCHAR(20) DEFAULT '#10b981',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ------------------------------------------------------------
-- 3. Waste Reasons Table
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `waste_reasons` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `reason` VARCHAR(150) NOT NULL,
  `category` ENUM('Operational', 'Quality', 'Storage', 'Consumer', 'Other') DEFAULT 'Operational',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ------------------------------------------------------------
-- 4. Main Food Waste Records Table
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `waste_records` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `date` DATE NOT NULL,
  `meal_type` ENUM('Breakfast', 'Lunch', 'Dinner', 'Snacks', 'All Day Prep') NOT NULL,
  `department` VARCHAR(100) NOT NULL,
  `category` VARCHAR(100) NOT NULL,
  `dish_name` VARCHAR(150) NOT NULL,
  `quantity_kg` DECIMAL(10,2) NOT NULL,
  `unit_cost` DECIMAL(10,2) NOT NULL,
  `total_cost` DECIMAL(10,2) GENERATED ALWAYS AS (`quantity_kg` * `unit_cost`) STORED,
  `reason` VARCHAR(150) NOT NULL,
  `action_prevention` TEXT DEFAULT NULL,
  `recorded_by` VARCHAR(100) NOT NULL DEFAULT 'Admin Staff',
  `facility_type` VARCHAR(50) DEFAULT 'Restaurant',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_date` (`date`),
  INDEX `idx_department` (`department`),
  INDEX `idx_category` (`category`),
  INDEX `idx_reason` (`reason`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ------------------------------------------------------------
-- 5. Reduction Goals Table
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `reduction_goals` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `month_year` VARCHAR(7) NOT NULL, -- e.g. "2026-09"
  `target_reduction_pct` DECIMAL(5,2) NOT NULL DEFAULT 15.00,
  `target_max_waste_kg` DECIMAL(10,2) NOT NULL,
  `target_max_cost` DECIMAL(10,2) NOT NULL,
  `status` ENUM('Active', 'Achieved', 'Exceeded') DEFAULT 'Active',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ------------------------------------------------------------
-- 6. Audit Trail Logs Table
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `audit_logs` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `action` VARCHAR(50) NOT NULL,
  `record_id` INT DEFAULT NULL,
  `user_name` VARCHAR(100) DEFAULT 'Admin',
  `details` TEXT DEFAULT NULL,
  `timestamp` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- SEED DATA INSERTION
-- ============================================================

INSERT IGNORE INTO `departments` (`id`, `name`, `code`, `description`) VALUES
(1, 'Kitchen Prep', 'PREP', 'Raw ingredient prep and vegetable cutting'),
(2, 'Buffet Line', 'BUFFET', 'Self-service dining area counters'),
(3, 'Plate Waste', 'DINING', 'Customer table return and leftovers'),
(4, 'Cold Storage', 'STORAGE', 'Refrigerators, chillers, and freezers'),
(5, 'Bakery & Pastry', 'BAKERY', 'Baking and dessert section');

INSERT IGNORE INTO `categories` (`id`, `name`, `default_cost_per_kg`, `color_code`) VALUES
(1, 'Produce (Vegetables & Fruits)', 3.50, '#10b981'),
(2, 'Meat & Poultry', 12.00, '#f43f5e'),
(3, 'Seafood', 18.50, '#06b6d4'),
(4, 'Dairy & Eggs', 4.20, '#f59e0b'),
(5, 'Bakery & Grains', 2.80, '#8b5cf6'),
(6, 'Prepared / Cooked Dishes', 8.00, '#3b82f6'),
(7, 'Beverages & Liquids', 2.10, '#64748b');

INSERT IGNORE INTO `waste_reasons` (`id`, `reason`, `category`) VALUES
(1, 'Overproduction / Excess Cooking', 'Operational'),
(2, 'Expiration / Date Expired', 'Storage'),
(3, 'Spoilage / Quality Deterioration', 'Storage'),
(4, 'Plate Waste / Customer Leftovers', 'Consumer'),
(5, 'Trim & Prep Loss', 'Operational'),
(6, 'Cooking Error / Burnt', 'Quality'),
(7, 'Cold Chain / Temp Spikes', 'Storage');

-- Seed Sample Waste Records
INSERT INTO `waste_records` (`date`, `meal_type`, `department`, `category`, `dish_name`, `quantity_kg`, `unit_cost`, `reason`, `action_prevention`, `recorded_by`, `facility_type`) VALUES
(CURDATE(), 'Lunch', 'Buffet Line', 'Prepared / Cooked Dishes', 'Grilled Chicken Breasts', 14.50, 12.50, 'Overproduction / Excess Cooking', 'Reduce batch size by 20% on Tuesdays', 'Chef Marco', 'Hotel Dining'),
(CURDATE(), 'Dinner', 'Plate Waste', 'Produce (Vegetables & Fruits)', 'Mixed Salad Bowls', 8.20, 4.00, 'Plate Waste / Customer Leftovers', 'Decrease side portion sizing by 15%', 'Sarah Jenkins', 'Hotel Dining'),
(DATE_SUB(CURDATE(), INTERVAL 1 DAY), 'Breakfast', 'Bakery & Pastry', 'Bakery & Grains', 'Assorted Croissants & Danishes', 6.80, 5.50, 'Expiration / Date Expired', 'Offer 50% discount item bundle at 10 AM', 'Chef Pierre', 'Cafeteria'),
(DATE_SUB(CURDATE(), INTERVAL 1 DAY), 'Lunch', 'Kitchen Prep', 'Produce (Vegetables & Fruits)', 'Potato & Onion Trimmings', 18.40, 2.80, 'Trim & Prep Loss', 'Train prep staff on precision peeling knife skills', 'Dave Miller', 'Restaurant'),
(DATE_SUB(CURDATE(), INTERVAL 2 DAY), 'Dinner', 'Cold Storage', 'Dairy & Eggs', 'Whole Milk & Cream Jugs', 12.00, 3.80, 'Cold Chain / Temp Spikes', 'Re-calibrate chiller thermostat #2', 'Alex Vance', 'Corporate Canteen'),
(DATE_SUB(CURDATE(), INTERVAL 3 DAY), 'Lunch', 'Buffet Line', 'Seafood', 'Steamed Salmon Fillets', 9.50, 19.00, 'Overproduction / Excess Cooking', 'Implement cook-to-order station past 1:30 PM', 'Chef Marco', 'Hotel Dining'),
(DATE_SUB(CURDATE(), INTERVAL 4 DAY), 'Dinner', 'Kitchen Prep', 'Meat & Poultry', 'Beef Stew Cuts', 11.20, 14.00, 'Cooking Error / Burnt', 'Ensure timer alert sounds on simmer kettles', 'Chef Elena', 'Mess Hall'),
(DATE_SUB(CURDATE(), INTERVAL 5 DAY), 'Breakfast', 'Buffet Line', 'Prepared / Cooked Dishes', 'Scrambled Eggs & Hashbrowns', 15.00, 6.20, 'Overproduction / Excess Cooking', 'Use smaller 1/3 size hotel pans for final hour', 'Mark Anthony', 'Hotel Dining');

-- Seed Initial Monthly Goal
INSERT INTO `reduction_goals` (`month_year`, `target_reduction_pct`, `target_max_waste_kg`, `target_max_cost`, `status`) VALUES
(DATE_FORMAT(CURDATE(), '%Y-%m'), 20.00, 250.00, 1800.00, 'Active');
