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
        : "No data";

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
                    <strong>Temp:</strong> ${escapeHtml(record.temp || "-")} &nbsp; | &nbsp;
                    <strong>Sugar:</strong> ${escapeHtml(record.sugar != null ? record.sugar : "-")} grams &nbsp; | &nbsp;
                    
                    <strong>Calories:</strong> ${escapeHtml(record.calories || "-")} kcal &nbsp; | &nbsp;
                    <strong>Price:</strong> $${escapeHtml(record.price || "-")}
                </p>

                <!-- Created Time -->
                <span class="record-create-time">
                    <i class="fa fa-calendar"></i> ${createdTimeText}
                </span>
            </div>

            <div class="record-right">
                <button class="record-btn edit-btn"><i class="fa fa-edit"></i></button>
                <button class="record-btn complete-btn"><i class="fa fa-check"></i></button>
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
                // Update dropdown
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

                // Update brands management section
                // const brandsList = $('#brands-list');
                // brandsList.empty();
                
                // response.brands.forEach(function(brands) {
                //     const brandItem = createBrandItem(brands);
                //     brandsList.append(brandItem);
                // });
                // Not in use
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