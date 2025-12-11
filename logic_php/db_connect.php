<?php
    $servername = "localhost";
    $username = "root"; // TODO: change username to your own
    $password = "Ad112550198@"; // TODO: change password to your own
    $dbname = "drink_tracker";

    // Create connection
    $conn = new mysqli($servername, $username, $password, $dbname, 3307);

    // Check connection
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }

?>
