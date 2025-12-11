<?php
require 'connect.php';

$brand_id = $_GET['brand_id'];
$name = $_GET['name'];

// Get original drink information
$sql = "SELECT * FROM drinks WHERE brand_id = ? AND name = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("is", $brand_id, $name);  // int, string
$stmt->execute();
$result = $stmt->get_result();
$drink = $result->fetch_assoc();

// Check if drink exists
if(!$drink){
    die("Drink not found.");
}

// Update
if($_SERVER('REQUEST_METHOD') === 'POST'){
    $new_brand_id = $_POST['brand_id'];
    $new_name = $_POST['name'];
    $new_price = $_POST['price'];
    $new_calories = $_POST['calories'];

    $update_sql = "UPDATE drinks SET brand_id = ?, name = ?, price = ?, calories = ? WHERE brand_id = ? AND name = ?";
    $update_stmt = $conn->prepare($update_sql);
    $update_stmt->bind_param("isiiis", $new_brand_id, $new_name, $new_price, $new_calories, $brand_id, $name);
    $update_stmt->execute();

    header("Location: operations.php");
    exit;
}