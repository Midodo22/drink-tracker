<?php
	session_start();
	require "db_connect.php";
	$stmt = $conn->stmt_init();

	if (!isset($_SESSION['username'])) {
		header("Location: ../pages/dashboard.php");
		exit();
	}

	$username = $_SESSION['username'];
	$user_id = $_SESSION['user_id'];

	// Pull posted values; topping can be empty
	$brand_id = isset($_POST["create-brand"]) ? (int)$_POST["create-brand"] : 0;
	$drink_name = isset($_POST["create-drink"]) ? trim($_POST["create-drink"]) : "";
	$toppings = isset($_POST["create-topping"]) ? trim($_POST["create-topping"]) : null;
	$temp = isset($_POST["create-temp"]) ? trim($_POST["create-temp"]) : "";
	$sugar = isset($_POST["create-sugar"]) ? (int)$_POST["create-sugar"] : 0;

	if ($brand_id === 0 || $drink_name === "" || $temp === "") {
		header("Location: ../pages/dashboard.php");
		exit();
	}

	$calories = 0;
	$price = 0;

	// Get drink price and calories
	$sql = "SELECT drinks.price AS price, drinks.calories AS calories
			FROM drinks
			WHERE drinks.brand_id = ? AND drinks.name = ?";

	$stmt = $conn->prepare($sql);
	$stmt->bind_param("is", $brand_id, $drink_name);
	$stmt->execute();

	$result = $stmt->get_result();
	$tmp = $result->fetch_all(MYSQLI_ASSOC)[0];

	$price += $tmp["price"];
	$calories += $tmp["calories"];
	$stmt->close();

	// Get topping price and calories (if topping is not empty)
	if($toppings !== null && $toppings !== ""){
		$sql = "SELECT toppings.price AS price, toppings.calories AS calories
				FROM toppings
				WHERE toppings.brand_id = ? AND toppings.name = ?";

		$stmt = $conn->prepare($sql);
		$stmt->bind_param("is", $brand_id, $toppings);
		$stmt->execute();

		$result = $stmt->get_result();
		$tmp = $result->fetch_all(mode: MYSQLI_ASSOC)[0];

		$price += $tmp["price"];
		$calories += $tmp["calories"];
		$stmt->close();
	}

	// Get last record_id of user
	$sql = "SELECT records.record_id AS id
			FROM records
			WHERE records.user_id = ?
			ORDER BY records.record_id DESC
			LIMIT 1";

	$stmt = $conn->prepare($sql);
	$stmt->bind_param("i", $user_id);
	$stmt->execute();

	$result = $stmt->get_result();
	if($result->num_rows == 0){
		$record_id = 0;
	}
	else{
		$record_id = $result->fetch_all(MYSQLI_ASSOC)[0]["id"] + 1;
	}

	$stmt->close();

	// Insert into database
	$sql = "INSERT INTO records (user_id, record_id, brand_id, drink_name, toppings, temp, sugar, calories, price)
			VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";

	$stmt = $conn->prepare($sql);
	$stmt->bind_param("iiisssiii", $user_id, $record_id, $brand_id, $drink_name, $toppings, $temp, $sugar, $calories, $price);

	$stmt->execute();

	// Redirect back to dashboard
	header("Location: ../pages/dashboard.php");

?>
