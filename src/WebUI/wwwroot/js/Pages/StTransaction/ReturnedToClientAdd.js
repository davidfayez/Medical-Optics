$(document).ready(function () {

    var url = window.location.pathname;
    var id = url.substring(url.lastIndexOf('/') + 1);

    $('input[type=radio][name=returnType],#FK_StStoreToId').change(function () {
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
    $('#FK_StStoreToId').change(function () {
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

    function loadBill() {
        $.ajax({
            url: '/StTransaction/GetBillForClientReturn?prifx=' + $("#returnedSerial").val(),
            success: function (bill) {
                debugger;
                if (bill.id > 0) {
                    var returnedBillDate = new Date(bill.transactionDate);
                    var returnedBillDateFormated = returnedBillDate.getFullYear() + "-" + ("0" + (returnedBillDate.getMonth() + 1)).slice(-2) + "-" + ("0" + returnedBillDate.getDate()).slice(-2);

                    $("#FK_StTransactionId").val(bill.id);
                    $("#FK_InvoiceTypeId").val(bill.fK_InvoiceTypeId);
                    $("#FK_RceClientId").val(bill.fK_RceClientId);
                    $("#FK_RceClientId").attr("disabled", true);
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

        var storeTransfergrid = $("#returnSupplierBillGrid").kendoGrid({
            dataSource: {
                transport: {
                    read: "/StTransaction/GetReturnClientDetails?id=" + $("#FK_StTransactionId").val()
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
                            totalPurchasePrice: { type: "string" },
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
                { field: "totalPurchasePrice", hidden: true },
                { field: "itemBarcode", title: Resources.Code, width: Resources.CodeWidth },
                { field: "itemName", title: Resources.ItemName, width: Resources.NameWidth },
                { field: "unitName", title: Resources.Unit, width: Resources.InputNumberWidth },
                { field: "unitSalesPrice", title: Resources.UnitSalesPrice, width: Resources.InputNumberWidth },
                { field: "quantityFrom", title: Resources.Quantity, width: Resources.InputNumberWidth },
                { field: "discount", title: Resources.DiscountResource, width: Resources.InputNumberWidth },
                { field: "expiryDate", title: Resources.DateExpiry, format: "{0:yyyy/MM/dd}", width: Resources.InputNumberWidth },
                { field: "taxPercentage", title: Resources.TaxPercentageResource, width: Resources.InputNumberWidth },
                { field: "taxValue", title: Resources.TaxValueResource, width: Resources.InputNumberWidth },
                //{ field: "operatingNumber", title: Resources.OperatingNumber, width: Resources.InputNumberWidth },
                { field: "totalSalesPrice", title: Resources.Total, width: Resources.InputNumberWidth },

                //{ width: Resources.ActionWidth, template: "<a  class='btn btn-danger btn-sm btnDelete' ><i class='fas fa-trash-alt'></i></a>" }
            ],
            dataBound: function (e) {
                e.sender.items().each(function () {
                    var dataItem = e.sender.dataItem(this);
                    kendo.bind(this, dataItem);
                });
                debugger;
                var view = this.dataSource.view();
                for (var i = 0; i < view.length; i++) {
                    if (view[i].fK_StStatusId == 8) {
                        this.tbody.find("tr[data-uid='" + view[i].uid + "']")
                            .addClass("k-state-selected")
                            .find(".k-checkbox")
                            .attr("checked", "checked")
                            .attr("disabled", "disabled");

                    }
                }
            },
            editable: false,
            selectable: "multiple, cell",


        });
        storeTransfergrid.data("kendoGrid").table.on("click", ".btnDelete", removeRow);
        storeTransfergrid.data("kendoGrid").table.on("click", ".row-checkbox", selectRow);
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
    //bind click event to the checkbox
    var now = new Date(),
        today = now.getFullYear() + "-" + ("0" + (now.getMonth() + 1)).slice(-2) + "-" + ("0" + now.getDate()).slice(-2);
    $('#ExpiryDate').val(today);

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

    function calaTotalForItem() {
        var discount = $("#Discount").val(),
            tax = $("#TaxValue").val(),
            quantity = $("#QuantityFrom").val(),
            price = $("#UnitSalesPrice").val();

        $("#TotalItemSalsePrice").val((parseFloat(price) * parseFloat(quantity)) + parseFloat(tax) - parseFloat(discount))
    }
    var tempSource = new kendo.data.DataSource({

    });

    var returnItemGrid = $("#returnItemGrid").kendoGrid({
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
            //{ field: "returnFromSerial", hidden: true },
            //{ field: "returnFromDate", hidden: true },
            { field: "itemBarcode", title: Resources.Code, width: Resources.CodeWidth },
            { field: "itemName", title: Resources.ItemName, width: Resources.NameWidth },
            { field: "unitName", title: Resources.Unit, width: Resources.InputNumberWidth },
            { field: "unitSalesPrice", title: Resources.UnitSalesPrice, width: Resources.InputNumberWidth },
            { field: "quantityFrom", title: Resources.Quantity, width: Resources.InputNumberWidth },
            { field: "discount", title: Resources.DiscountResource, width: Resources.InputNumberWidth },
            { field: "expiryDate", title: Resources.DateExpiry, format: "{0:yyyy/MM/dd}", width: Resources.InputNumberWidth },
            { field: "taxPercentage", title: Resources.TaxPercentageResource, width: Resources.InputNumberWidth },
            { field: "taxValue", title: Resources.TaxValueResource, width: Resources.InputNumberWidth },
            //{ field: "operatingNumber", title: Resources.OperatingNumber, width: Resources.InputNumberWidth },
            { field: "totalSalesPrice", title: Resources.Total, width: Resources.InputNumberWidth },
            //{ width: Resources.ActionWidth, template: "<a  class='btn btn-danger btn-sm btnDelete' ><i class='fas fa-trash-alt'></i></a>" }

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
    returnItemGrid.data("kendoGrid").table.on("click", ".btnDelete", removeRow);

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
                    $("#FK_StColorId").val(item.fK_StColorId);
                    $("#FK_StSizeId").val(item.fK_StSizeId);
                    $("#UnitSalesPrice").val(item.salePrice);
                    $("#UnitPurchasePrice").val(item.purchasePrice);
                    $("#UnitCostPrice").val(item.costPrice);
                    $("#TotalItemSalsePrice").val(0);

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
        }
    })

    $("#btnAddNewDetail").on('click', function () {

        var FK_StItemId = parseInt($("#FK_StItemId").val()),
            FK_StGenderId =parseInt($("#FK_StGenderId").val()),
            FK_StBrandId = parseInt($("#FK_StBrandId").val()),
            FK_StModelId = parseInt($("#FK_StModelId").val()),
            FK_StColorId = parseInt($("#FK_StColorId").val()),
            FK_StSizeId = parseInt($("#FK_StSizeId").val()),
            FK_StUnitId = parseInt($("#FK_StUnitId").val()),
            ItemBarcode = $("#ItemBarcodehid").val(),
            ItemName = $("#FK_StItemId option:selected").text(),
            UnitName = $("#FK_StUnitId option:selected").text(),
            UnitSalesPrice = parseFloat($("#UnitSalesPrice").val()),
            QuantityFrom = parseInt( $("#QuantityFrom").val()),
            Discount = parseFloat($("#Discount").val()),
            ExpiryDate = $("#ExpiryDate").val(),
            TaxPercentage = parseFloat($("#TaxPercentage").val()),
            TaxValue = $("#TaxValue").val(),
            OperatingNumber = parseInt($("#OperatingNumber").val()),
            TotalItemSalsePrice = parseFloat($("#TotalItemSalsePrice").val());
        debugger;
        if (FK_StItemId > 0 && QuantityFrom > 0 && UnitSalesPrice > 0 && TotalItemSalsePrice > 0 && $("#FK_StStoreToId").val() > 0 && FK_StUnitId > 0) {
            var quantity = 0;
            var table = $("#returnSupplierBillGrid").data("kendoGrid").dataSource.data();
            for (var i = 0; i < table.length; i++) {
                if (table[i].FK_StItemId == FK_StItemId)
                    quantity += parseFloat(table[i].QuantityFrom);
            }
                var totalRecords = $("#returnSupplierBillGrid").data("kendoGrid").dataSource.data().length;
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
    

    var thisRow = "";

    function removeRow() {

        var row = $(this).closest("tr"),
            grid = $("#returnSupplierBillGrid").data("kendoGrid"),
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
                var dataSource = $("#returnSupplierBillGrid").data("kendoGrid").dataSource;

                if (dataSource.remove(dataItem)) {
                    swal({
                        title: Resources.DeleteSuccessResource,
                        confirmButtonText: Resources.DoneResource,
                        type: "success"
                    });
                    var UnitSalesPrice = dataItem.UnitSalesPrice,
                        TotalItemSalesPrice = dataItem.TotalSalesPrice,
                        Discount = dataItem.Discount,
                        TaxValue = dataItem.TaxValue;
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
        debugger;
        for (var i = 0; i < gridData.length; i++) {
            if (checkedIds[gridData[i].id]) {
                var expiryDate = (gridData[i].expiryDate).toJSON();
                var row = {
                    FK_StItemId: gridData[i].fK_StItemId,
                    QuantityFrom: gridData[i].quantityFrom,
                    FK_StUnitId: gridData[i].fK_StUnitId,
                    FK_StBrandId: gridData[i].fK_StBrandId,
                    FK_StModelId: gridData[i].fK_StBrandId,
                    FK_StGenderId: gridData[i].fK_StGenderId,
                    FK_StColorId: gridData[i].fK_StColorId,
                    FK_StSizeId: gridData[i].fK_StSizeId,
                    Discount: gridData[i].discount,
                    TaxPercentage: gridData[i].taxPercentage,
                    TaxValue: gridData[i].taxValue,
                    ExpiryDate: expiryDate,
                    UnitPurchasePrice: gridData[i].unitPurchasePrice,
                    UnitCostPrice: gridData[i].unitCostPrice,
                    UnitSalesPrice: gridData[i].unitSalesPrice,
                    TotalCostPrice: gridData[i].unitCostPrice * gridData[i].quantityFrom,
                    TotalSalesPrice: gridData[i].totalSalesPrice,
                    TotalPurchasePrice: gridData[i].totalPurchasePrice,
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
        if ($("#createReturenClientForm").valid() && $("#SerialNumber").val() > 0 && table.length > 0) {

            var tran = {
                SerialNumber: $("#SerialNumber").val(),
                BookNumber: $("#returnedSerialhd").val().split("-")[1],
                BookNumberPrefix: $("#returnedSerialhd").val().split("-")[0] + "-",
                FK_RceClientId: $("#FK_RceClientId").val(),
                RceClientName: $("#FK_RceClientId option:selected").html(),
                //FK_StStoreFromId: null,
                FK_InvoiceTypeId: parseInt($("#FK_InvoiceTypeId").val()),
                FK_StStoreToId: $("#FK_StStoreToId").val(),
                TransactionDate: $("#TransactionDate").val(),
                TotalItemCount: $("#TotalItemCount").val(),
                TotalSalesPrice: $("#TotalSalesPrice").val(),
                FinalTotal: $("#FinalTotal").val(),
                //hdnAttachmentIds: $("#hdnAttachmentIds").val(),
                details: table
            }
            debugger
            $.ajax({
                url: '/StTransaction/CreateReturnedClient',
                type: 'POST',
                data: { returnedToClientVM: tran },
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
                                    document.location = "../../StTransaction/EditReturnedClient?id=" + result
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
        if ($("#createReturenClientForm").valid() && $("#SerialNumber").val() > 0 && table.length > 0) {
            var tranDetail = [];
            for (var i = 0; i < table.length; i++) {
                var detail = {
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
                    Discount: table[i].discount,
                    TaxPercentage: table[i].taxPercentage,
                    TaxValue: table[i].taxValue,
                    ExpiryDate: table[i].expiryDate,
                    ReturnFromSerial: $("#returnedSerialhd").val().split("-")[1],
                    ReturnFromDate: $("#returnedBillDate").val(),
                }
                tranDetail.push(detail);
            }
           
            var tran = {
                SerialNumber: $("#SerialNumber").val(),
                BookNumber: $("#returnedSerialhd").val().split("-")[1],
                BookNumberPrefix: $("#returnedSerialhd").val().split("-")[0] + "-",
                FK_RceClientId: $("#FK_RceClientId").val(),
                RceClientName: $("#FK_RceClientId option:selected").html(),
                FK_StStoreToId: $("#FK_StStoreToId").val(),
                FK_InvoiceTypeId: parseInt($("#FK_InvoiceTypeId").val()),
                TransactionDate: $("#TransactionDate").val(),
                TotalItemCount: $("#TotalItemCount").val(),
                TotalSalesPrice: $("#TotalSalesPrice").val(),
                FinalTotal: $("#FinalTotal").val(),
                //hdnAttachmentIds: $("#hdnAttachmentIds").val(),
                details: tranDetail
            }

            $.ajax({
                url: '/StTransaction/CreateReturnedClient',
                type: 'POST',
                data: { returnedToClientVM: tran },
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
})

var checkedIds = {};

//on click of the checkbox:
function selectRow() {
    var checked = this.checked,
        thischk = this,
        row = $(this).closest("tr"),
        grid = $("#returnSupplierBillGrid").data("kendoGrid"),
        dataItem = grid.dataItem(row);

        if (checked) {
            var quantity = 0;
            var table = $("#returnSupplierBillGrid").data("kendoGrid").dataSource.data();
            for (var i = 0; i < table.length; i++) {
                if (table[i].fK_StItemId == dataItem.fK_StItemId && checkedIds[table[i].id] == true)
                    quantity += parseFloat(table[i].quantityFrom);
            }

            checkedIds[dataItem.id] = checked;
            row.addClass("k-state-selected");
            var checkHeader = true;
            $.each(grid.items(), function (index, item) {
                if (!($(item).hasClass("k-state-selected"))) {
                    checkHeader = false;
                }
            });

            $("#header-chb")[0].checked = checkHeader;
            var gridData = $("#returnSupplierBillGrid").data("kendoGrid").dataSource._data;
            var quantity1 = 0;
            var total = 0;
            var totalDiscount = 0;
            var totalTax = 0
            var finalTotal = 0;

            for (var i = 0; i < gridData.length; i++) {

                if (checkedIds[gridData[i].id]) {
                    quantity1 += parseFloat(gridData[i].quantityFrom);
                    total += parseFloat(gridData[i].totalSalesPrice);
                    finalTotal += parseFloat(gridData[i].totalSalesPrice);
                    totalDiscount += parseFloat(gridData[i].discount);
                    totalTax += parseFloat(gridData[i].taxValue);
                }
            }

            $("#TotalItemCount").val(quantity1);
            $("#TotalSalesPrice").val(total);
            $("#TotalDiscount").val(totalDiscount);
            $("#TotalTax").val(totalTax);
            $("#FinalTotal").val(finalTotal);
                    
            //-select the row

        } else {
            //-remove selection
            row.removeClass("k-state-selected");
            $("#header-chb")[0].checked = false;
            checkedIds[dataItem.id] = checked
            var gridData = $("#returnSupplierBillGrid").data("kendoGrid").dataSource._data;
            var quantity = 0;
            var total = 0;
            var totalDiscount = 0;
            var totalTax = 0
            var finalTotal = 0;

            for (var i = 0; i < gridData.length; i++) {

                if (checkedIds[gridData[i].id]) {
                    quantity += parseFloat(gridData[i].quantityFrom);
                    total += parseFloat(gridData[i].totalSalesPrice);
                    finalTotal += parseFloat(gridData[i].totalSalesPrice);
                    totalDiscount += parseFloat(gridData[i].discount);
                    totalTax += parseFloat(gridData[i].taxValue);
                }
            }

            $("#TotalItemCount").val(quantity);
            $("#TotalSalesPrice").val(total);
            $("#TotalDiscount").val(totalDiscount);
            $("#TotalTax").val(totalTax);
            $("#FinalTotal").val(finalTotal);
        }

    

}