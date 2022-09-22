$(document).ready(function () {


    loadPaySupplierOpeningBalanceGrid();

    function loadPaySupplierOpeningBalanceGrid() {
        var dataSource = new kendo.data.DataSource({
            transport: {
                read: {
                    url: "/PaySupplierOpeningBalance/GetAll",
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
                        supplierCode: { editable: false },
                        supplierNameAr: { editable: false },
                        supplierNameEn: { editable: false },
                        accountCode: { editable: false },
                        accountNameAr: { editable: false },
                        accountNameEn: { editable: false },
                        financialPeriodName: { editable: false },
                        p_Debit: { editable: true },
                        p_Credit: { editable: true },
                        fK_GlAccountId: { editable: false },
                        fK_PaySupplierId: { editable: false },
                        fK_GlFinancialPeriodId: { editable: false }


                    }
                }
            }
        });


        var grid = $("#GridSupplierOpeningBalance").kendoGrid({
            excel: {
                fileName: "Supplier Opening Balances.xlsx",
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

                { field: "supplierCode", title: Resources.SupplierCodeResource, width: Resources.CodeWidth },
                { field: "supplierNameAr", title: Resources.SupplierNameArResource, width: Resources.NameWidth },
                { field: "supplierNameEn", title: Resources.SupplierNameEnResource, width: Resources.NameWidth },
                { field: "accountCode", title: Resources.AccountCodeResource, width: Resources.CodeWidth },
                { field: "accountNameAr", title: Resources.AccountNameArResource, width: Resources.NameWidth },
                { field: "accountNameEn", title: Resources.AccountNameEnResource, width: Resources.NameWidth },
                { field: "financialPeriodName", title: Resources.FinancialPeriodNameResource, width: Resources.NameWidth },
                { field: "p_Debit", template: "<input  pattern='[0-9]' title='No. must contain digits only' class='debit' value='#= p_Debit #' name='p_Debit' style='width:95%' />", title: Resources.DebitResource, width: Resources.InputNumberWidth },
                { field: "p_Credit", template: "<input   class='credit' value='#= p_Credit #' name='p_Credit' style='width:95%'/>", title: Resources.CreditResource, width: Resources.InputNumberWidth },
                { width: Resources.ActionWidth, template: "<button class='btn btn-success btn-sm btnSaveRow'><i class='fas fa-save'></i></button>" }

            ],
            dataBound: function (e) {
                e.sender.items().each(function () {
                    var dataItem = e.sender.dataItem(this);
                    kendo.bind(this, dataItem);
                    if (dataItem.isActive) {
                        //$(this).addClass("k-state-selected");
                    }
                });
                //debugger
                if (!hasRoleEdit)
                    $(".btnSaveRow").attr('disabled', 'disabled');

            }
        });
        grid.data("kendoGrid").table.on("click", ".btnSaveRow", SaveRow);
    }
    function SaveRow() {
        debugger
        var row = $(this).closest("tr"),
            grid = $("#GridSupplierOpeningBalance").data("kendoGrid"),
            dataItem = grid.dataItem(row);
        var debit = row.closest("tr").find('input[name$="p_Debit"]').val(),
            credit = row.closest("tr").find('input[name$="p_Credit"]').val(),
            fK_GlFinancialPeriodId = dataItem.fK_GlFinancialPeriodId,
            fK_GlAccountId = dataItem.fK_GlAccountId,
            fK_PaySupplierId = dataItem.fK_PaySupplierId,
            matchedDebit = false,
            matchedCredit = false;

        var data = {
            FK_GlFinancialPeriodId: fK_GlFinancialPeriodId,
            FK_PaySupplierId: fK_PaySupplierId,
            FK_GlAccountId: fK_GlAccountId,
            P_Debit: parseFloat(debit),
            P_Credit: parseFloat(credit)
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
                url: "/PaySupplierOpeningBalance/SaveGridRow",
                type: "Post",
                cache: false,
                processData: false,
                data: JSON.stringify(data),
                contentType: 'application/json',
                success: function (result) {

                    if (result) {
                        loadPaySupplierOpeningBalanceGrid();

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

    var supplierCodeDataSource = new kendo.data.DataSource({

        serverFiltering: true,
        type: "json",
        transport: {
            read: {
                url: "/PayLookups/GetAllPaySupplierAutoCompleteSearchByCode"
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
                id: "Id",
                fields: {

                    accountCode: {
                        type: "string"
                    }
                }
            }
        }
    });
    $("#supplierAutoComplete").kendoAutoComplete({

        dataSource: supplierCodeDataSource,
        placeholder: Resources.AutocompleateChoose,
        select: onSelect,
        change: onChange,
        headerTemplate: '<div class="dropdown-header k-widget k-header">' +
            '<span style="margin-left:100px">' + Resources.SupplierCodeResource + ' </span>' +
            '<span>' + Resources.SupplierNameResource + '</span>' +

            '</div>',
        template: '<span style="margin-left:150px">#: data.supplierCode #</span>' +
            '<span>#: data.supplierNameAr #</span>',
        dataTextField: "supplierCode",
        dataValueField: "id",
        filter: "contains",
        minLength: 1
    });
});
function onSelect(e) {
    $("#FK_PaySupplierId").val(e.dataItem.id);
}
function onChange(e) {
    debugger;
    var code = this.value();

    $.ajax({
        type: "POST",
        url: "/PayLookups/CheckSupplierCodeExist?code=" + code,
        data: "name=John&location=Boston",
        dataType: "json",
        success: function (response) {

            if (response != null) {
                $("#FK_PaySupplierId").val(response.id);

            } else {
                $("#FK_PaySupplierId").val(null);
                // $("#supplierAutoComplete").val(null);
                swal({
                    title: Resources.SupplierCodeNotFoundResource,
                    confirmButtonText: Resources.DoneResource,
                    type: "error"
                });
            }

        }
    });
}
function SaveGridSupplierOpeningBalance() {

    var List = [];
    var matchedDebit = false;
    var matchedCredit = false;
    var gridData = $('#GridSupplierOpeningBalance').data("kendoGrid").dataSource.data(),
        grid = $("#GridSupplierOpeningBalance").data("kendoGrid");
    for (var i = 0; i < gridData.length; i++) {

        var fK_GlAccountId = gridData[i].fK_GlAccountId;
        var fK_PaySupplierId = gridData[i].fK_PaySupplierId;
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
            FK_GlFinancialPeriodId: fK_GlFinancialPeriodId,
            FK_PaySupplierId: fK_PaySupplierId,
            FK_GlAccountId: fK_GlAccountId,
            P_Debit: parseFloat(debit),
            P_Credit: parseFloat(credit)
        };

        List.push(data);

    }
    if (matchedDebit && matchedCredit) {
        $.ajax({
            url: "/PaySupplierOpeningBalance/SaveGrid",
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
}

function refreshGridAOB() {
    $('#GridSupplierOpeningBalance').data('kendoGrid').dataSource.read();
}

$("#btnSearch").on('click', function () {
    debugger
    var supplierId = parseInt($("#FK_PaySupplierId").val());
    var financialPeriodId = parseInt($("#FK_GlFinancialPeriodId").val());
    if (isNaN(supplierId) || supplierId == 0) {
        swal({
            title: Resources.ChooseSupplierResource,
            confirmButtonText: Resources.DoneResource,
            type: "error"
        });
    }
    else
        $('#GridSupplierOpeningBalance').data('kendoGrid').dataSource.read({ supplierId: supplierId, financialPeriodId: financialPeriodId });

});

$(".exportExcel").on('click', function () {
    $("#GridSupplierOpeningBalance").getKendoGrid().saveAsExcel();
});