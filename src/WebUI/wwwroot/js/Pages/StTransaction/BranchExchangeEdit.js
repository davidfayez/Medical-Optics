$(document).ready(function () {

    var now = new Date(),
        today = now.getFullYear() + "-" + ("0" + (now.getMonth() + 1)).slice(-2) + "-" + ("0" + now.getDate()).slice(-2);

    var url = window.location.pathname;
    var id = url.substring(url.lastIndexOf('/') + 1);

    $('#ExpiryDate').val(today);
    $("#mainStStoreId").change(function () {

        if ($("#mainStStoreId").val() > 0) {
            $.ajax({
                url: '/StLookups/GetAllSubStoresByParentId?id=' + $("#mainStStoreId").val(),
                success: function (items) {
                    var options = '<option value="">' + Resources.SelectOne + '</option>'
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

    //$("#QuantityFrom").change(function () {
    //    if ($("#QuantityFrom").val() > 0 && $("#UnitSalesPrice").val() > 0) {

    //        $("#TotalItemSalsePrice").val($("#UnitSalesPrice").val() * $("#QuantityFrom").val())
    //    }
    //})
    //$("#UnitSalesPrice").change(function () {
    //    if ($("#QuantityFrom").val() > 0 && $("#UnitSalesPrice").val() > 0) {

    //        $("#TotalItemSalsePrice").val($("#UnitSalesPrice").val() * $("#QuantityFrom").val())
    //    }
    //})
    tempSource = new kendo.data.DataSource({
        transport: {
            read: {
                url: "/StTransaction/GetStBranchExchangeDetailsById?id=" + $("#Id").val(),
                Type: "GET"
            },
            parameterMap: function (options, operation) {
                if (operation !== "read" && options.models) {
                    return { models: kendo.stringify(options.models) };
                }
            }
        },
        //autoSync: true,
        batch: true,
        //pageSize: 20,
        schema: {
            model: {
                id: "id",
                fields: {
                    id: { editable: true },
                    fK_StItemId: { editable: false },
                    fK_StGenderId: { editable: false },
                    fK_StBrandId: { editable: false },
                    fK_StModelId: { editable: false },
                    fK_StColorId: { editable: false },
                    fK_StSizeId: { editable: false },
                    fK_StUnitId: { editable: false },
                    itemBarcode: { validation: { required: true } },
                    itemName: { validation: { required: true, message: Resources.Required } },
                    quantityFrom: { type: "number", validation: { min: 0, required: true, message: Resources.Required } },
                    discount: { type: "number", editable: false },
                    unitPurchasePrice: { type: "number", editable: false },
                    unitSalesPrice: { type: "number" },
                    unitCostPrice: { type: "number", editable: false },
                    expiryDate: { type: "date", validation: { required: true, message: Resources.Required } },
                }
            }
        }
    });

    var storeTransfergrid = $("#BranchExchangeDetailGrid").kendoGrid({
        dataSource: tempSource,
        navigatable: true,
        pageable: false,
        scrollable: false,
        columns: [
            { field: "fK_StItemId", hidden: true },
            { field: "FK_StGenderId", hidden: true },
            { field: "FK_StBrandId", hidden: true },
            { field: "FK_StModelId", hidden: true },
            { field: "FK_StColorId", hidden: true },
            { field: "FK_StSizeId", hidden: true },
            { field: "FK_StUnitId", hidden: true },
            { field: "itemBarcode", title: Resources.Code, width: Resources.CodeWidth },
            { field: "itemName", title: Resources.ItemName, width: Resources.NameWidth },
            { field: "quantityFrom", title: Resources.Quantity, width: Resources.InputNumberWidth },
            { field: "discount", hidden: true },
            { field: "unitPurchasePrice", hidden: true },
            { field: "unitSalesPrice", title: Resources.UnitSalesPrice, width: Resources.InputNumberWidth },
            { field: "unitCostPrice", hidden: true },
            //{ field: "totalSalsePrice", hidden: true },

            //{ field: "ItemUnit", title: Resources.Unit, width: Resources.NameWidth },
            { field: "expiryDate", format: "{0:yyyy/MM/dd}", width: Resources.DateWidth, title: Resources.DateExpiry },

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
            ItemUnit = $("#ItemUnit").val(),
            QuantityFrom = $("#Quantity").val(),
            Discount = parseFloat($("#Discount").val()),
            ExpiryDate = $("#ExpiryDate").val(),
            UnitPurchasePrice = $("#UnitPurchasePrice").val(),
            UnitSalesPrice = $("#UnitSalesPrice").val(),
            UnitCostPrice = $("#UnitCostPrice").val(),
            TotalItemSalsePrice = $("#TotalItemSalsePrice").val();
        var stStoreId;
        if ($("#subStStoreId").val() > 0)
            stStoreId = $("#subStStoreId").val();
        else
            stStoreId = $("#mainStStoreId").val();
        if ($("#mainForm").valid() && FK_StItemId > 0 && QuantityFrom > 0 && UnitSalesPrice > 0) {
            var quantity = 0;
            var table = $("#BranchExchangeDetailGrid").data("kendoGrid").dataSource.data();
            for (var i = 0; i < table.length; i++) {
                if (table[i].fK_StItemId == FK_StItemId && table[i].id == 0)
                    quantity += parseFloat(table[i].quantityFrom);
            }
            $.ajax({
                url: "/StTransaction/CheckItemBalance?itemId=" + FK_StItemId + "&&stockId=" + stStoreId + "&&quantity=" + quantity,
                success: function (result) {
                    result -= quantity;
                    if (result >= QuantityFrom) {
                        var totalRecords = $("#BranchExchangeDetailGrid").data("kendoGrid").dataSource.data().length;
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
                            itemName: ItemName,
                            itemBarcode: ItemBarcode,
                            expiryDate: ExpiryDate,
                            itemUnit: ItemUnit,
                            Discount: Discount,
                            quantityFrom: QuantityFrom,
                            UnitPurchasePrice: UnitPurchasePrice,
                            unitSalesPrice: UnitSalesPrice,
                            UnitCostPrice: UnitCostPrice,
                            totalSalsePrice: TotalItemSalsePrice
                        });

                        // set total 
                        var TotalItemCount = $("#TotalItemCount").val(),
                            TotalPurchasePrice = $("#TotalPurchasePrice").val(),
                            TotalSalesPrice = $("#TotalSalesPrice").val(),
                            TotalCostPrice = $("#TotalCostPrice").val(),
                            FinalTotal = $("#FinalTotal").val();
                        TotalDiscount = $("#TotalDiscount").val();


                        if (TotalItemCount > 0) {
                            $("#TotalItemCount").val(parseFloat(TotalItemCount) + parseFloat(QuantityFrom))
                        } else {
                            $("#TotalItemCount").val(parseFloat(QuantityFrom))
                        }
                        if (TotalDiscount > 0) {
                            $("#TotalDiscount").val(parseFloat(TotalDiscount) + parseFloat(Discount))
                        } else {
                            $("#TotalDiscount").val(parseFloat(Discount))
                        }
                        if (TotalPurchasePrice > 0) {
                            $("#TotalPurchasePrice").val(parseFloat(TotalPurchasePrice) + (parseFloat(UnitPurchasePrice) * parseFloat(QuantityFrom)))
                        } else {
                            $("#TotalPurchasePrice").val(parseFloat(UnitPurchasePrice) * parseFloat(QuantityFrom))
                        }
                        if (TotalSalesPrice > 0) {
                            $("#TotalSalesPrice").val(parseFloat(TotalSalesPrice) + ((parseFloat(UnitSalesPrice)) * parseFloat(QuantityFrom)))
                        } else {
                            $("#TotalSalesPrice").val(((parseFloat(UnitSalesPrice)) * parseFloat(QuantityFrom)))
                        }
                        if (FinalTotal > 0) {
                            $("#FinalTotal").val(parseFloat(FinalTotal) + (parseFloat(UnitSalesPrice) * parseFloat(QuantityFrom)))
                        } else {
                            $("#FinalTotal").val(parseFloat(UnitSalesPrice) * parseFloat(QuantityFrom))
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
                //} else if (isNaN(Discount) || Discount <= 0) {
                //    swal({
                //        title: Resources.EnterRequiredResource + " " + Resources.DiscountResource,
                //        confirmButtonText: Resources.DoneResource,
                //        type: "error"
                //    });
                //} else if (isNaN(UnitPurchasePrice) || UnitPurchasePrice <= 0) {
                //    swal({
                //        title: Resources.EnterRequiredResource + " " + Resources.UnitPurchasePrice,
                //        confirmButtonText: Resources.DoneResource,
                //        type: "error"
                //    });
            } else if (isNaN(UnitSalesPrice) || UnitSalesPrice <= 0) {
                swal({
                    title: Resources.EnterRequiredResource + " " + Resources.UnitSalesPrice,
                    confirmButtonText: Resources.DoneResource,
                    type: "error"
                });
            }
            //else if (isNaN(UnitCostPrice) || UnitCostPrice <= 0) {
            //    swal({
            //        title: Resources.EnterRequiredResource + " " + Resources.UnitCostPrice,
            //        confirmButtonText: Resources.DoneResource,
            //        type: "error"
            //    });
            //}

        }


    });
    storeTransfergrid.data("kendoGrid").table.on("click", ".btnDelete", removeRow);
    var thisRow = "";

    function removeRow() {

        var row = $(this).closest("tr"),
            grid = $("#BranchExchangeDetailGrid").data("kendoGrid"),
            dataItem = grid.dataItem(row),
            detailId = dataItem.id,
            dataSource = $("#BranchExchangeDetailGrid").data("kendoGrid").dataSource;

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
                //  var dataSource = $("#BranchExchangeDetailGrid").data("kendoGrid").dataSource;
                debugger
                if (detailId != "" && detailId != null) {
                    setTimeout(function () {
                        $.ajax({
                            url: "/StTransaction/DeleteBranchExchangeDetail?id=" + detailId,
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
                                        Discount = dataItem.discount,
                                        UnitPurchasePrice = dataItem.unitPurchasePrice,
                                        UnitSalesPrice = dataItem.unitSalesPrice,
                                        UnitCostPrice = dataItem.unitCostPrice;
                                    // set total 
                                    var TotalItemCount = $("#TotalItemCount").val(),
                                        TotalPurchasePrice = $("#TotalPurchasePrice").val(),
                                        TotalSalesPrice = $("#TotalSalesPrice").val(),
                                        FinalTotal = $("#FinalTotal").val();


                                    $("#TotalItemCount").val(parseFloat(TotalItemCount) - parseFloat(QuantityFrom))

                                    $("#TotalPurchasePrice").val(parseFloat(TotalPurchasePrice) - (parseFloat(UnitPurchasePrice) * parseFloat(QuantityFrom)))

                                    $("#TotalSalesPrice").val(parseFloat(TotalSalesPrice) - (parseFloat(UnitSalesPrice) * parseFloat(QuantityFrom)))

                                    $("#FinalTotal").val(parseFloat(FinalTotal) - (parseFloat(UnitSalesPrice) * parseFloat(QuantityFrom)))

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
                        Discount = dataItem.discount,
                        UnitPurchasePrice = dataItem.unitPurchasePrice,
                        UnitSalesPrice = dataItem.unitSalesPrice,
                        UnitCostPrice = dataItem.unitCostPrice;
                    // set total 
                    var TotalItemCount = $("#TotalItemCount").val(),
                        TotalPurchasePrice = $("#TotalPurchasePrice").val(),
                        TotalSalesPrice = $("#TotalSalesPrice").val(),
                        FinalTotal = $("#FinalTotal").val();


                    $("#TotalItemCount").val(parseFloat(TotalItemCount) - parseFloat(QuantityFrom))

                    $("#TotalPurchasePrice").val(parseFloat(TotalPurchasePrice) - (parseFloat(UnitPurchasePrice) * parseFloat(QuantityFrom)))

                    $("#TotalSalesPrice").val(parseFloat(TotalSalesPrice) - (parseFloat(UnitSalesPrice) * parseFloat(QuantityFrom)))

                    $("#FinalTotal").val(parseFloat(FinalTotal) - (parseFloat(UnitSalesPrice) * parseFloat(QuantityFrom)))

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
        $("#Quantity").val(null);
        $("#ItemGender").val("");
        $("#FK_StGenderId").val("");
        $("#ItemBrand").val("");
        $("#FK_StBrandId").val("");
        $("#ItemModel").val("");
        $("#FK_StModelId").val("");
        $("#ItemUnit").val("");
        $("#FK_StUnitId").val("");

        $("#UnitPurchasePrice").val(null);
        $("#UnitSalesPrice").val(null);
        $("#UnitCostPrice").val(null);

        $("#Discount").val(null);
        $("#FK_StColorId").html("");
        $("#FK_StSizeId").html("");
    }

    $("#btnSaveBalance").click(function () {
        if ($("#SerialNumber").val() > 0)
            $("#SerialNumberValid").text("")
        else
            $("#SerialNumberValid").text(Resources.Required)

        if ($("#DeliveryNumber").val() > 0)
            $("#DeliveryNumberValid").text("")
        else
            $("#DeliveryNumberValid").text(Resources.Required)

        var table = $("#BranchExchangeDetailGrid").data("kendoGrid").dataSource.data();
        if (table.length == 0) {
            swal({
                title: Resources.GridLengthZeroResource,
                confirmButtonText: Resources.DoneResource,
                type: "error"
            });

        }
        if ($("#mainForm").valid() && $("#SerialNumber").val() > 0 && $("#DeliveryNumber").val() > 0 && table.length > 0) {
            var tranDetail = [];
            for (var i = 0; i < table.length; i++) {
                var expiryDate = new Date(table[i].expiryDate);
                var expiryDateFormated = expiryDate.getFullYear() + "-" + ("0" + (expiryDate.getMonth() + 1)).slice(-2) + "-" + ("0" + expiryDate.getDate()).slice(-2);
                var prefix = document.getElementById("SerialPrefix").innerText;
                var SerialPrefix = prefix + $("#SerialNumber").val();
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
                    FinalTotal: table[i].unitSalesPrice * table[i].quantityFrom,
                    TotalSalsePrice: table[i].unitSalesPrice * table[i].quantityFrom,
                    TotalCostPrice: table[i].unitCostPrice * table[i].quantityFrom,
                    Discount: table[i].discount,
                    ExpiryDate: expiryDateFormated,
                }
                tranDetail.push(detail);
            }
            var stStoreId;
            if ($("#subStStoreId").val() > 0)
                stStoreId = $("#subStStoreId").val();
            else
                stStoreId = $("#mainStStoreId").val();
            var tran = {
                Id: $("#Id").val(),
                SerialNumber: $("#SerialNumber").val(),
                SerialPrefix: SerialPrefix,
                FK_StStoreFromId: stStoreId,
                FK_StStoreToId: $("#FK_StStoreToId").val(),
                TransactionDate: $("#TransactionDate").val(),
                DeliveryNumber: $("#DeliveryNumber").val(),
                TotalItemCount: $("#TotalItemCount").val(),
                TotalSalesPrice: $("#TotalSalesPrice").val(),
                TotalPurchasePrice: $("#TotalPurchasePrice").val(),
                TotalCostPrice: $("#TotalCostPrice").val(),
                FinalTotal: $("#FinalTotal").val(),
                TotalDiscount: $("#TotalDiscount").val(),
                hdnAttachmentIds: $("#hdnAttachmentIds").val(),
                details: tranDetail
            }

            $.ajax({
                url: '/StTransaction/EditBranchExchange',
                type: 'POST',
                data: { branchExchangeVM: tran },
                success: function (result) {
                    if (isNaN(result)) {
                        var message = "";
                        for (var i = 0; i < result.length; i++) {
                            if (result[i].quantityTo < result[i].quantityFrom && result[i].id == 0)
                                message += Resources.MaxItemAllowedQuantity + " " + result[i].itemName + " ( " + result[i].quantityTo + " ) ";
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
                        }, function () {
                            window.location.href = '/StTransaction/IndexBranchExchange';
                        });
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

    $(".btnExport").on('click', function () {
        $("#BranchExchangeDetailGrid").getKendoGrid().saveAsExcel();
    });


    $(".btnPrint").on('click', function () {
        var url = "/StTransaction/PrintBranchExchange?id=" + $("#Id").val();
        window.open(url, '_blank');
    });
}) 