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
        $stmt = $conn->prepare("SELECT * FROM tasks WHERE username = ? ORDER BY completed ASC, deadline ASC");
        $stmt->bind_param("s", $username);
        $stmt->execute();
        $result = $stmt->get_result();
        
        $tasks = [];
        while ($row = $result->fetch_assoc()) {
            $tasks[] = $row;
        }
        
        echo json_encode(['success' => true, 'tasks' => $tasks]);
        $stmt->close();
        break;
    
    case 'get_brands':
        $stmt = $conn->prepare("SELECT name FROM brands");
        $stmt->execute();
        $result = $stmt->get_result();
        
        $brands = ['none'];
        while ($row = $result->fetch_assoc()) {
            if (strtolower($row['name']) !== 'none') {
                $brands[] = $row['name'];
            }
        }
        
        echo json_encode(['success' => true, 'brands' => $brands]);
        $stmt->close();
        break;
    
    default:
        echo json_encode(['success' => false, 'message' => 'Invalid action']);
}

$conn->close();
?>