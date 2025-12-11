$(document).ready(function() {
    // loadBrands();
    // loadRecords();

    let recordBeingEdited = null;
    let price = 0;

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
        $("#edit-sugar").val(recordBeingEdited.sugar);
        $("#edit-temp").val(recordBeingEdited.temp);

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
        const toppingVal = $("#edit-topping").val();
        const newTopping = toppingVal === "null" || toppingVal === "" ? null : toppingVal;

        const newSugar = $("#edit-sugar").val();
        const newTemp = $("#edit-temp").val();
        const newPrice = calculatePrice(newBrandId, newDrinkName, newTopping);

        updateRecord(
            recordBeingEdited.record_id,
            newBrandId,
            newDrinkName,
            newTopping,
            newSugar,
            newTemp,
            newPrice,
            function(success){
                if(success){
                    recordBeingEdited.brand_id = newBrandId;
                    recordBeingEdited.drink_name = newDrinkName;
                    recordBeingEdited.topping = newTopping;
                    recordBeingEdited.sugar = newSugar;
                    recordBeingEdited.temp = newTemp;
                    recordBeingEdited.price = newPrice;

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
        $("#edit-drink").append(`<option value="${d.name}" data-price="${d.price}" ${selected}>${d.name} ($${d.price}, ${d.calories} cal)</option>`);
    });
}

function updateToppingOptions(brand_id, selectedTopping = null){
    const toppings = window.allToppings.filter(t => t.brand_id == brand_id);
    const select = $("#edit-topping");
    select.empty();

    select.append(`<option value="null" selected>None</option>`);
    toppings.forEach(t => {
        const selected = t.name === selectedTopping ? "selected" : "";
        select.append(`<option value="${t.name}" ${selected}> ${t.name} ($${t.price}, ${t.calories} cal) </option>`);
    });
}


function calculatePrice(brandId, drinkName, toppingName){
    const drink = window.allDrinks.find(d => String(d.brand_id) === String(brandId) && d.name === drinkName);
    const topping = window.allToppings.find(t => String(t.brand_id) === String(brandId) && t.name === toppingName);
    const drinkPrice = drink ? Number(drink.price) : 0;
    const toppingPrice = topping ? Number(topping.price) : 0;
    return drinkPrice + toppingPrice;
}


function updateRecord(recordId, newBrandId, newDrinkName, newTopping, newSugar, newTemp, newPrice, callback){
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
            temp: newTemp,
            price: newPrice
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
