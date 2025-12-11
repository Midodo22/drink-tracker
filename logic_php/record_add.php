<?php

require "db_connect.php";
$stmt = $conn->stmt_init();

$brand_name = $_POST[""];
$drink_name = $_POST[""];
$toppings = $_POST[""];
$temp = $_POST[""];
$sugar = $_POST[""];

$calories = 0;
$price = 0;

// Get brand id (can delete if not necassary)
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
$stmt->bind_param("s", $brand_name);
$stmt->execute();

$result = $stmt->get_result();
$tmp = $result->fetch_all(MYSQLI_ASSOC)[0];

$price += $tmp["price"];
$calories += $tmp["calories"];
$stmt->close();

// Get topping prive and calories

?>