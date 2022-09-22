$(document).ready(function () {
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

    $("#QuantityFrom").change(function () {
        if ($("#QuantityFrom").val() > 0 && $("#UnitSalesPrice").val() > 0) {

            $("#TotalItemSalsePrice").val($("#UnitSalesPrice").val() * $("#QuantityFrom").val())
        }
    })
    $("#UnitSalesPrice").change(function () {
        if ($("#QuantityFrom").val() > 0 && $("#UnitSalesPrice").val() > 0) {

            $("#TotalItemSalsePrice").val($("#UnitSalesPrice").val() * $("#QuantityFrom").val())
        }
    })
    $
    //$("#btnBillSearch").click(function () {
    //    loadBill();
    //})
    function loadBill() {
        $.ajax({
            url: '/StTransaction/GetBillForBranchReturn?id=' + $("#returnedSerial").val(),
            success: function (bill) {
                if (bill != null) {
                    $("#FK_StTransactionId").val(bill.id);
                    $("#returnedSerialhd").val($("#returnedSerial").val())
                    $("#returnedBillDate").val(bill.transactionDate.substring(0, 10));
                    loadBillDetails();
                } else {
                    swal({
                        title: Resources.InvalidBillNumber,
                        confirmButtonText: Resources.DoneResource,
                        type: "error"
                    });
                    loadBillDetails();
                }

            }
        })
    }
    //loadBillDetails();
    function loadBillDetails() {
        var billgrid = $("#returnBranchBillGrid").kendoGrid({
            excel: {
                fileName: "Return Store Details.xlsx",
                allPages: Resources.GridAllPages,
                filterable: Resources.GridFilterable
            },
            dataSource: {
                transport: {
                    read: "/StTransaction/GetReturnBranchDetails?id=" + $("#FK_StTransactionId").val() + "&RBId=" + $("#Id").val()
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
                            quantityFrom: { type: "string" },
                            unitSalesPrice: { type: "string" },
                            totalSalsePrice: { type: "string" },
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
                { field: "itemBarcode", title: Resources.Code, width: Resources.CodeWidth },
                { field: "itemName", title: Resources.ItemName, width: Resources.NameWidth },
                { field: "quantityFrom", title: Resources.Quantity, width: Resources.InputNumberWidth },
                { field: "unitSalesPrice", title: Resources.UnitSalesPrice, width: Resources.InputNumberWidth },
                { field: "totalSalsePrice", title: Resources.Total, width: Resources.InputNumberWidth }
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

        $("#returnBranchBillGrid").data("kendoGrid").table.on("click", ".row-checkbox", selectRow);

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
        //billgrid.table.on("click", ".row-checkbox", selectRow);
    }
    $("#btnItemBillSearch").click(function () {
        $.ajax({
            url: '/StTransaction/GetBillForBranchReturn?id=' + $("#inputBillNumber").val(),
            success: function (bill) {
                if (bill != null) {
                    $("#inputBillNumberhd").val($("#inputBillNumber").val())
                    items = bill.details;
                    var options = '<option value="">' + Resources.SelectOne + '</option>'
                    if (items != null) {
                        $("#inputBillDate").val(bill.transactionDate.substring(0, 10));
                        for (var i = 0; i < items.length; i++) {
                            options += '<option value="' + items[i].fK_StItemId + '">' + items[i].itemName + '</options>'
                        }
                    }

                    $("#FK_StItemId").html(options)
                } else {
                    swal({
                        title: Resources.InvalidBillNumber,
                        confirmButtonText: Resources.DoneResource,
                        type: "error"
                    });
                }

            }
        });
    })

    function LoadReturnItem() {
        tempSource = new kendo.data.DataSource({

            transport: {
                read: {
                    url: "/StTransaction/GetReturnBranchDetails?id=" + $("#Id").val(),
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
        var returnItemgrid = $("#returnItemGrid").kendoGrid({
            excel: {
                fileName: "Return Store Details.xlsx",
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
                { field: "itemBarcode", title: Resources.Code, width: Resources.CodeWidth },
                { field: "itemName", title: Resources.ItemName, width: Resources.NameWidth },
                { field: "quantityFrom", title: Resources.Quantity, width: Resources.InputNumberWidth },
                { field: "unitPurchasePrice", title: Resources.UnitPurchasePrice, width: Resources.InputNumberWidth, hidden: true },
                { field: "unitSalesPrice", title: Resources.UnitSalesPrice, width: Resources.InputNumberWidth },
                { field: "unitCostPrice", title: Resources.UnitCostPrice, width: Resources.InputNumberWidth, hidden: true },
                { field: "totalSalsePrice", title: Resources.Total, width: Resources.InputNumberWidth },
                { field: "returnFromSerial", hidden: true },
                { field: "returnFromDate", hidden: true },
                { width: Resources.ActionWidth, template: "<a  class='btn btn-danger btn-sm btnDelete' ><i class='fas fa-trash-alt'></i></a>" }
            ],
            editable: false,
            selectable: "multiple, cell",
            dataBound: function (e) {
                e.sender.items().each(function () {
                    var dataItem = e.sender.dataItem(this);
                    kendo.bind(this, dataItem);

                });

            }

        });
        returnItemgrid.data("kendoGrid").table.on("click", ".btnDelete", removeRow);
    }

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
            UnitSalesPrice = $("#UnitSalesPrice").val(),
            TotalItemSalsePrice = $("#TotalItemSalsePrice").val(),
            ReturnFromDate = $("#inputBillDate").val(),
            ReturnFromSerial = $("#inputBillNumberhd").val().split("-")[1];
        
        if (FK_StItemId > 0 && QuantityFrom > 0 && UnitSalesPrice > 0 && TotalItemSalsePrice > 0 && ReturnFromSerial > 0) {
            var quantity = 0;
            var table = $("#returnItemGrid").data("kendoGrid").dataSource.data();
            for (var i = 0; i < table.length; i++) {
                if (table[i].fK_StItemId == FK_StItemId)
                    quantity += parseFloat(table[i].quantityFrom);
            }
            $.ajax({
                url: "/StTransaction/CheckItemBalance?itemId=" + FK_StItemId + "&&stockId=" + $("#FK_StStoreFromId").val() + "&&quantity=" + quantity,
                success: function (result) {
                    result -= quantity;
                    if (result >= QuantityFrom) {
                        var totalRecords = $("#returnItemGrid").data("kendoGrid").dataSource.data().length;
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
                            unitSalesPrice: UnitSalesPrice,
                            totalSalsePrice: TotalItemSalsePrice,
                            returnFromDate: ReturnFromDate,
                            returnFromSerial: ReturnFromSerial
                        });

                        // set total 
                        var TotalItemCount = $("#TotalItemCount").val(),
                            TotalSalesPrice = $("#TotalSalesPrice").val();


                        if (TotalItemCount > 0) {
                            $("#TotalItemCount").val(parseFloat(TotalItemCount) + parseFloat(QuantityFrom))
                        } else {
                            $("#TotalItemCount").val(parseFloat(QuantityFrom))
                        }

                        if (TotalSalesPrice > 0) {
                            $("#TotalSalesPrice").val(parseFloat(TotalSalesPrice) + (parseFloat(UnitSalesPrice) * parseFloat(QuantityFrom)))
                        } else {
                            $("#TotalSalesPrice").val(parseFloat(UnitSalesPrice) * parseFloat(QuantityFrom))
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
            } else if (isNaN(UnitSalesPrice) || UnitSalesPrice <= 0) {
                swal({
                    title: Resources.EnterRequiredResource + " " + Resources.UnitSalesPrice,
                    confirmButtonText: Resources.DoneResource,
                    type: "error"
                });
                //
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


    function removeRow() {

        var row = $(this).closest("tr"),
            grid = $("#returnItemGrid").data("kendoGrid"),
            dataItem = grid.dataItem(row);
        swal({
            title: Resources.DeleteItemQuantityConfirmResource,
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
                if (dataSource._data.length > 1) {
                    if (dataItem.id != "" && dataItem.id != null) {
                        setTimeout(function () {
                            $.ajax({
                                url: "/StTransaction/DeleteReturnBranchDetail?id=" + dataItem.id,
                                type: "Get",
                                contentType: 'application/json; charset=utf-8',
                                success: function (result) {

                                }
                            });
                        });
                    }

                    if (dataSource.remove(dataItem)) {
                        swal({
                            title: Resources.DeleteSuccessResource,
                            confirmButtonText: Resources.DoneResource,
                            type: "success"
                        });

                        var QuantityFrom = dataItem.quantityFrom,
                            UnitSalesPrice = dataItem.unitSalesPrice;
                        // set total 
                        var TotalItemCount = $("#TotalItemCount").val(),
                            TotalSalesPrice = $("#TotalSalesPrice").val();


                        $("#TotalItemCount").val(parseFloat(TotalItemCount) - parseFloat(QuantityFrom))

                        $("#TotalSalesPrice").val(parseFloat(TotalSalesPrice) - (parseFloat(UnitSalesPrice) * parseFloat(QuantityFrom)))

                    }
                    else {
                        swal({
                            title: Resources.DeleteFailedResource,
                            confirmButtonText: Resources.DoneResource,
                            type: "error"
                        });
                    }
                } else {
                    if (hasRoleDelete) {
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
                                $.ajax({
                                    url: "/StTransaction/DeleteReturnBranch?Id=" + $("#Id").val(),
                                    type: "Get",
                                    contentType: 'application/json; charset=utf-8',
                                    success: function (result) {
                                        debugger;
                                        if (result) {

                                            swal({
                                                title: Resources.DeleteSuccessResource,
                                                confirmButtonText: Resources.DoneResource,
                                                type: "success"
                                            });
                                            document.location = "../../StTransaction/IndexReturnBranch"
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

                            }, 1000);
                        });
                    } else {
                        swal({
                            title: Resources.DeleteBillUnAuthorizeResource,
                            confirmButtonText: Resources.DoneResource,
                            type: "error"
                        });
                    }
                   
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

        $("#UnitPurchasePrice").val(0);
        $("#UnitSalesPrice").val(0);
        $("#UnitCostPrice").val(0);

        $("#TotalItemSalsePrice").val(0);
        $("#FK_StColorId").html("");
        $("#FK_StSizeId").html("");
    }

    $("#btnSaveTransaction").click(function () {
        if ($("#SerialNumber").val() > 0) {
            $("#SerialNumberValid").text("")
        } else {
            $("#SerialNumberValid").text(Resources.Required)
        }
        var returnType = $('input[type=radio][name=returnType]:checked').val();
        if (returnType == 'bill') {
            saveReturnBill();
        } else {
            saveReturnItem();
        }

    })
    function saveReturnBill() {
        debugger
        var table = [];
        var gridData = $("#returnBranchBillGrid").data("kendoGrid").dataSource._data;
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
                    TotalCostPrice: gridData[i].unitCostPrice * gridData[i].quantityFrom,
                    TotalSalsePrice: gridData[i].totalSalsePrice,
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
        if ($("#mainForm").valid() && $("#SerialNumber").val() > 0 && table.length > 0) {

            var tran = {
                Id: $("#Id").val(),
                //SerialNumber: $("#SerialNumber").val(),
                //BookNumber: $("#returnedSerialhd").val().split("-")[1],
                //FK_StStoreFromId: $("#FK_StStoreFromId").val(),
                //FK_StStoreToId: $("#FK_StStoreToId").val(),
                //TransactionDate: $("#TransactionDate").val(),
                TotalItemCount: $("#TotalItemCount").val(),
                TotalSalesPrice: $("#TotalSalesPrice").val(),
                hdnAttachmentIds: $("#hdnAttachmentIds").val(),
                details: table
            }
            debugger
            $.ajax({
                url: '/StTransaction/EditReturnBranch',
                type: 'POST',
                data: { addEditReturnBranchVM: tran },
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
                                document.location = "../../StTransaction/IndexReturnBranch"
                            }, 1000);
                        });

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
        if ($("#mainForm").valid() && $("#SerialNumber").val() > 0 && table.length > 0) {
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
                    UnitSalesPrice: table[i].unitSalesPrice,
                    TotalSalsePrice: table[i].totalSalsePrice,
                    ReturnFromSerial: table[i].returnFromSerial,
                    ReturnFromDate: table[i].returnFromDate
                }
                tranDetail.push(detail);
            }
            var tran = {
                Id: $("#Id").val(),
                //SerialNumber: $("#SerialNumber").val(),
                //FK_StStoreFromId: $("#FK_StStoreFromId").val(),
                //FK_StStoreToId: $("#FK_StStoreToId").val(),
                //TransactionDate: $("#TransactionDate").val(),
                TotalItemCount: $("#TotalItemCount").val(),
                TotalSalesPrice: $("#TotalSalesPrice").val(),
                hdnAttachmentIds: $("#hdnAttachmentIds").val(),
                details: tranDetail
            }

            $.ajax({
                url: '/StTransaction/EditReturnBranch',
                type: 'POST',
                data: { addEditReturnBranchVM: tran },
                success: function (result) {
                    if (result > 0) {
                        swal({
                            title: Resources.SavedSuccessfullyResource,
                            confirmButtonText: Resources.DoneResource,
                            type: "success"
                        }, function () {
                            setTimeout(function () {
                                document.location = "../../StTransaction/IndexReturnBranch"
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

    $(".btnExport").on('click', function () {
        var returnType = $('input[type=radio][name=returnType]:checked').val();

        if (returnType == 'bill')
            $("#returnBranchBillGrid").getKendoGrid().saveAsExcel();
        else
            $("#returnItemGrid").getKendoGrid().saveAsExcel();

    });
    $(".btnPrint").on('click', function () {
        var url = "/StTransaction/PrintReturnBranch?id=" + $("#Id").val();
        window.open(url, '_blank');
    });
})

//var checkedIds = {};

//on click of the checkbox:
function selectRow() {
    var checked = this.checked,
        thischk = this,
        row = $(this).closest("tr"),
        grid = $("#returnBranchBillGrid").data("kendoGrid"),
        dataItem = grid.dataItem(row)
        itemName="";

    if (checked) {
        var quantity = 0;
        var table = $("#returnBranchBillGrid").data("kendoGrid").dataSource.data();
        for (var i = 0; i < table.length; i++) {
            if (table[i].fK_StItemId == dataItem.fK_StItemId && checkedIds[table[i].id] == true) {
                quantity += parseFloat(table[i].quantityFrom);
                itemName = table[i].itemName;
            }                

        }
        $.ajax({
            url: "/StTransaction/CheckItemBalance?itemId=" + dataItem.fK_StItemId + "&&stockId=" + $("#FK_StStoreFromId").val() + "&&quantity=" + quantity,
            success: function (result) {
                result -= quantity;
                if (result >= dataItem.quantityFrom) {

                    checkedIds[dataItem.id] = checked;
                    row.addClass("k-state-selected");
                    var checkHeader = true;
                    $.each(grid.items(), function (index, item) {
                        if (!($(item).hasClass("k-state-selected"))) {
                            checkHeader = false;
                        }
                    });

                    $("#header-chb")[0].checked = checkHeader;
                    var gridData = $("#returnBranchBillGrid").data("kendoGrid").dataSource._data;
                    var quantity1 = 0;
                    var total = 0;
                    for (var i = 0; i < gridData.length; i++) {

                        if (checkedIds[gridData[i].id]) {
                            quantity1 += parseFloat(gridData[i].quantityFrom);
                            total += parseFloat(gridData[i].totalSalsePrice);
                        }
                    }

                    $("#TotalItemCount").val(quantity1);
                    $("#TotalSalesPrice").val(total);
                } else {
                    swal({
                        title: Resources.MaxItemAllowedQuantity + " " + itemName + " ( " + result + " )",
                        confirmButtonText: Resources.DoneResource,
                        type: "error"
                    });
                    if (checked)
                        thischk.checked = false;

                }
            }
        });
    } else {
        //-remove selection
        var itemChecked=0
        var gridData = $("#returnBranchBillGrid").data("kendoGrid").dataSource._data;
        for (var i = 0; i < gridData.length; i++) {

            if (checkedIds[gridData[i].id]) {
                itemChecked++;
            }
        }
        if (itemChecked>1) {
            if (dataItem.id != "" && dataItem.id != null) {
                setTimeout(function () {
                    $.ajax({
                        url: "/StTransaction/DeleteReturnBranchDetail?id=" + dataItem.id,
                        type: "Get",
                        contentType: 'application/json; charset=utf-8',
                        success: function (result) {

                        }
                    });
                });
            }
            checkedIds[dataItem.id] = checked;
            row.removeClass("k-state-selected");
            $("#header-chb")[0].checked = false;

            var total = parseFloat($("#TotalSalesPrice").val());
            var totalquantity = parseFloat($("#TotalItemCount").val());

            totalquantity -= parseFloat(dataItem.quantityFrom);
            total -= parseFloat(dataItem.totalSalsePrice);

            $("#TotalItemCount").val(totalquantity);
            $("#TotalSalesPrice").val(total);
        } else {
            swal({
                title: Resources.GridLengthZeroResource ,
                confirmButtonText: Resources.DoneResource,
                type: "error"
            });
        }
        
    }

}