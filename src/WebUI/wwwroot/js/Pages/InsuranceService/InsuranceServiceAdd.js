
$(document).ready(function () {

    $("#multiSelectSizes").kendoMultiSelect({
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


    loadColors();
    function loadColors() {
        $("#multiSelectColors").kendoMultiSelect({
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
    }
    $("#btnSubmit").on('click', function () {

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
        debugger;
        //submit form if valid
        if ($("#create").valid() && colorsValid && sizesValid) {
            $("#create").submit();
        }
    });

});