$(document).ready(function () {

    $('input[type=radio][name=SearchBy]').change(function () {
        if (this.value == "Barcode") {
            $("#ShowSearchByCategory").hide();
            $("#ShowSearchByBarcode").show();
        }
        else {
            $("#ShowSearchByCategory").show();
            $("#ShowSearchByBarcode").hide();
        }


    });

    $('input[type=radio][name=barcode-search]').change(function () {
        if (this.value == "MultipleBarcode") {
            $("#barcode-single").hide();
            $("#barcode-multi").show();
        }
        else {
            $("#barcode-single").show();
            $("#barcode-multi").hide();
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
                    $("#ItemBarcode").val(item.barcodeCode);

                }
            })
        }
    })

   
    var tempSource = new kendo.data.DataSource({

    });

    var barcodePrintingGrid = $("#BarcodePrintingGrid").kendoGrid({
        dataSource: tempSource,
        navigatable: true,
        pageable: false,
        scrollable: false,
        columns: [
            { field: "FK_StItemId", hidden: true },
            { field: "FK_MainCategories", hidden: true },
            { field: "ItemBarcode", title: Resources.Code, width: Resources.CodeWidth },
            { field: "ItemName", title: Resources.ItemName, width: Resources.NameWidth },
            { field: "CategoryName", title: Resources.MainCategories, width: Resources.NameWidth },
            { field: "PrintingNumber", title: Resources.PrintingNumber, width: Resources.InputNumberWidth },

            { width: Resources.ActionWidth, template: "<a  class='btn btn-danger btn-sm btnPrint' ><i class='fas fa-trash-alt'></i></a>" }
        ],
        editable: false,
        selectable: "multiple, cell",


    });
    $("#btnAddNewDetail").on('click', function () {
        debugger;
        var FK_StItemId = $("#FK_StItemId").val(),
            FK_MainCategories = $("#mainCategorie").val(),
            ItemBarcode = $("#ItemBarcode").val(),
            ItemName = $("#FK_StItemId option:selected").text(),
            CategoryName = $("#mainCategorie option:selected").text(),        
            PrintingNumber = $("#PrintingNumberForCategorySearch").val();
        debugger
        if (FK_StItemId > 0 && PrintingNumber > 0) {

            var totalRecords = $("#BarcodePrintingGrid").data("kendoGrid").dataSource.data().length;
            var Index = parseInt($("#Index").val());
            if (!isNaN(Index))
                totalRecords = Index - 1;
            tempSource.insert(totalRecords, {
                FK_StItemId: FK_StItemId,
                FK_MainCategories: FK_MainCategories,
                ItemBarcode: ItemBarcode,
                ItemName: ItemName,
                CategoryName: CategoryName,
                PrintingNumber: PrintingNumber,
            });

            ClearFormDetails();
        } else {
            debugger
            if (isNaN(FK_StItemId) || FK_StItemId <= 0) {

                swal({
                    title: Resources.EnterRequiredResource + " " + Resources.ItemName,
                    confirmButtonText: Resources.DoneResource,
                    type: "error"
                });
            } else if (isNaN(PrintingNumber) || PrintingNumber <= 0) {
                swal({
                    title: Resources.EnterRequiredResource + " " + Resources.PrintingNumber,
                    confirmButtonText: Resources.DoneResource,
                    type: "error"
                });
            }

        }


    });

    barcodePrintingGrid.data("kendoGrid").table.on("click", ".btnDelete", printRow);
    var thisRow = "";

    function printRow() {

        var row = $(this).closest("tr"),
            grid = $("#BarcodePrintingGrid").data("kendoGrid"),
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
                var dataSource = $("#BarcodePrintingGrid").data("kendoGrid").dataSource;

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

    $("#BarcodeForSingleSearch").blur(function () {
        validCodeForSingleSearch();
    });

    $("#BarcodeFrom").blur(function () {
        barcodeFromForMultiSearch();
    });

    $("#BarcodeTo").blur(function () {
        barcodeToForMultiSearch();
    });
}) 

var _validCodeForSingleSearch = false;
var _barcodeFromForMultiSearch = false;
var _barcodeToForMultiSearch = false;

