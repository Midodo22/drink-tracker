$(document).ready(function() {
    console.log('Page loaded, initializing...');
    
    loadCategories();
    
    loadTodos();

    // filter
    document.getElementById("filter-type").addEventListener("change", function () {
        const type = this.value;

        const categoryFilter = document.getElementById("category-filter");
        const completeFilter = document.getElementById("complete-filter");

        if (type === "category") {
            categoryFilter.style.display = "inline-block";
            completeFilter.style.display = "none";
            filterTodos("Category");
        } else if (type === "status") {
            categoryFilter.style.display = "none";
            completeFilter.style.display = "inline-block";
            filterTodos("Status");
        }
    });

    // init filter
    document.getElementById("complete-filter").style.display = "none";

    document.getElementById("category-filter").addEventListener("change", function () {
        filterTodos("Category");
    });
    
    document.getElementById("complete-filter").addEventListener("change", function () {
        filterTodos("Status");
    });

    // Character counters
    $('#todo-name').on('input', function() {
        $('#name-counter').text(this.value.length + '/50');
    });

    $('#todo-description').on('input', function() {
        $('#desc-counter').text(this.value.length + '/200');
    });

    // for new categories
    $('#todo-category').on('change', function() {
        const customInput = $('#custom-category');
        if (this.value === 'custom') {
            customInput.show().focus();
        } else {
            customInput.hide();
        }
    });

    // create new form
    $('#todo-form').on('submit', function(e) {
        e.preventDefault();
        
        let name = $('#todo-name').val().trim();
        let description = $('#todo-description').val().trim();
        let category = $('#todo-category').val();
        let deadline = $('#todo-deadline').val();

        if (!name) {
            alert('Please enter a task name');
            return;
        }

        if (category === 'custom') {
            category = $('#custom-category').val().trim() || 'none';
            
            if (category !== 'none' && category !== '') {
                $.ajax({
                    url: '../logic_php/todo.php',
                    type: 'POST',
                    data: {
                        action: 'add_category',
                        category: category
                    },
                    dataType: 'json',
                    success: function(response) {
                        console.log('Category add response:', response);
                        if (response.success) {
                            loadCategories();
                        }
                    },
                    error: function(xhr, status, error) {
                        console.error('Category add error:', error);
                    }
                });
            }
        }

        if (category === '') category = 'none';

        $.ajax({
            url: '../logic_php/todo.php',
            type: 'POST',
            data: {
                action: 'add',
                name: name,
                description: description,
                category: category,
                deadline: deadline
            },
            dataType: 'json',
            success: function(response) {
                console.log('Add task response:', response);
                if (response.success) {
                    $('#todo-form')[0].reset();
                    $('#name-counter').text('0/50');
                    $('#desc-counter').text('0/200');
                    $('#custom-category').hide();
                    
                    loadTodos();
                    
                    alert('Task added successfully!');
                } else {
                    alert('Error: ' + response.message);
                }
            },
            error: function(xhr, status, error) {
                console.error('Add task error:', error);
                console.error('Response:', xhr.responseText);
                alert('Failed to add task. Please try again.');
            }
        });
    });

    $(document).on('click', '.complete-btn', function() {
        const todoCard = $(this).closest('.todo-item-card');
        const taskName = todoCard.data('task-name');
        
        $.ajax({
            url: '../logic_php/todo.php',
            type: 'POST',
            data: {
                action: 'toggle_complete',
                task_name: taskName
            },
            dataType: 'json',
            success: function(response) {
                console.log('Toggle complete response:', response);
                if (response.success) {
                    todoCard.toggleClass('completed');
                }
            },
            error: function(xhr, status, error) {
                console.error('Toggle complete error:', error);
            }
        });
    });

    $(document).on('click', '.delete-btn', function() {
        if (confirm('Are you sure you want to delete this task?')) {
            const todoCard = $(this).closest('.todo-item-card');
            const taskName = todoCard.data('task-name');
            
            $.ajax({
                url: '../logic_php/todo.php',
                type: 'POST',
                data: {
                    action: 'delete',
                    task_name: taskName
                },
                dataType: 'json',
                success: function(response) {
                    console.log('Delete response:', response);
                    if (response.success) {
                        todoCard.fadeOut(300, function() {
                            $(this).remove();
                            // Check if container is empty
                            if ($('#todos-container .todo-item-card').length === 0) {
                                $('#todos-container').html('<p style="text-align: center; color: #999; grid-column: 1/-1;">No tasks yet. Add your first task above!</p>');
                            }
                        });
                    } else {
                        alert('Error: ' + response.message);
                    }
                },
                error: function(xhr, status, error) {
                    console.error('Delete error:', error);
                }
            });
        }
    });

    let taskBeingEdited = null;

// OPEN EDIT POPUP
$(document).on("click", ".edit-btn", function () {
    const card = $(this).closest(".todo-item-card");
    const taskName = card.data("task-name");

    taskBeingEdited = window.allTasks.find(t => t.name === taskName);

    if (!taskBeingEdited) return;

    // Fill modal fields
    $("#edit-name").val(taskBeingEdited.name);
    $("#edit-category").val(taskBeingEdited.category);
    $("#edit-description").val(taskBeingEdited.description);
    $("#edit-deadline").val(taskBeingEdited.deadline);

    // Show popup
    $("#edit-modal-overlay").removeClass("hidden");
});

// CANCEL CLOSE
$("#edit-cancel-btn").on("click", function () {
    $("#edit-modal-overlay").addClass("hidden");
});

// SAVE EDITED DATA
$("#edit-form").on("submit", function (e) {
    e.preventDefault();

    taskBeingEdited.name = $("#edit-name").val();
    taskBeingEdited.category = $("#edit-category").val();
    taskBeingEdited.description = $("#edit-description").val();
    taskBeingEdited.deadline = $("#edit-deadline").val();

    // Call your existing update function (adjust to your own code)
    updateTask(taskBeingEdited);

    // Close modal
    $("#edit-modal-overlay").addClass("hidden");

    // Re-render UI
    loadTasks();
});


    function updateTask(oldName, newName, newCategory) {
        $.ajax({
            url: '../logic_php/todo.php',
            type: 'POST',
            data: {
                action: 'update_task',
                old_name: oldName,
                new_name: newName,
                new_category: newCategory
            },
            dataType: 'json',
            success: function(response) {
                console.log('Update task response:', response);
                if (response.success) {
                    loadTodos();
                    alert('Task updated successfully!');
                } else {
                    alert('Error: ' + response.message);
                }
            },
            error: function(xhr, status, error) {
                console.error('Update task error:', error);
                alert('Failed to update task. Please try again.');
            }
        });
    }

    // Edit category button
    $(document).on('click', '.edit-category-btn', function() {
        const categoryItem = $(this).closest('.category-item');
        const oldName = categoryItem.data('category-name');
        
        if (oldName.toLowerCase() === 'none') {
            alert('Cannot modify "none" category');
            return;
        }
        
        const newName = prompt('Enter new category name:', oldName);
        if (newName === null || newName.trim() === '' || newName.trim().toLowerCase() === 'none') {
            return;
        }
        
        $.ajax({
            url: '../logic_php/todo.php',
            type: 'POST',
            data: {
                action: 'update_category',
                old_name: oldName,
                new_name: newName.trim()
            },
            dataType: 'json',
            success: function(response) {
                console.log('Update category response:', response);
                if (response.success) {
                    loadCategories();
                    loadTodos();
                    alert('Category updated successfully!');
                } else {
                    alert('Error: ' + response.message);
                }
            },
            error: function(xhr, status, error) {
                console.error('Update category error:', error);
                alert('Failed to update category. Please try again.');
            }
        });
    });

    $(document).on('click', '.delete-category-btn', function() {
        const categoryItem = $(this).closest('.category-item');
        const categoryName = categoryItem.data('category-name');
        
        if (categoryName.toLowerCase() === 'none') {
            alert('Cannot delete "none" category');
            return;
        }
        
        if (confirm(`Are you sure you want to delete category "${categoryName}" and all its tasks?`)) {
            $.ajax({
                url: '../logic_php/todo.php',
                type: 'POST',
                data: {
                    action: 'delete_category',
                    category: categoryName
                },
                dataType: 'json',
                success: function(response) {
                    console.log('Delete category response:', response);
                    if (response.success) {
                        loadCategories();
                        loadTodos();
                        alert('Category and its tasks deleted successfully!');
                    } else {
                        alert('Error: ' + response.message);
                    }
                },
                error: function(xhr, status, error) {
                    console.error('Delete category error:', error);
                    alert('Failed to delete category. Please try again.');
                }
            });
        }
    });
});

