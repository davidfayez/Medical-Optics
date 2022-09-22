$(document).ready(function () {
   

    loadPayRepaymentCancelGrid();

    function loadPayRepaymentCancelGrid() {
        var dataSource = new kendo.data.DataSource({
            transport: {
                read: {
                    url: "/PayRepayment/GetAll",
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
                        isActive: { editable: true },
                        id: { editable: false },
                        serial: { editable: false },
                        paySupplierName: { editable: false },
                        payBondSerial: { editable: false },
                        payBondDate: { type: "date", editable: false },
                        bondTotalAmount: { editable: false },
                    }
                }
            }
        });


        var grid = $("#GridPayRepaymentCancellation").kendoGrid({
            excel: {
                fileName: "Supplier Opening Balances.xlsx",
                allPages: true,
                filterable: true
            },
            dataSource: dataSource,
            pageSize: 20,
            serverPaging: true,
            serverFiltering: true,
            filterable: true,
            height: 550,
            groupable: true
            ,
            sortable: true,
            resizable: true,
            noRecords: true,
            messages: {
                noRecords: "There is no data on current page"
            },
            pageable: {
                pageSizes: [10, 20, 50, Resources.All],
                numeric: true,
                refresh: true

            },
            columns: [
                { width: Resources.CheckboxWidth, template: "<input type='checkbox' data-bind='checked:isActive' class='control-label i-check' />", headerTemplate: Resources.Status },
                //{ width: "150px", template: "<div class='custom-control custom-checkbox my-1 mr-sm-2'><input type='checkbox' data-bind='checked:isActive' class='custom-control-input' id='customControlInline5' /><label class='custom-control-label' for='customControlInline5></label></div>", headerTemplate: resources.status },
                { field: "serial", title: Resources.BondSerialResource, width: Resources.CodeWidth },
                { field: "paySupplierName", title: Resources.SupplierNameResource, width: Resources.NameWidth },
                { field: "payBondSerial", title: Resources.PayBondSerialResource, width: Resources.CodeWidth },
                {
                    field: "payBondDate", title: Resources.BondDateResource, format: "{0:yyyy/MM/dd}", width: Resources.DateWidth,
                    filterable: {
                        operators: {
                            date: {
                                gte: Resources.IsAfterOrEqualTo,
                                lte: Resources.IsBeforeOrEqualTo
                            }
                        },
                        extra: false,
                        ui: function (element) {
                            element.kendodatepicker({
                                format: '{0: dd/mm/yyyy}'
                            })
                        }
                    }
                },
                { field: "bondTotalAmount", title: Resources.BondTotalAmountResource, width: Resources.AmountWidth }


            ],
            dataBound: function (e) {
                e.sender.items().each(function () {
                    var dataItem = e.sender.dataItem(this);
                    kendo.bind(this, dataItem);
                    if (dataItem.isActive) {
                        //$(this).addClass("k-state-selected");
                    }
                });
                ////debugger
                //if (!hasRoleEdit)
                //    $(".btnSaveRow").attr('disabled', 'disabled');

            }
        });

    }

    

});

function CancelRepayments() {

    var List = [];

    var gridData = $('#GridPayRepaymentCancellation').data("kendoGrid").dataSource.data();
    for (var i = 0; i < gridData.length; i++) {

        var data = {
            id: parseInt(gridData[i].id),
            isActive: gridData[i].isActive,
        };

        List.push(data);

    }

    if (gridData.length == 0) {
        swal({
            title: Resources.GridLengthZeroResource,
            confirmButtonText: Resources.DoneResource,
            type: "error"
        });
    }
    else {
        $.ajax({
            url: "/PayRepayment/Cancellation",
            type: "Post",
            cache: false,
            processData: false,
            data: JSON.stringify(List),
            contentType: 'application/json',
            success: function (result) {

                if (result) {

                    swal({
                        title: Resources.SavedSuccessfullyResource,
                        confirmButtonText: Resources.DoneResource,
                        type: "success"
                    });
                    //$('#GridPayRepaymentCancellation').data('kendoGrid').dataSource.read();
                }
                else {
                    swal({
                        title: Resources.DefaultErrorMessageResource,
                        confirmButtonText: Resources.DoneResource,
                        type: "error"
                    });
                }
            },
            error: function (err, xqr, txt) { }
        });
    }
};


$("#btnSearch").on('click', function () {

    var serial = parseInt($("#Serial").val());
    var dateFrom = $("#DateFrom").val();
    var dateTo = $("#DateTo").val();
    var fK_DefBranchId = parseInt($("#FK_DefBranchId").val());
    if (isNaN(serial))
        serial = null;

    $('#GridPayRepaymentCancellation').data('kendoGrid').dataSource.read({ serial: serial, dateFrom: dateFrom, dateTo: dateTo, fK_DefBranchId: fK_DefBranchId });

});

$(".exportExcel").on('click', function () {
    $("#GridPayRepaymentCancellation").getKendoGrid().saveAsExcel();
});
