$(document).ready(function() {
    $(document).on("click", ".delete-btn", function () {
        if (!confirm("Are you sure you want to delete this drink record?")) return;

        const card = $(this).closest(".record-item-card");
        const record_id = card.data("record-id");

        $.ajax({
            url: "../logic_php/delete.php",
            type: "POST",
            data: {
                action: "delete_record",
                record_id: record_id
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