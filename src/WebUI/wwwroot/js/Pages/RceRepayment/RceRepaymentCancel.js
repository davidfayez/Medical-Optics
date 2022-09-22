$(document).ready(function () {
    

    loadRceRepaymentCancelGrid();

    function loadRceRepaymentCancelGrid() {
        var dataSource = new kendo.data.DataSource({
            transport: {
                read: {
                    url: "/RceRepayment/GetAll",
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
                        rceClientName: { editable: false },
                        rceBondSerial: { editable: false },
                        rceBondDate: { type: "date", editable: false },
                        bondTotalAmount: { editable: false },
                    }
                }
            }
        });


        var grid = $("#GridRceRepaymentCancellation").kendoGrid({
            excel: {
                fileName: "Client Opening Balances.xlsx",
                allPages: Resources.GridAllPages,
                filterable: Resources.GridFilterable
            },
            dataSource: dataSource,
            pageSize: 20,
            serverPaging: Resources.GridServerPaging,
            serverFiltering: Resources.GridServerFiltering,
            filterable: Resources.GridFilterable,
            height: Resources.GridHeight,
            groupable: Resources.GridGroupable
            ,
            sortable: Resources.GridSortable,
            resizable: Resources.GridResizable,
            noRecords: Resources.GridNoRecords,
            messages: {
                noRecords: Resources.GridNoRecordsMessage
            },
            pageable: {
                pageSizes: [10, 20, 50, Resources.All],
                numeric: Resources.GridNumeric,
                refresh: Resources.GridRefresh,

            },
            columns: [
                { width: "90px", template: "<input type='checkbox' data-bind='checked:isActive' class= 'control-label i-check' />", headerTemplate: Resources.Status },
                //{ width: "150px", template: "<div class='custom-control custom-checkbox my-1 mr-sm-2'><input type='checkbox' data-bind='checked:isActive' class='custom-control-input' id='customControlInline5' /><label class='custom-control-label' for='customControlInline5></label></div>", headerTemplate: resources.status },
                { field: "serial", title: Resources.BondSerialResource, width: Resources.CodeWidth },
                { field: "rceClientName", title: Resources.ClientNameResource, width: Resources.NameWidth },
                { field: "rceBondSerial", title: Resources.PayBondSerialResource, width: Resources.CodeWidth },
                {
                    field: "rceBondDate", title: Resources.BondDateResource, format: "{0:yyyy/MM/dd}", width: Resources.DateWidth,
                    filterable: {
                        operators: {
                            date: {
                                gte: Resources.Isafterorequalto,
                                lte: Resources.Isbeforeorequalto
                            }
                        },
                        extra: false,
                        ui: function (element) {
                            element.kendodatepicker({
                                format: '{0: dd/MM/yyyy}'
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

    var gridData = $('#GridRceRepaymentCancellation').data("kendoGrid").dataSource.data();
    for (var i = 0; i < gridData.length; i++) {

        var data = {
            id: parseInt(gridData[i].id),
            isActive: gridData[i].isActive,
        };

        List.push(data);

    }

    if (gridData.length == 0) {
        swal({
            title: Resources.GridLengthZeroChooseResource,
            confirmButtonText: Resources.DoneResource,
            type: "error"
        });
    }
    else {
        $.ajax({
            url: "/RceRepayment/Cancellation",
            type: "Post",
            cache: false,
            processData: false,
            data: JSON.stringify(List),
            contentType: 'application/json',
            success: function (result) {

                if (result) {

                    swal({
                        title: Resources.SavedSuccessfullyResource,
                        confirmButtonText: Resources.DoneResource ,
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
    var branchId = parseInt($("#FK_DefBranchId").val());
    if (isNaN(serial))
        serial = null;

    $('#GridRceRepaymentCancellation').data('kendoGrid').dataSource.read({ serial: serial, dateFrom: dateFrom, dateTo: dateTo, branchId: branchId });

});

$(".exportExcel").on('click', function () {
    $("#GridRceRepaymentCancellation").getKendoGrid().saveAsExcel();
});