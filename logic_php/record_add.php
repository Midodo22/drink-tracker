<?php

require "db_connect.php";
$stmt = $conn->stmt_init();

$username = $_SESSION['username'];

$brand_name = $_POST[""];
// $brand_id = $_POST[""];
$drink_name = $_POST[""];
$toppings = $_POST[""];
$temp = $_POST[""];
$sugar = $_POST[""];

$calories = 0;
$price = 0;

// Get user id
$sql = "SELECT users.id AS id
		FROM users
		WHERE users.username = ?";

$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $username);
$stmt->execute();

$result = $stmt->get_result();
$user_id = $result->fetch_all(MYSQLI_ASSOC)[0]["id"];
$stmt->close();

// Get brand id (can delete if not needed)
$sql = "SELECT brands.id AS id
		FROM brands
		WHERE brands.name = ?";

$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $brand_name);
$stmt->execute();

$result = $stmt->get_result();
$brand_id = $result->fetch_all(MYSQLI_ASSOC)[0]["id"];
$stmt->close();

// Get drink price and caloires
$sql = "SELECT drinks.price AS price, drinks.calories AS calories
		FROM drinks
		WHERE drinks.brand_id = ? AND drinks.name = ?";

$stmt = $conn->prepare($sql);
$stmt->bind_param("ss", $brand_id, $drink_name);
$stmt->execute();

$result = $stmt->get_result();
$tmp = $result->fetch_all(MYSQLI_ASSOC)[0];

$price += $tmp["price"];
$calories += $tmp["calories"];
$stmt->close();

// Get topping price and calories
$sql = "SELECT toppings.price AS price, toppings.calories AS calories
		FROM toppings
		WHERE toppings.brand_id = ? AND toppings.name = ?";

$stmt = $conn->prepare($sql);
$stmt->bind_param("ss", $brand_id, $drink_name);
$stmt->execute();

$result = $stmt->get_result();
$tmp = $result->fetch_all(mode: MYSQLI_ASSOC)[0];

$price += $tmp["price"];
$calories += $tmp["calories"];
$stmt->close();

// Get last record_id of user
$sql = "SELECT MAX(records.record_id) AS id
		FROM records
		WHERE records.user_id = ?";

$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $user_id);
$stmt->execute();

$result = $stmt->get_result();
$record_id = $result->fetch_all(MYSQLI_ASSOC)[0]["id"];
$record_id++;
$stmt->close();

// Insert into database
$sql = "INSERT INTO records (user_id, record_id, brand_id, drink_name, toppings, temp, sugar, calories, price)
		VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";

$stmt = $conn->prepare($sql);
$stmt->bind_param("n ", $user_id, $record_id, $brand_id, $drink_name, $toppings, $temp, $sugar, $calories, $price);

$stmt->execute();

?>