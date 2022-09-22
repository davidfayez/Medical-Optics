$(document).ready(function () {

    
    var currentDataItems = [];
    var datasource = new kendo.data.DataSource({
        transport: {
            read: "/PayRecurringBond/GetAllPayBond"
        },
        schema: {
            model: {
                id: "id",
                fields: {
                    serial: { type: "number" },
                    fK_CbPayTypeId: { type: "string" },
                    fK_DefCurrencyId: { type: "string" },
                    fK_CbCashAndBankAccountId: { type: "string" },
                    fK_GlFinancialPeriodId: { type: "string" },
                    totalAmount: { type: "number" },
                    isActive: { editable: false },
                }
            }
        },
        pageSize: 30
    });
    var Grid = $('#PayBondList').data('kendoGrid');
    $("#transferBonds").on('click', function () {
        var list = $("#BondList").data("kendoGrid");
        var grid = $('#PayBondList').data('kendoGrid');
        debugger;
        var data = grid.dataSource.data();
        var dataItems = grid.dataItems();
        //var l = dataItems.length;
        // Get selected rows
        var sel = $('input[type="checkbox"][name=choose]:checked', list.tbody).closest("tr");
        // Get data item for each
        var items = [];
        //if (dataItems.length == 0) {
            $.each(sel, function (idx, row) {
            var item = list.dataItem(row);
            items.push(item);
            });
        var res = items.filter(item1 =>
            !dataItems.some(item2 => (item2.id === item1.id )))

        debugger;
        console.log(items);
        $.merge(data, res);
        grid.dataSource.sync();
    });

    // Active In Edit
    $('input[type=radio][name=IsActive]').change(function () {
        if (this.value == "True") {
            $(".disabled-input").attr("disabled", "disabled");
            $("#FK_DefFreezingReasonId").val("");
            $("#FreezingNotes").val("");
        }
        else
            $(".disabled-input").removeAttr('disabled');
    });
    //Active In Edit
    var activeVal = $('input[name="IsActive"]:checked').val();
    if (activeVal == "False") {
        $(".disabled-input").removeAttr('disabled');
    }

    $('input[type=radio][name=Recurrence]').change(function () {
        switch (this.id) {
            case "EndDate":
                {
                    $("#NumberOfRecurrence").val(null);
                    break;
                }
        }
    });

    $("#PayBondType").kendoDropDownList({
        filter: "contains",
        height: 300,
        dataTextField: "text",
        dataValueField: "value",
        dataSource: {
            type: "json",
            //serverFiltering: true,
            transport: {
                read: {
                    url: "/PayRecurringBond/GetAllPayBondTypeForDDL",
                },
                parameterMap: function (data, action) {

                    if (action === "read") {
                        return {
                            //fK_DefBranchId: parseInt($("#FK_DefBranchId").val()),
                        };


                    } else {
                        return data;
                    }
                }
            }
        },
        //change: onSelectInvoiceType

    });

    $("#FK_GlFinancialPeriodId").kendoDropDownList({
        filter: "contains",
        height: 300,
        dataTextField: "text",
        dataValueField: "value",
        dataSource: {
            type: "json",
            //serverFiltering: true,
            transport: {
                read: {
                    url: "/PayRecurringBond/GetAllFinancialPeriodsForDDL",
                },
                parameterMap: function (data, action) {

                    if (action === "read") {
                        return {
                            //fK_DefBranchId: parseInt($("#FK_DefBranchId").val()),
                        };


                    } else {
                        return data;
                    }
                }
            }
        },
        //change: onSelectInvoiceType

    });

    LoadGridPayBond();
    function LoadGridPayBond() {
        var grid = $("#PayBondList").kendoGrid({
            excel: {
                fileName: "CbCheck.xlsx",
                allPages: Resources.GridAllPages,
                filterable: Resources.GridFilterable
            },
            dataSource: datasource,
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
            columns: [{
                field: "serial",
                title: Resources.Serial,
                width: 250
            }, {
                field: "fK_CbPayTypeId",
                    title: Resources.PayType,
                width: 150
            }, {
                field: "fK_DefCurrencyId",
                    title: Resources.Currency,
                width: 150
            }, {
                field: "fK_CbCashAndBankAccountId",
                    title: Resources.CashBankAccount,
                width: 150
            },
            {
                field: "fK_GlFinancialPeriodId",
                title: Resources.FinancialPeriodName,
                width: 150
            },
            {
                field: "totalAmount",
                title: Resources.Amount,
                width: 150
            },
                { width: "90px", template: "<input type='checkbox' data-bind='checked:isActive' class= 'control-label i-check' disabled = 'disabled' />", headerTemplate: Resources.Status },
            { width: "150px", template: "<a  href='/PayBond/Edit/#= id #'  class='btn btn-success btn-sm btnEdit'><i class='fas fa-edit'></i></a> <a  class='btn btn-danger btn-sm btnDelete' ><i class='fas fa-trash-alt'></i></a>" },

            ],
            dataBound: function (e) {
                //var items = e.sender.dataItems();
                //var grid = $('#PayBondList').data('kendoGrid');
                //var data = grid.dataSource.data();
                //var dataItems = grid.dataItems(); 
                //if (dataItems.length != 0) {
                //var res = dataItems.filter(item1 =>
                //        !currentDataItems.some(item2 => (item2.id === item1.id)))
                //    $.merge(datasource.data(), res);
                //    datasource.sync();
                //    e.preventDefault();
                // }
                e.sender.items().each(function () {
                    var dataItem = e.sender.dataItem(this);
                    $.merge(datasource.data(), dataItem);
                    kendo.bind(this, dataItem);
                    if (dataItem.isActive) {
                        //$(this).addClass("k-state-selected");
                    }
                });
            }
        });
        grid.data("kendoGrid").table.on("click", ".btnDelete", removeAccount);
    }
    function removeAccount() {

        var row = $(this).closest("tr"),
            grid = $("#PayBondList").data("kendoGrid"),
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
                var dataSource = $("#PayBondList").data("kendoGrid").dataSource;
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

            }, 3000);
        });
    }
    $("#btnDataReview").on('click', function () {
        debugger;
        var fK_GlFinancialPeriodId = $("#FK_GlFinancialPeriodId").val(),
            payBondType = $("#PayBondType").val(),
            fK_PayBondId = $("#PayBondSerial").val();

        $('#PayBondList').data('kendoGrid').dataSource.read({ payBondType: payBondType, fK_GlFinancialPeriodId: fK_GlFinancialPeriodId, fK_PayBondId: fK_PayBondId });
        datasource.sync();
        var grid = $('#PayBondList').data('kendoGrid');
        var data = grid.dataSource.data();
        currentDataItems = grid.dataItems(); 
    });

});

