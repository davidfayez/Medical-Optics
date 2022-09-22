$(document).ready(function () {

    $("#FK_StMainCategoryId").change(function () {
        if ($("#FK_StMainCategoryId").val() > 0) {
            $.ajax({
                url: '/StLookups/GetAllStItemByMainCategory?id=' + $("#FK_StMainCategoryId").val(),
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
                    $("#FK_StUnitId").val(item.fK_StUnitId);
                    $("#ItemCode").val(item.itemCode);
                }
            })
        }
    })

    var tempSource = new kendo.data.DataSource({

    });

    var purOrderDetail = $("#purOrderDetailGrid").kendoGrid({
        dataSource: tempSource,
        navigatable: true,
        pageable: false,
        scrollable: false,
        columns: [
            { field: "FK_StItemId", hidden: true },
            { field: "FK_StUnitId", hidden: true },
            { field: "FK_StMainCategoryId", hidden: true },
            { field: "ItemName", title: Resources.ItemName, width: Resources.NameWidth },
            { field: "ItemCode", title: Resources.Code, width: Resources.CodeWidth },
            { field: "ItemUnit", title: Resources.Unit, width: Resources.NameWidth },
            { field: "Quantity", title: Resources.Quantity, width: Resources.InputNumberWidth },
            { width: Resources.ActionWidth, template: "<a  class='btn btn-danger btn-sm btnDelete' ><i class='fas fa-trash-alt'></i></a>" }
        ],
        editable: false,
        selectable: "multiple, cell",


    });
    $("#btnAddNewDetail").on('click', function () {

        var FK_StItemId = $("#FK_StItemId").val(),
            FK_StMainCategoryId = $("#FK_StMainCategoryId").val(),
            FK_StUnitId = $("#FK_StUnitId").val(),
            ItemName = $("#FK_StItemId option:selected").text(),
            ItemCode = $("#ItemCode").val(),
            ItemUnit = $("#FK_StUnitId option:selected").text(),

            Quantity = $("#Quantity").val();
        if (FK_StItemId == null || FK_StItemId == "") {
            ItemName = $("#NewItemName").val().trim();
            FK_StMainCategoryId = null;
        }

        debugger
        if (((FK_StItemId != null && FK_StItemId != "") || ItemName != "") && Quantity != "" && FK_StUnitId != "") {

            var totalRecords = $("#purOrderDetailGrid").data("kendoGrid").dataSource.data().length;
            var Index = parseInt($("#Index").val());
            debugger
            if (!isNaN(Index))
                totalRecords = Index - 1;
            tempSource.insert(totalRecords, {
                FK_StMainCategoryId: FK_StMainCategoryId,
                FK_StItemId: FK_StItemId,
                FK_StUnitId: FK_StUnitId,
                ItemName: ItemName,
                ItemCode: ItemCode,
                ItemUnit: ItemUnit,
                Quantity: Quantity,
            });

            ClearFormDetails();

        }
        else {
            debugger
            if ((FK_StItemId == null || FK_StItemId <= 0) && ItemName == "") {

                swal({
                    title: Resources.EnterRequiredResource + " " + Resources.ItemName,
                    confirmButtonText: Resources.DoneResource,
                    type: "error"
                });
            }
            else if (FK_StUnitId == "") {

                swal({
                    title: Resources.EnterRequiredResource + " " + Resources.Unit,
                    confirmButtonText: Resources.DoneResource,
                    type: "error"
                });
            }
            else if (Quantity == "") {
                swal({
                    title: Resources.EnterRequiredResource + " " + Resources.Quantity,
                    confirmButtonText: Resources.DoneResource,
                    type: "error"
                });
            }

        }


    });
    purOrderDetail.data("kendoGrid").table.on("click", ".btnDelete", removeRow);
    var thisRow = "";

    function removeRow() {

        var row = $(this).closest("tr"),
            grid = $("#purOrderDetailGrid").data("kendoGrid"),
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
                var dataSource = $("#purOrderDetailGrid").data("kendoGrid").dataSource;

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
        $("#ItemCode").val("");
        $("#Quantity").val(null);
        $("#ItemUnit").val("");
        $("#FK_StUnitId").val("");
        $("#NewItemName").val("");
        $("#FK_StMainCategoryId").val("")
    }

    $("#btnSaveOrder").click(function () {
        debugger
        var table = $("#purOrderDetailGrid").data("kendoGrid").dataSource.data();
        if (table.length == 0) {
            swal({
                title: Resources.GridLengthZeroResource,
                confirmButtonText: Resources.DoneResource,
                type: "error"
            });

        }
        if ($("#createForm").valid() && $("#SerialNumber").val() > 0 && $("#FK_HrEmployeeId").val() > 0 && table.length > 0) {
            var detail = [];
            for (var i = 0; i < table.length; i++) {
                var NewItemName = null;
                if (table[i].FK_StItemId == null || table[i].FK_StItemId == "")
                    NewItemName = table[i].ItemName;
                var detailData = {
                    FK_StMainCategoryId: table[i].FK_StMainCategoryId,
                    FK_StItemId: table[i].FK_StItemId,
                    FK_StUnitId: table[i].FK_StUnitId,
                    Quantity: table[i].Quantity,
                    NewItemName: NewItemName,

                }
                debugger
                detail.push(detailData);
            }

            var pur = {
                SerialNumber: $("#SerialNumber").val(),
                FK_HrEmployeeId: $("#FK_HrEmployeeId").val(),
                FK_HrDepartmentId: $("#FK_HrDepartmentId").val(),
                OrderDate: $("#OrderDate").val(),
                PurchaseOrderDetail: detail
            }
            debugger
            $.ajax({
                url: '/PurchaseOrder/Create',
                type: 'POST',
                data: { purchaseOrderVM: pur },
                success: function (result) {
                    if (result) {
                        swal({
                            title: Resources.SavedSuccessfullyResource,
                            confirmButtonText: Resources.DoneResource,
                            type: "success"
                        });
                        document.location = "../../PurchaseOrder/Index";
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