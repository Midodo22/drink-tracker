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
    case 'add':
        $name = trim($_POST['name'] ?? '');
        $description = trim($_POST['description'] ?? '');
        $category = trim($_POST['category'] ?? 'none');
        $deadline = !empty($_POST['deadline']) ? $_POST['deadline'] : null;
        
        if (empty($name)) {
            echo json_encode(['success' => false, 'message' => 'Name is required']);
            break;
        }
        
        $stmt = $conn->prepare("SELECT name FROM tasks WHERE name = ?");
        $stmt->bind_param("s", $name);
        $stmt->execute();
        $result = $stmt->get_result();
        
        if ($result->num_rows > 0) {
            echo json_encode(['success' => false, 'message' => 'Task name already exists. Please use a different name.']);
            $stmt->close();
            break;
        }
        $stmt->close();
        
        $stmt = $conn->prepare("INSERT INTO tasks (username, name, description, category, deadline, completed) VALUES (?, ?, ?, ?, ?, 0)");
        $stmt->bind_param("sssss", $username, $name, $description, $category, $deadline);
        
        if ($stmt->execute()) {
            echo json_encode([
                'success' => true, 
                'message' => 'Task added successfully',
                'task' => [
                    'name' => $name,
                    'description' => $description,
                    'category' => $category,
                    'deadline' => $deadline,
                    'completed' => 0
                ]
            ]);
        } else {
            echo json_encode(['success' => false, 'message' => 'Failed to add task: ' . $stmt->error]);
        }
        $stmt->close();
        break;
    
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
    
    case 'toggle_complete':
        $task_name = $_POST['task_name'] ?? '';
        
        $stmt = $conn->prepare("UPDATE tasks SET completed = NOT completed WHERE name = ? AND username = ?");
        $stmt->bind_param("ss", $task_name, $username);
        
        if ($stmt->execute() && $stmt->affected_rows > 0) {
            $stmt2 = $conn->prepare("SELECT completed FROM tasks WHERE name = ? AND username = ?");
            $stmt2->bind_param("ss", $task_name, $username);
            $stmt2->execute();
            $result = $stmt2->get_result();
            $row = $result->fetch_assoc();
            echo json_encode(['success' => true, 'completed' => $row['completed']]);
            $stmt2->close();
        } else {
            echo json_encode(['success' => false, 'message' => 'Failed to update task']);
        }
        $stmt->close();
        break;
    
    case 'delete':
        $task_name = $_POST['task_name'] ?? '';
        
        $stmt = $conn->prepare("DELETE FROM tasks WHERE name = ? AND username = ?");
        $stmt->bind_param("ss", $task_name, $username);
        
        if ($stmt->execute() && $stmt->affected_rows > 0) {
            echo json_encode(['success' => true, 'message' => 'Task deleted successfully']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Failed to delete task']);
        }
        $stmt->close();
        break;
    
    case 'update_task':
        $old_name = $_POST['old_name'] ?? '';
        $new_name = trim($_POST['new_name'] ?? '');
        $new_category = trim($_POST['new_category'] ?? 'none');
        
        if (empty($new_name)) {
            echo json_encode(['success' => false, 'message' => 'Task name is required']);
            break;
        }
        
        // Check if new name already exists (and it's not the same task)
        if ($old_name !== $new_name) {
            $stmt = $conn->prepare("SELECT name FROM tasks WHERE name = ?");
            $stmt->bind_param("s", $new_name);
            $stmt->execute();
            $result = $stmt->get_result();
            
            if ($result->num_rows > 0) {
                echo json_encode(['success' => false, 'message' => 'Task name already exists. Please use a different name.']);
                $stmt->close();
                break;
            }
            $stmt->close();
        }
        
        $stmt = $conn->prepare("UPDATE tasks SET name = ?, category = ? WHERE name = ? AND username = ?");
        $stmt->bind_param("ssss", $new_name, $new_category, $old_name, $username);
        
        if ($stmt->execute() && $stmt->affected_rows > 0) {
            echo json_encode(['success' => true, 'message' => 'Task updated successfully']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Failed to update task']);
        }
        $stmt->close();
        break;
    
    case 'add_category':
        $category = trim($_POST['category'] ?? '');
        
        if (empty($category) || strtolower($category) === 'none') {
            echo json_encode(['success' => false, 'message' => 'Invalid category name']);
            break;
        }
        
        // Check if category already exists
        $stmt = $conn->prepare("SELECT name FROM categories WHERE name = ?");
        $stmt->bind_param("s", $category);
        $stmt->execute();
        $result = $stmt->get_result();
        
        if ($result->num_rows == 0) {
            $stmt->close();
            $stmt = $conn->prepare("INSERT INTO categories (name) VALUES (?)");
            $stmt->bind_param("s", $category);
            
            if ($stmt->execute()) {
                echo json_encode(['success' => true, 'message' => 'Category added', 'category' => $category]);
            } else {
                echo json_encode(['success' => false, 'message' => 'Failed to add category: ' . $stmt->error]);
            }
        } else {
            echo json_encode(['success' => true, 'message' => 'Category already exists', 'category' => $category]);
        }
        $stmt->close();
        break;
    
    case 'get_categories':
        $stmt = $conn->prepare("SELECT name FROM categories ORDER BY name ASC");
        $stmt->execute();
        $result = $stmt->get_result();
        
        $categories = ['none'];
        while ($row = $result->fetch_assoc()) {
            if (strtolower($row['name']) !== 'none') {
                $categories[] = $row['name'];
            }
        }
        
        echo json_encode(['success' => true, 'categories' => $categories]);
        $stmt->close();
        break;
    
    case 'update_category':
        $old_name = $_POST['old_name'] ?? '';
        $new_name = trim($_POST['new_name'] ?? '');
        
        if (strtolower($old_name) === 'none') {
            echo json_encode(['success' => false, 'message' => 'Cannot modify "none" category']);
            break;
        }
        
        if (empty($new_name) || strtolower($new_name) === 'none') {
            echo json_encode(['success' => false, 'message' => 'Invalid category name']);
            break;
        }
        
        // Check if new name already exists
        if ($old_name !== $new_name) {
            $stmt = $conn->prepare("SELECT name FROM categories WHERE name = ?");
            $stmt->bind_param("s", $new_name);
            $stmt->execute();
            $result = $stmt->get_result();
            
            if ($result->num_rows > 0) {
                echo json_encode(['success' => false, 'message' => 'Category name already exists']);
                $stmt->close();
                break;
            }
            $stmt->close();
        }
        
        // Update category name (this will cascade to tasks due to foreign key)
        $stmt = $conn->prepare("UPDATE categories SET name = ? WHERE name = ?");
        $stmt->bind_param("ss", $new_name, $old_name);
        
        if ($stmt->execute()) {
            // Also update tasks with this category
            $stmt2 = $conn->prepare("UPDATE tasks SET category = ? WHERE category = ?");
            $stmt2->bind_param("ss", $new_name, $old_name);
            $stmt2->execute();
            $stmt2->close();
            
            echo json_encode(['success' => true, 'message' => 'Category updated successfully']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Failed to update category']);
        }
        $stmt->close();
        break;
    
    case 'delete_category':
        $category = $_POST['category'] ?? '';
        
        if (strtolower($category) === 'none') {
            echo json_encode(['success' => false, 'message' => 'Cannot delete "none" category']);
            break;
        }
        
        // Delete all tasks with this category for this user
        $stmt = $conn->prepare("DELETE FROM tasks WHERE category = ? AND username = ?");
        $stmt->bind_param("ss", $category, $username);
        $stmt->execute();
        $stmt->close();
        
        // Delete the category
        $stmt = $conn->prepare("DELETE FROM categories WHERE name = ?");
        $stmt->bind_param("s", $category);
        
        if ($stmt->execute()) {
            echo json_encode(['success' => true, 'message' => 'Category and its tasks deleted successfully']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Failed to delete category']);
        }
        $stmt->close();
        break;
    
    default:
        echo json_encode(['success' => false, 'message' => 'Invalid action']);
}

$conn->close();
?>