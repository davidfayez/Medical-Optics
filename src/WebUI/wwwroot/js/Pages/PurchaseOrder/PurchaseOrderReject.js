$(document).ready(function () {

    tempSource = new kendo.data.DataSource({
        transport: {
            read: {
                url: "/PurchaseOrder/GetDetailsById?id=" + $("#Id").val(),
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
                    id: { editable: true },
                    fK_StMainCategoryId: { editable: false },
                    fK_StItemId: { editable: false },
                    fK_StUnitId: { editable: false },
                    itemCode: { type: "text", editable: false },
                    itemName: { type: "text", editable: false },
                    itemUnit: { type: "text", editable: false },
                    quantity: { type: "number", editable: false },

                }
            }
        }
    });

    var purOrderDetail = $("#rejectDetailsPOGrid").kendoGrid({
        dataSource: tempSource,
        navigatable: true,
        pageable: false,
        scrollable: false,
        columns: [
            { field: "fK_StItemId", hidden: true },
            { field: "fK_StUnitId", hidden: true },
            { field: "fK_StMainCategoryId", hidden: true },
            { field: "itemName", title: Resources.ItemName, width: Resources.NameWidth },
            { field: "itemCode", title: Resources.Code, width: Resources.CodeWidth },
            { field: "itemUnit", title: Resources.Unit, width: Resources.NameWidth },
            { field: "quantity", title: Resources.Quantity, width: Resources.InputNumberWidth },
        ],
        editable: false,
        selectable: "multiple, cell",


    });


    $("#btnReject").click(function () {
        var id = $("#Id").val(),
            reason = $("#reasonForRejection").val().trim();
        if (reason == "") {
            swal({
                title: Resources.EnterRequiredResource + " " + Resources.ReasonForRejection,
                confirmButtonText: Resources.DoneResource,
                type: "error"
            });
        }
        else if (id > 0) {
            swal({
                title: Resources.Reject,
                text: Resources.RejectMessage,
                type: "info",
                showCancelButton: true,
                confirmButtonText: Resources.Reject,
                cancelButtonText: Resources.CancelResource,
                closeOnConfirm: false,
                showLoaderOnConfirm: true
            }, function () {
                setTimeout(function () {

                    $.ajax({
                        url: '/PurchaseOrder/Reject',
                        type: 'POST',
                        data: { id: id, reason: reason },
                        success: function (result) {
                            if (result) {
                                swal({
                                    title: Resources.DoneResource,
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

                }, 3000);
            });

        }
        else {
            swal({
                title: Resources.ErrorMsgResource,
                confirmButtonText: Resources.DoneResource,
                type: "success"
            });
        }
    })
}) 