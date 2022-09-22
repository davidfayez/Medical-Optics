$(document).ready(function () {

   
    //Active in Create
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
    if (activeVal == undefined) {
        $(".disabled-input").removeAttr('disabled');
    }
    //Edit Pay Type
    var PayTypeId = $("#FK_CbPayTypeId").val();
    if (PayTypeId == 2)
        $("#Check").show();
    else
        $("#Check").hide();

    //Edit Currency Factor
    var currencyFactorVal = $("#CurrencyFactor").val();
    if (currencyFactorVal == 1)
        $('#CurrencyFactor').attr('readonly', true);
    else
        $('#CurrencyFactor').attr('readonly', false);

    //cash Bank AutoComplete
    var CashAndBankAccountDebitDataSource = new kendo.data.DataSource({

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
    $("#CashAndBankAccountDebitAutoComplete").kendoAutoComplete({

        dataSource: CashAndBankAccountDebitDataSource,
        select: onCashDebitSelect,
        change: onCashDebitChange,
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

    //Account AutoComplete
    var CashAndBankAccountCreditDataSource = new kendo.data.DataSource({

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
    $("#CashAndBankAccountCreditAutoComplete").kendoAutoComplete({

        dataSource: CashAndBankAccountCreditDataSource,
        select: onCashCreditSelect,
        change: onCashCreditChange,
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

    //Currency Factor
    $("#FK_DefCurrencyId").change(function (e) {
        var BondDate = $("#BondDate").val();
        var voucherDate = new Date($("#BondDate").val());
        var DefcurrencyId = parseInt($("#FK_DefCurrencyId").val());
        $.ajax({
            url: "/GlJournalVoucher/GetCurrencyFactorByIdInPeriod?id=" + DefcurrencyId + "&period=" + BondDate /*voucherDate.toUTCString()*/,
            type: "Get",
            contentType: false,
            processData: false,
            success: function (data) {
                debugger;
                if (data.hasOwnProperty("factor")) {
                    $("#CurrencyFactor").val(data.factor);
                    $('#CurrencyFactor').attr('readonly', false);
                }
                else {
                    $("#CurrencyFactor").val(data.defaultFactor);
                    if (data.isPimary == true)
                        $('#CurrencyFactor').attr('readonly', true);
                    else
                        $('#CurrencyFactor').attr('readonly', false);
                }
            }
        });
    })

    //Pay Type
    $("#FK_CbPayTypeId").change(function (e) {
        debugger;
        var id = $("#FK_CbPayTypeId").val();
        if (id == 2)
            $("#Check").show();
        else
            $("#Check").hide();


    });
});

function onCashDebitSelect(e) {
    debugger;
    var item = e.dataItem;
    $("#FK_CbCashAndBankAccountDebitId").val(e.dataItem.id);
    $("#CashAndBankAccountDebit").val(e.dataItem.accountNameAr);


}
function onCashDebitChange(e) {
    debugger;
    var code = this.value();

    $.ajax({
        type: "POST",
        url: "/CbCashAndBankAccount/CheckAccountCodeExist?code=" + code,
        data: "name=John&location=Boston",
        dataType: "json",
        success: function (response) {

            if (response != null) {
                $("#FK_CbCashAndBankAccountDebitId").val(response.id);
                $("#CashAndBankAccountDebit").val(response.accountNameAr);
            } else {
                $("#FK_CbCashAndBankAccountDebitId").val(null);
                $("#CashAndBankAccountDebit").val("");

                swal({
                    title: Resources.AccountCodeNotFoundResource,
                    confirmButtonText: Resources.DoneResource,
                    type: "error"
                });
            }

        }
    });
}

function onCashCreditSelect(e) {
    debugger;
    var item = e.dataItem;
    $("#FK_CbCashAndBankAccountCreditId").val(e.dataItem.id);
    $("#CashAndBankAccountCredit").val(e.dataItem.accountNameAr);


}
function onCashCreditChange(e) {
    debugger;
    var code = this.value();

    $.ajax({
        type: "POST",
        url: "/CbCashAndBankAccount/CheckAccountCodeExist?code=" + code,
        data: "name=John&location=Boston",
        dataType: "json",
        success: function (response) {

            if (response != null) {
                $("#FK_CbCashAndBankAccountCreditId").val(response.id);
                $("#CashAndBankAccountCredit").val(response.accountNameAr);

            } else {
                $("#FK_CbCashAndBankAccountCreditId").val(null);
                $("#CashAndBankAccountCredit").val("");
                swal({
                    title: Resources.AccountCodeNotFoundResource,
                    confirmButtonText: Resources.DoneResource,
                    type: "error"
                });
            }

        }
    });
}
function ChangeIsActive(e) {
    if (e.checked === true) {
        $(".disabled-input").attr("disabled", "disabled");
        $("#FK_DefFreezingReasonId").val("");
        $("#FreezingNotes").val("");
    }
    else
        $(".disabled-input").removeAttr('disabled');

}








