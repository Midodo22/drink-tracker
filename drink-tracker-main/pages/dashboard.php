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

        <!-- Add New Todo Card -->
        <div class="card todo-input-card" aria-label="Add new todo" style="margin-top: min(50px, 12vh);">
            <h1 style="text-align: center; margin-bottom: 1rem; font-weight: 700;">Add New Task</h1>
            
            <form id="todo-form" method="post">
                <div style="margin-bottom: 1rem;">
                    <label for="todo-name" style="font-weight: 600;"><i class="fa fa-pencil"></i> Name <span style="color: #999; font-size: 0.9em;">(max 50 characters)</span></label>
                    <input type="text" name="todo-name" id="todo-name" class="text-box" maxlength="50" required>
                    <small id="name-counter" style="color: #666; font-size: 0.85em; font-weight: 500;">0/50</small>
                </div>

                <div style="margin-bottom: 1rem;">
                    <label for="todo-description" style="font-weight: 600;"><i class="fa fa-align-left"></i> Description <span style="color: #999; font-size: 0.9em;">(max 200 characters)</span></label>
                    <textarea name="todo-description" id="todo-description" class="text-box" maxlength="200" rows="4" style="resize: none; min-height: 100px;"></textarea>
                    <small id="desc-counter" style="color: #666; font-size: 0.85em; font-weight: 500;">0/200</small>
                </div>

                <div style="display: flex; gap: 1rem; margin-bottom: 1rem;">
                    <div style="flex: 1;">
                        <label for="todo-category" style="font-weight: 600;"><i class="fa fa-tag"></i> Category</label>
                        <div style="display: flex; gap: 0.5rem;">
                            <select name="todo-category" id="todo-category" class="text-box" style="flex: 1;">
                                <option value="none">None</option>
                                <option value="custom">+ Add New Category</option>
                            </select>
                        </div>
                        <input type="text" id="custom-category" class="text-box" placeholder="Enter new category" style="display: none; margin-top: 0.5rem;" maxlength="30">
                    </div>

                    <div style="flex: 1;">
                        <label for="todo-deadline" style="font-weight: 600;"><i class="fa fa-calendar"></i> Deadline</label>
                        <input type="date" name="todo-deadline" id="todo-deadline" class="text-box">
                    </div>
                </div>

                <button type="submit" class="cta" style="background-color: var(--theme_green); color: white; font-weight: 600; cursor: pointer; margin-top: 1rem;">
                    <i class="fa fa-plus"></i> Add Task
                </button>
            </form>
        </div>

        <!-- Category Management Section -->
        <div class="card" style="margin-top: 2rem; max-width: 800px;">
            <h2 style="text-align: center; margin-bottom: 1rem; font-weight: 700;">Manage Categories</h2>
            <div id="categories-list" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 1rem;">
                <p style="text-align: center; color: #999; grid-column: 1/-1; font-weight: 500;">Loading categories...</p>
            </div>
        </div>

        <!-- Existing Todos Section -->
        <div style="width: 100%; max-width: 1200px; margin-top: 2rem;">
            <h2 style="text-align: center; color: var(--main_text); margin-bottom: 1rem; font-weight: 700;">My Tasks</h2>
            
            <!-- Filter Section -->
            <div style="text-align: center; margin-bottom: 1.5rem;">
                <label for="filter-type" style="margin-right: 0.5rem; font-weight: 600;">Filter by 
                    <select id="filter-type" class="text-box" style="max-width: 250px; display: inline-block;">
                        <option value="category">Category</option>
                        <option value="status">Status</option>
                    </select>
                    :
                </label>

                <select id="category-filter" class="text-box" style="max-width: 250px; display: inline-block;">
                    <option value="all">All Categories</option>
                    <option value="homework">Homework</option>
                    <option value="project">Project</option>
                    <option value="exam">Exam</option>
                </select>
                <select id="complete-filter" class="text-box" style="max-width: 250px; display: inline-block;">
                    <option value="all">All</option>
                    <option value="complete">Complete</option>
                    <option value="incomplete">Incomplete</option>
                </select>
            </div>

            
            <div id="todos-container">
                <p style="text-align: center; color: #999; grid-column: 1/-1; font-weight: 500;">Loading tasks...</p>
            </div>

        </div>

        <!-- EDIT MODAL OVERLAY -->
        <div id="edit-modal-overlay" class="modal-overlay hidden">
            <div id="edit-modal" class="modal-card">
                <h2>Edit Task</h2>

                <form id="edit-form">
                    <label>Name:</label>
                    <input type="text" id="edit-name" class="edit-text-box" required>

                    <label>Category:</label>
                    <input type="text" id="edit-category" class="edit-text-box">

                    <label>Description:</label>
                    <textarea id="edit-description" class="edit-text-box" rows="3"></textarea>

                    <label>Deadline:</label>
                    <input type="date" id="edit-deadline" class="edit-text-box">

                    <div class="modal-buttons">
                        <button type="button" id="edit-cancel-btn" class="todo-btn">Cancel</button>
                        <button type="submit" class="todo-btn save-btn">Save</button>
                    </div>
                </form>
            </div>
        </div>

    	<script src="../logic_js/logic.js"></script>

    </body>

</html>