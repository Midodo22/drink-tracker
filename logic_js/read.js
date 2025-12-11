$(document).ready(function() {
    console.log('Page loaded, initializing...');
    
    loadBrands();
    loadRecords();

    $.when(loadAllDrinks(), loadAllToppings()).done(() => {
        loadDrinkOptions(-1);
        loadToppingOptions(-1);
    });

    // create selection
    document.getElementById("create-brand").addEventListener("change", function () {
        const brand_id = this.value;
        loadDrinkOptions(brand_id);
        loadToppingOptions(brand_id);
    });

    // init filter
    document.getElementById("brand-filter").addEventListener("change", function () {
        filterRecords("brand");
    });

});

function createRecordCard(record) {
    const createdTimeText = record.created_at
        ? new Date(record.created_at).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric"
          })
        : "無資料";

    const tempMap = {
        "normal": "正常",
        "half": "少冰",
        "less": "微冰",
        "little": "去冰",
        "none": "完全去冰",
        "warm": "溫",
        "hot": "熱"
    };

    const sugarMap = {
        "10": 10,
        "9": 9,
        "8": 8,
        "7": 7,
        "6": 6,
        "5": 5,
        "4": 4,
        "3": 3,
        "2": 2,
        "1": 1,
        "0": 0
    };
    
    const displayTemp = tempMap[record.temp] || record.temp || "-";
    const displaySugar = sugarMap[record.sugar] || record.sugar || "-";

    return `
        <div class="record-item-card"
            data-record-id="${record.record_id}"
            data-user-id="${record.user_id}"
            data-brand-id="${record.brand_id}">

            <div class="record-left">

                <!-- Top Row: Drink + Brand -->
                <div class="record-top-row">
                    <h3 class="record-drink">${escapeHtml(record.drink_name)}</h3>
                    <span class="record-brand">${escapeHtml(record.brand_name || "Unknown")}</span>

                    <!-- Toppings -->
                    <p class="record-topping">
                        <strong>Toppings:</strong> ${escapeHtml(record.toppings || "None")}
                    </p>
                </div>

                <!-- Temperature & Sugar -->
                <p class="record-topping">
                    <strong><i class="fa fa-thermometer-half"></i> Temp:</strong> ${escapeHtml(displayTemp)} &nbsp; | &nbsp;
                    <strong><i class="fa fa-cube"></i> Sugar:</strong> ${escapeHtml(displaySugar)} &nbsp; | &nbsp;
                    
                    <strong><i class="bi bi-fire"></i> Calories:</strong> ${escapeHtml(record.calories || "-")} kcal &nbsp; | &nbsp;
                    <strong><i class="bi bi-coin"></i> Price:</strong> $${escapeHtml(record.price || "-")}
                </p>

                <!-- Created Time -->
                <span class="record-create-time">
                    <i class="fa fa-calendar"></i> ${createdTimeText}
                </span>
            </div>

            <div class="record-right">
                <button class="record-btn edit-btn"><i class="fa fa-edit"></i></button>
                <button class="record-btn delete-btn"><i class="fa fa-trash"></i></button>
            </div>

        </div>

    `;
}

// Function to load all records
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
            $('#records-container').html('<p style="text-align: center; color: #f44336; grid-column: 1/-1; font-weight: 600;">Error loading records. Please refresh the page.</p>');
        }
    });
}

// Function to filter and display records based on selected brand
function filterRecords(type) {
    if (type == "brand"){
        const selectedBrand = $('#brand-filter').val();
        const container = $('#records-container');
        container.empty();
        
        if (!window.allRecords || window.allRecords.length === 0) {
            container.html('<p style="text-align: center; color: #999; grid-column: 1/-1; font-weight: 500;">No records yet. Add your first record above!</p>');
            return;
        }

        let filteredRecords;
        if (selectedBrand === 'all') {
            filteredRecords = window.allRecords;
        } else {
            const selectedBrandId = parseInt(selectedBrand, 10);
            filteredRecords = window.allRecords.filter(record => record.brand_id === selectedBrandId);
        }
        
        if (filteredRecords.length === 0) {
            container.html('<p style="text-align: center; color: #999; grid-column: 1/-1; font-weight: 500;">No records under this brand.</p>');
        } else {
            filteredRecords.forEach(function(record) {
                const recordCard = createRecordCard(record);
                container.append(recordCard);
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
                // Update create dropdown
                const createSelect = $('#create-brand');
                const currentCreate = createSelect.val();
                
                createSelect.empty();
                createSelect.append('<option value="" disabled selected>Select a brand</option>');
                createSelect.append('<option value="all">All Brands</option>');
                
                response.brands.forEach(function(brand) {
                    createSelect.append(`<option value="${brand.id}">${escapeHtml(brand.name)}</option>`);
                });

                window.brands = response.brands;
                
                if (currentCreate) {
                    createSelect.val(currentCreate);
                }

                // Update filter dropdown
                const select = $('#brand-filter');
                const currentValue = select.val();
                
                select.empty();
                select.append('<option value="all">All Brands</option>');
                
                response.brands.forEach(function(brand) {
                    select.append(`<option value="${brand.id}">${escapeHtml(brand.name)}</option>`);
                });

                window.brands = response.brands;
                
                if (currentValue) {
                    select.val(currentValue);
                }
            }
        },
        error: function(xhr, status, error) {
            console.error('Load brands error:', error);
        }
    });
}

function loadAllDrinks() {
    console.log('Loading all drink options...');
    return $.ajax({
        url: '../logic_php/read.php',
        type: 'POST',
        data: { action: 'get_drinks' },
        dataType: 'json',
        success: function(response) {
            console.log('Drinks response:', response);
            if (response.success) {
                window.allDrinks = response.drinks;
                console.log("Successfully loaded all drinks.")
            }
        },
        error: function(xhr, status, error) {
            console.error('Load drinks error:', error);
        }
    });
}

function loadAllToppings() {
    console.log('Loading all topping options...');
    return $.ajax({
        url: '../logic_php/read.php',
        type: 'POST',
        data: { action: 'get_toppings' },
        dataType: 'json',
        success: function(response) {
            console.log('Toppings response:', response);
            if (response.success) {
                window.allToppings = response.toppings;
                console.log("Successfully loaded all toppings.")
            }
        },
        error: function(xhr, status, error) {
            console.error('Load drinks error:', error);
        }
    });
}

function loadDrinkOptions(brand_id) {
    const select = $("#create-drink");
    select.empty();
    select.append(`<option value="" disabled selected>Select a drink</option>`)
    if (brand_id === -1) {
        window.allDrinks.forEach(d => {
            select.append(`<option value="${d.name}">${d.name} ($${d.price}, ${d.calories} cal)</option>`);
        });
        console.log("Initialized drink options")
    }
    else {
        const drinks = window.allDrinks.filter(d => d.brand_id == brand_id);
        drinks.forEach(d => {
            select.append(`<option value="${d.name}">${d.name} ($${d.price}, ${d.calories} cal)</option>`);
        });
    }
}

function loadToppingOptions(brand_id) {
    const select = $("#create-topping");
    select.empty();
    select.append(`<option value="" disabled selected>Select a topping</option>`)
    if (brand_id === -1) {
        window.allToppings.forEach(t => {
            select.append(`<option value="${t.name}">${t.name} ($${t.price}, ${t.calories} cal)</option>`);
        });
        console.log("Initialized topping options")
    }
    else {
        const toppings = window.allToppings.filter(t => t.brand_id == brand_id);
        toppings.forEach(t => {
            select.append(`<option value="${t.name}">${t.name} ($${t.price}, ${t.calories} cal)</option>`);
        });
    }
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