function saveRecurring() {
    var value = $('input[type=radio][name=Type]:checked').attr('id');

    debugger;
    var NumberOfRecurrence = parseInt($("#NumberOfRecurrence").val());
    var startDate = $("#RecurrenceStartDate").val();
    var ResultDate = new Date($("#RecurrenceStartDate").val());
    var EndDate = new Date($("#RecurrenceEndDate").val());
    var EveryNumberOfDays = parseInt($("#EveryNumberOfDays").val());
    switch (value) {
        case "IsDaily":
            {
                $("#IsDaily").val('true');
                $("#IsWeekly").val('false');
                $("#IsMonthly").val('false');
                $("#IsYearly").val('false');
                $("#EveryNumberOfDays").val(null);
                if (!isNaN(NumberOfRecurrence) && startDate != "") {
                    ResultDate.setDate(ResultDate.getDate() + NumberOfRecurrence);
                    EndDate = ResultDate;
                    $("#RecurrenceEndDate").text(EndDate.toDateString());

                }
                break;
            }
        case "IsWeekly":
            {
                $("#IsDaily").val('false');
                $("#IsWeekly").val('true');
                $("#IsMonthly").val('false');
                $("#IsYearly").val('false');
                $("#EveryNumberOfDays").val(null);
                if (!isNaN(NumberOfRecurrence) && startDate != "") {
                    ResultDate.setDate(ResultDate.getDate() + (NumberOfRecurrence * 7));
                    EndDate = ResultDate;
                    $("#RecurrenceEndDate").text(EndDate.toDateString());

                }
                break;
            }
        case "IsMonthly":
            {
                $("#IsDaily").val('false');
                $("#IsWeekly").val('false');
                $("#IsMonthly").val('true');
                $("#IsYearly").val('false');
                $("#EveryNumberOfDays").val(null);
                if (!isNaN(NumberOfRecurrence) && startDate != "") {
                    ResultDate.setMonth(ResultDate.getMonth() + NumberOfRecurrence);
                    EndDate = ResultDate;
                    $("#RecurrenceEndDate").text(EndDate.toDateString());
                    //alert($("#RecurrenceEndDate").text());
                }
                break;
            }
        case "IsYearly":
            {
                $("#IsDaily").val('false');
                $("#IsWeekly").val('false');
                $("#IsMonthly").val('false');
                $("#IsYearly").val('true');
                $("#EveryNumberOfDays").val(null);

                if (!isNaN(NumberOfRecurrence) && startDate != "") {
                    ResultDate.setFullYear(ResultDate.getFullYear() + NumberOfRecurrence);
                    EndDate = ResultDate;
                    $("#RecurrenceEndDate").text(EndDate.toDateString());

                }
                break;
            }
        case "NumberOfDays":
            {
                if ($("#EveryNumberOfDays").val() == 0) {
                    $('input[type=radio][name=Type][id=IsDaily]').prop('checked', true);
                    swal({
                        title: Resources.EveryNumberOfDaysNotExistResource,
                        confirmButtonText: Resources.DoneResource,
                        type: "error"
                    }, function () {
                    });
                }
                else {
                    $("#IsDaily").val('false');
                    $("#IsWeekly").val('false');
                    $("#IsMonthly").val('false');
                    $("#IsYearly").val('false');
                    if (!isNaN(NumberOfRecurrence) && startDate != "") {
                        ResultDate.setDate(ResultDate.getDate() + (NumberOfRecurrence * EveryNumberOfDays));
                        EndDate = ResultDate;
                        $("#RecurrenceEndDate").text(EndDate.toDateString());

                    }
                    break;
                }

            }
    }
    
    debugger;
    var List = [];
    var endDate = $("#RecurrenceEndDate").val();
    var numberOfRecurrence = $("#NumberOfRecurrence").val();
    if (isNaN(parseInt($("#EveryNumberOfDays").val())))
        $("#EveryNumberOfDays").val("");

    

        var gridData = $('#PayBondList').data("kendoGrid").dataSource.data();
        for (var i = 0; i < gridData.length; i++) {
            var data = {
                FK_PayBondId: parseInt(gridData[i].id),
                //PayBondType: parseInt($("#PayBondType").val()),
                FK_GlFinancialPeriodId: parseInt($("#FK_GlFinancialPeriodId").val()),
                Description: String($("#Description").val()),
                NotificationPeriod: parseInt($("#NotificationPeriod").val()),
                RecurrenceStartDate: new Date($("#RecurrenceStartDate").val()),
                RecurrenceEndDate: new Date($("#RecurrenceEndDate").text()),
                NumberOfRecurrence: parseInt($("#NumberOfRecurrence").val()),
                IsDaily:   JSON.parse($("#IsDaily").val()),
                IsWeekly:  JSON.parse($("#IsWeekly").val()),
                IsMonthly: JSON.parse($("#IsMonthly").val()),
                IsYearly:  JSON.parse($("#IsYearly").val()),
                EveryNumberOfDays: parseInt($("#EveryNumberOfDays").val()),
                FK_DefBranchId: parseInt($("#FK_DefBranchId").val()),
                //IsActive: Boolean($("#IsActive").val()),
                //FK_DefFreezingReasonId: parseInt($("#FK_DefFreezingReasonId").val()),
                //FreezingNotes: String($("#FreezingNotes").val()),
            }

            List.push(data);

        }

        if (List.length == 0) {

            swal({
                title: Resources.GridLengthZeroResource,
                confirmButtonText: Resources.DoneResource,
                type: "error"
            }, function () {
            });

        }
        else if (endDate == "" && numberOfRecurrence == "") {
            swal({
                title: Resources.EndDateAndNumberOfRecurrenceNotExistResource,
                confirmButtonText: Resources.DoneResource,
                type: "error"
            }, function () {
            });
        }
        else if (startDate == "") {
            swal({
                title: Resources.StartDateNotExistResource,
                confirmButtonText: Resources.DoneResource ,
                type: "error"
            }, function () {
            });
        }
        else if (parseInt($("#NotificationPeriod").val()) == 0) {
            swal({
                title: Resources.NotificationPeriodNotExistResource,
                confirmButtonText: Resources.DoneResource,
                type: "error"
            }, function () {
            });
        }
        else {
                $.ajax({
                    url: "/PayRecurringBond/saveRecurring",
                    type: "Post",
                    data: JSON.stringify(List),
                    contentType: 'application/json',
                    success: function (result) {
                        debugger
                        if (result) {

                            swal({
                                title: Resources.SavedSuccessfullyResource,
                                confirmButtonText: Resources.DoneResource,
                                type: "success"
                            }, function () {
                                    window.location.href = '/PayRecurringBond/Index';
                            });
                        }
                        else {
                            swal({
                                title: Resources.DefaultErrorMessageResource,
                                confirmButtonText: Resources.DoneResource,
                                type: "error"
                            });
                        }
                    }
                });
            //}

        }
    //}
}


