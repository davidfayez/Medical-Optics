$(document).ready(function () {
    ////// returned from Bill
    $('input[type=radio][name=returnType],#mainStStoreId').change(function () {
        if (this.value == 'bill') {
            document.getElementById("itemsInputdiv").style.display = "none";
            document.getElementById("returnedSerialtxt").style.display = "flex";
            document.getElementById("returnBillContainer").style.display = "block";
            $("#FK_StTransactionId").val("");
            $("#returnedSerial").val("");
            $("#returnedSerialhd").val("");
            $("#BillTotal").val(0);
            loadBillDetails();

        }
        else if (this.value == 'item') {
            document.getElementById("itemsInputdiv").style.display = "block";
            document.getElementById("returnedSerialtxt").style.display = "none";
            document.getElementById("returnBillContainer").style.display = "none";
            $("#FK_PaySupplierId").attr("disabled", false);
            $("#FK_PaySupplierId").val("");
            $("#inputBillNumber").val("");
            $("#inputBillNumberhd").val("");
            $("#BillTotal").val(0);
            $("#FK_StItemId").html("");
            var itmGrid = $("#returnItemGrid").data("kendoGrid")
            var itmDataSource = $("#returnItemGrid").data("kendoGrid").dataSource;
            for (var i = 0; itmGrid.dataItems("tr").length; i++) {
                console.log(itmGrid.dataItems("tr")[i])
                itmDataSource.remove(itmGrid.dataItems("tr")[i])
            }
        }
    });
    $('#mainStStoreId').change(function () {
        var returnType = $('input[type=radio][name=returnType]:checked').val();

        if (returnType == 'bill') {
            $("#FK_StTransactionId").val("");
            $("#returnedSerial").val("");
            $("#returnedSerialhd").val("");
            $("#BillTotal").val(0);
            loadBillDetails();
        }
        else {
            $("#inputBillNumber").val("");
            $("#inputBillNumberhd").val("");
            $("#BillTotal").val(0);
            $("#FK_StItemId").html("");
            var itmGrid = $("#returnItemGrid").data("kendoGrid")
            var itmDataSource = $("#returnItemGrid").data("kendoGrid").dataSource;
            for (var i = 0; itmGrid.dataItems("tr").length; i++) {
                console.log(itmGrid.dataItems("tr")[i])
                itmDataSource.remove(itmGrid.dataItems("tr")[i])
            }
        }

    });


    $("#btnSearch").click(function () {

        var returnedBillNumber = $("#returnedSerial").val().trim();
        if (returnedBillNumber != "") {
            loadBill();
        } else {
            swal({
                title: Resources.EnterRequiredResource + " " + Resources.PurchaseInvoiceNumber,
                confirmButtonText: Resources.DoneResource,
                type: "error"
            });
        }
    });
    function loadBill() {
        $.ajax({
            url: '/StTransaction/GetBillForSupplierReturn?prifx=' + $("#returnedSerial").val(),
            success: function (bill) {
                if (bill.id > 0) {
                    var returnedBillDate = new Date(bill.transactionDate);
                    var returnedBillDateFormated = returnedBillDate.getFullYear() + "-" + ("0" + (returnedBillDate.getMonth() + 1)).slice(-2) + "-" + ("0" + returnedBillDate.getDate()).slice(-2);

                    $("#FK_StTransactionId").val(bill.id);
                    $("#FK_PaySupplierId").val(bill.fK_PaySupplierId);
                    $("#FK_PaySupplierId").attr("disabled", true)
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
    loadBillDetails();
    //grid returned from Bill
    function loadBillDetails() {

        var billgrid = $("#returnSupplierBillGrid").kendoGrid({
            dataSource: {
                transport: {
                    read: "/StTransaction/GetReturnSupplierDetails?id=" + $("#FK_StTransactionId").val()
                },
                schema: {
                    model: {
                        id: "id",
                        fields: {
                            id: { editable: true },
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
                            quantityTo: { type: "string" },
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
                { field: "quantityTo", title: Resources.Quantity, width: Resources.InputNumberWidth },
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

                    if (checkedIds[view[i].id]) {
                        this.tbody.find("tr[data-uid='" + view[i].uid + "']")
                            .addClass("k-state-selected")
                            .find(".k-checkbox")
                            .attr("checked", "checked");
                    }
                }
            }

        });

    }
    $("#btnItemBillSearch").click(function () {

        $.ajax({
            url: '/StTransaction/GetBillForSupplierReturn?prifx=' + $("#inputBillNumber").val(),
            success: function (bill) {

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

    var tempSource = new kendo.data.DataSource({

    });

    var returnItemGrid = $("#returnItemGrid").kendoGrid({
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
            { field: "TotalSalsePrice", hidden: true },
            { field: "UnitCostPrice", hidden: true },
            { field: "UnitSalesPrice", hidden: true },
            { field: "ReturnFromSerial", hidden: true },
            { field: "ReturnFromDate", hidden: true },
            { field: "ItemBarcode", title: Resources.Code, width: Resources.CodeWidth },
            { field: "ItemName", title: Resources.ItemName, width: Resources.NameWidth },
            { field: "QuantityFrom", title: Resources.Quantity, width: Resources.InputNumberWidth },
            { field: "UnitPurchasePrice", title: Resources.UnitPurchasePrice, width: Resources.InputNumberWidth },
            { field: "TotalPurchasePrice", title: Resources.Total, width: Resources.InputNumberWidth },
            { field: "TaxPercentage", title: Resources.TaxPercentageResource, width: Resources.InputNumberWidth },
            { field: "TaxValue", title: Resources.TaxValueResource, width: Resources.InputNumberWidth },
            { field: "Discount", title: Resources.DiscountResource, width: Resources.InputNumberWidth },
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

        if ($("#createReturenSupplierForm").valid() && FK_StItemId > 0 && QuantityFrom > 0 && UnitPurchasePrice > 0 /*&& ReturnFromSerial > 0*/) {
            debugger
            var quantity = 0;
            var table = $("#returnItemGrid").data("kendoGrid").dataSource.data();
            for (var i = 0; i < table.length; i++) {
                if (table[i].FK_StItemId == FK_StItemId)
                    quantity += parseFloat(table[i].QuantityFrom);
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
                        var totalRecords = $("#returnItemGrid").data("kendoGrid").dataSource.data().length;
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
                            QuantityFrom: QuantityFrom,
                            Discount: Discount,
                            TaxValue: TaxValue,
                            TaxPercentage: TaxPercentage,
                            UnitSalesPrice: UnitSalesPrice,
                            UnitPurchasePrice: UnitPurchasePrice,
                            TotalPurchasePrice: TotalItemPurchasePrice,
                            TotalSalsePrice: UnitSalesPrice * QuantityFrom,
                            //ReturnFromDate: ReturnFromDate,
                            //ReturnFromSerial: ReturnFromSerial
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
            })
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
    returnItemGrid.data("kendoGrid").table.on("click", ".btnDelete", removeRow);
    $("#returnSupplierBillGrid").data("kendoGrid").table.on("click", ".row-checkbox", selectRow);
    var thisRow = "";

    $('#header-chb').change(function (ev) {
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

    function removeRow() {

        var row = $(this).closest("tr"),
            grid = $("#returnItemGrid").data("kendoGrid"),
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
                var dataSource = $("#returnItemGrid").data("kendoGrid").dataSource;

                if (dataSource.remove(dataItem)) {
                    swal({
                        title: Resources.DeleteSuccessResource,
                        confirmButtonText: Resources.DoneResource,
                        type: "success"
                    });

                    var QuantityFrom = dataItem.QuantityFrom,
                        UnitPurchasePrice = dataItem.UnitPurchasePrice,
                        Discount = dataItem.Discount,
                        TaxValue = dataItem.TaxValue;
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
        var returnType = $('input[type=radio][name=returnType]:checked').val();

        if (returnType == 'bill') {
            saveReturnBill();
        } else {
            saveReturnItem();
        }

    })
    function saveReturnBill() {
        var table = [];
        var gridData = $("#returnSupplierBillGrid").data("kendoGrid").dataSource._data;
        for (var i = 0; i < gridData.length; i++) {
            if (checkedIds[gridData[i].id]) {
                var row = {
                    FK_StItemId: gridData[i].fK_StItemId,
                    QuantityFrom: gridData[i].quantityTo,
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
                    ReturnedId: gridData[i].id,

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
                title: Resources.EnterRequiredResource + " " + Resources.PurchaseInvoiceNumber,
                confirmButtonText: Resources.DoneResource,
                type: "error"
            });
        }
        if ($("#createReturenSupplierForm").valid() && $("#SerialNumber").val() > 0 && table.length > 0 && $("#returnedSerialhd").val().trim() != "") {
            var stStoreId;
            if ($("#subStStoreId").val() > 0)
                stStoreId = $("#subStStoreId").val();
            else
                stStoreId = $("#mainStStoreId").val();


            var tran = {
                SerialNumber: $("#SerialNumber").val(),
                BookNumber: $("#returnedSerialhd").val().split("-")[1],
                // SerialPrefix: $("#SerialPrefix").text() + $("#SerialNumber").val(),
                FK_PaySupplierId: $("#FK_PaySupplierId").val(),
                PaySupplierName: $("#FK_PaySupplierId option:selected").html(),
                FK_StStoreFromId: stStoreId,
                TransactionDate: $("#TransactionDate").val(),
                FinalTotal: $("#BillTotal").val(),
                TotalDiscount: $("#TotalDiscount").val(),
                TotalTax: $("#TotalTax").val(),
                TotalNet: $("#TotalNet").val(),
                hdnAttachmentIds: $("#hdnAttachmentIds").val(),
                details: table
            }

            $.ajax({
                url: '/StTransaction/CreateReturnedSupplier',
                type: 'POST',
                data: { returnedToSupplierVM: tran },
                success: function (result) {
                    if (isNaN(result)) {
                        var message = "";
                        for (var i = 0; i < result.length; i++) {
                            if (result[i].quantityTo < result[i].quantityFrom)
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
                            setTimeout(function () {
                                document.location = "../../StTransaction/EditReturnedSupplier?id=" + result
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
    }
    function saveReturnItem() {
        var table = $("#returnItemGrid").data("kendoGrid").dataSource.data();
        if (table.length == 0) {
            swal({
                title: Resources.GridLengthZeroResource,
                confirmButtonText: Resources.DoneResource,
                type: "error"
            });

        }
        if ($("#createReturenSupplierForm").valid() && $("#SerialNumber").val() > 0 && table.length > 0) {
            var tranDetail = [];
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
                    TotalSalsePrice: table[i].TotalSalsePrice,
                    TotalCostPrice: table[i].TotalCostPrice,
                    TaxValue: table[i].TaxValue,
                    TaxPercentage: table[i].TaxPercentage,
                    Discount: table[i].Discount,
                    //ReturnFromSerial: table[i].ReturnFromSerial,
                    //ReturnFromDate: table[i].ReturnFromDate
                }
                tranDetail.push(detail);
            }
            var stStoreId;
            if ($("#subStStoreId").val() > 0)
                stStoreId = $("#subStStoreId").val();
            else
                stStoreId = $("#mainStStoreId").val();
            var tran = {
                SerialNumber: $("#SerialNumber").val(),
                SerialPrefix: $("#SerialPrefix").text() + $("#SerialNumber").val(),
                BookNumber: 0,
                FK_PaySupplierId: $("#FK_PaySupplierId").val(),
                PaySupplierName: $("#FK_PaySupplierId option:selected").html(),
                FK_StStoreFromId: stStoreId,
                TransactionDate: $("#TransactionDate").val(),
                FinalTotal: $("#BillTotal").val(),
                TotalDiscount: $("#TotalDiscount").val(),
                TotalTax: $("#TotalTax").val(),
                TotalNet: $("#TotalNet").val(),
                hdnAttachmentIds: $("#hdnAttachmentIds").val(),
                details: tranDetail
            }

            $.ajax({
                url: '/StTransaction/CreateReturnedSupplier',
                type: 'POST',
                data: { returnedToSupplierVM: tran },
                success: function (result) {
                    if (isNaN(result)) {
                        var message = "";
                        for (var i = 0; i < result.length; i++) {
                            if (result[i].quantityTo < result[i].quantityFrom)
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
                            setTimeout(function () {
                                document.location = "../../StTransaction/EditReturnedSupplier?id=" + result
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
    }

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
var checkedIds = {};

//on click of the checkbox:
function selectRow() {
    var thisRow = this;
    if ($("#createReturenSupplierForm").valid()) {
        var checked = this.checked,
            row = $(this).closest("tr"),
            grid = $("#returnSupplierBillGrid").data("kendoGrid"),
            dataItem = grid.dataItem(row);

        //  checkedIds[dataItem.id] = checked;

        if (checked) {
            //-select the row
            //row.addClass("k-state-selected");

            //var checkHeader = true;

            //$.each(grid.items(), function (index, item) {
            //    if (!($(item).hasClass("k-state-selected"))) {
            //        checkHeader = false;
            //    }
            //});

            //$("#header-chb")[0].checked = checkHeader;

            // check quantity valid

            var quantity = 0;
            var table = $("#returnSupplierBillGrid").data("kendoGrid").dataSource.data();
            for (var i = 0; i < table.length; i++) {
                if (table[i].fK_StItemId == dataItem.fK_StItemId && checkedIds[table[i].id])
                    quantity += parseFloat(table[i].quantityTo);
            }
            var stStoreId;
            if ($("#subStStoreId").val() > 0)
                stStoreId = $("#subStStoreId").val();
            else
                stStoreId = $("#mainStStoreId").val();
            $.ajax({
                url: "/StTransaction/CheckItemBalance?itemId=" + dataItem.fK_StItemId + "&&stockId=" + stStoreId + "&&quantity=" + quantity,
                success: function (result) {
                    result -= quantity;

                    if (result >= dataItem.quantityTo) {
                        //row.addClass("k-state-selected");

                        //var checkHeader = true;

                        //$.each(grid.items(), function (index, item) {
                        //    if (!($(item).hasClass("k-state-selected"))) {
                        //        checkHeader = false;
                        //    }
                        //});

                        //$("#header-chb")[0].checked = checkHeader;

                        checkedIds[dataItem.id] = checked;
                        var gridData = $("#returnSupplierBillGrid").data("kendoGrid").dataSource._data;
                        var total = 0,
                            totalDiscount = 0,
                            totalTax = 0;
                        for (var i = 0; i < gridData.length; i++) {

                            if (checkedIds[gridData[i].id]) {
                                total += parseFloat(gridData[i].unitPurchasePrice) * parseFloat(gridData[i].quantityTo);
                                totalDiscount += parseFloat(gridData[i].discount);
                                totalTax += parseFloat(gridData[i].taxValue);
                            }
                        }

                        $("#BillTotal").val(total); //اجمالى سعر الشراء 
                        $("#TotalDiscount").val(totalDiscount);
                        $("#TotalTax").val(totalTax);
                        $("#TotalNet").val(total + totalTax - totalDiscount);
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

        } else {

            //-remove selection
            checkedIds[dataItem.id] = checked;
            row.removeClass("k-state-selected");
            $("#header-chb")[0].checked = false;
            var gridData = $("#returnSupplierBillGrid").data("kendoGrid").dataSource._data;
            var total = 0,
                totalDiscount = 0,
                totalTax = 0;
            for (var i = 0; i < gridData.length; i++) {

                if (checkedIds[gridData[i].id]) {
                    total += parseFloat(gridData[i].unitPurchasePrice) * parseFloat(gridData[i].quantityTo);
                    totalDiscount += parseFloat(gridData[i].discount);
                    totalTax += parseFloat(gridData[i].taxValue);
                }
            }

            $("#BillTotal").val(total); //اجمالى سعر الشراء 
            $("#TotalDiscount").val(totalDiscount);
            $("#TotalTax").val(totalTax);
            $("#TotalNet").val(total + totalTax - totalDiscount);


        }

    }
    else {
        this.checked = false;
    }

}