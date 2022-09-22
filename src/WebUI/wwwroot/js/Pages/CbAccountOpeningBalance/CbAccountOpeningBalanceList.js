$(document).ready(function () {
    

    loadCbAccountOpeningBalanceGrid();

    function loadCbAccountOpeningBalanceGrid() {
        var dataSource = new kendo.data.DataSource({
            transport: {
                read: {
                    url: "/CbAccountOpeningBalance/GetAll",
                    Type: "GET"
                }
            },
            error: function (e) {
                alert("Status: " + e.status + "; Error message: " + e.errorThrown);
            },
            pageSize: Resources.GridPageSize,
            schema: {
                model: {
                    id: "id",
                    fields: {
                        id: { editable: false },
                        accountCode: { editable: false },
                        accountNameAr: { editable: false },
                        accountNameEn: { editable: false },
                        financialPeriodName: { editable: false },
                        p_Debit: { editable: true },
                        p_Credit: { editable: true }


                    }
                }
            }
        });


        var grid = $("#GridCbAccountOpeningBalance").kendoGrid({
            excel: {
                fileName: "Account Opening Balances.xlsx",
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
                pageSizes: [20, 40, 60, Resources.All],
                numeric: Resources.GridNumeric,
                refresh: Resources.GridRefresh,

            },
            columns: [

                { field: "accountCode", title: Resources.AccountCodeResource, width: Resources.CodeWidth },
                { field: "accountNameAr", title: Resources.AccountNameArResource, width: Resources.NameWidth },
                { field: "accountNameEn", title: Resources.AccountNameEnResource, width: Resources.NameWidth },
                { field: "financialPeriodName", title: Resources.FinancialPeriodNameResource, width: Resources.NameWidth },
                { field: "p_Debit", template: "<input  title='No. must contain digits only' class='debit' value='#= p_Debit #' name='p_Debit' style='width:95%' />", title: Resources.DebitResource, width: Resources.InputNumberWidth },
                { field: "p_Credit", template: "<input   class='credit' value='#= p_Credit #' name='p_Credit' style='width:95%'/>", title: Resources.CreditResource, width: Resources.InputNumberWidth },
                { width: Resources.ActionWidth, template: "<button class='btn btn-success btn-sm btnSaveRow'><i class='fas fa-save'></i></button>" }

            ],
            dataBound: function (e) {
                e.sender.items().each(function () {
                    var dataItem = e.sender.dataItem(this);
                    kendo.bind(this, dataItem);
                    if (dataItem.isActive) {
                        // $(this).addClass("k-state-selected");
                    }
                });
                debugger
                if (!hasRoleEdit)
                    $(".btnSaveRow").attr('disabled', 'disabled');
            }
        });
        grid.data("kendoGrid").table.on("click", ".btnSaveRow", SaveRow);
    }
    function SaveRow() {

        var row = $(this).closest("tr"),
            grid = $("#GridCbAccountOpeningBalance").data("kendoGrid"),
            dataItem = grid.dataItem(row);
        var debit = row.closest("tr").find('input[name$="p_Debit"]').val();
        var credit = row.closest("tr").find('input[name$="p_Credit"]').val();
        var fK_GlFinancialPeriodId = dataItem.fK_GlFinancialPeriodId;
        var FK_CbAccountId = dataItem.fK_CbAccountId;
        var matchedDebit = false;
        var matchedCredit = false;

        var data = {
            fK_GlFinancialPeriodId: fK_GlFinancialPeriodId,
            fK_CbAccountId: FK_CbAccountId,
            p_Debit: parseFloat(debit),
            p_Credit: parseFloat(credit)
        };
        if (!debit.match('[-+]?([0-9]*.[0-9]+|[0-9]+)'))
            matchedDebit = false;
        else
            matchedDebit = true;

        if (!credit.match('[-+]?([0-9]*.[0-9]+|[0-9]+)'))
            matchedCredit = false;

        else
            matchedCredit = true;


        if (matchedDebit && matchedCredit) {
            $.ajax({
                url: "/CbAccountOpeningBalance/SaveGridRow",
                type: "Post",
                cache: false,
                processData: false,
                data: JSON.stringify(data),
                contentType: 'application/json',
                success: function (result) {

                    if (result) {
                        loadCbAccountOpeningBalanceGrid();

                        swal({
                            title: Resources.SavedSuccessfullyResource,
                            confirmButtonText: Resources.DoneResource,
                            type: "success"
                        });
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
        else
            $("#matchedMsg").show();



    }

    var accountCodeDataSource = new kendo.data.DataSource({

        serverFiltering: true,
        type: "json",
        transport: {
            read: {
                url: "/CbCashAndBankAccount/GetAllAutoCompleteSearchByCode"
            },
            parameterMap: function (data, action) {
                if (action === "read") {
                    return {
                        code: data.filter.filters[0].value
                    };
                } else {
                    return data;
                }
            }
        }
        ,
        schema: {
            model: {
                id: "id",
                fields: {

                    accountCode: {
                        type: "string"
                    }
                }
            }
        }
    });
    $("#accountAutoComplete").kendoAutoComplete({

        dataSource: accountCodeDataSource,
        select: onSelect,
        change: onChange,
        headerTemplate: '<div class="dropdown-header k-widget k-header">' +
            '<span style="margin-left:100px">' + Resources.AccountCodeResource + ' </span>' +
            '<span>' + Resources.AccountNameResource + '</span>' +

            '</div>',
        template: '<span style="margin-left:100px">#: data.accountCode #</span>' +
            '<span>#: data.accountNameAr #</span>',
        dataTextField: "accountCode",
        dataValueField: "id",
        filter: "contains",
        minLength: 1,
        placeholder: Resources.AutocompleateChoose
    });
});
function onSelect(e) {
    console.log(e.dataItem);
    $("#FK_CbAccountId").val(e.dataItem.id);
}
function onChange(e) {
    debugger;
    var code = this.value();

    $.ajax({
        type: "POST",
        url: "/CbCashAndBankAccount/CheckAccountCodeExist?code=" + code,
        data: "name=John&location=Boston",
        dataType: "json",
        success: function (response) {
            debugger;
            if (response != null) {
                $("#FK_CbAccountId").val(response.id);

            } else {
                $("#FK_CbAccountId").val(null);
                swal({
                    title: Resources.AccountCodeNotFoundResource,
                    confirmButtonText: Resources.DoneResource,
                    type: "error"
                });
            }

        }
    });
}
function SaveGridData() {

    var List = [];
    var matchedDebit = false;
    var matchedCredit = false;
    var gridData = $('#GridCbAccountOpeningBalance').data("kendoGrid").dataSource.data(),
        grid = $("#GridCbAccountOpeningBalance").data("kendoGrid");
    for (var i = 0; i < gridData.length; i++) {

        var fK_GlAccountId = gridData[i].fK_CbAccountId;
        var fK_GlFinancialPeriodId = gridData[i].fK_GlFinancialPeriodId;

        var currentUid = gridData[i].uid;
        var currentRow = grid.table.find("tr[data-uid='" + currentUid + "']");
        var credit = $(currentRow).find('input[name$="p_Credit"]').val();
        var debit = $(currentRow).find('input[name$="p_Debit"]').val();

        if (!String(debit).match('[-+]?([0-9]*.[0-9]+|[0-9]+)')) {
            $("#matchedMsg").show();
            matchedDebit = false;
            break;
        }
        else {
            $("#matchedMsg").hide();
            matchedDebit = true;
        }
        if (!String(credit).match('[-+]?([0-9]*.[0-9]+|[0-9]+)')) {
            $("#matchedMsg").show();
            matchedCredit = false;
            break;
        }
        else {
            $("#matchedMsg").hide();
            matchedCredit = true;
        }
        var data = {
            fK_GlFinancialPeriodId: fK_GlFinancialPeriodId,
            fK_CbAccountId: fK_GlAccountId,
            p_Debit: parseFloat(debit),
            p_Credit: parseFloat(credit)
        };

        List.push(data);

    }
    if (matchedDebit && matchedCredit) {
        $.ajax({
            url: "/CbAccountOpeningBalance/SaveGrid",
            type: "Post",
            cache: false,
            processData: false,
            data: JSON.stringify(List),
            contentType: 'application/json',
            success: function (result) {

                if (result) {

                    refreshGridAOB();
                    swal({
                        title: Resources.SavedSuccessfullyResource,
                        confirmButtonText:  Resources.DoneResource,
                        type: "success"
                    });
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
}

function refreshGridAOB() {
    $('#GridCbAccountOpeningBalance').data('kendoGrid').dataSource.read();
}

$("#btnSearch").on('click', function () {
    debugger;
    var accountId = parseInt($("#FK_CbAccountId").val());
    var financialPeriodId = parseInt($("#FK_GlFinancialPeriodId").val());
    //debugger;
    //if (isNaN(accountId) || accountId == 0) {
    //    swal({
    //        title: $("#ChooseAccountResource").text(),
    //        confirmButtonText: $("#DoneResource").text(),
    //        type: "error"
    //    });
    //}
    //else
        $('#GridCbAccountOpeningBalance').data('kendoGrid').dataSource.read({ accountId: accountId, financialPeriodId: financialPeriodId });

});

$(".exportExcel").on('click', function () {
    $("#GridCbAccountOpeningBalance").getKendoGrid().saveAsExcel();
});