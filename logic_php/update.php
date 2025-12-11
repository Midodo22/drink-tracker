<?php
require 'db_connect.php';
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action']) && $_POST['action'] === 'update_record') {

    // Old information
    $old_brand_id = $_POST['old_brand_id'];
    $old_drink = $_POST['old_drink'];

    // New data
    $new_brand_id = $_POST['brand_id'];
    $new_drink = $_POST['drink_name'];
    $new_topping = $_POST['topping'];
    $new_sugar = $_POST['sugar'];
    $new_temp = $_POST['temp'];

    // Update records
    $update_sql = "UPDATE records 
                   SET brand_id = ?, drink_name = ?, topping = ?, sugar = ?, temp = ? 
                   WHERE brand_id = ? AND drink_name = ?";
    $update_stmt = $conn->prepare($update_sql);
    $update_stmt->bind_param("isssis", $new_brand_id, $new_drink, $new_topping, $new_sugar $new_temp, $old_brand_id, $old_drink);

    if ($update_stmt->execute()) {
        echo json_encode(['success' => true]);
    } else {
        echo json_encode(['success' => false, 'message' => $update_stmt->error]);
    }
    exit;
}
