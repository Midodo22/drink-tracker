$(document).ready(function() {
    // loadBrands();
    // loadRecords();

    let recordBeingEdited = null;
    // OPEN EDIT POPUP
    $(document).on("click", ".edit-btn", function () {
        console.log("Opened edit console")

        const card = $(this).closest(".record-item-card");
        const record_id = card.data("record-id");

        recordBeingEdited = window.allRecords.find(r => r.record_id == record_id);

        if (!recordBeingEdited) return;

        // Fill modal fields
        // Brand scrolling to select
        // NOTE: can we use window.brands
        $("#edit-brand").empty();
        window.brands.forEach(b => {
            const selected = b.id == recordBeingEdited.brand_id ? "selected" : "";
            $("#edit-brand").append(`<option value="${b.id}" ${selected}>${escapeHtml(b.name)}</option>`);
        });
        updateDrinkOptions(recordBeingEdited.brand_id, recordBeingEdited.drink_name);
        updateToppingOptions(recordBeingEdited.brand_id, recordBeingEdited.topping);
        updateSugarOptions(recordBeingEdited.sugar);
        updateTempOptions(recordBeingEdited.temp);

        // Show popup
        $("#edit-modal-overlay").removeClass("hidden");
    });

    $("#edit-brand").on("change", function() {
        const brand_id = $(this).val();
        updateDrinkOptions(brand_id);
        updateToppingOptions(brand_id);
    });

    // CANCEL CLOSE
    $("#edit-cancel-btn").on("click", function () {
        $("#edit-modal-overlay").addClass("hidden");
    });

    // SAVE EDITED DATA
    $("#edit-form").on("submit", function(e){
        e.preventDefault();
        if (!recordBeingEdited) return;

        const newBrandId = $("#edit-brand").val();  // brand_id
        const newDrinkName = $("#edit-drink").val();  // drink_name
        const newTopping = $("#edit-topping").val();
        const newSugar = $("#edit-sugar").val();
        const newTemp = $("#edit-temp").val();

        updateRecord(
            recordBeingEdited.record_id,
            newBrandId,
            newDrinkName,
            newTopping,
            newSugar,
            newTemp,
            function(success){
                if(success){
                    recordBeingEdited.brand_id = newBrandId;
                    recordBeingEdited.drink_name = newDrinkName;
                    recordBeingEdited.topping = newTopping;
                    recordBeingEdited.sugar = newSugar;
                    recordBeingEdited.temp = newTemp;

                    loadRecords();
                    $("#edit-modal-overlay").addClass("hidden");
                }
            }
        );
    });
});

function updateDrinkOptions(brand_id, selectedDrink=null){
    const drinks = window.allDrinks.filter(d => d.brand_id == brand_id);
    $("#edit-drink").empty();
    drinks.forEach(d => {
        const selected = d.name === selectedDrink ? "selected" : "";
        $("#edit-drink").append(`<option value="${d.name}" ${selected}>${d.name} ($${d.price}, ${d.calories} cal)</option>`);
    });
}

function updateToppingOptions(brand_id, selectedTopping = null){
    const toppings = window.allToppings.filter(t => t.brand_id == brand_id);
    const select = $("#edit-topping");
    select.empty();

    toppings.forEach(t => {
        const selected = t.name === selectedTopping ? "selected" : "";
        select.append(`<option value="${t.name}" ${selected}>
            ${t.name} ($${t.price}, ${t.calories} cal)
        </option>`);
        });
}

function updateSugarOptions(selectedSugar = null) {
    const sugarOptions = [
        { value: 10, label: "正常" },
        { value: 9, label: "9" },
        { value: 8, label: "少糖" },
        { value: 7, label: "七分糖" },
        { value: 6, label: "6" },
        { value: 5, label: "半糖" },
        { value: 4, label: "4" },
        { value: 3, label: "微糖" },
        { value: 2, label: "2" },
        { value: 1, label: "一分糖" },
        { value: 0, label: "無糖" }
    ];

    const select = $("#edit-sugar");
    select.empty();
    sugarOptions.forEach(s => {
        const selected = String(s.value) === String(selectedSugar) ? "selected" : "";
        select.append(`<option value="${s.value}" ${selected}>${s.label}</option>`);
    });
}

function updateTempOptions(selectedTemp = null) {
    const tempOptions = [
        { value: "normal", label: "正常" },
        { value: "half", label: "少冰" },
        { value: "less", label: "微冰" },
        { value: "little", label: "去冰" },
        { value: "none", label: "完全去冰" },
        { value: "warm", label: "溫" },
        { value: "hot", label: "熱" }
    ];

    const select = $("#edit-temp");
    select.empty();
    tempOptions.forEach(t => {
        const selected = String(t.value) === String(selectedTemp) ? "selected" : "";
        select.append(`<option value="${t.value}" ${selected}>${t.label}</option>`);
    });
}


function updateRecord(recordId, newBrandId, newDrinkName, newTopping, newSugar, newTemp, callback){
    $.ajax({
        url: "../logic_php/update.php",
        type: "POST",
        data: {
            action: "update_record",
            record_id: recordId,
            brand_id: newBrandId,
            drink_name: newDrinkName,
            topping: newTopping,
            sugar: newSugar,
            temp: newTemp
        },
        dataType: "json",
        success: function(response) {
            if(response.success){
                console.log("Record updated successfully!");
                if(typeof callback === "function") callback(true);
            }
            else {
                alert("Error: " + response.message);
                if(typeof callback === "function") callback(false);
            }
        },
        error: function(xhr, status, error){
            console.error("Failed to update record:", error);
            alert("Failed to update record.");
            if(typeof callback === "function") callback(false);
        }
    });
}