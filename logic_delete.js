$(document).ready(function() {
    $(document).on("click", ".delete-btn", function () {
        if (!confirm("Are you sure you want to delete this drink record?")) return;

        const card = $(this).closest(".todo-item-card");
        const brand_id = card.data("brand-id");
        const drink_name = card.data("drink-name");

        $.ajax({
            url: "../logic_php/delete.php",
            type: "POST",
            data: {
                action: "delete_record",
                brand_id: brand_id,
                drink_name: drink_name
            },
            dataType: "json",
            success: function (response) {
                if (response.success) {
                    card.fadeOut(300, function () {
                        $(this).remove();
                    });
                } else {
                    alert("Error: " + response.message);
                }
            },
            error: function (xhr, status, error) {
                console.error("Delete error:", error);
                alert("Failed to delete record.");
            }
        });
    });
});