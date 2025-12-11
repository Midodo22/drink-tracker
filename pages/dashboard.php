<?php
    session_start();

    // Check if the user is logged in, if
    // not then redirect them to the index page
    if (!isset($_SESSION['user_id'])) {
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
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css">
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

        <!-- Add New Record Card -->
        <div class="card record-input-card" aria-label="Add new record" style="margin-top: min(50px, 12vh);">
            <h1 style="text-align: center; margin-bottom: 1rem; font-weight: 700;">Add New Record</h1>
            
            <form id="record-form" method="post" action="../logic_php/record_add.php">
                <div style="margin-bottom: 1rem;">
                    <label for="create-brand" style="font-weight: 600;"><i class="bi bi-shop"></i> Brand</label>
                    <br>
                    <select id="create-brand" name="create-brand" class="text-box" style="max-width: 250px; display: inline-block;">
                    </select>
                </div>

                <div style="margin-bottom: 1rem;">
                    <label for="create-drink" style="font-weight: 600;"><i class="bi bi-cup-straw"></i> Drink name</label>
                    <br>
                    <select id="create-drink" name="create-drink" class="text-box" style="max-width: 250px; display: inline-block;">
                    </select>
                </div>

                <div style="margin-bottom: 1rem;">
                    <label for="create-topping" style="font-weight: 600;"><i class="fa fa-plus-circle"></i> Toppings</label>
                    <br>
                    <select id="create-topping" name="create-topping" class="text-box" style="max-width: 250px; display: inline-block;">
                    </select>
                </div>

                <div style="display: flex; gap: 1rem; margin-bottom: 1rem;">
                    <div style="flex: 1;">
                        <label for="create-temp" style="font-weight: 600;"><i class="fa fa-thermometer-half"></i> Temperature</label>
                        <div style="display: flex; gap: 0.5rem;">
                            <select id="create-temp" name="create-temp" class="text-box" style="max-width: 250px; display: inline-block;">
                                <option value="normal">正常</option>
                                <option value="half">少冰</option>
                                <option value="less">微冰</option>
                                <option value="little">去冰</option>
                                <option value="none">完全去冰</option>
                                <option value="warm">溫</option>
                                <option value="hot">熱</option>
                            </select>
                        </div>
                    </div>

                    <div style="flex: 1;">
                        <label for="create-sugar" style="font-weight: 600;"><i class="fa fa-cube"></i> Sugar</label>
                        <select id="create-sugar" name="create-sugar" class="text-box" style="max-width: 250px; display: inline-block;">
                        <option value=10>10</option>
                        <option value=9>9</option>
                        <option value=8>8</option>
                        <option value=7>7</option>
                        <option value=6>6</option>
                        <option value=5>5</option>
                        <option value=4>4</option>
                        <option value=3>3</option>
                        <option value=2>2</option>
                        <option value=1>1</option>
                        <option value=0>0</option>
                    </select>
                    </div>
                </div>

                <button type="submit" class="cta" style="background-color: var(--theme_green); color: white; font-weight: 600; cursor: pointer; margin-top: 1rem;">
                    <i class="fa fa-plus"></i> Add Record
                </button>
            </form>
        </div>

        <!-- Category Management Section -->
        <!-- <div class="card" style="margin-top: 2rem; max-width: 800px;">
            <h2 style="text-align: center; margin-bottom: 1rem; font-weight: 700;"></h2>
            <div id="categories-list" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 1rem;">
                <p style="text-align: center; color: #999; grid-column: 1/-1; font-weight: 500;">Loading categories...</p>
            </div>
        </div> -->

        <!-- Records -->
        <div style="width: 100%; max-width: 1200px; margin-top: 2rem;">
            <h2 style="text-align: center; color: var(--main_text); margin-bottom: 1rem; font-weight: 700;">My Records</h2>
            
            <!-- Filter -->
            <div style="text-align: center; margin-bottom: 1.5rem;">
                <label for="brand-filter" style="margin-right: 0.5rem; font-weight: 600;">Filter by brand:
                </label>

                <select id="brand-filter" class="text-box" style="max-width: 250px; display: inline-block;">
                </select>
            </div>

            <div id="records-container">
                <p style="text-align: center; color: #999; grid-column: 1/-1; font-weight: 500;">Loading records...</p>
            </div>
        </div>

        <!-- Edit Popup -->
        <div id="edit-modal-overlay" class="modal-overlay hidden">
            <div id="edit-modal" class="modal-card">
                <h2>Edit Record</h2>

                <form id="edit-form">
                    <div style="margin-bottom: 1rem;">
                        <label style="font-weight: 600;"><i class="bi bi-shop"></i> Brand:</label>
                        <select id="edit-brand" class="text-box" style="max-width: 250px; display: inline-block;">
                        </select>
                    </div>

                    <div style="margin-bottom: 1rem;">
                        <label style="font-weight: 600;"><i class="bi bi-cup-straw"></i> Drink name:</label>
                        <select id="edit-drink" class="text-box" style="max-width: 250px; display: inline-block;">
                        </select>
                    </div>

                    <div style="margin-bottom: 1rem;">
                        <label style="font-weight: 600;"><i class="fa fa-plus-circle"></i> Toppings:</label>
                        <select id="edit-topping" class="text-box" style="max-width: 250px; display: inline-block;">
                        </select>
                    </div>

                    <div style="margin-bottom: 1rem;">
                        <label style="font-weight: 600;"><i class="fa fa-thermometer-half"></i> Temperature:</label>
                        <select id="edit-temp" class="text-box" style="max-width: 250px; display: inline-block;">
                            <option value="normal">正常</option>
                            <option value="half">少冰</option>
                            <option value="less">微冰</option>
                            <option value="little">去冰</option>
                            <option value="none">完全去冰</option>
                            <option value="warm">溫</option>
                            <option value="hot">熱</option>
                        </select>
                    </div>
                    
                    <div style="margin-bottom: 1rem;">
                        <label style="font-weight: 600;"><i class="fa fa-cube"></i> Sugar:</label>
                        <select id="edit-sugar" class="text-box" style="max-width: 250px; display: inline-block;">
                            <option value=10>10</option>
                            <option value=9>9</option>
                            <option value=8>8</option>
                            <option value=7>7</option>
                            <option value=6>6</option>
                            <option value=5>5</option>
                            <option value=4>4</option>
                            <option value=3>3</option>
                            <option value=2>2</option>
                            <option value=1>1</option>
                            <option value=0>0</option>
                        </select>
                    </div>

                    <div class="modal-buttons">
                        <button type="button" id="edit-cancel-btn" class="record-btn">Cancel</button>
                        <button type="submit" class="record-btn save-btn">Save</button>
                    </div>
                    
                </form>
            </div>
        </div>

    	<script src="../logic_js/read.js"></script>
    	<script src="../logic_js/logic_update.js"></script>
    	<script src="../logic_js/logic_delete.js"></script>

    </body>

</html>
