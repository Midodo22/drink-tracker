SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

CREATE TABLE `brands` (
  `id` int(11) NOT NULL,
  `name` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `drinks` (
  `brand_id` int(11) NOT NULL,
  `name` varchar(20) NOT NULL,
  `price` int(11),
  `calories` int(11)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `friends` (
  `user_id` int(11) NOT NULL,
  `friend_id` int(11) NOT NULL,
  `friend_name` varchar(20)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `records` (
  `record_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `brand_id` int(11) NOT NULL,
  `drink_name` varchar(20) NOT NULL,
  `toppings` varchar(20),
  `temp` varchar(20),
  `sugar` int(11),
  `calories` int(11),
  `price` int(11),
  `created_at` timestamp DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `toppings` (
  `brand_id` int(11) NOT NULL,
  `name` varchar(20) NOT NULL,
  `price` int(11) NOT NULL,
  `calories` int(11)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(20) NOT NULL,
  `password` varchar(256) NOT NULL,
  `invite_code` varchar(10),
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

ALTER TABLE `brands`
  ADD PRIMARY KEY (`id`);

ALTER TABLE `drinks`
  ADD PRIMARY KEY (`brand_id`,`name`);

ALTER TABLE `friends`
  ADD PRIMARY KEY (`user_id`,`friend_id`);

ALTER TABLE `records`
  ADD PRIMARY KEY (`user_id`,`record_id`);

ALTER TABLE `toppings`
  ADD PRIMARY KEY (`brand_id`,`name`);

INSERT INTO users (username, password)
VALUES ("admin", "3611673572");

INSERT INTO users (username, password)
VALUES ("CVML", "2058471855");

INSERT INTO records (user_id, record_id, brand_id, drink_name, temp, sugar, price)
VALUES (1, 1, 1, "八曜和茶", "hot", "half", 35);

INSERT INTO records (user_id, record_id, brand_id, drink_name, temp, sugar, price)
VALUES (1, 2, 3, "伯爵可可拿鐵(L)", "normal", "less", 80);

INSERT INTO records (user_id, record_id, brand_id, drink_name, temp, sugar, price, calories)
VALUES (1, 3, 2, "極黑芝麻奶茶", "warm", "seven", 65, 554);

COMMIT;
