<?php
    $servername = "localhost";
    $username = "cvml";
    $password = "dwpcvml2025";
    $dbname = "hw4_userbase";

    // Create connection
    $conn = new mysqli($servername, $username, $password, $dbname);

    // Check connection
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }

?>
