<?php
    session_start();
    header('Content-Type: application/json');

    // Check if user is logged in
    if (!isset($_SESSION['username'])) {
        echo json_encode(['success' => false, 'message' => 'Not logged in']);
        exit();
    }

    include 'db_connect.php';

    $action = $_POST['action'] ?? '';
    $username = $_SESSION['username'];

    switch ($action) {
        case 'get_all':
            $stmt = $conn->prepare("SELECT * FROM records ORDER BY created_at DESC");
            // $stmt = $conn->prepare("SELECT * FROM records WHERE username = ? ORDER BY created_at DESC");
            $stmt->bind_param("s", $username);
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
            $stmt = $conn->prepare("SELECT name FROM brands");
            $stmt->execute();
            $result = $stmt->get_result();
            
            $brands = [];
            while ($row = $result->fetch_assoc()) {
                $brands[] = [
                    'id' => $row['id'],
                    'name' => $row['brand_name']
                ];
            }
            
            echo json_encode(['success' => true, 'brands' => $brands]);
            $stmt->close();
            break;
        
        default:
            echo json_encode(['success' => false, 'message' => 'Invalid action']);
    }

    $conn->close();
?>