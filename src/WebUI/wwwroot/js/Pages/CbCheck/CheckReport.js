$(document).ready(function () {

    
    LoadGridCheck();
    function LoadGridCheck() {
        var grid = $("#CbCheckList").kendoGrid({
            excel: {
                fileName: "CbCheck.xlsx",
                allPages: true,
                filterable: true
            },
            dataSource: {
                transport: {
                    read: "/CbCheck/GetAllCheckReport"
                },
                schema: {
                    model: {
                        id: "id",
                        fields: {
                            checkNumber: { type: "string" },
                            fK_GlFinancialPeriodId: { type: "string" },
                            fK_DefCurrencyId: { type: "string" },
                            amount: { type: "string" },
                            movementType: { type: "string" },
                            isActive: { editable: false },
                            //fK_CbAccountTypeId: { type: "string" },
                            //address: { type: "string" },
                            //website: { type: "string" },
                            //responsiblePerson: { type: "string" },
                            //fK_DefCurrencyId: { type: "string" },
                            //fK_GlAccountId: { type: "string" },
                            //fK_CbCreditMachineId: { type: "string" },
                            //fK_CbCheckFormEnglishId: { type: "string" },
                            //fK_CbCheckFormArabicId: { type: "string" },
                        }
                    }
                },
                pageSize: 30
            },
            height: 540,
            sortable: true,
            reorderable: true,
            groupable: true,
            resizable: true,
            filterable: true,
            columnMenu: true,
            noRecords: true,
            messages: {
                noRecords: "There is no data on current page"
            },
            pageable: true,
            columns: [{
                field: "checkNumber",
                title: Resources.CheckNumber,
                width: 250
            }, {
                field: "fK_GlFinancialPeriodId",
                    title: Resources.FinancialPeriodName,
                width: 150
            }, {
                field: "fK_DefCurrencyId",
                    title: Resources.Currency,
                width: 150
                }, {
                    field: "amount",
                    title: Resources.Amount,
                    width: 150
                },
                {
                field: "movementType",
                    title: Resources.MovementType,
                width: 150
            }
            ],
            dataBound: function (e) {
                e.sender.items().each(function () {
                    var dataItem = e.sender.dataItem(this);
                    kendo.bind(this, dataItem);
                    if (dataItem.isActive) {
                        // $(this).addClass("k-state-selected");
                    }
                });
            }
        });
        grid.data("kendoGrid").table.on("click", ".btnDelete", removeAccount);
    }
    function removeAccount() {

        var row = $(this).closest("tr"),
            grid = $("#CbCheckList").data("kendoGrid"),
            dataItem = grid.dataItem(row);
        swal({
            title: Resources.DeleteResource,
            text:  Resources.DeleteConfirmResource,
            type: "info",
            showCancelButton: true,
            confirmButtonText: Resources.DeleteResource,
            cancelButtonText:  Resources.CancelResource,
            closeOnConfirm: false,
            showLoaderOnConfirm: true
        }, function () {
            setTimeout(function () {
                $.ajax({
                    url: "/CbCheck/Delete?id=" + dataItem.id,
                    type: "Get",
                    contentType: 'application/json; charset=utf-8',
                    success: function (result) {
                        debugger;
                        if (result) {
                            LoadGridVoucher();
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
                    },
                    error: function (err, xqr, txt) { }
                });

            }, 3000);
        });
    }
    $("#btnDataReview").on('click', function () {
        debugger;
        var dateFrom = $("#DateFrom").val(),
            dateTo = $("#DateTo").val(),
            checkNumber = $("#CheckNumber").val(),
            currencyID = $("#FK_DefCurrencyId").val(), 
            isPosted = $('input[name="Posting"]:checked').val();
        var fK_DefBranchId = parseInt($("#FK_DefBranchId").val());

        $('#CbCheckList').data('kendoGrid').dataSource.read({ dateFrom: dateFrom, dateTo: dateTo, checkNumber: checkNumber, currencyID: currencyID, isPosted: isPosted, fK_DefBranchId: fK_DefBranchId});
    });
});

$(".exportExcel").on('click', function () {
    $("#CbCheckList").getKendoGrid().saveAsExcel();
});


$(".btnPrint").on('click', function () {
    var dateFrom = $("#DateFrom").val(),
        dateTo = $("#DateTo").val(),
        checkNumber = $("#CheckNumber").val(),
        currencyID = $("#FK_DefCurrencyId").val(),
        isPosted = $('input[name="Posting"]:checked').val();
    var fK_DefBranchId = parseInt($("#FK_DefBranchId").val());

    var url = "/CbCheck/CheckReportPrint?&dateFrom=" + dateFrom + "&dateTo=" + dateTo + "&checkNumber=" + checkNumber + "&currencyID=" + currencyID + "&isPosted=" + isPosted + "&fK_DefBranchId=" + fK_DefBranchId;
    window.open(url, '_blank').print();
});