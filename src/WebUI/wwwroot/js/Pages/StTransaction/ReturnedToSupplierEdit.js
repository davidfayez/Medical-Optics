﻿$(document).ready(function () {
    checkedIds = {};


    if ($("#returnedSerial").val().trim() != "" || $("#returnedSerial").val().trim() != 0) {
        $('input[type=radio][id=rdReturnBill]').attr("checked", true);
        document.getElementById("itemsInputdiv").style.display = "none";
        document.getElementById("returnedSerialtxt").style.display = "flex";
        document.getElementById("returnBillContainer").style.display = "block";
        loadBill();
    } else {
        $('input[type=radio][id=rdReturnItem]').attr("checked", true);
        document.getElementById("itemsInputdiv").style.display = "block";
        document.getElementById("returnedSerialtxt").style.display = "none";
        document.getElementById("returnBillContainer").style.display = "none";
        LoadReturnItem();
    }
    $("#btnSearch").click(function () {

        var returnedBillNumber = $("#returnedSerial").val().trim();
        if (returnedBillNumber != "") {
            loadBill();
        } else {
            swal({
                title: Resources.EnterRequiredResource + " " + Resources.ReturnedInvoiceNumber,
                confirmButtonText: Resources.DoneResource,
                type: "error"
            });
        }
    });
    function loadBill() {
        debugger
        $.ajax({
            url: '/StTransaction/GetBillForSupplierReturn?prifx=' + $("#returnedSerial").val(),
            success: function (bill) {
                if (bill.id > 0) {
                    debugger
                    var returnedBillDate = new Date(bill.transactionDate);
                    var returnedBillDateFormated = returnedBillDate.getFullYear() + "-" + ("0" + (returnedBillDate.getMonth() + 1)).slice(-2) + "-" + ("0" + returnedBillDate.getDate()).slice(-2);

                    $("#FK_StTransactionId").val(bill.id);
                    $("#returnedSerialhd").val($("#returnedSerial").val());
                    $("#returnedBillDate").val(returnedBillDateFormated);
                    loadBillDetails();
                } else {
                    swal({
                        title: Resources.InvoiceNotFound,
                        confirmButtonText: Resources.DoneResource,
                        type: "error"
                    });

                    $("#FK_StTransactionId").val(0);
                    loadBillDetails();
                }

            }
        })
    }
    //loadBillDetails();
    //grid returned from Bill
    function loadBillDetails() {

        billgrid = $("#returnSupplierBillGridEdit").kendoGrid({
            excel: {
                fileName: "Return Supplier Details.xlsx",
                allPages: Resources.GridAllPages,
                filterable: Resources.GridFilterable
            },
            dataSource: {
                transport: {
                    read: "/StTransaction/GetReturnSupplierDetails?id=" + $("#FK_StTransactionId").val() + "&PRId=" + $("#Id").val()
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
                            discount: { type: "string" },
                            taxValue: { type: "string" },
                            taxPercentage: { type: "string" },
                            itemBarcode: { type: "string" },
                            itemName: { type: "string" },
                            quantityFrom: { type: "string" },
                            unitSalesPrice: { type: "string" },
                            unitCostPrice: { type: "string" },
                            unitPurchasePrice: { type: "string" },
                            totalSalsePrice: { type: "string" },
                            totalPurchasePrice: { type: "string" },
                            returnFromSerial: { type: "string" }
                        }
                    }
                }
            },
            navigatable: true,
            pageable: false,
            scrollable: false,
            columns: [
                {
                    title: 'Select All',
                    headerTemplate: "<input type='checkbox' id='header-chb' class='k-checkbox header-checkbox'><label class='k-checkbox-label' for='header-chb'></label>",
                    template: function (dataItem) {
                        return "<input type='checkbox' id='" + dataItem.id + "' class='k-checkbox row-checkbox'><label class='k-checkbox-label' for='" + dataItem.id + "'></label>";
                    },
                    width: Resources.CheckboxWidth
                },
                { field: "fK_StItemId", hidden: true },
                { field: "fK_StGenderId", hidden: true },
                { field: "fK_StBrandId", hidden: true },
                { field: "fK_StModelId", hidden: true },
                { field: "fK_StColorId", hidden: true },
                { field: "fK_StSizeId", hidden: true },
                { field: "fK_StUnitId", hidden: true },
                { field: "totalSalsePrice", hidden: true },
                { field: "unitCostPrice", hidden: true },
                { field: "unitSalesPrice", hidden: true },
                { field: "itemBarcode", title: Resources.Code, width: Resources.CodeWidth },
                { field: "itemName", title: Resources.ItemName, width: Resources.NameWidth },
                { field: "quantityFrom", title: Resources.Quantity, width: Resources.InputNumberWidth },
                { field: "unitPurchasePrice", title: Resources.UnitPurchasePrice, width: Resources.InputNumberWidth },
                { field: "totalPurchasePrice", title: Resources.Total, width: Resources.InputNumberWidth },
                { field: "taxPercentage", title: Resources.TaxPercentageResource, width: Resources.InputNumberWidth },
                { field: "taxValue", title: Resources.TaxValueResource, width: Resources.InputNumberWidth },
                { field: "discount", title: Resources.DiscountResource, width: Resources.InputNumberWidth },
            ],
            editable: false,
            selectable: "multiple, cell",
            dataBound: function (e) {
                e.sender.items().each(function () {
                    var dataItem = e.sender.dataItem(this);
                    kendo.bind(this, dataItem);

                });

                var view = this.dataSource.view();
                for (var i = 0; i < view.length; i++) {
                    debugger
                    if (view[i].checked) {
                        this.tbody.find("tr[data-uid='" + view[i].uid + "']")
                            .addClass("k-state-selected")
                            .find(".k-checkbox")
                            .attr("checked", "checked");

                        checkedIds[view[i].id] = true;
                    }
                }
            }

        });
        $("#returnSupplierBillGridEdit").data("kendoGrid").table.on("click", ".row-checkbox", selectRow);
        $('#header-chb').change(function (ev) {
            debugger
            var checked = ev.target.checked;
            var s = $('.row-checkbox');
            $('.row-checkbox').each(function (idx, item) {
                if (checked) {
                    var c = $(item).closest('tr').is('.k-state-selected');
                    if (!($(item).closest('tr').is('.k-state-selected'))) {
                        $(item).click();
                    }

                } else {
                    if ($(item).closest('tr').is('.k-state-selected')) {
                        $(item).click();
                    }

                }
            });
        });
    }
    $("#btnItemBillSearch").click(function () {

        $.ajax({
            url: '/StTransaction/GetBillForSupplierReturn?prifx=' + $("#inputBillNumber").val(),
            success: function (bill) {
                debugger
                if (bill.id > 0) {

                    $("#inputBillNumberhd").val($("#inputBillNumber").val())
                    items = bill.details;
                    var options = '<option value="">' + Resources.SelectOne + '</option>'
                    if (items != null) {
                        $("#inputBillDate").val(bill.transactionDate.substring(0, 10));
                        for (var i = 0; i < items.length; i++) {
                            options += '<option value="' + items[i].fK_StItemId + '">' + items[i].itemName + '</options>'
                        }
                    }

                    $("#FK_StItemId").html(options);
                } else {
                    $("#FK_StItemId").html('<option value="">' + Resources.SelectOne + '</option>');
                    swal({
                        title: Resources.InvoiceNotFound,
                        confirmButtonText: Resources.DoneResource,
                        type: "error"
                    });
                }

            }
        });
    })


    //end return bill
    var now = new Date(),
        today = now.getFullYear() + "-" + ("0" + (now.getMonth() + 1)).slice(-2) + "-" + ("0" + now.getDate()).slice(-2);
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
                    $("#QuantityFrom").val(null);
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
                    $("#TotalItemPurchasePrice").val(null);
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

            $("#TotalItemPurchasePrice").val($("#UnitPurchasePrice").val() * $("#QuantityFrom").val())
        }
    })
    $("#UnitPurchasePrice").change(function () {
        if ($("#QuantityFrom").val() > 0 && $("#UnitPurchasePrice").val() > 0) {

            $("#TotalItemPurchasePrice").val($("#UnitPurchasePrice").val() * $("#QuantityFrom").val())
        }
    })



    function LoadReturnItem() {
        tempSource = new kendo.data.DataSource({
            transport: {
                read: {
                    url: "/StTransaction/GetReturnSupplierDetails?id=" + $("#Id").val(),
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
                        fK_StItemId: { type: "string" },
                        fK_StGenderId: { type: "string" },
                        fK_StBrandId: { type: "string" },
                        fK_StModelId: { type: "string" },
                        fK_StColorId: { type: "string" },
                        fK_StSizeId: { type: "string" },
                        fK_StUnitId: { type: "string" },
                        itemBarcode: { type: "string" },
                        taxValue: { type: "string" },
                        taxPercentage: { type: "string" },
                        discount: { type: "string" },
                        itemBarcode: { type: "string" },
                        itemName: { type: "string" },
                        quantityFrom: { type: "string" },
                        unitSalesPrice: { type: "string" },
                        unitCostPrice: { type: "string" },
                        unitPurchasePrice: { type: "string" },
                        totalSalsePrice: { type: "string" },
                        totalPurchasePrice: { type: "string" },
                        returnFromSerial: { type: "string" }
                    }
                }
            }
        });
        var returnItemGrid = $("#returnItemGridEdit").kendoGrid({
            excel: {
                fileName: "Return Supplier Details.xlsx",
                allPages: Resources.GridAllPages,
                filterable: Resources.GridFilterable
            },
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
                { field: "totalSalsePrice", hidden: true },
                { field: "unitCostPrice", hidden: true },
                { field: "unitSalesPrice", hidden: true },
                { field: "returnFromSerial", hidden: true },
                { field: "returnFromDate", hidden: true },
                { field: "itemBarcode", title: Resources.Code, width: Resources.CodeWidth },
                { field: "itemName", title: Resources.ItemName, width: Resources.NameWidth },
                { field: "quantityFrom", title: Resources.Quantity, width: Resources.InputNumberWidth },
                { field: "unitPurchasePrice", title: Resources.UnitPurchasePrice, width: Resources.InputNumberWidth },
                { field: "totalPurchasePrice", title: Resources.Total, width: Resources.InputNumberWidth },
                { field: "taxPercentage", title: Resources.TaxPercentageResource, width: Resources.InputNumberWidth },
                { field: "taxValue", title: Resources.TaxValueResource, width: Resources.InputNumberWidth },
                { field: "discount", title: Resources.DiscountResource, width: Resources.InputNumberWidth },
                { width: Resources.ActionWidth, template: "<a  class='btn btn-danger btn-sm btnDelete' ><i class='fas fa-trash-alt'></i></a>" }

            ],
            editable: false,
            selectable: "multiple, cell",
            dataBound: function (e) {
                e.sender.items().each(function () {
                    var dataItem = e.sender.dataItem(this);
                    kendo.bind(this, dataItem);

                });

                var view = this.dataSource.view();
                for (var i = 0; i < view.length; i++) {

                    if (checkedIds[view[i].id]) {
                        this.tbody.find("tr[data-uid='" + view[i].uid + "']")
                            .addClass("k-state-selected")
                            .find(".k-checkbox")
                            .attr("checked", "checked");
                    }
                }
            }

        });
        $("#returnItemGridEdit").data("kendoGrid").table.on("click", ".btnDelete", removeRow);
    }

    $("#btnAddNewDetail").on('click', function () {
        debugger
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
            TaxPercentage = $("#TaxPercentage").val(),
            TaxValue = $("#TaxValue").val(),
            Discount = $("#Discount").val(),
            UnitSalesPrice = $("#UnitSalesPrice").val(),
            UnitPurchasePrice = $("#UnitPurchasePrice").val(),
            TotalItemPurchasePrice = $("#TotalItemPurchasePrice").val();
        //ReturnFromDate = $("#inputBillDate").val(),
        //ReturnFromSerial = $("#inputBillNumberhd").val().split("-")[1];

        if (Discount == "")
            Discount = 0;
        if (TaxPercentage == "")
            TaxPercentage = 0;
        if (TaxValue == "")
            TaxValue = 0;

        if ($("#editReturenSupplierForm").valid() && FK_StItemId > 0 && QuantityFrom > 0 && UnitPurchasePrice > 0 /*&& ReturnFromSerial > 0*/) {
            debugger
            var quantity = 0;
            var table = $("#returnItemGridEdit").data("kendoGrid").dataSource.data();
            for (var i = 0; i < table.length; i++) {
                if (table[i].fK_StItemId == FK_StItemId && table[i].id == 0)
                    quantity += parseFloat(table[i].quantityFrom);
            }
            var stStoreId;
            if ($("#subStStoreId").val() > 0)
                stStoreId = $("#subStStoreId").val();
            else
                stStoreId = $("#mainStStoreId").val();
            $.ajax({
                url: "/StTransaction/CheckItemBalance?itemId=" + FK_StItemId + "&&stockId=" + stStoreId + "&&quantity=" + quantity,
                success: function (result) {
                    result -= quantity;
                    if (result >= QuantityFrom) {

                        var totalRecords = $("#returnItemGridEdit").data("kendoGrid").dataSource.data().length;
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
                            discount: Discount,
                            taxValue: TaxValue,
                            taxPercentage: TaxPercentage,
                            unitSalesPrice: UnitSalesPrice,
                            unitPurchasePrice: UnitPurchasePrice,
                            totalPurchasePrice: TotalItemPurchasePrice,
                            totalSalsePrice: UnitSalesPrice * QuantityFrom,
                            //returnFromDate: ReturnFromDate,
                            //returnFromSerial: ReturnFromSerial,

                        });

                        // set total 
                        var BillTotal = $("#BillTotal").val(),
                            TotalDiscount = $("#TotalDiscount").val(),
                            TotalTax = $("#TotalTax").val(),
                            TotalNet = $("#TotalNet").val();

                        debugger
                        if (BillTotal > 0) {
                            $("#BillTotal").val(parseFloat(BillTotal) + (parseFloat(UnitPurchasePrice) * parseFloat(QuantityFrom)))
                        } else {
                            $("#BillTotal").val(parseFloat(UnitPurchasePrice) * parseFloat(QuantityFrom))
                        }
                        if (TotalDiscount > 0)
                            $("#TotalDiscount").val(parseFloat(TotalDiscount) + parseFloat(Discount))
                        else
                            $("#TotalDiscount").val(parseFloat(Discount))

                        if (TotalTax > 0)
                            $("#TotalTax").val(parseFloat(TotalTax) + parseFloat(TaxValue))
                        else
                            $("#TotalTax").val(parseFloat(TaxValue))

                        BillTotal = $("#BillTotal").val();
                        TotalDiscount = $("#TotalDiscount").val();
                        TotalTax = $("#TotalTax").val();

                        $("#TotalNet").val(parseFloat(BillTotal) + parseFloat(TotalTax) - parseFloat(TotalDiscount));



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
            }
            //else {
            //    swal({
            //        title: Resources.EnterRequiredResource + " " + Resources.UnitCostPrice,
            //        confirmButtonText: Resources.DoneResource,
            //        type: "error"
            //    });
            //}

        }


    });
    //   $("#returnItemGridEdit").data("kendoGrid").table.on("click", ".btnDelete", removeRow);
    //  $("#returnSupplierBillGridEdit").data("kendoGrid").table.on("click", ".row-checkbox", selectRow);
    var thisRow = "";



    function removeRow() {
        debugger
        var row = $(this).closest("tr"),
            grid = $("#returnItemGridEdit").data("kendoGrid"),
            dataItem = grid.dataItem(row),
            detailId = dataItem.id,
            dataSource = $("#returnItemGridEdit").data("kendoGrid").dataSource;
        if (dataSource._view.length == 1 && hasRoleDelete == false) {
            swal({
                title: Resources.DeleteBillUnAuthorizeResource,
                confirmButtonText: Resources.DoneResource,
                type: "error"
            });
            thisRow.checked = true;
        }
        else if (dataSource._view.length == 1 && hasRoleDelete) {
            swal({
                title: Resources.DeleteResource,
                text: Resources.DeleteBillConfirmResource,
                type: "info",
                showCancelButton: true,
                confirmButtonText: Resources.DeleteResource,
                cancelButtonText: Resources.CancelResource,
                closeOnConfirm: false,
                showLoaderOnConfirm: true
            }, function () {
                setTimeout(function () {
                    // var dataSource = $("#returnItemGridEdit").data("kendoGrid").dataSource;
                    debugger
                    var id = $("#Id").val();
                    if (id != "" && id > 0) {
                        setTimeout(function () {
                            $.ajax({
                                url: "/StTransaction/DeleteReturnedToSupplier?id=" + id,
                                type: "Get",
                                contentType: 'application/json; charset=utf-8',
                                success: function (result) {

                                    if (result) {
                                        dataSource.remove(dataItem)
                                        swal({
                                            title: Resources.DeleteSuccessResource,
                                            confirmButtonText: Resources.DoneResource,
                                            type: "success"
                                        });
                                        window.location = "../../StTransaction/IndexReturnedSupplier"
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

                        }, 2000);
                    }
                    else if (dataSource.remove(dataItem)) {
                        swal({
                            title: Resources.DeleteSuccessResource,
                            confirmButtonText: Resources.DoneResource,
                            type: "success"
                        });
                        debugger
                        var QuantityFrom = dataItem.quantityFrom,
                            UnitPurchasePrice = dataItem.unitPurchasePrice,
                            Discount = dataItem.discount,
                            TaxValue = dataItem.taxValue;
                        // set total 
                        var BillTotal = $("#BillTotal").val(),
                            TotalDiscount = $("#TotalDiscount").val(),
                            TotalTax = $("#TotalTax").val();


                        $("#BillTotal").val(parseFloat(BillTotal) - (parseFloat(UnitPurchasePrice) * parseFloat(QuantityFrom)))

                        if (TotalDiscount > 0)
                            $("#TotalDiscount").val(parseFloat(TotalDiscount) - parseFloat(Discount))
                        else
                            $("#TotalDiscount").val(parseFloat(Discount))

                        if (TotalTax > 0)
                            $("#TotalTax").val(parseFloat(TotalTax) - parseFloat(TaxValue))
                        else
                            $("#TotalTax").val(parseFloat(TaxValue))

                        BillTotal = $("#BillTotal").val();
                        TotalDiscount = $("#TotalDiscount").val();
                        TotalTax = $("#TotalTax").val();

                        $("#TotalNet").val(parseFloat(BillTotal) + parseFloat(TotalTax) - parseFloat(TotalDiscount));
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
        } else {


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
                    // var dataSource = $("#returnItemGridEdit").data("kendoGrid").dataSource;
                    debugger
                    if (detailId != "" && detailId != null) {
                        setTimeout(function () {
                            $.ajax({
                                url: "/StTransaction/DeleteReturnedToSupplierDetail?id=" + detailId,
                                type: "Get",
                                contentType: 'application/json; charset=utf-8',
                                success: function (result) {

                                    if (result) {
                                        dataSource.remove(dataItem)
                                        swal({
                                            title: Resources.DeleteSuccessResource,
                                            confirmButtonText: Resources.DoneResource,
                                            type: "success"
                                        });
                                        debugger
                                        var QuantityFrom = dataItem.quantityFrom,
                                            UnitPurchasePrice = dataItem.unitPurchasePrice,
                                            Discount = dataItem.discount,
                                            TaxValue = dataItem.taxValue;
                                        // set total 
                                        var BillTotal = $("#BillTotal").val(),
                                            TotalDiscount = $("#TotalDiscount").val(),
                                            TotalTax = $("#TotalTax").val();


                                        $("#BillTotal").val(parseFloat(BillTotal) - (parseFloat(UnitPurchasePrice) * parseFloat(QuantityFrom)))

                                        if (TotalDiscount > 0)
                                            $("#TotalDiscount").val(parseFloat(TotalDiscount) - parseFloat(Discount))
                                        else
                                            $("#TotalDiscount").val(parseFloat(Discount))

                                        if (TotalTax > 0)
                                            $("#TotalTax").val(parseFloat(TotalTax) - parseFloat(TaxValue))
                                        else
                                            $("#TotalTax").val(parseFloat(TaxValue))

                                        BillTotal = $("#BillTotal").val();
                                        TotalDiscount = $("#TotalDiscount").val();
                                        TotalTax = $("#TotalTax").val();

                                        $("#TotalNet").val(parseFloat(BillTotal) + parseFloat(TotalTax) - parseFloat(TotalDiscount));

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
                        debugger
                        var QuantityFrom = dataItem.quantityFrom,
                            UnitPurchasePrice = dataItem.unitPurchasePrice,
                            Discount = dataItem.discount,
                            TaxValue = dataItem.taxValue;
                        // set total 
                        var BillTotal = $("#BillTotal").val(),
                            TotalDiscount = $("#TotalDiscount").val(),
                            TotalTax = $("#TotalTax").val();


                        $("#BillTotal").val(parseFloat(BillTotal) - (parseFloat(UnitPurchasePrice) * parseFloat(QuantityFrom)))

                        if (TotalDiscount > 0)
                            $("#TotalDiscount").val(parseFloat(TotalDiscount) - parseFloat(Discount))
                        else
                            $("#TotalDiscount").val(parseFloat(Discount))

                        if (TotalTax > 0)
                            $("#TotalTax").val(parseFloat(TotalTax) - parseFloat(TaxValue))
                        else
                            $("#TotalTax").val(parseFloat(TaxValue))

                        BillTotal = $("#BillTotal").val();
                        TotalDiscount = $("#TotalDiscount").val();
                        TotalTax = $("#TotalTax").val();

                        $("#TotalNet").val(parseFloat(BillTotal) + parseFloat(TotalTax) - parseFloat(TotalDiscount));

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
        $("#TotalItemPurchasePrice").val(null);
        $("#QuantityFrom").val(null);
        $("#TaxPercentage").val(null);
        $("#TaxValue").val(null);

        $("#Discount").val(null);
        $("#FK_StColorId").html("");
        $("#FK_StSizeId").html("");
    }

    // save

    $("#btnSaveTransaction").click(function () {

        var returnType = $('input[type=radio][name=returnType]:checked').val();

        if (returnType == 'bill') {
            saveReturnBill();
        } else {
            saveReturnItem();
        }

    })
    function saveReturnBill() {
        var table = [];
        var gridData = $("#returnSupplierBillGridEdit").data("kendoGrid").dataSource._data;
        for (var i = 0; i < gridData.length; i++) {
            if (checkedIds[gridData[i].id]) {
                debugger
                var id = gridData[i].id,
                    returnedId = gridData[i].returnedId;
                if (gridData[i].returnedId == "" || gridData[i].returnedId == 0) {
                    id = 0;
                    returnedId = gridData[i].id;
                }
                var row = {
                    Id: id,
                    FK_StItemId: gridData[i].fK_StItemId,
                    QuantityFrom: gridData[i].quantityFrom,
                    FK_StUnitId: gridData[i].fK_StUnitId,
                    FK_StBrandId: gridData[i].fK_StBrandId,
                    FK_StModelId: gridData[i].fK_StBrandId,
                    FK_StGenderId: gridData[i].fK_StGenderId,
                    FK_StColorId: gridData[i].fK_StColorId,
                    FK_StSizeId: gridData[i].fK_StSizeId,
                    UnitPurchasePrice: gridData[i].unitPurchasePrice,
                    UnitCostPrice: gridData[i].unitCostPrice,
                    UnitSalesPrice: gridData[i].unitSalesPrice,
                    TotalCostPrice: gridData[i].totalCostPrice,
                    TotalSalsePrice: gridData[i].totalSalsePrice,
                    TaxValue: gridData[i].taxValue,
                    TaxPercentage: gridData[i].taxPercentage,
                    Discount: gridData[i].discount,
                    ReturnFromSerial: $("#returnedSerialhd").val().split("-")[1],
                    ReturnFromDate: $("#returnedBillDate").val(),
                    ReturnedId: returnedId
                }
                table.push(row);
            }
        }
        if (table.length == 0) {
            swal({
                title: Resources.GridLengthZeroResource,
                confirmButtonText: Resources.DoneResource,
                type: "error"
            });

        }

        if ($("#returnedSerialhd").val().trim() == "") {
            swal({
                title: Resources.EnterRequiredResource + " " + Resources.ReturnedInvoiceNumber,
                confirmButtonText: Resources.DoneResource,
                type: "error"
            });
        }
        if ($("#editReturenSupplierForm").valid() && $("#SerialNumber").val() > 0 && table.length > 0 && $("#returnedSerialhd").val().trim() != "") {
            var stStoreId;
            if ($("#subStStoreId").val() > 0)
                stStoreId = $("#subStStoreId").val();
            else
                stStoreId = $("#mainStStoreId").val();
            debugger

            var tran = {
                Id: $("#Id").val(),
                //SerialNumber: $("#SerialNumber").val(),
                BookNumber: $("#returnedSerialhd").val().split("-")[1],
                //// SerialPrefix: $("#SerialPrefix").text() + $("#SerialNumber").val(),
                //FK_PaySupplierId: $("#FK_PaySupplierId").val(),
                //PaySupplierName: $("#FK_PaySupplierId option:selected").html(),
                FK_StStoreFromId: stStoreId,
                //TransactionDate: $("#TransactionDate").val(),
                FinalTotal: $("#BillTotal").val(),
                TotalDiscount: $("#TotalDiscount").val(),
                TotalTax: $("#TotalTax").val(),
                TotalNet: $("#TotalNet").val(),
                hdnAttachmentIds: $("#hdnAttachmentIds").val(),
                details: table
            }
            debugger
            $.ajax({
                url: '/StTransaction/EditReturnedSupplier',
                type: 'POST',
                data: { returnedToSupplierVM: tran },
                success: function (result) {
                    debugger
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

                        window.location = "../../StTransaction/IndexReturnedSupplier"
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
    }
    function saveReturnItem() {
        var table = $("#returnItemGridEdit").data("kendoGrid").dataSource.data();
        if (table.length == 0) {
            swal({
                title: Resources.GridLengthZeroResource,
                confirmButtonText: Resources.DoneResource,
                type: "error"
            });

        }
        if ($("#editReturenSupplierForm").valid() && $("#SerialNumber").val() > 0 && table.length > 0) {
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
                    TotalSalsePrice: table[i].totalSalsePrice,
                    TotalCostPrice: table[i].totalCostPrice,
                    TaxValue: table[i].taxValue,
                    TaxPercentage: table[i].taxPercentage,
                    Discount: table[i].discount,
                    //ReturnFromSerial: table[i].returnFromSerial,
                    //ReturnFromDate: table[i].returnFromDate
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
                //SerialNumber: $("#SerialNumber").val(),
                //SerialPrefix: $("#SerialPrefix").text() + $("#SerialNumber").val(),
                //FK_PaySupplierId: $("#FK_PaySupplierId").val(),
                //PaySupplierName: $("#FK_PaySupplierId option:selected").html(),
                FK_StStoreFromId: stStoreId,
                //TransactionDate: $("#TransactionDate").val(),
                FinalTotal: $("#BillTotal").val(),
                TotalDiscount: $("#TotalDiscount").val(),
                TotalTax: $("#TotalTax").val(),
                TotalNet: $("#TotalNet").val(),
                hdnAttachmentIds: $("#hdnAttachmentIds").val(),
                details: tranDetail
            }

            $.ajax({
                url: '/StTransaction/EditReturnedSupplier',
                type: 'POST',
                data: { returnedToSupplierVM: tran },
                success: function (result) {
                    debugger
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

                        window.location = "../../StTransaction/IndexReturnedSupplier"
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
    }
    $(".btnExport").on('click', function () {
        var returnType = $('input[type=radio][name=returnType]:checked').val();

        if (returnType == 'bill')
            $("#returnSupplierBillGridEdit").getKendoGrid().saveAsExcel();
        else
            $("#returnItemGridEdit").getKendoGrid().saveAsExcel();

    });
    $(".btnPrint").on('click', function () {
        var url = "/StTransaction/PrintReturnedToSupplier?id=" + $("#Id").val();
        window.open(url, '_blank');
    });
    $("#TaxPercentage").change(function () {
        debugger
        if (this.value < 0)
            this.value = 0;

        if ($("#QuantityFrom").val() > 0 && $("#UnitPurchasePrice").val() > 0) {
            debugger
            $("#TaxValue").val($("#QuantityFrom").val() * $("#UnitPurchasePrice").val() * (this.value / 100))
            //calaTotalForItem();
        }
    })
    $("#TaxValue").change(function () {
        if (this.value < 0)
            this.value = 0;
        if ($("#QuantityFrom").val() > 0 && $("#UnitPurchasePrice").val() > 0) {
            var total = ($("#QuantityFrom").val() * $("#UnitPurchasePrice").val())
            var result = (this.value / total) * 100;
            $("#TaxPercentage").val(result);
        }
    })
});
//var checkedIds = {};

//on click of the checkbox:
function selectRow() {
    debugger
    var thisRow = this;
    if ($("#editReturenSupplierForm").valid()) {

        var checked = this.checked,
            row = $(this).closest("tr"),
            grid = $("#returnSupplierBillGridEdit").data("kendoGrid"),
            dataItem = grid.dataItem(row);

        // checkedIds[dataItem.id] = checked;
        if (checked) {
            //-select the row

            // check quantity valid
            debugger
            var quantity = 0;
            var table = $("#returnSupplierBillGridEdit").data("kendoGrid").dataSource.data();
            //for (var i = 0; i < table.length; i++) {
            //    if (table[i].fK_StItemId == dataItem.fK_StItemId && table[i].returnedId == 0)
            //        quantity += parseFloat(table[i].quantityFrom);
            //}
            var stStoreId;
            if ($("#subStStoreId").val() > 0)
                stStoreId = $("#subStStoreId").val();
            else
                stStoreId = $("#mainStStoreId").val();
            $.ajax({
                url: "/StTransaction/CheckItemBalance?itemId=" + dataItem.fK_StItemId + "&&stockId=" + stStoreId + "&&quantity=" + quantity,
                success: function (result) {
                    result -= quantity;
                    debugger
                    if (result >= dataItem.quantityFrom) {
                        checkedIds[dataItem.id] = checked;
                        var gridData = $("#returnSupplierBillGridEdit").data("kendoGrid").dataSource._data;

                        var total = 0,
                            totalDiscount = 0,
                            totalTax = 0;
                        for (var i = 0; i < gridData.length; i++) {
                            debugger
                            if (checkedIds[gridData[i].id]) {
                                total += parseFloat(gridData[i].unitPurchasePrice) * parseFloat(gridData[i].quantityFrom);
                                totalDiscount += parseFloat(gridData[i].discount);
                                totalTax += parseFloat(gridData[i].taxValue);
                            }
                        }

                        $("#BillTotal").val(total); //اجمالى سعر الشراء 
                        $("#TotalDiscount").val(totalDiscount);
                        $("#TotalTax").val(totalTax);
                        $("#TotalNet").val(total + totalTax - totalDiscount);

                        //var total = 0;
                        //for (var i = 0; i < gridData.length; i++) {

                        //    if (checkedIds[gridData[i].id]) {
                        //        total += parseFloat(gridData[i].unitPurchasePrice) * parseFloat(gridData[i].quantityFrom);
                        //    }
                        //}

                        //$("#BillTotal").val(total); //اجمالى سعر الشراء 
                    } else {
                        //row.removeClass("k-state-selected");
                        thisRow.checked = false;
                        // checkedIds[dataItem.id] = false;
                        swal({
                            title: Resources.MaxItemAllowedQuantity + " " + dataItem.itemName + " ( " + result + " )",
                            confirmButtonText: Resources.DoneResource,
                            type: "error"
                        });

                    }
                }
            })

        }
        else {
            debugger
            //-remove selection

            if (dataItem.returnedId > 0) {
                var count = 0;
                var listData = $("#returnSupplierBillGridEdit").data("kendoGrid").dataSource._data;
                for (var i = 0; i < listData.length; i++) {

                    if (checkedIds[listData[i].id]) {
                        count += 1;
                    }
                }
                if (count == 1 && hasRoleDelete == false) {
                    swal({
                        title: Resources.DeleteBillUnAuthorizeResource,
                        confirmButtonText: Resources.DoneResource,
                        type: "error"
                    });
                    thisRow.checked = true;
                }
                else if (count == 1 && hasRoleDelete) {
                    swal({
                        title: Resources.DeleteResource,
                        text: Resources.DeleteBillConfirmResource,
                        type: "info",
                        showCancelButton: true,
                        confirmButtonText: Resources.DeleteResource,
                        cancelButtonText: Resources.CancelResource,
                        closeOnConfirm: false,
                        showLoaderOnConfirm: true
                    }, function (inputValue) {
                        if (inputValue) {
                            setTimeout(function () {
                                // var dataSource = $("#returnItemGridEdit").data("kendoGrid").dataSource;
                                debugger
                                var id = $("#Id").val();
                                if (id != "" && id > 0) {
                                    setTimeout(function () {
                                        $.ajax({
                                            url: "/StTransaction/DeleteReturnedToSupplier?id=" + id,
                                            type: "Get",
                                            contentType: 'application/json; charset=utf-8',
                                            success: function (result) {

                                                if (result) {
                                                    // dataSource.remove(dataItem)
                                                    swal({
                                                        title: Resources.DeleteSuccessResource,
                                                        confirmButtonText: Resources.DoneResource,
                                                        type: "success"
                                                    });
                                                    window.location = "../../StTransaction/IndexReturnedSupplier"
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

                                    }, 2000);
                                }

                                else {
                                    swal({
                                        title: Resources.DeleteFailedResource,
                                        confirmButtonText: Resources.DoneResource,
                                        type: "error"
                                    });
                                }

                            }, 1000);
                        }
                        else {
                            thisRow.checked = true;
                        }
                    });
                }
                else {

                    swal({
                        title: Resources.DeleteResource,
                        text: Resources.DeleteItemQuantityConfirmResource,
                        type: "info",
                        showCancelButton: true,
                        confirmButtonText: Resources.DeleteResource,
                        cancelButtonText: Resources.CancelResource,
                        closeOnConfirm: false,
                        showLoaderOnConfirm: true
                    }, function (inputValue) {
                        if (inputValue) {
                            setTimeout(function () {
                                // var dataSource = $("#returnItemGridEdit").data("kendoGrid").dataSource;
                                debugger

                                if (dataItem.id != "" && dataItem.id > 0) {
                                    setTimeout(function () {
                                        $.ajax({
                                            url: "/StTransaction/DeleteReturnedToSupplierDetail?id=" + dataItem.id,
                                            type: "Get",
                                            contentType: 'application/json; charset=utf-8',
                                            success: function (result) {

                                                if (result) {
                                                    //dataSource.remove(dataItem)
                                                    swal({
                                                        title: Resources.DeleteSuccessResource,
                                                        confirmButtonText: Resources.DoneResource,
                                                        type: "success"
                                                    });
                                                    checkedIds[dataItem.id] = false;
                                                    debugger
                                                    var gridData = $("#returnSupplierBillGridEdit").data("kendoGrid").dataSource._data;
                                                    var total = 0,
                                                        totalDiscount = 0,
                                                        totalTax = 0;
                                                    for (var i = 0; i < gridData.length; i++) {
                                                        debugger
                                                        if (checkedIds[gridData[i].id]) {
                                                            total += parseFloat(gridData[i].unitPurchasePrice) * parseFloat(gridData[i].quantityFrom);
                                                            totalDiscount += parseFloat(gridData[i].discount);
                                                            totalTax += parseFloat(gridData[i].taxValue);
                                                        }
                                                    }

                                                    $("#BillTotal").val(total); //اجمالى سعر الشراء 
                                                    $("#TotalDiscount").val(totalDiscount);
                                                    $("#TotalTax").val(totalTax);
                                                    $("#TotalNet").val(total + totalTax - totalDiscount);

                                                    //var total = parseFloat($("#BillTotal").val());
                                                    //for (var i = 0; i < gridData.length; i++) {

                                                    //    if (gridData[i].id == dataItem.id) {
                                                    //        total -= parseFloat(gridData[i].totalPurchasePrice);
                                                    //    }
                                                    //}

                                                    //  $("#BillTotal").val(total); //اجمالى سعر الشراء 
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

                                else {
                                    swal({
                                        title: Resources.DeleteFailedResource,
                                        confirmButtonText: Resources.DoneResource,
                                        type: "error"
                                    });
                                }

                            }, 1000);
                        }
                        else {
                            thisRow.checked = true;
                        }

                    });
                }
            } else {
                checkedIds[dataItem.id] = false;
                var gridData = $("#returnSupplierBillGridEdit").data("kendoGrid").dataSource._data;
                var total = 0,
                    totalDiscount = 0,
                    totalTax = 0;
                for (var i = 0; i < gridData.length; i++) {
                    debugger
                    if (checkedIds[gridData[i].id]) {
                        total += parseFloat(gridData[i].unitPurchasePrice) * parseFloat(gridData[i].quantityFrom);
                        totalDiscount += parseFloat(gridData[i].discount);
                        totalTax += parseFloat(gridData[i].taxValue);
                    }
                }

                $("#BillTotal").val(total); //اجمالى سعر الشراء 
                $("#TotalDiscount").val(totalDiscount);
                $("#TotalTax").val(totalTax);
                $("#TotalNet").val(total + totalTax - totalDiscount);

                //var total = parseFloat($("#BillTotal").val());
                //for (var i = 0; i < gridData.length; i++) {

                //    if (gridData[i].id == dataItem.id) {
                //        total -= parseFloat(gridData[i].totalPurchasePrice);
                //    }
                //}

                //$("#BillTotal").val(total); //اجمالى سعر الشراء 

            }
        }
    }
    else {
        this.checked = false;
    }
}