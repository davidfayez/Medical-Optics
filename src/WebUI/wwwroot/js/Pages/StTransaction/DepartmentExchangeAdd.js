﻿$(document).ready(function () {

    var now = new Date(),
        today = now.getFullYear() + "-" + ("0" + (now.getMonth() + 1)).slice(-2) + "-" + ("0" + now.getDate()).slice(-2);
    $('#ExpiryDate').val(today);
   

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

    //$("#QuantityFrom").change(function () {
    //    if ($("#QuantityFrom").val() > 0 && $("#UnitSalesPrice").val() > 0) {

    //        $("#TotalItemSalsePrice").val($("#UnitSalesPrice").val() * $("#QuantityFrom").val())
    //    }
    //})
    
    var tempSource = new kendo.data.DataSource({

    });

    var storeTransfergrid = $("#DepartmentExchangeDetailGrid").kendoGrid({
        dataSource: tempSource,
        navigatable: true,
        pageable: false,
        scrollable: false,
        columns: [
            { field: "FK_StItemId", hidden: true },
            { field: "FK_StGenderId", hidden: true },
            { field: "FK_StBrandId", hidden: true },
            { field: "FK_StModelId", hidden: true },
            { field: "FK_StColorId", hidden: true },
            { field: "FK_StSizeId", hidden: true },
            { field: "FK_StUnitId", hidden: true },
            { field: "ItemBarcode", title: Resources.Code, width: Resources.CodeWidth },
            { field: "ItemName", title: Resources.ItemName, width: Resources.NameWidth },
            { field: "QuantityFrom", title: Resources.Quantity, width: Resources.InputNumberWidth },
            { field: "Discount", hidden: true },
            { field: "UnitPurchasePrice", hidden: true },
            { field: "UnitSalesPrice", hidden: true  },
            { field: "UnitCostPrice", hidden: true },
            //{ field: "TotalSalsePrice", title: Resources.Total, width: Resources.InputNumberWidth },

            //{ field: "ItemUnit", title: Resources.Unit, width: Resources.NameWidth },
            { field: "ExpiryDate", format: "{0:yyyy/MM/dd}", width: Resources.DateWidth, title: Resources.DateExpiry },

            { width: Resources.ActionWidth, template: "<a  class='btn btn-danger btn-sm btnDelete' ><i class='fas fa-trash-alt'></i></a>" }
        ],
        editable: false,
        selectable: "multiple, cell",


    });
    $("#btnAddNewDetail").on('click', function () {
        debugger;
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
        debugger
        if (FK_StItemId > 0 && QuantityFrom > 0 && UnitSalesPrice > 0 ) {

            var totalRecords = $("#DepartmentExchangeDetailGrid").data("kendoGrid").dataSource.data().length;
            var Index = parseInt($("#Index").val());
            if (!isNaN(Index))
                totalRecords = Index - 1;
            tempSource.insert(totalRecords, {
                FK_StItemId: FK_StItemId,
                FK_StGenderId: FK_StGenderId,
                FK_StBrandId: FK_StBrandId,
                FK_StModelId: FK_StModelId,
                FK_StColorId: FK_StColorId,
                FK_StSizeId: FK_StSizeId,
                FK_StUnitId: FK_StUnitId,
                ItemBarcode: ItemBarcode,
                ItemName: ItemName,
                ExpiryDate: ExpiryDate,
                ItemUnit: ItemUnit,
                Discount: Discount,
                QuantityFrom: QuantityFrom,
                UnitPurchasePrice: UnitPurchasePrice,
                UnitSalesPrice: UnitSalesPrice,
                UnitCostPrice: UnitCostPrice,
                TotalSalsePrice: TotalItemSalsePrice
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
            debugger
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
            grid = $("#DepartmentExchangeDetailGrid").data("kendoGrid"),
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
                var dataSource = $("#DepartmentExchangeDetailGrid").data("kendoGrid").dataSource;

                if (dataSource.remove(dataItem)) {
                    swal({
                        title: Resources.DeleteSuccessResource,
                        confirmButtonText: Resources.DoneResource,
                        type: "success"
                    });

                    var QuantityFrom = dataItem.QuantityFrom,
                        Discount = dataItem.Discount,
                        UnitPurchasePrice = dataItem.UnitPurchasePrice,
                        UnitSalesPrice = dataItem.UnitSalesPrice,
                        UnitCostPrice = dataItem.UnitCostPrice;
                    // set total 
                    var TotalItemCount = $("#TotalItemCount").val(),
                        //TotalPurchasePrice = $("#TotalPurchasePrice").val(),
                        TotalSalesPrice = $("#TotalSalesPrice").val(),
                        FinalTotal = $("#FinalTotal").val();


                    $("#TotalItemCount").val(parseFloat(TotalItemCount) - parseFloat(QuantityFrom))

                    //$("#TotalPurchasePrice").val(parseFloat(TotalPurchasePrice) - (parseFloat(UnitPurchasePrice) * parseFloat(QuantityFrom)))

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

        var table = $("#DepartmentExchangeDetailGrid").data("kendoGrid").dataSource.data();
        if (table.length == 0) {
            swal({
                title: Resources.GridLengthZeroResource,
                confirmButtonText: Resources.DoneResource,
                type: "error"
            });

        }
        if ($("#mainForm").valid() && $("#SerialNumber").val() > 0  && table.length > 0) {
            var tranDetail = [];
            var prefix = document.getElementById("SerialPrefix").innerText;
            var SerialPrefix = prefix + $("#SerialNumber").val();
            for (var i = 0; i < table.length; i++) {
                var detail = {
                    FK_StItemId: table[i].FK_StItemId,
                    QuantityFrom: table[i].QuantityFrom,
                    FK_StUnitId: table[i].FK_StUnitId,
                    FK_StBrandId: table[i].FK_StBrandId,
                    FK_StModelId: table[i].FK_StBrandId,
                    FK_StGenderId: table[i].FK_StGenderId,
                    FK_StColorId: table[i].FK_StColorId,
                    FK_StSizeId: table[i].FK_StSizeId,
                    UnitPurchasePrice: table[i].UnitPurchasePrice,
                    UnitCostPrice: table[i].UnitCostPrice,
                    UnitSalesPrice: table[i].UnitSalesPrice,
                    FinalTotal: table[i].UnitSalesPrice * table[i].QuantityFrom,
                    TotalCostPrice: table[i].UnitCostPrice * table[i].QuantityFrom,
                    TotalSalsePrice: table[i].UnitSalesPrice * table[i].QuantityFrom,
                    Discount: table[i].Discount,
                    ExpiryDate: table[i].ExpiryDate,
                }
                tranDetail.push(detail);
            }
            debugger;
            var stStoreId;
            if ($("#subStStoreId").val() > 0)
                stStoreId = $("#subStStoreId").val();
            else
                stStoreId = $("#mainStStoreId").val();
            var tran = {
                SerialNumber: $("#SerialNumber").val(),
                SerialPrefix: SerialPrefix,
                FK_StStoreFromId: stStoreId,
                FK_HrDepartmentId: $("#FK_HrDepartmentId").val(),
                TransactionDate: $("#TransactionDate").val(),
                TotalItemCount: $("#TotalItemCount").val(),
                TotalSalesPrice: $("#TotalSalesPrice").val(),
                TotalPurchasePrice: $("#TotalPurchasePrice").val(),
                TotalCostPrice: $("#TotalCostPrice").val(),
                TotalDiscount: $("#TotalDiscount").val(),
                FinalTotal: $("#FinalTotal").val(),
                hdnAttachmentIds: $("#hdnAttachmentIds").val(),
                TotalDiscount: $("#TotalDiscount").val(),
                details: tranDetail
            }

            $.ajax({
                url: '/StTransaction/CreateDepartmentExchange',
                type: 'POST',
                data: { addEditDepartmentExchangeVM: tran },
                success: function (result) {
                    if (result) {
                        swal({
                            title: Resources.SavedSuccessfullyResource,
                            confirmButtonText: Resources.DoneResource,
                            type: "success"
                        }, function () {
                                window.location.href = '/StTransaction/IndexDepartmentExchange';
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
}) 