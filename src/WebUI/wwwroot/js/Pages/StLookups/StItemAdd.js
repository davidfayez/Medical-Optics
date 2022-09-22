
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

        //submit form if valid
        if ($("#createStItem").valid() && colorsValid && sizesValid) {
            $("#createStItem").submit();
        }
    });

});