// Function to load all todos
function loadTodos() {
    console.log('Loading tasks...');
    $.ajax({
        url: '../logic_php/todo.php',
        type: 'POST',
        data: { action: 'get_all' },
        dataType: 'json',
        success: function(response) {
            console.log('Tasks response:', response);
            if (response.success) {
                const container = $('#todos-container');
                container.empty();
                
                // Store all tasks globally for filtering
                window.allTasks = response.tasks;
                
                if (response.tasks.length === 0) {
                    container.html('<p style="text-align: center; color: #999; grid-column: 1/-1; font-weight: 500;">No tasks yet. Add your first task above!</p>');
                } else {
                    let type = document.getElementById("filter-type").value;
                    filterTodos(type);
                }
            } else {
                console.error('Failed to load tasks:', response.message);
                $('#todos-container').html('<p style="text-align: center; color: #f44336; grid-column: 1/-1; font-weight: 600;">Error loading tasks. Please refresh the page.</p>');
            }
        },
        error: function(xhr, status, error) {
            console.error('Load tasks error:', error);
            console.error('Response:', xhr.responseText);
            $('#todos-container').html('<p style="text-align: center; color: #f44336; grid-column: 1/-1; font-weight: 600;">Error loading tasks. Please refresh the page.</p>');
        }
    });
}

