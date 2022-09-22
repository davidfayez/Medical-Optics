

$("#submitStColorModal").on('click', function () {
    debugger;

    if ($("#StColorModal").valid()) {

        var data = {
            ColorNameAr: $("#ColorNameAr").val(),
            ColorNameEn: $("#ColorNameEn").val(),
            RGB: $("#RGB").val(),
            Description: $("#StColorDescriptionModal").val(),
        }

        $.ajax({
            url: "/StLookups/PopUpCreateStColor",
            type: "post",
            cache: false,
            processData: false,
            data: JSON.stringify(data),
            contentType: 'application/json',
            success: function (result) {
                //   $("#FK_StColorId").append("<option selected='selected' value='" + result.id + "'>" + result.colorNameAr + "</option>");

                var multiselectColors = $("#multiSelectColors").data("kendoMultiSelect");
                var multiDataItemsColors = multiselectColors.dataItems();
                multiselectColors.dataSource.add({ colorNameAr: result.colorNameAr, id: result.id });
                var colorsIds = [];
                for (var i = 0; i < multiDataItemsColors.length; i++) {
                    colorsIds.push(multiDataItemsColors[i].id);
                }
                colorsIds.push(result.id);
                multiselectColors.value(colorsIds);
                $("#closeStColorModal").click();

            }
        });
    }

});
$("#closeStColorModal").on('click', function () {

    $("#ColorNameAr").val('');
    $("#ColorNameEn").val('');
    $("#RGB").val('');
    $("#StColorDescriptionModal").val('');

});

