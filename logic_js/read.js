$(document).ready(function() {
    console.log('Page loaded, initializing...');
    
    loadBrands();
    
    loadRecords();

    // filter
    // document.getElementById("filter-type").addEventListener("change", function () {
    //     const type = this.value;

    //     const brandFilter = document.getElementById("brand-filter");
    //     const completeFilter = document.getElementById("complete-filter");

    //     if (type === "brand") {
    //         brandFilter.style.display = "inline-block";
    //         completeFilter.style.display = "none";
    //         filterRecords("brand");
    //     }
    // });

    // init filter
    document.getElementById("complete-filter").style.display = "none";

    document.getElementById("brand-filter").addEventListener("change", function () {
        filterRecords("brand");
    });

});

// Function to load all todos
function loadRecords() {
    console.log('Loading records...');
    $.ajax({
        url: '../logic_php/read.php',
        type: 'POST',
        data: { action: 'get_all' },
        dataType: 'json',
        success: function(response) {
            console.log('Records response:', response);
            if (response.success) {
                const container = $('#records-container');
                container.empty();
                
                // Store all records globally for filtering
                window.allRecords = response.records;
                
                if (response.records.length === 0) {
                    container.html('<p style="text-align: center; color: #999; grid-column: 1/-1; font-weight: 500;">No records yet. Add your first record above!</p>');
                }
                else {
                    filterRecords("brand");
                }
            }
            else {
                console.error('Failed to load records:', response.message);
                $('#records-container').html('<p style="text-align: center; color: #f44336; grid-column: 1/-1; font-weight: 600;">Error loading records. Please refresh the page.</p>');
            }
        },
        error: function(xhr, status, error) {
            console.error('Load records error:', error);
            console.error('Response:', xhr.responseText);
            $('#todos-container').html('<p style="text-align: center; color: #f44336; grid-column: 1/-1; font-weight: 600;">Error loading records. Please refresh the page.</p>');
        }
    });
}

// Function to filter and display todos based on selected brand
function filterRecords() {
    if (type == "brand"){
        const selectedBrand = $('#brand-filter').val();
        const container = $('#records-container');
        container.empty();
        
        if (!window.allRecords || window.allRecords.length === 0) {
            container.html('<p style="text-align: center; color: #999; grid-column: 1/-1; font-weight: 500;">No records yet. Add your first record above!</p>');
            return;
        }
        
        const filteredRecords = selectedBrand === 'all' 
            ? window.allRecords 
            : window.allRecords.filter(records => records.brand === selectedBrand);
        
        if (filteredRecords.length === 0) {
            container.html('<p style="text-align: center; color: #999; grid-column: 1/-1; font-weight: 500;">No records under this brand.</p>');
        } else {
            filteredRecords.forEach(function(record) {
                const todoCard = createTodoCard(tarecordsk);
                container.append(todoCard);
            });
        }
    }
    else {
        console.log("Error: Invalid filter type")
    }
}

function loadBrands() {
    console.log('Loading brands...');
    $.ajax({
        url: '../logic_php/read.php',
        type: 'POST',
        data: { action: 'get_brands' },
        dataType: 'json',
        success: function(response) {
            console.log('Brands response:', response);
            if (response.success) {
                // Update dropdown
                const select = $('#brand-filter');
                const currentValue = select.val();
                
                select.empty();
                select.append('<option value="none">None</option>');
                
                response.brands.forEach(function(brand) {
                    select.append(`<option value="${escapeHtml(brand)}">${escapeHtml(brand)}</option>`);
                });

                // Update brand filter
                const filter = $('#brand-filter');
                const currentFilterValue = filter.val();
                
                filter.empty();
                filter.append('<option value="all">All Brands</option>');
                
                response.brands.forEach(function(brands) {
                    filter.append(`<option value="${escapeHtml(brands)}">${escapeHtml(brands)}</option>`);
                });
                
                if (currentFilterValue) {
                    filter.val(currentFilterValue);
                }

                // Update brands management section
                const brandsList = $('#brands-list');
                brandsList.empty();
                
                response.brands.forEach(function(brands) {
                    const brandItem = createBrandItem(brands);
                    brandsList.append(brandItem);
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