// Function to filter and display todos based on selected category
function filterTodos(type) {
    if (type == "Status"){
        const selectedStatus = $('#complete-filter').val(); 
        const container = $('#todos-container');
        container.empty();

        if (!window.allTasks || window.allTasks.length === 0) {
            container.html('<p style="text-align: center; color: #999; grid-column: 1/-1; font-weight: 500;">No tasks yet. Add your first task above!</p>');
            return;
        }

        const filteredTasks =
            selectedStatus === 'all'
                ? window.allTasks
                : window.allTasks.filter(task => {
                    if (selectedStatus === 'complete') return task.completed === 1;
                    if (selectedStatus === 'incomplete') return task.completed === 0;
                });

        if (filteredTasks.length === 0) {
            container.html('<p style="text-align: center; color: #999; grid-column: 1/-1; font-weight: 500;">No tasks with this status.</p>');
        } else {
            filteredTasks.forEach(function(task) {
                const todoCard = createTodoCard(task);
                container.append(todoCard);
            });
        }
    }
    else {
        const selectedCategory = $('#category-filter').val();
        const container = $('#todos-container');
        container.empty();
        
        if (!window.allTasks || window.allTasks.length === 0) {
            container.html('<p style="text-align: center; color: #999; grid-column: 1/-1; font-weight: 500;">No tasks yet. Add your first task above!</p>');
            return;
        }
        
        const filteredTasks = selectedCategory === 'all' 
            ? window.allTasks 
            : window.allTasks.filter(task => task.category === selectedCategory);
        
        if (filteredTasks.length === 0) {
            container.html('<p style="text-align: center; color: #999; grid-column: 1/-1; font-weight: 500;">No tasks in this category.</p>');
        } else {
            filteredTasks.forEach(function(task) {
                const todoCard = createTodoCard(task);
                container.append(todoCard);
            });
        }
    }
}

