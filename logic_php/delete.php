<?php
require 'db_connect.php';
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action']) && $_POST['action'] === 'delete_record') {

    $brand_id = $_POST['brand_id'];
    $name = $_POST['name'];

    $sql = "DELETE FROM drinks WHERE brand_id = ? AND name = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("is", $brand_id, $name);

    if ($stmt->execute()) {
        echo json_encode(['success' => true]);
    } else {
        echo json_encode(['success' => false, 'message' => $stmt->error]);
    }
    exit;
}
?>
