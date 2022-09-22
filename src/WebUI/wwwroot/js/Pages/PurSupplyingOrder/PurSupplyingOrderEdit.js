$(document).ready(function () {

    $("#FK_CategoryId").change(function () {
        if ($("#FK_CategoryId").val() > 0) {
            $.ajax({
                url: '/StLookups/GetAllStItemByMainCategory?id=' + $("#FK_CategoryId").val(),
                success: function (items) {
                    var options='<option value="">'+Resources.SelectOne+'</option>'
                    for (var i = 0; i < items.length; i++) {
                        options += '<option value="' + items[i].id + '">' + items[i].itemName +'</options>'
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
                    $("#UnitName").val(item.unitName);
                    $("#TotalItemSalsePrice").val(0);
                    var colorOptions = "";
                    for (var i = 0; i < item.itemColor.length; i++) {
                        colorOptions += '<option value="' + item.itemColor[i].value + '">' + item.itemColor[i].text +'</options>'
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
                    $("#UnitName").val(item.unitName);
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
        if ($("#QuantityFrom").val() > 0 && $("#UnitPurchasePrice").val() > 0) {

            $("#TotalItemPrice").val($("#UnitPurchasePrice").val() * $("#QuantityFrom").val())
        }
    })
    $("#UnitSalesPrice").change(function () {
        if ($("#QuantityFrom").val() > 0 && $("#UnitPurchasePrice").val() > 0) {

            $("#TotalItemPrice").val($("#UnitPurchasePrice").val() * $("#QuantityFrom").val())
        }
    })
    var tempSource = new kendo.data.DataSource({
        transport: {
            read: "/PurSupplyingOrder/GetPurSupplyingOrderDetails?id=" + $("#Id").val()
        },
        schema: {
            model: {
                id: "id",
                fields: {
                    fK_StItemId: { type: "string" },
                    fK_StMainCategoryId: { type: "string" },
                    fK_StUnitId: { type: "string" },
                    itemBarcode: { type: "string" },
                    itemName: { type: "string" },
                    unitName: { type: "string" },
                    quantity: { type: "string" },
                    unitPrice: { type: "string" },
                    totalSalsePrice: { type: "string" },
                    creationDate: { type: "date", editable: false },
                    isActive: { editable: false },
                }
            }
        }
    });

    var orderDetailgrid = $("#purchaseOrderDetailGrid").kendoGrid({
        dataSource: tempSource,
        navigatable: true,
        pageable: false,
        scrollable: false,
        columns: [
            { field: "fK_StItemId", hidden: true },
            { field: "fK_StMainCategoryId", hidden: true },
            { field: "fK_StUnitId", hidden: true },
            { field: "itemBarcode", title: Resources.Code, width: Resources.CodeWidth },
            { field: "itemName", title: Resources.ItemName, width: Resources.NameWidth },
            { field: "unitName", title: Resources.Unit, width: Resources.InputNumberWidth },
            { field: "quantity", title: Resources.Quantity, width: Resources.InputNumberWidth },
            { field: "unitPrice", title: Resources.UnitPurchasePrice, width: Resources.InputNumberWidth },
            
            { width: Resources.ActionWidth, template: "<a  class='btn btn-danger btn-sm btnDelete' ><i class='fas fa-trash-alt'></i></a>" }
        ],
        editable: false,
        selectable: "multiple, cell",


    });
    $("#btnAddNewDetail").on('click', function () {

        var FK_StItemId = $("#FK_StItemId").val(),
            FK_StUnitId = $("#FK_StUnitId").val(),
            ItemBarcode = $("#ItemBarcodehid").val(),
            FK_StMainCategoryId = $("#FK_CategoryId").val(),
            ItemName = $("#FK_StItemId option:selected").text(),
            Quantity = $("#QuantityFrom").val(),
            UnitPrice = $("#UnitPurchasePrice").val(),
            UnitName = $("#UnitName").val()
        TotalItemSalsePrice = $("#TotalItemPrice").val();

        if (FK_StItemId > 0 && Quantity > 0 && UnitPrice > 0 ) {

            var totalRecords = $("#purchaseOrderDetailGrid").data("kendoGrid").dataSource.data().length;
            var Index = parseInt($("#Index").val());
            if (!isNaN(Index))
                totalRecords = Index - 1;
            tempSource.insert(totalRecords, {
                fK_StItemId: FK_StItemId,
                fK_StUnitId: FK_StUnitId,
                itemBarcode: ItemBarcode,
                itemName: ItemName,
                quantity: Quantity,
                unitName: UnitName,
                fK_StMainCategoryId: FK_StMainCategoryId,
                unitPrice: UnitPrice,
            });

            // set total 
            var TotalPrice = $("#TotalPrice").val();



            if (TotalPrice > 0) {
                $("#TotalPrice").val(parseFloat(TotalPrice) + (parseFloat(UnitPrice) * parseFloat(Quantity)))
            } else {
                $("#TotalPrice").val(parseFloat(UnitPrice) * parseFloat(Quantity))
            }



            ClearFormDetails();
        } else {

            if (isNaN(FK_StItemId) || FK_StItemId <= 0) {

                swal({
                    title: Resources.EnterRequiredResource + " " + Resources.ItemName,
                    confirmButtonText: Resources.DoneResource,
                    type: "error"
                });
            } else if (isNaN(Quantity) || QuantityFrom <= 0) {
                swal({
                    title: Resources.EnterRequiredResource + " " + Resources.Quantity,
                    confirmButtonText: Resources.DoneResource,
                    type: "error"
                });
            } else if (isNaN(UnitPrice) || UnitPrice <= 0) {
                swal({
                    title: Resources.EnterRequiredResource + " " + Resources.UnitPurchasePrice,
                    confirmButtonText: Resources.DoneResource,
                    type: "error"
                });
            }

        }


    });
    orderDetailgrid.data("kendoGrid").table.on("click", ".btnDelete", removeRow);
    
    function removeRow() {

        var row = $(this).closest("tr"),
            grid = $("#purchaseOrderDetailGrid").data("kendoGrid"),
            dataItem = grid.dataItem(row);
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
                var dataSource = $("#purchaseOrderDetailGrid").data("kendoGrid").dataSource;

                if (dataSource.remove(dataItem)) {
                    swal({
                        title: Resources.DeleteSuccessResource,
                        confirmButtonText: Resources.DoneResource,
                        type: "success"
                    });

                    var Quantity = dataItem.quantity,
                        UnitPurchasePrice = dataItem.unitPrice;
                    // set total 
                    var TotalItemCount = $("#TotalItemCount").val(),
                        TotalPrice = $("#TotalPrice").val();


                    //$("#TotalItemCount").val(parseFloat(TotalItemCount) - parseFloat(Quantity));

                    $("#TotalPrice").val(parseFloat(TotalPrice) - (parseFloat(UnitPurchasePrice) * parseFloat(Quantity)))

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

        $("#UnitPurchasePrice").val(0);
        $("#TotalItemSalsePrice").val(0);
    }

    $("#btnSaveTransaction").click(function () {
        if ($("#SerialNumber").val() > 0) {
            $("#SerialNumberValid").text("")
        } else {
            $("#SerialNumberValid").text(Resources.Required)
        }

        var table = $("#purchaseOrderDetailGrid").data("kendoGrid").dataSource.data();
        if (table.length == 0) {
            swal({
                title: Resources.GridLengthZeroResource,
                confirmButtonText: Resources.DoneResource,
                type: "error"
            });

        }

        if ($("#FK_PaySupplierId").val() > 0) {
            $("#ValidFK_PaySupplierId").text("")
        } else {
            $("#ValidFK_PaySupplierId").text(Resources.Required)
        }
        if ($("#mainForm").valid() && $("#SerialNumber").val() > 0 && table.length > 0 && $("#FK_PaySupplierId").val() > 0) {
            var tranDetail = [];
            for (var i = 0; i < table.length; i++) {
                var detail = {
                    Id: table[i].id,
                    FK_StItemId: table[i].fK_StItemId,
                    FK_StMainCategoryId: table[i].fK_StMainCategoryId,
                    Quantity: table[i].quantity,
                    FK_StUnitId: table[i].fK_StUnitId,
                    UnitPrice: table[i].unitPrice,
                    TotalSalsePrice: table[i].totalSalsePrice,
                }
                tranDetail.push(detail);
            }
            var tran = {
                Id: $("#Id").val(),
                SerialNumber: $("#SerialNumber").val(),
                FK_PaySupplierId: $("#FK_PaySupplierId").val(),
                FK_DefCurrencyId: $("#FK_DefCurrencyId").val(),
                OrderDate: $("#OrderDate").val(),
                FK_HrDepartmentId: $("#FK_HrDepartmentId").val(),
                FK_StStatusId: $("#FK_StStatusId").val(),
                PurchaseOrderSerial: $("#PurchaseOrderSerial").val(),
                PurPriceOfferSerial: $("#PurPriceOfferSerial").val(),
                FK_PayTypeId: $("#FK_PayTypeId").val(),
                TotalPrice: $("#TotalPrice").val(),
                hdnAttachmentIds: $("#hdnAttachmentIds").val(),
                FK_PayTypeId: $("[name='FK_PayTypeId']:checked").val(),
                details: tranDetail
            }

            $.ajax({
                url: '/PurSupplyingOrder/Edit',
                type: 'POST',
                data: { addEditPurSupplying: tran },
                success: function (result) {
                    if (result) {
                        swal({
                            title: Resources.SavedSuccessfullyResource,
                            confirmButtonText: Resources.DoneResource,
                            type: "success"
                        });

                        window.location ="../../PurSupplyingOrder/Index"
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
        $("#purchaseOrderDetailGrid").getKendoGrid().saveAsExcel();
    });


    $(".btnPrint").on('click', function () {
        var url = "/PurSupplyingOrder/Print?id=" + $("#Id").val();
        window.open(url, '_blank');
    });
}) 