function createTodoCard(task) {
    const deadlineText = task.deadline
        ? new Date(task.deadline).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric"
          })
        : "No deadline";

    return `
        <div class="todo-item-card ${task.completed == 1 ? "completed" : ""}"
            data-task-name="${escapeHtml(task.name)}">

            <div class="todo-left">
                <div class="todo-top-row">
                    <h3 class="todo-name">${escapeHtml(task.name)}</h3>
                    <span class="todo-category">${escapeHtml(task.category || "none")}</span>
                </div>

                <p class="todo-description">${escapeHtml(task.description || "No description")}</p>
                <span class="todo-deadline"><i class="fa fa-calendar"></i> ${deadlineText}</span>
            </div>

            <div class="todo-right">
                <button class="todo-btn edit-btn"><i class="fa fa-edit"></i></button>
                <button class="todo-btn complete-btn"><i class="fa fa-check"></i></button>
                <button class="todo-btn delete-btn"><i class="fa fa-trash"></i></button>
            </div>
        </div>
    `;
}



// Function to load categories
function loadCategories() {
    console.log('Loading categories...');
    $.ajax({
        url: '../logic_php/todo.php',
        type: 'POST',
        data: { action: 'get_categories' },
        dataType: 'json',
        success: function(response) {
            console.log('Categories response:', response);
            if (response.success) {
                // Update dropdown
                const select = $('#todo-category');
                const currentValue = select.val();
                
                select.empty();
                select.append('<option value="none">None</option>');
                
                response.categories.forEach(function(category) {
                    if (category.toLowerCase() !== 'none') {
                        select.append(`<option value="${escapeHtml(category)}">${escapeHtml(category)}</option>`);
                    }
                });
                
                select.append('<option value="custom">+ Add New Category</option>');
                
                if (currentValue && currentValue !== 'custom') {
                    select.val(currentValue);
                }

                // Update category filter
                const filter = $('#category-filter');
                const currentFilterValue = filter.val();
                
                filter.empty();
                filter.append('<option value="all">All Categories</option>');
                
                response.categories.forEach(function(category) {
                    filter.append(`<option value="${escapeHtml(category)}">${escapeHtml(category)}</option>`);
                });
                
                if (currentFilterValue) {
                    filter.val(currentFilterValue);
                }

                // Update category management section
                const categoriesList = $('#categories-list');
                categoriesList.empty();
                
                response.categories.forEach(function(category) {
                    const categoryItem = createCategoryItem(category);
                    categoriesList.append(categoryItem);
                });
            }
        },
        error: function(xhr, status, error) {
            console.error('Load categories error:', error);
        }
    });
}

// Function to create category item element
function createCategoryItem(category) {
    const isNone = category.toLowerCase() === 'none';
    const editDeleteButtons = isNone ? 
        '<span style="color: #999; font-size: 0.85em; font-weight: 500;">(default)</span>' :
        `
            <button class="todo-btn edit-category-btn" title="Edit category" style="padding: 0.3rem 0.5rem; font-size: 0.85em;">
                <i class="fa fa-edit"></i>
            </button>
            <button class="todo-btn delete-category-btn" title="Delete category and its tasks" style="padding: 0.3rem 0.5rem; font-size: 0.85em; background-color: #f44336;">
                <i class="fa fa-trash"></i>
            </button>
        `;
    
    return `
        <div class="category-item" data-category-name="${escapeHtml(category)}" style="padding: 0.75rem; border: 1px solid #ddd; border-radius: 8px; display: flex; justify-content: space-between; align-items: center;">
            <span style="font-weight: 600;">${escapeHtml(category)}</span>
            <div style="display: flex; gap: 0.5rem;">
                ${editDeleteButtons}
            </div>
        </div>
    `;
}

// Helper function to escape HTML
function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return String(text).replace(/[&<>"']/g, function(m) { return map[m]; });
}