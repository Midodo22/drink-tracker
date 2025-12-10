$(document).ready(function() {
    console.log('Page loaded, initializing...');
    
    loadBrands();
    
    loadRecords();

    // filter
    document.getElementById("filter-type").addEventListener("change", function () {
        const type = this.value;

        const brandFilter = document.getElementById("brand-filter");
        const completeFilter = document.getElementById("complete-filter");

        if (type === "brand") {
            brandFilter.style.display = "inline-block";
            completeFilter.style.display = "none";
            filterRecords("brand");
        }
    });

    // init filter
    document.getElementById("complete-filter").style.display = "none";

    document.getElementById("category-filter").addEventListener("change", function () {
        filterRecords("Category");
    });
    
    document.getElementById("complete-filter").addEventListener("change", function () {
        filterRecords("Status");
    });

});

// Function to load all todos
function loadRecords() {
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
                    filterRecords(type);
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
function filterRecords(type) {
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

function loadbrands() {
    console.log('Loading brands...');
    $.ajax({
        url: '../logic_php/todo.php',
        type: 'POST',
        data: { action: 'get_brands' },
        dataType: 'json',
        success: function(response) {
            console.log('Brands response:', response);
            if (response.success) {
                // Update dropdown
                const select = $('#todo-category');
                const currentValue = select.val();
                
                select.empty();
                select.append('<option value="none">None</option>');
                
                response.brands.forEach(function(category) {
                    if (category.toLowerCase() !== 'none') {
                        select.append(`<option value="${escapeHtml(category)}">${escapeHtml(category)}</option>`);
                    }
                });
                
                select.append('<option value="custom">+ Add New Category</option>');
                
                if (currentValue && currentValue !== 'custom') {
                    select.val(currentValue);
                }

                // Update brand filter
                const filter = $('#brand-filter');
                const currentFilterValue = filter.val();
                
                filter.empty();
                filter.append('<option value="all">All Brands</option>');
                
                response.brands.forEach(function(category) {
                    filter.append(`<option value="${escapeHtml(category)}">${escapeHtml(category)}</option>`);
                });
                
                if (currentFilterValue) {
                    filter.val(currentFilterValue);
                }

                // Update category management section
                const brandsList = $('#brands-list');
                brandsList.empty();
                
                response.brands.forEach(function(category) {
                    const categoryItem = createCategoryItem(category);
                    brandsList.append(categoryItem);
                });
            }
        },
        error: function(xhr, status, error) {
            console.error('Load brands error:', error);
        }
    });
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