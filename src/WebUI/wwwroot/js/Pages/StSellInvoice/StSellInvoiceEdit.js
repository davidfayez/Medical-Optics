$(document).ready(function () {

    var isClient = true;

    var clientCodeDataSource = new kendo.data.DataSource({

        serverFiltering: true,
        type: "json",
        transport: {
            read: {
                url: function () {
                    if (isClient == true)
                        return "/RceLookups/GetAllRceClientAutoCompleteSearchByCode";
                    else
                        return "/RceLookups/GetAllRceSubClientAutoCompleteSearchByCode";
                }
            },
            parameterMap: function (data, action) {
                if (action === "read") {
                    return {
                        code: data.filter.filters[0].value
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
    $('#isSubClient').change(function () {

        if (this.checked) //عميل مؤقت
            isClient = false;
        else //عميل
            isClient = true


        $("#FK_RceClientId").val(null);
        $("#FK_RceSubClientId").val(null);
        $("#RceClientName").val(null);
        $("#RepaymentPeriod").val(null);
        $("#FK_GlAccountId").val(null);
        $("#FK_DefCurrencyId").val("");
        $("#clientAutoComplete").val("");
        $("#Factor").val("");
        $("#AccountName").val(null);
        $("#AccountCode").val(null);
    });
    $("#clientAutoComplete").kendoAutoComplete({

        dataSource: clientCodeDataSource,
        placeholder: Resources.AutocompleateChoose,
        select: onSelectClient,
        change: onChangeClient,
        headerTemplate: '<div class="dropdown-header k-widget k-header">' +
            '<span style="margin-left:100px">' + Resources.ClientCodeResource + ' </span>' +
            '<span>' + Resources.ClientNameResource + '</span>' +

            '</div>',
        template: '<span style="margin-left:150px">#: data.clientCode #</span>' +
            '<span>#: data.clientNameAr #</span>',
        dataTextField: "clientCode",
        dataValueField: "id",
        filter: "contains",
        minLength: 1
    });
    function onSelectClient(e) {
        if (isClient == true)
            $("#FK_RceClientId").val(e.dataItem.id);

        else
            $("#FK_RceSubClientId").val(e.dataItem.id);

        $("#RceClientName").val(e.dataItem.clientNameAr);
        $("#RepaymentPeriod").val(e.dataItem.repaymentPeriod);
        $("#FK_DefCurrencyId").val(e.dataItem.fK_DefCurrencyId);
        $("#FK_GlAccountId").val(e.dataItem.fK_GlAccountId);
        $("#Factor").val(e.dataItem.factor);
        $("#AccountName").val(e.dataItem.accountName);
        $("#AccountCode").val(e.dataItem.accountCode);
    }
    function onChangeClient(e) {
        var code = this.value();
        var id = "";
        var checkUrl = "";
        if (isClient == true) {
            id = 'FK_RceClientId';
            checkUrl = "/RceLookups/CheckClientCodeExist?code=";
        }
        else {
            id = 'FK_RceSubClientId';
            checkUrl = "/RceLookups/CheckSubClientCodeExist?code=";
        }
        $.ajax({
            type: "GET",
            url: checkUrl + code,
            success: function (response) {
                debugger
                if (response != null) {
                    $("#" + id + "").val(response.id);
                    $("#RceClientName").val(response.clientNameAr);
                    $("#RepaymentPeriod").val(response.repaymentPeriod);
                    $("#FK_DefCurrencyId").val(response.fK_DefCurrencyId);
                    $("#FK_GlAccountId").val(response.fK_GlAccountId);
                    $("#Factor").val(response.factor);
                    $("#AccountName").val(response.accountName);
                    $("#AccountCode").val(response.accountCode);
                    //Set BillDueDate
                    var newDate = new Date($("#BillDate").val()),
                        day = newDate.getDate() + response.repaymentPeriod,
                        month = newDate.getMonth(),
                        year = newDate.getFullYear();
                    newDate = new Date(year, month, day);
                    newDate = newDate.getFullYear() + "-" + ("0" + (newDate.getMonth() + 1)).slice(-2) + "-" + ("0" + newDate.getDate()).slice(-2);
                    $('#BillDueDate').val(newDate);
                } else {
                    $("#" + id + "").val(null);
                    $("#RceClientName").val(null);
                    $("#RepaymentPeriod").val(null);
                    $("#FK_GlAccountId").val(null);
                    $("#FK_DefCurrencyId").val("");
                    $("#Factor").val("");
                    $("#AccountName").val(null);
                    $("#AccountCode").val(null);
                    swal({
                        title: Resources.ClientCodeNotFoundResource,
                        confirmButtonText: Resources.DoneResource,
                        type: "error"
                    });
                }

            }
        });
    }


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
                        code: data.filter.filters[0].value
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

            calaTotalForItem();
        }
    })
    $("#UnitSalesPrice").change(function () {

        if ($("#QuantityFrom").val() > 0 && $("#UnitSalesPrice").val() > 0) {

            calaTotalForItem();
        }
    })
    $("#Discount").change(function () {
        if (this.value < 0)
            this.value = 0;

        if ($("#QuantityFrom").val() > 0 && $("#UnitSalesPrice").val() > 0) {

            calaTotalForItem();
        }
    })
    $("#TaxPercentage").change(function () {
        if (this.value < 0)
            this.value = 0;
        $("#TaxValue").val($("#QuantityFrom").val() * $("#UnitSalesPrice").val() * (this.value / 100))
        if ($("#QuantityFrom").val() > 0 && $("#UnitSalesPrice").val() > 0) {

            calaTotalForItem();
        }
    })
    $("#TaxValue").change(function () {
        if (this.value < 0)
            this.value = 0;
        if ($("#QuantityFrom").val() > 0 && $("#UnitSalesPrice").val() > 0) {
            calaTotalForItem();
            $("#TaxPercentage").val(($("#TaxValue").val() * 100) / ($("#UnitSalesPrice").val() * $("#QuantityFrom").val()));
        }
    })
    $("#DownPayment").change(function () {
        if (this.value < 0)
            this.value = 0;
        $("#TotalPaid").val(this.value);
    })
    function calaTotalForItem() {
        var discount = $("#Discount").val(),
            tax = $("#TaxValue").val(),
            quantity = $("#QuantityFrom").val(),
            price = $("#UnitSalesPrice").val();

        $("#TotalItemSalsePrice").val((parseFloat(price) * parseFloat(quantity)) + parseFloat(tax) - parseFloat(discount))
    }
    var tempSource = new kendo.data.DataSource({
        transport: {
            read: "/StSellInvoice/GetSellInvoiceDetails?id=" + $("#Id").val()
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
                    unitName: { type: "string" },
                    unitSalesPrice: { type: "string" },
                    quantityFrom: { type: "string" },
                    discount: { type: "string" },
                    taxPercentage: { type: "string" },
                    taxValue: { type: "string" },
                    operatingNumber: { type: "string" },
                    totalSalesPrice: { type: "string" },
                    expiryDate: { type: "date", editable: false },
                    creationDate: { type: "date", editable: false },
                    isActive: { editable: false },
                }
            }
        }
    });

    var storeTransfergrid = $("#sellInvoiceDetailGrid").kendoGrid({
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
            { field: "unitName", title: Resources.Unit, width: Resources.InputNumberWidth },
            { field: "unitSalesPrice", title: Resources.UnitSalesPrice, width: Resources.InputNumberWidth },
            { field: "quantityFrom", title: Resources.Quantity, width: Resources.InputNumberWidth },
            { field: "discount", title: Resources.DiscountResource, width: Resources.InputNumberWidth },
            { field: "expiryDate", title: Resources.DateExpiry, width: Resources.InputNumberWidth, format: "{0:yyyy/MM/dd}" },
            { field: "taxPercentage", title: Resources.TaxPercentageResource, width: Resources.InputNumberWidth },
            { field: "taxValue", title: Resources.TaxValueResource, width: Resources.InputNumberWidth },
            { field: "operatingNumber", title: Resources.OperatingNumber, width: Resources.InputNumberWidth },
            { field: "totalSalesPrice", title: Resources.Total, width: Resources.InputNumberWidth },

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
            UnitName = $("#FK_StUnitId option:selected").text(),
            UnitSalesPrice = $("#UnitSalesPrice").val(),
            QuantityFrom = $("#QuantityFrom").val(),
            Discount = $("#Discount").val(),
            ExpiryDate = $("#ExpiryDate").val(),
            TaxPercentage = $("#TaxPercentage").val(),
            TaxValue = $("#TaxValue").val(),
            OperatingNumber = $("#OperatingNumber").val(),
            TotalItemSalsePrice = $("#TotalItemSalsePrice").val();

        if (FK_StItemId > 0 && QuantityFrom > 0 && UnitSalesPrice > 0 && TotalItemSalsePrice > 0 && $("#FK_StStoreFromId").val() > 0 && FK_StUnitId > 0) {
            var quantity = 0;
            var table = $("#sellInvoiceDetailGrid").data("kendoGrid").dataSource.data();
            for (var i = 0; i < table.length; i++) {
                if (table[i].fK_StItemId == FK_StItemId && table[i].id == 0)
                    quantity += parseFloat(table[i].quantityFrom);
            }

            $.ajax({
                url: "/StTransaction/CheckItemBalance?itemId=" + FK_StItemId + "&&stockId=" + $("#FK_StStoreFromId").val() + "&&quantity=" + quantity,
                success: function (result) {
                    result -= quantity;
                    if (result >= QuantityFrom) {
                        var totalRecords = $("#sellInvoiceDetailGrid").data("kendoGrid").dataSource.data().length;
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
                            unitName: UnitName,
                            unitSalesPrice: UnitSalesPrice,
                            quantityFrom: QuantityFrom,
                            discount: Discount,
                            expiryDate: ExpiryDate,
                            taxPercentage: TaxPercentage,
                            taxValue: TaxValue,
                            operatingNumber: OperatingNumber,
                            totalSalesPrice: TotalItemSalsePrice
                        });

                        // set total 
                        var TotalSalesPrice = $("#TotalSalesPrice").val(),
                            TotalDiscount = $("#TotalDiscount").val(),
                            TotalTax = $("#TotalTax").val(),
                            FinalTotal = $("#FinalTotal").val();


                        if (TotalSalesPrice > 0) {
                            $("#TotalSalesPrice").val(parseFloat(TotalSalesPrice) + parseFloat(TotalItemSalsePrice))
                        } else {
                            $("#TotalSalesPrice").val(parseFloat(TotalItemSalsePrice))
                        }
                        if (TotalDiscount > 0) {
                            $("#TotalDiscount").val(parseFloat(TotalDiscount) + Discount)
                        } else {
                            $("#TotalDiscount").val(Discount)
                        }
                        if (TotalTax > 0) {
                            $("#TotalTax").val(parseFloat(TotalTax) + parseFloat(TaxValue))
                        } else {
                            $("#TotalTax").val(parseFloat(TaxValue))
                        }
                        if (FinalTotal > 0) {
                            $("#FinalTotal").val(parseFloat(TotalSalesPrice) + parseFloat(TotalItemSalsePrice))
                        } else {
                            $("#FinalTotal").val(TotalItemSalsePrice)
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
                    title: Resources.EnterRequiredResource + " " + Resources.Unit,
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
            grid = $("#sellInvoiceDetailGrid").data("kendoGrid"),
            dataItem = grid.dataItem(row),
            detailId = dataItem.id,
            dataSource = $("#sellInvoiceDetailGrid").data("kendoGrid").dataSource;
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
                //var dataSource = $("#sellInvoiceDetailGrid").data("kendoGrid").dataSource;
                debugger
                if (detailId != "" && detailId != null) {
                    setTimeout(function () {
                        $.ajax({
                            url: "/StSellInvoice/DeleteSellInvoiceDetail?id=" + detailId,
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
                                    var TotalItemSalesPrice = dataItem.totalSalesPrice,
                                        Discount = dataItem.discount,
                                        UnitSalesPrice = dataItem.unitSalesPrice,
                                        TaxValue = dataItem.taxValue;
                                    // set total 
                                    var TotalSalesPrice = $("#TotalSalesPrice").val(),
                                        TotalDiscount = $("#TotalDiscount").val(),
                                        TotalTax = $("#TotalTax").val(),
                                        FinalTotal = $("#FinalTotal").val();


                                    $("#TotalSalesPrice").val(parseFloat(TotalSalesPrice) - parseFloat(TotalItemSalesPrice))

                                    $("#TotalDiscount").val(parseFloat(TotalDiscount) - parseFloat(Discount))

                                    $("#TotalTax").val(parseFloat(TotalTax) - parseFloat(TaxValue))

                                    $("#FinalTotal").val(parseFloat(FinalTotal) - parseFloat(TotalItemSalesPrice))

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

                    var TotalItemSalesPrice = dataItem.totalSalesPrice,
                        Discount = dataItem.discount,
                        UnitSalesPrice = dataItem.unitSalesPrice,
                        TaxValue = dataItem.taxValue;
                    // set total 
                    var TotalSalesPrice = $("#TotalSalesPrice").val(),
                        TotalDiscount = $("#TotalDiscount").val(),
                        TotalTax = $("#TotalTax").val(),
                        FinalTotal = $("#FinalTotal").val();


                    $("#TotalSalesPrice").val(parseFloat(TotalSalesPrice) - parseFloat(TotalItemSalesPrice))

                    $("#TotalDiscount").val(parseFloat(TotalDiscount) - parseFloat(Discount))

                    $("#TotalTax").val(parseFloat(TotalTax) - parseFloat(TaxValue))

                    $("#FinalTotal").val(parseFloat(FinalTotal) - parseFloat(TotalItemSalesPrice))

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

        $("#UnitSalesPrice").val(0);

        $("#TotalItemSalsePrice").val(0);
        $("#FK_StColorId").html("");
        $("#FK_StSizeId").html("");
        $("#Discount").val(0);
        $("#TaxPercentage").val(0);
        $("#TaxValue").val(0);
    }

    $("#btnSaveTransaction").click(function () {
        if ($("#SerialNumber").val() > 0) {
            $("#SerialNumberValid").text("")
        } else {
            $("#SerialNumberValid").text(Resources.Required)
        }
        if ($("#FK_StStoreFromId").val() > 0) {
            $("#validFK_StStoreFromId").text("")
        } else {
            $("#validFK_StStoreFromId").text(Resources.Required)
        }
        if ($("#FK_RceClientId").val() > 0) {
            $("#validFK_RceClientId").text("")
        } else {
            $("#validFK_RceClientId").text(Resources.Required)
        }
        var table = $("#sellInvoiceDetailGrid").data("kendoGrid").dataSource.data();
        if (table.length == 0) {
            swal({
                title: Resources.GridLengthZeroResource,
                confirmButtonText: Resources.DoneResource,
                type: "error"
            });

        }
        if ($("#SerialNumber").val() > 0 && table.length > 0 && $("#FK_StStoreFromId").val() > 0 && $("#FK_RceClientId").val() > 0) {
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
                    Discount: table[i].discount,
                    TaxValue: table[i].taxValue,
                    TaxPercentage: table[i].taxPercentage,
                    ExpiryDate: table[i].expiryDate,
                    OperatingNumber: table[i].operatingNumber,
                    UnitSalesPrice: table[i].unitSalesPrice,
                    TotalSalesPrice: table[i].totalSalesPrice,
                }
                tranDetail.push(detail);
            }
            var tran = {
                Id: $("#Id").val(),
                SerialNumber: $("#SerialNumber").val(),
                FK_InvoiceTypeId: $("input:checked").val(),
                FK_StStoreFromId: $("#FK_StStoreFromId").val(),
                TransactionDate: $("#TransactionDate").val(),
                DueDate: $("#DueDate").val(),
                TotalDiscount: $("#TotalDiscount").val(),
                FK_RceClientId: $("#FK_RceClientId").val(),
                FK_GlAccountId: $("#FK_GlAccountId").val(),
                FK_CostCenterId: $("#FK_CostCenterId").val(),
                TotalPaid: $("#TotalPaid").val(),
                FinalTotal: $("#FinalTotal").val(),
                TotalSalesPrice: $("#TotalSalesPrice").val(),
                hdnAttachmentIds: $("#hdnAttachmentIds").val(),
                details: tranDetail
            }

            $.ajax({
                url: '/StSellInvoice/Edit',
                type: 'POST',
                data: { addEditStSellInvoiceVM: tran },
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

                        window.location = "../../StTransaction/Search"
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