<?php
    session_start();

    // Check if the user is logged in, if
    // not then redirect them to the index page
    if (!isset($_SESSION['username'])) {
        header("Location: index.php");
        exit();
    }
?>

<!DOCTYPE html>
<html lang="en">

    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link rel="shortcut icon" href="../images/penguin.jpg">
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.css">
        <link rel="stylesheet" href="../css/styles.css">
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=DotGothic16&display=swap" rel="stylesheet">
        <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
        <title>Dashboard</title>
    </head>

    <body>
        <div class="navigation">
            <section class="page_nav lang-block lang-en" id="en-panel" lang="en" aria-hidden="false">
                <p style="font-weight: 600;">Hello, <?php echo htmlspecialchars($_SESSION['username']); ?></p>
                <a href="./logout.php" id="logout-button" style="font-weight:bolder;">Logout</a>
            </section>
        </div>

        <!-- Brands list -->
        <div class="card" style="margin-top: 2rem; max-width: 800px;">
            <div id="brands-list" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 1rem;">
                <p style="text-align: center; color: #999; grid-column: 1/-1; font-weight: 500;">Loading brands...</p>
            </div>
        </div>

        <!-- Records -->
        <div style="width: 100%; max-width: 1200px; margin-top: 2rem;">
            <h2 style="text-align: center; color: var(--main_text); margin-bottom: 1rem; font-weight: 700;">My Tasks</h2>
            
            <!-- Filter -->
            <div style="text-align: center; margin-bottom: 1.5rem;">
                <label for="filter-type" style="margin-right: 0.5rem; font-weight: 600;">Filter by brand
                    <!-- <select id="filter-type" class="text-box" style="max-width: 250px; display: inline-block;">
                        <option value="brand">Brand</option>
                        <option value="status">Status</option>
                    </select> -->
                    :
                </label>

                <select id="brand-filter" class="text-box" style="max-width: 250px; display: inline-block;">
                </select>
                <select id="complete-filter" class="text-box" style="max-width: 250px; display: inline-block;">
                    <option value="all">All</option>
                    <option value="complete">Complete</option>
                    <option value="incomplete">Incomplete</option>
                </select>
            </div>

            
            <div id="todos-container" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1.5rem;">
                <p style="text-align: center; color: #999; grid-column: 1/-1; font-weight: 500;">Loading tasks...</p>
            </div>
        </div>

    	<script src="../logic_js/logic.js"></script>

    </body>

</html>