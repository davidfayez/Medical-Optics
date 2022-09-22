$(document).ready(function () {

    var now = new Date(),
        today = now.getFullYear() + "-" + ("0" + (now.getMonth() + 1)).slice(-2) + "-" + ("0" + now.getDate()).slice(-2);
    $('#ExpiryDate').val(today);
    $("#mainStStoreId").change(function () {

        if ($("#mainStStoreId").val() > 0) {
            $.ajax({
                url: '/StLookups/GetAllSubStoresByParentId?id=' + $("#mainStStoreId").val(),
                success: function (items) {
                    var options = '<option value="">' + Resources.SelectOne + '</option>'
                    debugger
                    for (var i = 0; i < items.length; i++) {
                        options += '<option value="' + items[i].id + '">' + items[i].storeNameAr + '</options>'
                    }
                    $("#subStStoreId").html(options)
                }
            })
        }
    });

    $("#mainCategorie").change(function () {
        if ($("#mainCategorie").val() > 0) {
            $.ajax({
                url: '/StLookups/GetAllStItemByMainCategory?id=' + $("#mainCategorie").val(),
                success: function (items) {
                    var options = '<option value="">' + Resources.SelectOne + '</option>'
                    for (var i = 0; i < items.length; i++) {
                        options += '<option value="' + items[i].id + '">' + items[i].itemName + '</options>'
                    }
                    $("#FK_StItemId").html(options)
                }
            })
        }
    });

    $("#FK_StItemId").change(function () {
        if ($("#FK_StItemId").val() > 0) {
            $.ajax({
                url: '/StLookups/GetItemData?id=' + $("#FK_StItemId").val(),
                success: function (item) {
                    $("#ItemBarcode").val(item.barcodeCode)
                    $("#ItemBarcodehid").val(item.barcodeCode)
                    $("#Discount").val(item.discount);
                    $("#ItemGender").val(item.genderName);
                    $("#FK_StGenderId").val(item.fK_StGenderId);
                    $("#ItemBrand").val(item.brandName);
                    $("#FK_StBrandId").val(item.fK_StBrandId);
                    $("#ItemModel").val(item.modelName);
                    $("#FK_StModelId").val(item.fK_StModelId);
                    $("#FK_StUnitId").val(item.fK_StUnitId);
                    $("#ItemUnit").val(item.unitName);
                    $("#UnitPurchasePrice").val(item.purchasePrice);
                    $("#UnitSalesPrice").val(item.salePrice);
                    $("#UnitCostPrice").val(item.costPrice);

                    //  $("#TotalItemSalsePrice").val(0);
                    var colorOptions = "";
                    for (var i = 0; i < item.itemColor.length; i++) {
                        colorOptions += '<option value="' + item.itemColor[i].value + '">' + item.itemColor[i].text + '</options>'
                    }
                    $("#FK_StColorId").html(colorOptions);

                    var sizeOptions = "";
                    for (var i = 0; i < item.itemSize.length; i++) {
                        sizeOptions += '<option value="' + item.itemSize[i].value + '">' + item.itemSize[i].text + '</options>'
                    }
                    $("#FK_StSizeId").html(sizeOptions);
                }
            })
        }
    })

   
    var url = "/StTransaction/GetAllItemsProfits";
    loadStItemsProfitsGrid();

    function loadStItemsProfitsGrid() {
        var dataSource = new kendo.data.DataSource({
            transport: {
                read: {
                    url: url,
                    Type: "GET"
                }
            },
            error: function (e) {
                alert("Status: " + e.status + "; Error message: " + e.errorThrown);
            },
            pageMainCategory: 10,
            schema: {
                model: {
                    id: "id",
                    fields: {
                        id: { editable: false },
                        storeName: { editable: false },
                        categoryName: { editable: false },
                        itemBarcode: { editable: false },
                        itemName: { editable: false },
                        totalSalsePrice: { editable: false },
                        totalPurchasePrice: { editable: false },
                        totalProfits: { editable: false },

                    }
                }
            }
        });


        var grid = $("#StItemsProfitsGrid").kendoGrid({
            excel: {
                fileName: "Stock Branch Exchange.xlsx",
                allPages: Resources.GridAllPages,
                filterable: Resources.GridFilterable
            },
            dataSource: dataSource,
            pageMainCategory: 20,
            serverPaging: Resources.GridServerPaging,
            serverFiltering: Resources.GridServerFiltering,
            filterable: Resources.GridFilterable,
            height: Resources.GridHeight,
            groupable: Resources.GridGroupable
            ,
            sortable: Resources.GridSortable,
            resizable: Resources.GridResizable,
            noRecords: Resources.GridNoRecords,
            messages: {
                noRecords: Resources.GridNoRecordsMessage
            },
            pageable: {
                pageMainCategorys: [10, 20, 50, Resources.All],
                numeric: Resources.GridNumeric,
                refresh: Resources.GridRefresh,

            },
            columns: [

                { field: "storeName", title: Resources.Store, width: Resources.NameWidth },
                { field: "categoryName", title: Resources.MainCategories, width: Resources.NameWidth },
                { field: "itemBarcode", title: Resources.Barcode, width: Resources.NameWidth },
                { field: "itemName", title: Resources.ItemName, width: Resources.NameWidth },
                { field: "totalSalsePrice", title: Resources.TotalSalesPrice, width: Resources.AmountWidth },
                { field: "totalPurchasePrice", title: Resources.TotalPurchasePrice, width: Resources.AmountWidth },
                { field: "totalProfits", title: Resources.TotalProfits, width: Resources.AmountWidth },
                
            ],
            dataBound: function (e) {
                e.sender.items().each(function () {
                    var dataItem = e.sender.dataItem(this);
                    kendo.bind(this, dataItem);

                });
                if (!hasRoleEdit)
                    $(".btnEdit").addClass('disabled');

                if (!hasRoleDelete)
                    $(".btnDelete").addClass('disabled');
            },
            //resizable: true
        });
        
    }

    $("#btnSearch").on('click', function () {
        var stStoreId;
        if ($("#subStStoreId").val() > 0)
            stStoreId = $("#subStStoreId").val();
        else
            stStoreId = $("#mainStStoreId").val();
        debugger;
        var fK_StItemId = $("#FK_StItemId").val(),
            dateFrom = $("#DateFrom").val(),
            dateTo = $("#DateTo").val(),
            //FK_StStoreToId = stStoreId,
            barcodeFrom = $("#BarcodeFrom").val(),
            barcodeTo = $("#BarcodeTo").val(),
            fK_StMainCategoryId = $("#mainCategorie").val(),
            fK_PaySupplierId = $("#FK_PaySupplierId").val(),
            ItemName = $("#FK_StItemId option:selected").text();
        debugger
        url = "/StTransaction/GetAllItemsProfits?dateFrom=" + dateFrom + "&dateTo=" + dateTo + "&fK_StStoreId=" + stStoreId + "&barcodeFrom=" + barcodeFrom + "&barcodeTo=" + barcodeTo + "&fK_StMainCategoryId=" + fK_StMainCategoryId + "&fK_StItemId=" + fK_StItemId + "&fK_PaySupplierId=" + fK_PaySupplierId 
        loadStItemsProfitsGrid();


    });

}) 