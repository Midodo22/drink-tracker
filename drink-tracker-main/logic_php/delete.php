<?php
require 'connect.php';

$brand_id = $_GET['brand_id'];
$name = $_GET['name'];

$sql = "DELETE FROM drinks WHERE brand_id = ? AND name = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("is", $brand_id, $name);
$stmt->execute();

header("Location: operation.php");
exit;