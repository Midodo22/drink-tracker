<?php
$servername = "localhost";
$username = "cvml";
$password = "dwpcvml2025";
$database = "cvml";

$conn = new mysqli($servername, $username, $password, $database);

// Check connection
if ($conn->connect_error) {
    echo "Connection failed: $conn->connect_error <br>";
    exit();
}

?>