function validCodeForSingleSearch() {
    //$("#mainForm").valid();
    var code = $("#BarcodeForSingleSearch").val();
    if (code == "") {
        return false;
    }
    $.ajax({
        url: '/StTransaction/CodeValidate/' + code,
        success: (e) => {
            if (e == "true") {
                $("#validCode").text("");
                $(".btnPrintForSingleSearch").prop('disabled', false);
                _validCodeForSingleSearch = true;
            } else {
                $("#validCode").text(e);
                $(".btnPrintForSingleSearch").prop('disabled', true);
                _validCodeForSingleSearch = false;
            }
        }
    });

    return _validCodeForSingleSearch;
}

function barcodeFromForMultiSearch() {
    //$("#mainForm").valid();
    var code = $("#BarcodeFrom").val();
    if (code == "") {
        return false;
    }
    $.ajax({
        url: '/StTransaction/CodeValidate/' + code,
        success: (e) => {
            if (e == "true") {
                $("#validCode").text("");
                $(".btnPrintForMultiSearch").prop('disabled', false);
                _barcodeFromForMultiSearch = true;
            } else {
                $("#validCode").text(e);
                $(".btnPrintForMultiSearch").prop('disabled', true);
                _barcodeFromForMultiSearch = false;
            }
        }
    });

    return _barcodeFromForMultiSearch;
}

function barcodeToForMultiSearch() {
    //$("#mainForm").valid();
    var code = $("#BarcodeTo").val();
    if (code == "") {
        return false;
    }
    $.ajax({
        url: '/StTransaction/CodeValidate/' + code,
        success: (e) => {
            if (e == "true") {
                $("#validCode").text("");
                $(".btnPrintForMultiSearch").prop('disabled', false);
                _barcodeToForMultiSearch = true;
            } else {
                $("#validCode").text(e);
                $(".btnPrintForMultiSearch").prop('disabled', true);
                _barcodeToForMultiSearch = false;
            }
        }
    });

    return _barcodeToForMultiSearch;
}

$(".btnPrintForSingleSearch").on('click', function () {
    debugger;
    var barcode = $("#BarcodeForSingleSearch").val();
    var count = parseInt($("#PrintingNumberForSingleSearch").val());
    if (isNaN(barcode) || barcode <= 0) {
        swal({
            title: Resources.EnterRequiredResource + " " + Resources.Barcode,
            confirmButtonText: Resources.DoneResource,
            type: "error"
        });
    }
    else if (isNaN(count) || count <= 0) {
        swal({
            title: Resources.EnterRequiredResource + " " + Resources.PrintingNumber,
            confirmButtonText: Resources.DoneResource,
            type: "error"
        });
    }
    else {
        var url = "/StTransaction/BarcodeReportPrintSingleBarcode?barcode=" + barcode + "&count=" + count;
        window.open(url, '_blank');
    }
    
});

$(".btnPrintForMultiSearch").on('click', function () {
    debugger;
    var barcodeFrom = $("#BarcodeFrom").val();
    var barcodeTo = $("#BarcodeTo").val();
    var count = parseInt($("#PrintingNumberForMultiSearch").val());
    if ((isNaN(barcodeFrom) || barcodeFrom <= 0) && (isNaN(barcodeTo) || barcodeTo <= 0)) {
        swal({
            title: Resources.EnterRequiredResource + " " + Resources.Barcode,
            confirmButtonText: Resources.DoneResource,
            type: "error"
        });
    }
   else if (isNaN(count) || count <= 0) {
        swal({
            title: Resources.EnterRequiredResource + " " + Resources.PrintingNumber,
            confirmButtonText: Resources.DoneResource,
            type: "error"
        });
    }
    else {
        var url = "/StTransaction/BarcodeReportPrintMultiBarcode?barcodeFrom=" + barcodeFrom + "&barcodeTo=" + barcodeTo + "&count=" + count;
        window.open(url, '_blank');
    }
    
});

$(".btnPrintForCategorySearch").on('click', function () {
    var items = [];
    gridData = $("#BarcodePrintingGrid").data("kendoGrid").dataSource.data();
    for (var i = 0; i < gridData.length; i++) {
        var row = { id: parseInt(gridData[i].FK_StItemId), printingNumber: parseInt(gridData[i].PrintingNumber) };
        items.push(row);
    }
    debugger;
    

    var url = "/StTransaction/BarcodeReportPrintMultiItem?items=" + JSON.stringify(items) ;
    window.open(url, '_blank');
});