$(document).ready(function () {

    $("#FK_CategoryId").change(function () {
        if ($("#FK_CategoryId").val() > 0) {
            $.ajax({
                url: '/StLookups/GetAllStItemByMainCategory?id=' + $("#FK_CategoryId").val(),
                success: function (items) {
                    var options = '<option value="">' + Resources.SelectOne + '</option>'
                    for (var i = 0; i < items.length; i++) {
                        options += '<option value="' + items[i].id + '">' + items[i].itemName + '</options>'
                    }
                    $("#FK_StItemId").html(options)
                }
            })
        }
    })

    $("#FK_StItemId").change(function () {
        if ($("#FK_StItemId").val() > 0) {
            $.ajax({
                url: '/StLookups/GetItemData?id=' + $("#FK_StItemId").val(),
                success: function (item) {
                    $("#ItemBarcode").val(item.barcodeCode)
                    $("#ItemBarcodehid").val(item.barcodeCode)
                    $("#QuantityFrom").val(0);
                    $("#ItemGender").val(item.genderName);
                    $("#FK_StGenderId").val(item.fK_StGenderId);
                    $("#ItemBrand").val(item.brandName);
                    $("#FK_StBrandId").val(item.fK_StBrandId);
                    $("#ItemModel").val(item.modelName);
                    $("#FK_StModelId").val(item.fK_StModelId);
                    $("#FK_StUnitId").val(item.fK_StUnitId);
                    $("#UnitPurchasePrice").val(item.purchasePrice);
                    $("#UnitSalesPrice").val(item.salePrice);
                    $("#UnitCostPrice").val(item.costPrice);

                    $("#TotalItemSalsePrice").val(0);
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

    $("#ItemBarcode").change(function () {
        //debugger;
        //var bar=$("#ItemBarcode").val();
        if ($("#ItemBarcode").val() != "") {
            $.ajax({
                url: '/StLookups/GetBarcodeData?barcode=' + $("#ItemBarcode").val(),
                success: function (item) {
                    debugger;
                    $("#ItemBarcode").val(item.barcodeCode)
                    $("#ItemBarcodehid").val(item.barcodeCode)
                    //  $("#QuantityFrom").val(0);
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
                    $("#FK_StItemId").val(item.id);
                    //$("#mainCategorie").val(item.fK_StMainCategoryId);

                    if (item.id != 0) {
                        var option = '<option value="' + item.id + '">' + item.itemName + '</options>'
                        $("#FK_StItemId").html(option);
                    }

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

    $("#QuantityFrom").change(function () {
        if ($("#QuantityFrom").val() > 0 && $("#UnitSalesPrice").val() > 0) {

            $("#TotalItemSalsePrice").val($("#UnitSalesPrice").val() * $("#QuantityFrom").val())
        }
    })
    $("#UnitSalesPrice").change(function () {
        if ($("#QuantityFrom").val() > 0 && $("#UnitSalesPrice").val() > 0) {

            $("#TotalItemSalsePrice").val($("#UnitSalesPrice").val() * $("#QuantityFrom").val())
        }
    })
    var tempSource = new kendo.data.DataSource({
        transport: {
            read: "/StTransaction/GetStroeTransferDetails?id=" + $("#Id").val()
        },
        schema: {
            model: {
                id: "id",
                fields: {
                    fK_StItemId: { type: "string" },
                    fK_StGenderId: { type: "string" },
                    fK_StBrandId: { type: "string" },
                    fK_StModelId: { type: "string" },
                    fK_StColorId: { type: "string" },
                    fK_StSizeId: { type: "string" },
                    fK_StUnitId: { type: "string" },
                    itemBarcode: { type: "string" },
                    itemName: { type: "string" },
                    quantityFrom: { type: "string" },
                    unitPurchasePrice: { type: "string" },
                    unitSalesPrice: { type: "string" },
                    unitCostPrice: { type: "string" },
                    totalSalsePrice: { type: "string" },
                    creationDate: { type: "date", editable: false },
                    isActive: { editable: false },
                }
            }
        }
    });

    var storeTransfergrid = $("#storeTransferDetailGrid").kendoGrid({
        dataSource: tempSource,
        navigatable: true,
        pageable: false,
        scrollable: false,
        columns: [
            { field: "fK_StItemId", hidden: true },
            { field: "fK_StGenderId", hidden: true },
            { field: "fK_StBrandId", hidden: true },
            { field: "fK_StModelId", hidden: true },
            { field: "fK_StColorId", hidden: true },
            { field: "fK_StSizeId", hidden: true },
            { field: "fK_StUnitId", hidden: true },
            { field: "itemBarcode", title: Resources.Code, width: Resources.CodeWidth },
            { field: "itemName", title: Resources.ItemName, width: Resources.NameWidth },
            { field: "quantityFrom", title: Resources.Quantity, width: Resources.InputNumberWidth },
            { field: "unitPurchasePrice", title: Resources.UnitPurchasePrice, width: Resources.InputNumberWidth },
            { field: "unitSalesPrice", title: Resources.UnitSalesPrice, width: Resources.InputNumberWidth },
            { field: "unitCostPrice", title: Resources.UnitCostPrice, width: Resources.InputNumberWidth },
            { field: "totalSalsePrice", title: Resources.Total, width: Resources.InputNumberWidth },

            { width: Resources.ActionWidth, template: "<a  class='btn btn-danger btn-sm btnDelete' ><i class='fas fa-trash-alt'></i></a>" }
        ],
        editable: false,
        selectable: "multiple, cell",


    });
    $("#btnAddNewDetail").on('click', function () {

        var FK_StItemId = $("#FK_StItemId").val(),
            FK_StGenderId = $("#FK_StGenderId").val(),
            FK_StBrandId = $("#FK_StBrandId").val(),
            FK_StModelId = $("#FK_StModelId").val(),
            FK_StColorId = $("#FK_StColorId").val(),
            FK_StSizeId = $("#FK_StSizeId").val(),
            FK_StUnitId = $("#FK_StUnitId").val(),
            ItemBarcode = $("#ItemBarcodehid").val(),
            ItemName = $("#FK_StItemId option:selected").text(),
            QuantityFrom = $("#QuantityFrom").val(),
            UnitPurchasePrice = $("#UnitPurchasePrice").val(),
            UnitSalesPrice = $("#UnitSalesPrice").val(),
            UnitCostPrice = $("#UnitCostPrice").val(),
            TotalItemSalsePrice = $("#TotalItemSalsePrice").val();

        if ($("#mainForm").valid() && FK_StItemId > 0 && QuantityFrom > 0 && UnitSalesPrice > 0 && TotalItemSalsePrice > 0 && $("#FK_StStoreFromId").val()) {
            var quantity = 0;
            var table = $("#storeTransferDetailGrid").data("kendoGrid").dataSource.data();
            for (var i = 0; i < table.length; i++) {
                if (table[i].fK_StItemId == FK_StItemId && table[i].id == 0)
                    quantity += parseFloat(table[i].quantityFrom);
            }

            $.ajax({
                url: "/StTransaction/CheckItemBalance?itemId=" + FK_StItemId + "&&stockId=" + $("#FK_StStoreFromId").val() + "&&quantity=" + quantity,
                success: function (result) {
                    result -= quantity;
                    if (result >= QuantityFrom) {
                        var totalRecords = $("#storeTransferDetailGrid").data("kendoGrid").dataSource.data().length;
                        var Index = parseInt($("#Index").val());
                        if (!isNaN(Index))
                            totalRecords = Index - 1;
                        tempSource.insert(totalRecords, {
                            fK_StItemId: FK_StItemId,
                            fK_StGenderId: FK_StGenderId,
                            fK_StBrandId: FK_StBrandId,
                            fK_StModelId: FK_StModelId,
                            fK_StColorId: FK_StColorId,
                            fK_StSizeId: FK_StSizeId,
                            fK_StUnitId: FK_StUnitId,
                            itemBarcode: ItemBarcode,
                            itemName: ItemName,
                            quantityFrom: QuantityFrom,
                            unitPurchasePrice: UnitPurchasePrice,
                            unitSalesPrice: UnitSalesPrice,
                            unitCostPrice: UnitCostPrice,
                            totalSalsePrice: TotalItemSalsePrice
                        });

                        // set total 
                        var TotalItemCount = $("#TotalItemCount").val(),
                            TotalPurchasePrice = $("#TotalPurchasePrice").val(),
                            TotalSalesPrice = $("#TotalSalesPrice").val(),
                            TotalCostPrice = $("#TotalCostPrice").val();


                        if (TotalItemCount > 0) {
                            $("#TotalItemCount").val(parseFloat(TotalItemCount) + parseFloat(QuantityFrom))
                        } else {
                            $("#TotalItemCount").val(parseFloat(QuantityFrom))
                        }
                        if (TotalPurchasePrice > 0) {
                            $("#TotalPurchasePrice").val(parseFloat(TotalPurchasePrice) + (parseFloat(UnitPurchasePrice) * parseFloat(QuantityFrom)))
                        } else {
                            $("#TotalPurchasePrice").val(parseFloat(UnitPurchasePrice) * parseFloat(QuantityFrom))
                        }
                        if (TotalSalesPrice > 0) {
                            $("#TotalSalesPrice").val(parseFloat(TotalSalesPrice) + (parseFloat(UnitSalesPrice) * parseFloat(QuantityFrom)))
                        } else {
                            $("#TotalSalesPrice").val(parseFloat(UnitSalesPrice) * parseFloat(QuantityFrom))
                        }
                        if (TotalCostPrice > 0) {
                            $("#TotalCostPrice").val(parseFloat(TotalCostPrice) + (parseFloat(UnitCostPrice) * parseFloat(QuantityFrom)))
                        } else {
                            $("#TotalCostPrice").val(parseFloat(UnitCostPrice) * parseFloat(QuantityFrom))
                        }

                        ClearFormDetails();

                    } else {
                        swal({
                            title: Resources.MaxItemAllowedQuantity + " " + $("#FK_StItemId option:selected").text() + " ( " + result + " )",
                            confirmButtonText: Resources.DoneResource,
                            type: "error"
                        });
                    }
                }
            });

        } else {

            if (isNaN(FK_StItemId) || FK_StItemId <= 0) {

                swal({
                    title: Resources.EnterRequiredResource + " " + Resources.ItemName,
                    confirmButtonText: Resources.DoneResource,
                    type: "error"
                });
            } else if (isNaN(QuantityFrom) || QuantityFrom <= 0) {
                swal({
                    title: Resources.EnterRequiredResource + " " + Resources.Quantity,
                    confirmButtonText: Resources.DoneResource,
                    type: "error"
                });
            } else if (isNaN(UnitPurchasePrice) || UnitPurchasePrice <= 0) {
                swal({
                    title: Resources.EnterRequiredResource + " " + Resources.UnitPurchasePrice,
                    confirmButtonText: Resources.DoneResource,
                    type: "error"
                });
            } else if (isNaN(UnitSalesPrice) || UnitSalesPrice <= 0) {
                swal({
                    title: Resources.EnterRequiredResource + " " + Resources.UnitSalesPrice,
                    confirmButtonText: Resources.DoneResource,
                    type: "error"
                });
            } else if ($("#FK_StStoreFromId").val() == "") {
                swal({
                    title: Resources.EnterRequiredResource + " " + Resources.Store,
                    confirmButtonText: Resources.DoneResource,
                    type: "error"
                });
            } else {
                swal({
                    title: Resources.EnterRequiredResourceEnterRequiredResource + " " + Resources.UnitCostPrice,
                    confirmButtonText: Resources.DoneResource,
                    type: "error"
                });
            }

        }


    });
    storeTransfergrid.data("kendoGrid").table.on("click", ".btnDelete", removeRow);
    var thisRow = "";

    function removeRow() {

        var row = $(this).closest("tr"),
            grid = $("#storeTransferDetailGrid").data("kendoGrid"),
            dataItem = grid.dataItem(row),
            detailId = dataItem.id,
            dataSource = $("#storeTransferDetailGrid").data("kendoGrid").dataSource;
        swal({
            title: Resources.DeleteResource,
            text: Resources.DeleteItemQuantityConfirmResource,
            type: "info",
            showCancelButton: true,
            confirmButtonText: Resources.DeleteResource,
            cancelButtonText: Resources.CancelResource,
            closeOnConfirm: false,
            showLoaderOnConfirm: true
        }, function () {
            setTimeout(function () {
                //var dataSource = $("#storeTransferDetailGrid").data("kendoGrid").dataSource;
                debugger
                if (detailId != "" && detailId != null) {
                    setTimeout(function () {
                        $.ajax({
                            url: "/StTransaction/DeleteStoreTransferDetail?id=" + detailId,
                            type: "Get",
                            contentType: 'application/json; charset=utf-8',
                            success: function (result) {

                                if (result) {
                                    //LoadGridBondDetails();
                                    dataSource.remove(dataItem)
                                    swal({
                                        title: Resources.DeleteSuccessResource,
                                        confirmButtonText: Resources.DoneResource,
                                        type: "success"
                                    });
                                    var QuantityFrom = dataItem.quantityFrom,
                                        UnitPurchasePrice = dataItem.unitPurchasePrice,
                                        UnitSalesPrice = dataItem.unitSalesPrice,
                                        UnitCostPrice = dataItem.unitCostPrice;
                                    // set total 
                                    var TotalItemCount = $("#TotalItemCount").val(),
                                        TotalPurchasePrice = $("#TotalPurchasePrice").val(),
                                        TotalSalesPrice = $("#TotalSalesPrice").val(),
                                        TotalCostPrice = $("#TotalCostPrice").val();


                                    $("#TotalItemCount").val(parseFloat(TotalItemCount) - parseFloat(QuantityFrom))

                                    $("#TotalPurchasePrice").val(parseFloat(TotalPurchasePrice) - (parseFloat(UnitPurchasePrice) * parseFloat(QuantityFrom)))

                                    $("#TotalSalesPrice").val(parseFloat(TotalSalesPrice) - (parseFloat(UnitSalesPrice) * parseFloat(QuantityFrom)))

                                    $("#TotalCostPrice").val(parseFloat(TotalCostPrice) - (parseFloat(UnitCostPrice) * parseFloat(QuantityFrom)))

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
                }
                else if (dataSource.remove(dataItem)) {
                    swal({
                        title: Resources.DeleteSuccessResource,
                        confirmButtonText: Resources.DoneResource,
                        type: "success"
                    });

                    var QuantityFrom = dataItem.quantityFrom,
                        UnitPurchasePrice = dataItem.unitPurchasePrice,
                        UnitSalesPrice = dataItem.unitSalesPrice,
                        UnitCostPrice = dataItem.unitCostPrice;
                    // set total 
                    var TotalItemCount = $("#TotalItemCount").val(),
                        TotalPurchasePrice = $("#TotalPurchasePrice").val(),
                        TotalSalesPrice = $("#TotalSalesPrice").val(),
                        TotalCostPrice = $("#TotalCostPrice").val();


                    $("#TotalItemCount").val(parseFloat(TotalItemCount) - parseFloat(QuantityFrom))

                    $("#TotalPurchasePrice").val(parseFloat(TotalPurchasePrice) - (parseFloat(UnitPurchasePrice) * parseFloat(QuantityFrom)))

                    $("#TotalSalesPrice").val(parseFloat(TotalSalesPrice) - (parseFloat(UnitSalesPrice) * parseFloat(QuantityFrom)))

                    $("#TotalCostPrice").val(parseFloat(TotalCostPrice) - (parseFloat(UnitCostPrice) * parseFloat(QuantityFrom)))

                }
                else {
                    swal({
                        title: Resources.DeleteFailedResource,
                        confirmButtonText: Resources.DoneResource,
                        type: "error"
                    });
                }

            }, 1000);
        });
    }

    function ClearFormDetails() {
        $("#FK_StItemId").val("");
        $("#ItemBarcode").val("");
        $("#ItemBarcodehid").val("");
        $("#QuantityFrom").val(0);
        $("#ItemGender").val("");
        $("#FK_StGenderId").val("");
        $("#ItemBrand").val("");
        $("#FK_StBrandId").val("");
        $("#ItemModel").val("");
        $("#FK_StModelId").val("");

        $("#UnitPurchasePrice").val(0);
        $("#UnitSalesPrice").val(0);
        $("#UnitCostPrice").val(0);

        $("#TotalItemSalsePrice").val(0);
        $("#FK_StColorId").html("");
        $("#FK_StSizeId").html("");
    }

    $("#btnSaveTransaction").click(function () {
        if ($("#SerialNumber").val() > 0) {
            $("#SerialNumberValid").text("")
        } else {
            $("#SerialNumberValid").text(Resources.Required)
        }
        if ($("#OperatingNumber").val() > 0) {
            $("#OperatingNumberValid").text("")
        } else {
            $("#OperatingNumberValid").text(Resources.Required)
        }
        var table = $("#storeTransferDetailGrid").data("kendoGrid").dataSource.data();
        if (table.length == 0) {
            swal({
                title: Resources.GridLengthZeroResource,
                confirmButtonText: Resources.DoneResource,
                type: "error"
            });

        }
        if ($("#FK_StStoreFromId").val() == $("#FK_StStoreToId").val()) {
            swal({
                title: Resources.ErrorSameStore,
                confirmButtonText: Resources.DoneResource,
                type: "error"
            });
        }
        if ($("#mainForm").valid() && $("#SerialNumber").val() > 0 && $("#OperatingNumber").val() > 0 && table.length > 0 && $("#FK_StStoreFromId").val() != $("#FK_StStoreToId").val()) {
            var tranDetail = [];
            for (var i = 0; i < table.length; i++) {
                var detail = {
                    Id: table[i].id,
                    FK_StItemId: table[i].fK_StItemId,
                    QuantityFrom: table[i].quantityFrom,
                    FK_StUnitId: table[i].fK_StUnitId,
                    FK_StBrandId: table[i].fK_StBrandId,
                    FK_StModelId: table[i].fK_StBrandId,
                    FK_StGenderId: table[i].fK_StGenderId,
                    FK_StColorId: table[i].fK_StColorId,
                    FK_StSizeId: table[i].fK_StSizeId,
                    UnitPurchasePrice: table[i].unitPurchasePrice,
                    UnitCostPrice: table[i].unitCostPrice,
                    UnitSalesPrice: table[i].unitSalesPrice,
                    TotalCostPrice: table[i].unitCostPrice * table[i].QuantityFrom,
                    TotalSalsePrice: table[i].totalSalsePrice,
                }
                tranDetail.push(detail);
            }
            var tran = {
                Id: $("#Id").val(),
                SerialNumber: $("#SerialNumber").val(),
                FK_StStoreFromId: $("#FK_StStoreFromId").val(),
                FK_StStoreToId: $("#FK_StStoreToId").val(),
                TransactionDate: $("#TransactionDate").val(),
                OperatingNumber: $("#OperatingNumber").val(),
                TotalItemCount: $("#TotalItemCount").val(),
                TotalSalesPrice: $("#TotalSalesPrice").val(),
                TotalPurchasePrice: $("#TotalPurchasePrice").val(),
                TotalCostPrice: $("#TotalCostPrice").val(),
                //hdnAttachmentIds: $("#hdnAttachmentIds").val(),
                details: tranDetail
            }

            $.ajax({
                url: '/StTransaction/EditStoreTransfer',
                type: 'POST',
                data: { addEditStoreTransferVM: tran },
                success: function (result) {
                    if (isNaN(result)) {
                        var message = "";
                        for (var i = 0; i < result.length; i++) {
                            if (result[i].quantityTo < result[i].quantityFrom && result[i].id == 0)
                                message += Resources.MaxItemAllowedQuantity + " " + result[i].itemName + " ( " + result[i].quantityTo + " ) ,";
                        }

                        swal({
                            title: message,
                            confirmButtonText: Resources.DoneResource,
                            type: "error"
                        });

                    } else if (result > 0) {
                        swal({
                            title: Resources.SavedSuccessfullyResource,
                            confirmButtonText: Resources.DoneResource,
                            type: "success"
                        });

                        window.location = "../../StTransaction/IndexStoreTransfer"
                    } else {
                        swal({
                            title: Resources.ErrorMsgResource,
                            confirmButtonText: Resources.DoneResource,
                            type: "success"
                        });
                    }
                }
            })
        }
    })
}) 