$(document).ready(function () {

   
    $("#FK_CategoryId").change(function () {
        if ($("#FK_CategoryId").val() > 0) {
            $.ajax({
                url: '/InsuranceService/GetAllStItemByMainCategory?id=' + $("#FK_CategoryId").val(),
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
                url: '/InsuranceService/GetServiceData?id=' + $("#FK_StItemId").val(),
                success: function (item) {
                    $("#CashPrice").val(item.cashPrice);
                    $("#ContractPrice").val(item.contractPrice);
                    $("#InsurancePrice").val(item.insurancePrice);

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

    var tempSource = new kendo.data.DataSource({
        transport: {
            read: {
                url: "/InsurancePriceList/GetInsurancePriceListDetail?id="+$("#Id").val(),
                Type: "GET"
            }
        },
        error: function (e) {
            alert("Status: " + e.status + "; Error message: " + e.errorThrown);
        },
        pageSize: 10,
        schema: {
            model: {
                id: "id",
                fields: {
                    id: { editable: false },
                    fK_StItemId: { editable: false },
                    itemName: { editable: false },
                    cashPrice: { type: "number", validation: { required: true, min: 1 } },
                    contractPrice: { type: "number", validation: { required: true, min: 1 } },
                    insurancePrice: { type: "number", validation: { required: true, min: 1 } },

                }
            }
        }
    });

    var storeTransfergrid = $("#insuranceListDetailGrid").kendoGrid({
        dataSource: tempSource,
        navigatable: true,
        pageable: false,
        scrollable: false,
        columns: [
            { field: "fK_StItemId", hidden: true },
            { field: "itemName", title: Resources.ItemName, width: Resources.NameWidth },
            { field: "cashPrice", title: Resources.UnitPurchasePrice, width: Resources.InputNumberWidth },
            { field: "contractPrice", title: Resources.UnitSalesPrice, width: Resources.InputNumberWidth },
            { field: "insurancePrice", title: Resources.UnitCostPrice, width: Resources.InputNumberWidth },

            { width: Resources.ActionWidth, template: "<a  class='btn btn-danger btn-sm btnDelete' ><i class='fas fa-trash-alt'></i></a>" }
        ],
        editable: true,
        selectable: "multiple, cell",


    });
    $("#btnAddNewDetail").on('click', function () {

        var FK_StItemId = $("#FK_StItemId").val(),
            ItemName = $("#FK_StItemId option:selected").text(),
            CashPrice = $("#CashPrice").val(),
            ContractPrice = $("#ContractPrice").val(),
            InsurancePrice = $("#InsurancePrice").val();
        if (FK_StItemId > 0 && CashPrice > 0 && ContractPrice > 0 && InsurancePrice > 0) {

            var totalRecords = $("#insuranceListDetailGrid").data("kendoGrid").dataSource.data().length;
            var Index = parseInt($("#Index").val());
            if (!isNaN(Index))
                totalRecords = Index - 1;
            tempSource.insert(totalRecords, {
                fK_StItemId: FK_StItemId,
                itemName: ItemName,
                cashPrice: CashPrice,
                contractPrice: ContractPrice,
                insurancePrice: InsurancePrice
            });



            ClearFormDetails();


        } else {

            if (isNaN(FK_StItemId) || FK_StItemId <= 0) {

                swal({
                    title: Resources.EnterRequiredResource + " " + Resources.ItemName,
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
            } else {
                swal({
                    title: Resources.EnterRequiredResource + " " + Resources.UnitCostPrice,
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
            grid = $("#insuranceListDetailGrid").data("kendoGrid"),
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
                var dataSource = $("#insuranceListDetailGrid").data("kendoGrid").dataSource;

                if (dataSource.remove(dataItem)) {
                    swal({
                        title: Resources.DeleteSuccessResource,
                        confirmButtonText: Resources.DoneResource,
                        type: "success"
                    });

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

        $("#CashPrice").val(0);
        $("#ContractPrice").val(0);
        $("#InsurancePrice").val(0);
    }

    $("#btnSaveTransaction").click(function () {

        var table = $("#insuranceListDetailGrid").data("kendoGrid").dataSource.data();
        if (table.length == 0) {
            swal({
                title: Resources.GridLengthZeroResource,
                confirmButtonText: Resources.DoneResource,
                type: "error"
            });

        }
        if ($("#mainForm").valid() && table.length > 0) {
            var tranDetail = [];
            for (var i = 0; i < table.length; i++) {
                var detail = {
                    Id: table[i].id,
                    FK_StItemId: table[i].fK_StItemId,
                    ItemName: table[i].itemName,
                    CashPrice: table[i].cashPrice,
                    ContractPrice: table[i].contractPrice,
                    InsurancePrice: table[i].insurancePrice
                }
                tranDetail.push(detail);
            }
            var tran = {
                Id: $("#Id").val(),
                PriceListCode: $("#PriceListCode").val(),
                PriceListNameAr: $("#PriceListNameAr").val(),
                PriceListNameEn: $("#PriceListNameEn").val(),
                DateFrom: $("#DateFrom").val(),
                DateTo: $("#DateTo").val(),
                Description: $("#Description").val(),
                IsActive: $('input[type=radio][name=IsActive]:checked').val(),
                details: tranDetail
            }

            $.ajax({
                url: '/InsurancePriceList/Edit',
                type: 'POST',
                data: { insurancePriceListVM: tran },
                success: function (result) {
                    if (result > 0) {
                        swal({
                            title: Resources.SavedSuccessfullyResource,
                            confirmButtonText: Resources.DoneResource,
                            type: "success"
                        });

                        window.location = "../../InsurancePriceList/index"
                    } else {
                        swal({
                            title: Resources.ErrorMsgResource,
                            confirmButtonText: Resources.DoneResource,
                            type: "error"
                        });
                    }
                }
            })
        }
    })
}) 
