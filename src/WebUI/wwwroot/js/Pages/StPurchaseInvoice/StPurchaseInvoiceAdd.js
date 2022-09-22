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
                    $("#FK_StUnitId").val(item.fK_StUnitId);
                    $("#ItemUnit").val(item.unitName);
                    $("#UnitPurchasePrice").val(item.purchasePrice);


                }
            })
        }
    })

    //$("#ItemBarcode").change(function () {
    //    //debugger;
    //    //var bar=$("#ItemBarcode").val();
    //    if ($("#ItemBarcode").val() != "") {
    //        $.ajax({
    //            url: '/StLookups/GetBarcodeData?barcode=' + $("#ItemBarcode").val(),
    //            success: function (item) {
    //                debugger;
    //                $("#ItemBarcode").val(item.barcodeCode)
    //                $("#ItemBarcodehid").val(item.barcodeCode)
    //                //  $("#QuantityFrom").val(0);

    //                $("#FK_StUnitId").val(item.fK_StUnitId);
    //                $("#ItemUnit").val(item.unitName);
    //                $("#UnitPurchasePrice").val(item.purchasePrice);
    //                $("#FK_StItemId").val(item.id);


    //            }
    //        })
    //    }
    //})

    $("#Discount , #UnitPurchasePrice").change(function () {
        if ($("#Discount").val() > 0 && $("#UnitPurchasePrice").val() > 0) {

            //$("#UnitPurchasePrice").val($("#UnitPurchasePrice").val() - $("#Discount").val())
        }
    })
    $("#TaxPercentage").change(function () {
        debugger
        if (this.value < 0)
            this.value = 0;

        if ($("#Quantity").val() > 0 && $("#UnitPurchasePrice").val() > 0) {
            debugger
            $("#TaxValue").val($("#Quantity").val() * $("#UnitPurchasePrice").val() * (this.value / 100))
            //calaTotalForItem();
        }
    })
    $("#TaxValue").change(function () {
        if (this.value < 0)
            this.value = 0;
        if ($("#Quantity").val() > 0 && $("#UnitPurchasePrice").val() > 0) {
            var total = ($("#Quantity").val() * $("#UnitPurchasePrice").val())
            var result = (this.value / total) * 100;
            $("#TaxPercentage").val(result);
        }
    })

    // Supplier 
    var isSupplier = true;
    var supplierCodeDataSource = new kendo.data.DataSource({

        serverFiltering: true,
        type: "json",
        transport: {
            read: {
                url: function () {
                    if (isSupplier == true)
                        return "/PayLookups/GetAllPaySupplierAutoCompleteSearchByCode";
                    else
                        return "/PayLookups/GetAllPaySubSupplierAutoCompleteSearchByCode";
                }
            },
            parameterMap: function (data, action) {
                if (action === "read") {
                    return {
                        code: data.filter.filters.length > 0 ? data.filter.filters[0].value : ""
                    };
                } else {
                    return data;
                }
            }
        }
        ,
        schema: {
            model: {
                id: "id",
                fields: {

                    accountCode: {
                        type: "string"
                    }
                }
            }
        }
    });
    $("#supplierAutoComplete").kendoAutoComplete({

        dataSource: supplierCodeDataSource,
        placeholder: Resources.AutocompleateChoose,
        select: onSelectSupplier,
        change: onChangeSupplier,
        placeholder: Resources.AutocompleateChoose,
        headerTemplate: '<div class="dropdown-header k-widget k-header">' +
            '<span style="margin-left:100px">' + Resources.SupplierCodeResource + ' </span>' +
            '<span>' + Resources.SupplierNameResource + '</span>' +

            '</div>',
        template: '<span style="margin-left:150px">#: data.supplierCode #</span>' +
            '<span>#: data.supplierNameAr #</span>',
        dataTextField: "supplierCode",
        dataValueField: "id",
        filter: "contains",
        minLength: 1
    });
    function onSelectSupplier(e) {
        debugger
        if (isSupplier == true)
            $("#FK_PaySupplierId").val(e.dataItem.id);

        else
            $("#FK_PaySubSupplierId").val(e.dataItem.id);


        $("#PaySupplierName").val(e.dataItem.supplierNameAr);
        $("#GlAccountCode").val(e.dataItem.accountCode);
        $("#GlAccountName").val(e.dataItem.accountName);

    }
    function onChangeSupplier(e) {

        var code = this.value();
        var id = "";
        var checkUrl = "";
        if (isSupplier == true) {
            id = 'FK_PaySupplierId';
            checkUrl = "/PayLookups/CheckSupplierCodeExist?code=";
        }
        else {

            id = 'FK_PaySubSupplierId';
            checkUrl = "/PayLookups/CheckSubSupplierCodeExist?code=";
        }
        $.ajax({
            type: "Get",
            url: checkUrl + code,
            success: function (response) {
                debugger
                if (response != null) {
                    $("#" + id + "").val(response.id);
                    $("#PaySupplierName").val(response.supplierNameAr);
                    $("#FK_GlAccountId").val(response.fK_GlAccountId);
                    $("#GlAccountCode").val(response.accountCode);
                    $("#GlAccountName").val(response.accountName);

                } else {
                    $("#" + id + "").val(null);
                    $("#PaySupplierName").val(null);
                    $("#FK_GlAccountId").val(null);
                    $("#GlAccountCode").val(null);
                    $("#GlAccountName").val(null);

                    swal({
                        title: Resources.SupplierCodeNotFoundResource,
                        confirmButtonText: Resources.DoneResource,
                        type: "error"
                    });
                }

            }
        });
    }

    //cost center
    var costCenterDataSource = new kendo.data.DataSource({

        serverFiltering: true,
        type: "json",
        transport: {
            read: {
                url: "/CostCenter/GetAllAutoCompleteBySearch"
            },
            parameterMap: function (data, action) {
                if (action === "read") {
                    return {
                        code: data.filter.filters.length > 0 ? data.filter.filters[0].value : ""
                    };
                } else {
                    return data;
                }
            }
        }
        ,
        schema: {
            model: {
                id: "id",
                fields: {

                    costCenterCode: {
                        type: "string"
                    }
                }
            }
        }
    });
    $("#costCenterAutoComplete").kendoAutoComplete({

        dataSource: costCenterDataSource,
        placeholder: Resources.AutocompleateChoose,
        select: onSelectCostCenter,
        change: onChangeCostCenter,
        headerTemplate: '<div class="dropdown-header k-widget k-header">' +
            '<span style="margin-left:30px">' + Resources.CostCenterCodeResource + ' </span>' +
            '<span>' + Resources.CostCenterNameResource + '</span>' +

            '</div>',
        template: '<span style="margin-left:150px">#: data.costCenterCode #</span>' +
            '<span>#: data.costCenterNameAr #</span>',
        dataTextField: "costCenterCode",
        dataValueField: "id",
        filter: "contains",
        minLength: 1
    });

    function onSelectCostCenter(e) {
        $("#FK_CostCenterId").val(e.dataItem.id);
        $("#CostCenterName").val(e.dataItem.costCenterNameAr);
    }
    function onChangeCostCenter(e) {
        var code = this.value();

        $.ajax({
            type: "POST",
            url: "/CostCenter/CheckCostCenterExist?code=" + code,
            data: "name=John&location=Boston",
            dataType: "json",
            success: function (response) {

                if (response != null) {
                    $("#FK_CostCenterId").val(response.id);
                    $("#CostCenterName").val(response.costCenterNameAr);

                } else {
                    $("#FK_CostCenterId").val(null);
                    $("#CostCenterName").val(null);
                    swal({
                        title: Resources.CostCenterCodeNotFoundResource,
                        confirmButtonText: Resources.DoneResource,
                        type: "error"
                    });
                }

            }
        });
    }

    //grid
    var tempSource = new kendo.data.DataSource({

    });

    var purInvoiceDetailGrid = $("#purInvoiceDetailGrid").kendoGrid({
        dataSource: tempSource,
        navigatable: true,
        pageable: false,
        scrollable: false,
        columns: [
            { field: "FK_StItemId", hidden: true },
            { field: "FK_StUnitId", hidden: true },
            { field: "ItemBarcode", title: Resources.Code, width: Resources.CodeWidth },
            { field: "ItemName", title: Resources.ItemName, width: Resources.NameWidth },
            { field: "ItemUnit", title: Resources.Unit, width: Resources.NameWidth },
            { field: "UnitPurchasePrice", title: Resources.UnitPurchasePrice, width: Resources.InputNumberWidth },
            { field: "QuantityTo", title: Resources.Quantity, width: Resources.InputNumberWidth },
            { field: "Discount", title: Resources.DiscountResource, width: Resources.InputNumberWidth },
            { field: "ExpiryDate", format: "{0:yyyy/MM/dd}", width: Resources.DateWidth, title: Resources.DateExpiry },
            { field: "TaxPercentage", title: Resources.TaxPercentageResource, width: Resources.InputNumberWidth },
            { field: "TaxValue", title: Resources.TaxValueResource, width: Resources.InputNumberWidth },
            { field: "OperatingNumber", title: Resources.OperatingNumber, width: Resources.InputNumberWidth },

            { width: Resources.ActionWidth, template: "<a  class='btn btn-danger btn-sm btnDelete' ><i class='fas fa-trash-alt'></i></a>" }
        ],
        editable: false,
        selectable: "multiple, cell",


    });
    $("#btnAddNewDetail").on('click', function () {

        var FK_StItemId = $("#FK_StItemId").val(),
            ItemBarcode = $("#ItemBarcodehid").val(),
            FK_StUnitId = $("#FK_StUnitId").val(),
            UnitPurchasePrice = $("#UnitPurchasePrice").val(),
            QuantityTo = $("#Quantity").val(),
            Discount = parseFloat($("#Discount").val()),
            ExpiryDate = new Date($("#ExpiryDate").val()),
            ItemName = $("#FK_StItemId option:selected").text(),
            ItemUnit = $("#ItemUnit").val(),
            TaxPercentage = parseFloat($("#TaxPercentage").val()),
            TaxValue = parseFloat($("#TaxValue").val()),
            OperatingNumber = $("#OperatingNumber").val();

        if (isNaN(Discount))
            Discount = 0;
        if (isNaN(TaxPercentage))
            TaxPercentage = 0;
        if (isNaN(TaxValue))
            TaxValue = 0;


        if ($("#formCreatePurInvoice").valid() && FK_StItemId > 0 && QuantityTo > 0 && UnitPurchasePrice > 0 && OperatingNumber != "") {

            var totalRecords = $("#purInvoiceDetailGrid").data("kendoGrid").dataSource.data().length;
            var Index = parseInt($("#Index").val());
            if (!isNaN(Index))
                totalRecords = Index - 1;
            tempSource.insert(totalRecords, {
                FK_StItemId: FK_StItemId,
                FK_StUnitId: FK_StUnitId,
                ItemBarcode: ItemBarcode,
                ItemName: ItemName,
                ExpiryDate: ExpiryDate,
                ItemUnit: ItemUnit,
                Discount: isNaN(Discount) ? 0 : Discount,
                QuantityTo: QuantityTo,
                UnitPurchasePrice: UnitPurchasePrice,
                TaxPercentage: isNaN(TaxPercentage) ? 0 : TaxPercentage,
                TaxValue: isNaN(TaxValue) ? 0 : TaxValue,
                OperatingNumber: OperatingNumber,

            });

            // set total 
            var TotalPurchasePrice = $("#TotalPurchasePrice").val(),
                TotalDiscount = $("#TotalDiscount").val(),
                TotalTax = $("#TotalTax").val(),
                TotalNet = $("#TotalNet").val();

            debugger
            if (TotalPurchasePrice > 0)
                $("#TotalPurchasePrice").val(parseFloat(TotalPurchasePrice) + (parseFloat(UnitPurchasePrice) * parseFloat(QuantityTo)))
            else
                $("#TotalPurchasePrice").val(parseFloat(UnitPurchasePrice) * parseFloat(QuantityTo))

            if (TotalDiscount > 0)
                $("#TotalDiscount").val(parseFloat(TotalDiscount) + Discount)
            else
                $("#TotalDiscount").val(Discount)

            if (TotalTax > 0)
                $("#TotalTax").val(parseFloat(TotalTax) + TaxValue)
            else
                $("#TotalTax").val(TaxValue)

            TotalPurchasePrice = $("#TotalPurchasePrice").val();
            TotalDiscount = $("#TotalDiscount").val();
            TotalTax = $("#TotalTax").val();
            if (TotalNet > 0)
                $("#TotalNet").val(parseFloat(TotalPurchasePrice) + parseFloat(TotalTax) - parseFloat(TotalDiscount))
            else
                $("#TotalNet").val(parseFloat(TotalPurchasePrice) + TaxValue - Discount)



            ClearFormDetails();
        } else {

            if (isNaN(FK_StItemId) || FK_StItemId <= 0) {

                swal({
                    title: Resources.EnterRequiredResource + " " + Resources.ItemName,
                    confirmButtonText: Resources.DoneResource,
                    type: "error"
                });
            }
            else if (isNaN(UnitPurchasePrice) || UnitPurchasePrice <= 0) {
                swal({
                    title: Resources.EnterRequiredResource + " " + Resources.UnitPurchasePrice,
                    confirmButtonText: Resources.DoneResource,
                    type: "error"
                });
            }
            else if (isNaN(QuantityTo) || QuantityTo <= 0) {
                swal({
                    title: Resources.EnterRequiredResource + " " + Resources.Quantity,
                    confirmButtonText: Resources.DoneResource,
                    type: "error"
                });
            }
            else if (OperatingNumber == "") {
                swal({
                    title: Resources.EnterRequiredResource + " " + Resources.OperatingNumber,
                    confirmButtonText: Resources.DoneResource,
                    type: "error"
                });
            }
        }
    });
    purInvoiceDetailGrid.data("kendoGrid").table.on("click", ".btnDelete", removeRow);
    var thisRow = "";

    function removeRow() {

        var row = $(this).closest("tr"),
            grid = $("#purInvoiceDetailGrid").data("kendoGrid"),
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
                var dataSource = $("#purInvoiceDetailGrid").data("kendoGrid").dataSource;

                if (dataSource.remove(dataItem)) {
                    swal({
                        title: Resources.DeleteSuccessResource,
                        confirmButtonText: Resources.DoneResource,
                        type: "success"
                    });

                    var QuantityTo = dataItem.QuantityTo,
                        Discount = dataItem.Discount,
                        UnitPurchasePrice = dataItem.UnitPurchasePrice,
                        TaxValue = dataItem.TaxValue,
                        UnitCostPrice = dataItem.UnitCostPrice;
                    // set total 
                    var TotalPurchasePrice = $("#TotalPurchasePrice").val(),
                        TotalDiscount = $("#TotalDiscount").val(),
                        TotalTax = $("#TotalTax").val(),
                        TotalNet = $("#TotalNet").val();

                    debugger
                    if (TotalPurchasePrice > 0)
                        $("#TotalPurchasePrice").val(parseFloat(TotalPurchasePrice) - (parseFloat(UnitPurchasePrice) * parseFloat(QuantityTo)))
                    else
                        $("#TotalPurchasePrice").val(parseFloat(UnitPurchasePrice) * parseFloat(QuantityTo))

                    if (TotalDiscount > 0)
                        $("#TotalDiscount").val(parseFloat(TotalDiscount) - Discount)
                    else
                        $("#TotalDiscount").val(Discount)

                    if (TotalTax > 0)
                        $("#TotalTax").val(parseFloat(TotalTax) - TaxValue)
                    else
                        $("#TotalTax").val(TaxValue)

                    TotalPurchasePrice = $("#TotalPurchasePrice").val();
                    TotalDiscount = $("#TotalDiscount").val();
                    TotalTax = $("#TotalTax").val();
                    if (TotalNet > 0)
                        $("#TotalNet").val(parseFloat(TotalPurchasePrice) + parseFloat(TotalTax) - parseFloat(TotalDiscount))
                    else
                        $("#TotalNet").val(parseFloat(TotalPurchasePrice) + TaxValue - Discount)
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
        $("#ItemUnit").val("");
        $("#FK_StUnitId").val("");
        $("#UnitPurchasePrice").val(null);
        $("#Discount").val(null);
        $("#TaxPercentage").val(null);
        $("#TaxValue").val(null);
        $("#OperatingNumber").val("");
    }

    $("#btnSave").click(function () {
        debugger

        var table = $("#purInvoiceDetailGrid").data("kendoGrid").dataSource.data();
        if (table.length == 0) {
            swal({
                title: Resources.GridLengthZeroResource,
                confirmButtonText: Resources.DoneResource,
                type: "error"
            });

        }
        if ($("#formCreatePurInvoice").valid() && $("#SerialNumber").val() > 0 && table.length > 0) {
            var tranDetail = [];
            var stStoreId;
            if ($("#subStStoreId").val() > 0)
                stStoreId = $("#subStStoreId").val();
            else
                stStoreId = $("#mainStStoreId").val();
            for (var i = 0; i < table.length; i++) {
                var expiryDate = new Date(table[i].ExpiryDate);
                var expiryDateFormated = expiryDate.getFullYear() + "-" + ("0" + (expiryDate.getMonth() + 1)).slice(-2) + "-" + ("0" + expiryDate.getDate()).slice(-2);
                var detail = {
                    FK_StItemId: table[i].FK_StItemId,
                    QuantityTo: table[i].QuantityTo,
                    FK_StUnitId: table[i].FK_StUnitId,
                    UnitPurchasePrice: table[i].UnitPurchasePrice,
                    Discount: table[i].Discount,
                    ExpiryDate: expiryDateFormated,
                    TaxPercentage: table[i].TaxPercentage,
                    TaxValue: table[i].TaxValue,
                    OperatingNumber: table[i].OperatingNumber,
                    FK_StStoreId: stStoreId,
                    IsActive: true,
                }
                debugger
                tranDetail.push(detail);
            }

            var tran = {
                FK_InvoiceTypeId: $("input[name='InvoiceType']:checked").val(),
                SerialNumber: $("#SerialNumber").val(),
                FK_StStoreFromId: stStoreId,
                TransactionDate: $("#TransactionDate").val(),
                DueDate: $("#DueDate").val(),
                SupplyingOrderNumber: $("#SupplyingOrderNumber").val(),
                FK_PaySupplierId: $("#FK_PaySupplierId").val(),
                PaySupplierName: $("#PaySupplierName").val(),
                FK_GlAccountId: $("#FK_GlAccountId").val(),
                GlAccountName: $("#GlAccountName").val(),
                FK_CostCenterId: $("#FK_CostCenterId").val(),
                CostCenterName: $("#CostCenterName").val(),

                TotalPurchasePrice: $("#TotalPurchasePrice").val(),
                TotalDiscount: $("#TotalDiscount").val(),
                TotalTax: $("#TotalTax").val(),
                TotalNet: $("#TotalNet").val(),
                hdnAttachmentIds: $("#hdnAttachmentIds").val(),
                StTransactionDetails: tranDetail
            }
            debugger
            $.ajax({
                url: '/StPurchaseInvoice/Create',
                type: 'POST',
                data: { purchaseInvoiceVM: tran },
                success: function (result) {
                    debugger
                    if (result > 0) {
                        swal({
                            title: Resources.SavedSuccessfullyResource,
                            confirmButtonText: Resources.DoneResource,
                            type: "success"
                        }, function () {
                            setTimeout(function () {
                                debugger
                                document.location = "../../StPurchaseInvoice/Edit?id=" + result
                            }, 1000);
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