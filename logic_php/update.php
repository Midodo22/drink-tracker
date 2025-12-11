<?php
    session_start();
    require 'db_connect.php';
    header('Content-Type: application/json');

    if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action']) && $_POST['action'] === 'update_record') {
        $record_id = intval($_POST['record_id']);
        $user_id = $_SESSION['user_id'];


        // New data
        $new_brand_id = intval($_POST['brand_id']);
        $new_drink = $_POST['drink_name'];
        $new_topping = $_POST['topping'];
        $new_sugar = intval($_POST['sugar']);
        $new_temp = $_POST['temp'];

        // Update records
        $update_sql = "UPDATE records 
                    SET brand_id = ?, drink_name = ?, toppings = ?, sugar = ?, temp = ? 
                    WHERE record_id=? AND user_id = ?";
        $update_stmt = $conn->prepare($update_sql);
        $update_stmt->bind_param("issisii", $new_brand_id, $new_drink, $new_topping, $new_sugar, $new_temp, $record_id, $user_id);

        if ($update_stmt->execute()) {
            echo json_encode(['success' => true]);
        } else {
            echo json_encode(['success' => false, 'message' => $update_stmt->error]);
        }

        exit;
    }
?>