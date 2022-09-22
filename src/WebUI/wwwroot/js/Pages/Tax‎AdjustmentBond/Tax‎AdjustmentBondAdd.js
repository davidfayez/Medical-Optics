$().ready(function () {
    
    if (!$('#isActive').is(':checked'))
        $(".isActive").removeAttr('disabled');
    //cash Bank AutoComplete
    var CashAndBankAccountDataSource = new kendo.data.DataSource({

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
    $("#CashBankAccountCodeComplete").kendoAutoComplete({

        dataSource: CashAndBankAccountDataSource,
        placeholder: Resources.AutocompleateChoose,
        select: onCashSelect,
        change: onCashChange,
        headerTemplate: '<div class="dropdown-header k-widget k-header">' +
            '<span style="margin-left:100px">' + Resources.AccountCodeResource + ' </span>' +
            '<span>' + Resources.AccountNameResource + '</span>' +

            '</div>',
        template: '<span style="margin-left:100px">#: data.accountCode #</span>' +
            '<span>#: data.accountNameAr #</span>',
        dataTextField: "accountCode",
        dataValueField: "id",
        filter: "contains",
        minLength: 1
    });
    function onCashSelect(e) {
        debugger;
        var item = e.dataItem;
        $("#FK_CbCashAndBankAccountId").val(e.dataItem.id);
        $("#CashAndBankAccountName").val(e.dataItem.accountNameAr);
        $("#FK_GlAccountIdFromId").val(e.dataItem.fK_GlAccountId);


    }
    function onCashChange(e) {
        debugger;
        var code = this.value();

        $.ajax({
            type: "POST",
            url: "/CbCashAndBankAccount/CheckAccountCodeExist?code=" + code,
            data: "name=John&location=Boston",
            dataType: "json",
            success: function (response) {
                debugger
                if (response != null) {
                    $("#FK_CbCashAndBankAccountId").val(response.id);
                    $("#CashAndBankAccountName").val(response.accountNameAr);
                    $("#FK_GlAccountIdFromId").val(response.fK_GlAccountId);
                } else {
                    $("#FK_GlAccountIdFromId").val(null);
                    $("#FK_CbCashAndBankAccountId").val(null);
                    $("#CashAndBankAccountName").val("");
                    $("#CashBankAccountCodeComplete").val(null);

                    swal({
                        title: Resources.AccountCodeNotFoundResource,
                        confirmButtonText: Resources.DoneResource,
                        type: "error"
                    });
                }

            }
        });
    }



    var accountCodeDataSource = new kendo.data.DataSource({

        serverFiltering: true,
        type: "json",
        transport: {
            read: {
                url: "/GlAccount/GetAllAutoCompleteBySearch"
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
    $("#AccountToAutoComplete").kendoAutoComplete({

        dataSource: accountCodeDataSource,
        placeholder: Resources.AutocompleateChoose,
        select: onSelectAccountTo,
        change: onChangeAccountTo,
        headerTemplate: '<div class="dropdown-header k-widget k-header">' +
            '<span style="margin-left:50px">' + Resources.AccountCodeResource + ' </span>' +
            '<span>' + Resources.AccountNameResource + '</span>' +

            '</div>',
        template: '<span style="margin-left:50px">#: data.accountCode #</span>' +
            '<span>#: data.accountNameAr #</span>',
        dataTextField: "accountCode",
        dataValueField: "id",
        filter: "contains",
        minLength: 1
    });

    function onSelectAccountTo(e) {
        $("#FK_GlAccountIdToId").val(e.dataItem.accountId);
        $("#ToAccountName").val(e.dataItem.accountNameAr);
    }
    function onChangeAccountTo(e) {
        var code = this.value();

        $.ajax({
            type: "POST",
            url: "/GlAccount/CheckAccountCodeExist?code=" + code,
            data: "name=John&location=Boston",
            dataType: "json",
            success: function (response) {

                if (response != null) {
                    $("#FK_GlAccountIdToId").val(response.accountId);
                    $("#ToAccountName").val(response.accountNameAr);

                } else {
                    $("#FK_GlAccountIdFromId").val(null);
                    $("#ToAccountName").val(null);
                    swal({
                        title: Resources.AccountCodeNotFoundResource,
                        confirmButtonText: Resources.DoneResource,
                        type: "error"
                    });
                }

            }
        });
    }

    // Grid
    var tempSource = new kendo.data.DataSource({

    });
    var gridBound = $("#GridTaxsBondDetails").kendoGrid({
        dataSource: tempSource,
        navigatable: true,
        pageable: false,
        columns: [
            { field: "fK_GlAccountIdToId", hidden: true },
            { field: "toAccountCode", width: 140, title: Resources.AccountCodeResource },
            { field: "toAccountName", width: 140, title: Resources.AccountNameResource },
            { field: "value", title: Resources.TaxValueResource, width: 140 },
            { field: "percentage", title: Resources.TaxPercentageResource, width: 140 },
            { width: "80px", template: "<a  class='btn btn-danger btn-sm btnDelete' ><i class='fas fa-trash-alt'></i></a>" }
        ],
        editable: true,
        selectable: "multiple, cell",
        noRecords: Resources.GridNoRecords,
        messages: {
            noRecords: Resources.GridNoRecordsMessage
        },

    });
    gridBound.data("kendoGrid").table.on("click", ".btnDelete", removeTaxBondDetailRow);
    function removeTaxBondDetailRow() {

        var row = $(this).closest("tr"),
            grid = $("#GridTaxsBondDetails").data("kendoGrid"),
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
                var dataSource = $("#GridTaxsBondDetails").data("kendoGrid").dataSource;

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
    $("#btnAddTaxBondDetail").on('click', function () {

        var fK_GlAccountIdToId = $("#FK_GlAccountIdToId").val(),
            toAccountCode = $("#AccountToAutoComplete").val(),
            toAccountName = $("#ToAccountName").val(),
            taxValue = $("#TaxValue").val(),
            taxPercentage = $("#TaxPercentage").val();


        if (fK_GlAccountIdToId == "" || isNaN(fK_GlAccountIdToId)) {

            swal({
                title: Resources.ChooseAccountResource,
                confirmButtonText: Resources.DoneResource,
                type: "error"
            });
        }
        else if (taxValue == "") {

            swal({
                title: Resources.TaxRequiredResource,
                confirmButtonText: Resources.DoneResource,
                type: "error"
            });
        }
        else if (taxPercentage == "") {

            swal({
                title: Resources.TaxPercentageRequiredResource,
                confirmButtonText: Resources.DoneResource,
                type: "error"
            });
        }
        else {
            tempSource.insert(0, {
                fK_GlAccountIdToId: fK_GlAccountIdToId,
                toAccountCode: toAccountCode,
                toAccountName: toAccountName,
                value: taxValue,
                percentage: taxPercentage,
            });

            $("#FK_GlAccountIdToId").val("");
            $("#AccountToAutoComplete").val("");
            $("#ToAccountName").val("");
            $("#TaxValue").val("");
            $("#TaxPercentage").val("");
        }


    });

});

$('select[name="FK_TaxesPeriodId"]').change(function () {

    var taxPeriodId = $(this).val();
    $.ajax({
        type: "POST",
        url: "/TaxsAdjustmentBond/GetTaxesPeriod?id=" + taxPeriodId,
        dataType: "json",
        success: function (response) {
            debugger
            if (response != null) {
                var dateFrom = new Date(response.dateFrom);
                dateFrom = dateFrom.getFullYear() + "-" + ("0" + (dateFrom.getMonth() + 1)).slice(-2) + "-" + ("0" + dateFrom.getDate()).slice(-2);
                var dateTo = new Date(response.dateTo);
                dateTo = dateTo.getFullYear() + "-" + ("0" + (dateTo.getMonth() + 1)).slice(-2) + "-" + ("0" + dateTo.getDate()).slice(-2);

                $("#DateFrom").val(dateFrom);
                $("#DateTo").val(dateTo);


            }

        }
    });

})

$("input[name='IsActive']").on('click', function () {
    if ($("input[name='IsActive']:checked").val() == "true") {
        $(".isActive").attr("disabled", "disabled");
        $(".isActive").val(null);
    }
    else {
        $(".isActive").removeAttr('disabled');
        $(".isActive").val(null);
    }

});

$("#TaxValue").keyup(function () {
    var taxValue = parseFloat($(this).val()),
        gross = parseFloat($("#Gross").val());

    if (!isNaN(taxValue) && !isNaN(gross)) {
        var result = (taxValue / gross) * 100;
        $("#TaxPercentage").val(result);
    }

});

$("#TaxPercentage").keyup(function () {
    var taxPercentage = parseFloat($(this).val()),
        gross = parseFloat($("#Gross").val());

    if (!isNaN(taxPercentage) && !isNaN(gross)) {
        var result = gross / taxPercentage;
        $("#TaxValue").val(result);
    }

});

function SubmitTaxsBondCreate() {
    if ($("#FormTaxsAdjustmentBondCreate").valid()) {
        var listDetails = [];
        var gridData = $('#GridTaxsBondDetails').data("kendoGrid").dataSource.data();

        if (gridData.length == 0) {
            swal({
                title: Resources.GridLengthZeroResource,
                confirmButtonText: Resources.DoneResource,
                type: "error"
            });
        }
        else {
            for (var i = 0; i < gridData.length; i++) {

                var detail = {
                    Id: 0,
                    FK_GlAccountIdFromId: parseInt($("#FK_GlAccountIdFromId").val()),
                    FK_GlAccountIdToId: parseFloat(gridData[i].fK_GlAccountIdToId),
                    Value: parseFloat(gridData[i].value),
                    Percentage: parseFloat(gridData[i].percentage),
                };
                listDetails.push(detail);
            }

            var isActive = $("input[name='IsActive']:checked").val();
            if (isActive == "true")
                isActive = true;
            else
                isActive = false;

            var Obj = {
                Id: 0,
                DateFrom: new Date($("#DateFrom").val()),
                DateTo: new Date($("#DateTo").val()),
                BondDate: new Date($("#BondDate").val()),
                Gross: parseFloat($("#Gross").val()),
                Description: $("#Description").val(),
                BondCode:$("#BondCode").val(),
                IsActive: isActive,
                FK_DefFreezingReasonId: parseInt($("#FK_DefFreezingReasonId").val()),
                FK_CbCashAndBankAccountId: parseInt($("#FK_CbCashAndBankAccountId").val()),
                FK_GlAccountId: parseInt($("#FK_GlAccountIdFromId").val()),
                FK_TaxesPeriodId: parseInt($("#FK_TaxesPeriodId").val()),
                FreezingReasons: $("#FreezingReasons").val(),
                hdnAttachmentIds: $("#hdnAttachmentIds").val(),
                ListDetails: listDetails
            };
            debugger;
            $.ajax({
                url: "/TaxsAdjustmentBond/Create",
                type: "Post",
                cache: false,
                processData: false,
                data: JSON.stringify(Obj),
                contentType: 'application/json',
                success: function (result) {

                    if (result) {

                        swal({
                            title: Resources.SavedSuccessfullyResource,
                            confirmButtonText: Resources.DoneResource,
                            type: "success"
                        }, function () {
                                window.location.href = '/TaxsAdjustmentBond/Index';
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
        }


    }

}