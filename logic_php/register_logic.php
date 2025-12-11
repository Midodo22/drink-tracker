<?php
    include 'db_connect.php';

    $message = "";
    $toastClass = "";

    if ($_SERVER["REQUEST_METHOD"] == "POST") {
        $username = $_POST['username'];
        $password = $_POST['password'];

        // Hash
        include 'hash.php';
        $password_hashed = adler_hash($password, 114514);

        // Check if username already exists
        $checkUnStmt = $conn->prepare("SELECT username FROM users WHERE username = ?");
        $checkUnStmt->bind_param("s", $username);
        $checkUnStmt->execute();
        $checkUnStmt->store_result();

        if ($checkUnStmt->num_rows > 0) {
            $message = "Username already taken";
            $toastClass = "#007bff";
        } else {
            // Prepare and bind
            $stmt = $conn->prepare("INSERT INTO users (username, password) VALUES (?, ?)");
            $stmt->bind_param("ss", $username, $password_hashed);

            if ($stmt->execute()) {
                $message = "Account created successfully";
                $toastClass = "#28a745";
            } else {
                $message = "Error: " . $stmt->error;
                $toastClass = "#dc3545";
            }

            $stmt->close();
        }

        $checkUnStmt->close();
        $conn->close();
    }
?>
