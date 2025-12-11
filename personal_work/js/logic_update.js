$(document).ready(function() {
    let recordBeingEdited = null;
    // OPEN EDIT POPUP
    $(document).on("click", ".edit-btn", function () {
        const card = $(this).closest(".todo-item-card");
        const brand_id = card.data("brand_id");
        const drink_name = card.data("drink_name");

        recordBeingEdited = window.allRecords.find(r => r.brand_id == brand_id && r.drink_name === drink_name);

        if (!recordBeingEdited) return;

        // Fill modal fields
        // Brand scrolling to select
        $("#edit-brand").empty();
        window.brands.forEach(b => {
            const selected = b.brand_id == recordBeingEdited.brand_id ? "selected" : "";
            $("#edit-brand").append(`<option value="${b.brand_id}" ${selected}>${b.brand_name}</option>`);
        });
        updateDrinkOptions(recordBeingEdited.brand_id, recordBeingEdited.drink_name);
        updateToppingOptions(recordBeingEdited.brand_id, recordBeingEdited.topping);
        $("#edit-sugar").val(recordBeingEdited.sugar);

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

        updateRecord(
            recordBeingEdited.brand_id,
            recordBeingEdited.drink_name,
            newBrandId,
            newDrinkName,
            newTopping,
            newSugar,
            function(success){
                if(success){
                    recordBeingEdited.brand_id = newBrandId;
                    recordBeingEdited.drink_name = newDrinkName;
                    recordBeingEdited.topping = newTopping;
                    recordBeingEdited.sugar = newSugar;

                    loadRecords();  // TODO: Re-render UI
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
        const selected = d.drink_name === selectedDrink ? "selected" : "";
        $("#edit-drink").append(`<option value="${d.drink_name}" ${selected}>${d.drink_name} ($${d.price}, ${d.calories} cal)</option>`);
    });
}

function updateToppingOptions(brand_id, selectedTopping = null) {
    const toppings = window.allToppings.filter(t => t.brand_id == brand_id);
    const select = $("#edit-topping");
    select.empty();

    toppings.forEach(t => {
        const selected = t.topping_name === selectedTopping ? "selected" : "";
        select.append(`<option value="${t.topping_name}" ${selected}>
            ${t.topping_name} ($${t.price}, ${t.calories} cal)
        </option>`);
        });
    }

function updateRecord(oldBrandId, oldDrinkName, newBrandId, newDrinkName, newTopping, newSugar, callback){
    $.ajax({
        url: "../logic.php/update.php",
        type: "POST",
        data: {
            action: "update_record",
            old_brand_id: oldBrandId,
            old_drink: oldDrinkName,
            brand_id: newBrandId,
            drink_name: newDrinkName,
            topping: newTopping,
            sugar: newSugar
        },
        dataType: "json",
        success: function(response) {
            if(response.success){
                console.log("Record updated successfully!");
                if(typeof callback === "function") callback(true);
            } else {
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