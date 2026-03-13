-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Mar 13, 2026 at 10:03 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `eduvertex`
--

-- --------------------------------------------------------

--
-- Table structure for table `classes`
--

CREATE TABLE `classes` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `section` varchar(10) DEFAULT NULL,
  `room` varchar(50) DEFAULT NULL,
  `department_id` int(11) DEFAULT NULL,
  `capacity` int(11) DEFAULT NULL,
  `status` enum('active','inactive') DEFAULT 'active'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `classes`
--

INSERT INTO `classes` (`id`, `name`, `section`, `room`, `department_id`, `capacity`, `status`) VALUES
(1, 'CSE A', NULL, '101', 1, 60, 'active'),
(2, 'CSE B', NULL, '102', 1, 60, 'active'),
(3, 'ECE A', NULL, '201', 2, 60, 'active'),
(4, 'ECE B', NULL, '202', 2, 60, 'active'),
(5, 'MECH A', NULL, '301', 3, 60, 'active'),
(6, 'MECH B', NULL, '302', 3, 60, 'active'),
(7, 'CIVIL A', NULL, '401', 4, 60, 'active'),
(8, 'CIVIL B', NULL, '402', 4, 60, 'active'),
(9, 'EEE A', NULL, '501', 5, 60, 'active'),
(10, 'EEE B', NULL, '502', 5, 60, 'active'),
(11, 'CSE A', NULL, '101', 1, 60, 'active'),
(12, 'CSE B', NULL, '102', 1, 60, 'active'),
(13, 'ECE A', NULL, '201', 2, 60, 'active'),
(14, 'ECE B', NULL, '202', 2, 60, 'active'),
(15, 'MECH A', NULL, '301', 3, 60, 'active'),
(16, 'MECH B', NULL, '302', 3, 60, 'active'),
(17, 'CIVIL A', NULL, '401', 4, 60, 'active'),
(18, 'CIVIL B', NULL, '402', 4, 60, 'active'),
(19, 'EEE A', NULL, '501', 5, 60, 'active'),
(20, 'EEE B', NULL, '502', 5, 60, 'active'),
(21, 'III Year AIDS', NULL, '7', 6, 60, 'active');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `classes`
--
ALTER TABLE `classes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `department_id` (`department_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
