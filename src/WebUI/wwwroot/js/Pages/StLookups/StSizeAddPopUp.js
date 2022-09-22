
$("#submitStSizeModal").on('click', function () {
    debugger;

    if ($("#StSizeModal").valid()) {

        var data = {
            SizeNameAr: $("#SizeNameAr").val(),
            SizeNameEn: $("#SizeNameEn").val(),
            Description: $("#StSizeDescriptionModal").val(),
        }

        $.ajax({
            url: "/StLookups/PopUpCreateStSize",
            type: "post",
            cache: false,
            processData: false,
            data: JSON.stringify(data),
            contentType: 'application/json',
            success: function (result) {
                // $("#FK_StSizeId").append("<option selected='selected' value='" + result.id + "'>" + result.sizeNameAr + "</option>");
                var multiselectSizes = $("#multiSelectSizes").data("kendoMultiSelect");
                var multiDataItemsSizes = multiselectSizes.dataItems();
                multiselectSizes.dataSource.add({ sizeNameAr: result.sizeNameAr, id: result.id });
                var sizesIds = [];
                for (var i = 0; i < multiDataItemsSizes.length; i++) {
                    sizesIds.push(multiDataItemsSizes[i].id);
                }
                sizesIds.push(result.id);
                multiselectSizes.value(sizesIds);
                $("#closeStSizeModal").click();

            }
        });
    }

});
$("#closeStSizeModal").on('click', function () {

    $("#SizeNameAr").val('');
    $("#SizeNameEn").val('');
    $("#StSizeDescriptionModal").val('');

});