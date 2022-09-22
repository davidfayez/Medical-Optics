$(document).ready(function () {
    debugger

    var multiSelectSize = $("#multiSelectSizes").kendoMultiSelect({
        placeholder: Resources.Choose + " " + Resources.Sizes,
        dataTextField: "sizeNameAr",
        dataValueField: "id",
        autoBind: false,
        dataSource: {
            type: "json",
            serverFiltering: true,
            transport: {
                read: {
                    url: "/StLookups/GetSizesMultiSelect"
                }
            }
        },
    });

    multiSelectSize.data("kendoMultiSelect").value(sizeIds);
    var multiSelectColor = $("#multiSelectColors").kendoMultiSelect({
        placeholder: Resources.Choose + " " + Resources.Colors,
        dataTextField: "colorNameAr",
        dataValueField: "id",
        autoBind: false,
        dataSource: {
            type: "json",
            serverFiltering: true,
            transport: {
                read: {
                    url: "/StLookups/GetColorsMultiSelect"
                },
            },
            schema: {
                model: {
                    id: "id",
                    fields: {

                        colorNameAr: {
                            type: "string"
                        }
                    }
                }
            }
        },

    });

    multiSelectColor.data("kendoMultiSelect").value(colorIds);

    if ($('#IsTaxable').is(':checked')) {
        $("#TaxAmount").removeAttr('disabled');
        $("#FK_TaxTypeId").removeAttr('disabled');

    }

    if ($('#IsDiscountable').is(':checked')) {
        $("#DiscountAmount").removeAttr('disabled');
        $("#FK_TaxTypeId").removeAttr('disabled');

    }

    $('#IsTaxable').change(function () {
        if ($('#IsTaxable').is(':checked')) {
            $("#TaxAmount").removeAttr('disabled');
            $("#FK_TaxTypeId").removeAttr('disabled');
        }
        else {
            $("#TaxAmount").attr("disabled", "disabled");
            $("#FK_TaxTypeId").attr("disabled", "disabled");
            $("#TaxAmount").val(null);
            $("#FK_TaxTypeId").val(null);
        }

    });

    $('#IsDiscountable').change(function () {
        if ($('#IsDiscountable').is(':checked')) {
            $("#DiscountAmount").removeAttr('disabled');
        }
        else {
            $("#DiscountAmount").attr("disabled", "disabled");
            $("#DiscountAmount").val(null);
        }

    });


    $("#btnSubmitEdit").on('click', function () {
        debugger
        //if ($("#createStItem").valid()) {

        // Set Color valus selected Ids
        var multiselectColors = $("#multiSelectColors").data("kendoMultiSelect");
        var multiDataItemsColors = multiselectColors.dataItems();
        var colorsIds = [];
        var colorsValid = true;
        for (var i = 0; i < multiDataItemsColors.length; i++) {
            colorsIds.push(multiDataItemsColors[i].id);
        }
        $('input:hidden[name=ColorIds]').val(colorsIds);
        if (colorsIds.length == 0) {
            $('#colorValidation').attr("hidden", false);
            colorsValid = false;
        } else {
            $('#colorValidation').attr("hidden", true);
        }
        colorsIds = [];


        // Set Size valus selected Ids
        var multiselectSizes = $("#multiSelectSizes").data("kendoMultiSelect");
        var multiDataItemsSizes = multiselectSizes.dataItems();
        var sizesIds = [];
        var sizesValid = true;
        for (var i = 0; i < multiDataItemsSizes.length; i++) {
            sizesIds.push(multiDataItemsSizes[i].id);
        }
        $('input:hidden[name=SizeIds]').val(sizesIds);
        if (sizesIds.length == 0) {
            $('#sizeValidation').attr("hidden", false);
            sizesValid = false;
        } else {
            $('#sizeValidation').attr("hidden", true);
        }
        sizesIds = [];

        //submit form if valid
        if ($("#edit").valid() && colorsValid && sizesValid) {
            $("#edit").submit();
        }
    });


   
});

//Remove Item 
function remove(id) {


    swal({
        title: Resources.DeleteResource,
        text: Resources.DeleteConfirmResource,
        type: "info",
        showCancelButton: true,
        confirmButtonText: Resources.DeleteResource,
        cancelButtonText: Resources.CancelResource,
        closeOnConfirm: false,
        showLoaderOnConfirm: true
    }, function () {
        setTimeout(function () {
            $.ajax({
                url: "/InsuranceService/Delete?Id=" + id,
                type: "Get",
                contentType: 'application/json; charset=utf-8',
                success: function (result) {
                    debugger;
                    if (result) {
                        swal({
                            title: Resources.DeleteSuccessResource,
                            confirmButtonText: Resources.DoneResource,
                            type: "success"
                        });
                        document.location = "../../InsuranceService/Index";
                    }
                    else {
                        swal({
                            title: Resources.DeleteFailedResource,
                            confirmButtonText: Resources.DoneResource,
                            type: "error"
                        });
                    }
                },
                error: function (err, xqr, txt) { }
            });

        }, 3000);
    });
}