<?php
    session_start();
    header('Content-Type: application/json');

    // Check if user is logged in
    if (!isset($_SESSION['user_id'])) {
        echo json_encode(['success' => false, 'message' => 'Not logged in']);
        exit();
    }

    include 'db_connect.php';

    $action = $_POST['action'] ?? '';
    $username = $_SESSION['username'];
    $user_id = $_SESSION['user_id'];

    switch ($action) {
        case 'get_all':
            $stmt = $conn->prepare("SELECT r.*, brands.name AS brand_name FROM records AS r INNER JOIN brands ON r.brand_id=brands.id WHERE user_id=? ORDER BY r.created_at DESC");
            // $stmt = $conn->prepare("SELECT * FROM records WHERE username = ? ORDER BY created_at DESC");
            $stmt->bind_param("s", $user_id);
            $stmt->execute();
            $result = $stmt->get_result();
            
            $records = [];
            while ($row = $result->fetch_assoc()) {
                $records[] = $row;
            }
            
            echo json_encode(['success' => true, 'records' => $records]);
            $stmt->close();
            break;
        
        case 'get_brands':
            $stmt = $conn->prepare("SELECT * FROM brands");
            $stmt->execute();
            $result = $stmt->get_result();
            
            $brands = [];
            while ($row = $result->fetch_assoc()) {
                $brands[] = [
                    'id' => $row['id'],
                    'name' => $row['name']
                ];
            }
            
            echo json_encode(['success' => true, 'brands' => $brands]);
            $stmt->close();
            break;
        
        case 'get_drinks':
            $stmt = $conn->prepare("SELECT * FROM drinks");
            $stmt->execute();
            $result = $stmt->get_result();
            
            $drinks = [];
            while ($row = $result->fetch_assoc()) {
                $drinks[] = $row;
            }
            
            echo json_encode(['success' => true, 'drinks' => $drinks]);
            $stmt->close();
            break;

        case 'get_toppings':
            $stmt = $conn->prepare("SELECT * FROM toppings");
            $stmt->execute();
            $result = $stmt->get_result();
            
            $toppings = [];
            while ($row = $result->fetch_assoc()) {
                $toppings[] = $row;
            }
            
            echo json_encode(['success' => true, 'toppings' => $toppings]);
            $stmt->close();
            break;
        
        default:
            echo json_encode(['success' => false, 'message' => 'Invalid action or error when processing request']);
    }

    $conn->close();
?>