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

        // Prepare and execute
        $stmt = $conn->prepare("SELECT * FROM users WHERE username = ?");
        $stmt->bind_param("s", $username);
        $stmt->execute();
        $stmt->store_result();

        if ($stmt->num_rows > 0) {
            $stmt->bind_result($db_id, $db_username, $db_password, $db_invite_code);
            $stmt->fetch();

            if ($password_hashed === $db_password) {
                $message = "Login successful";
                $toastClass = "bg-success";
                // Start the session and redirect to the dashboard or home page
                session_start();
                $_SESSION['user_id'] = $db_id;
                $_SESSION['username'] = $db_username;
                $_SESSION['invite_code'] = $db_invite_code;

                header("Location: dashboard.php");
                exit();
            } else {
                $message = "Incorrect password";
                $toastClass = "bg-danger";
            }
        }
        else {
            $message = "Username not found";
            $toastClass = "bg-warning";
        }

        $stmt->close();
        $conn->close();
    }
?>