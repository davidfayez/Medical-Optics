$(document).ready(function () {

    $('#DefBranches').change(function () {

        $("#FK_CbBankId").data("kendoDropDownList").value("0");
        $("#FK_CbBankId").data("kendoDropDownList").dataSource.read();


    });
    //Active in Create
    $('input[type=radio][name=IsActive]').change(function () {
        debugger;
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


    //Edit Currency Factor
    var currencyFactorVal = $("#CurrencyFactor").val();
    if (currencyFactorVal == 1)
        $('#CurrencyFactor').attr('readonly', true);
    else
        $('#CurrencyFactor').attr('readonly', false);

    //Currency Factor
    //$("#FK_DefCurrencyId").change(function (e) {
    //    var BondDate = $("#BondDate").val();
    //    var voucherDate = new Date($("#BondDate").val());
    //    var DefcurrencyId = parseInt($("#FK_DefCurrencyId").val());
    //    $.ajax({
    //        url: "/GlJournalVoucher/GetCurrencyFactorByIdInPeriod?id=" + DefcurrencyId + "&period=" + BondDate /*voucherDate.toUTCString()*/,
    //        type: "Get",
    //        contentType: false,
    //        processData: false,
    //        success: function (data) {
    //            debugger;
    //            if (data.hasOwnProperty("factor")) {
    //                $("#CurrencyFactor").val(data.factor);
    //                $('#CurrencyFactor').attr('readonly', false);
    //            }
    //            else {
    //                $("#CurrencyFactor").val(data.defaultFactor);
    //                if (data.isPimary == true)
    //                    $('#CurrencyFactor').attr('readonly', true);
    //                else
    //                    $('#CurrencyFactor').attr('readonly', false);
    //            }
    //        }
    //    });
    //})

    $("#FK_CbBankId").kendoDropDownList({
        filter: "contains",
        height: 300,
        dataTextField: "codeAndName",
        dataValueField: "id",
        dataSource: {
            type: "json",
            //serverFiltering: true,
            transport: {
                read: {
                    url: "/CbBank/GetAllBanksForDDList",
                },
                parameterMap: function (data, action) {

                    if (action === "read") {
                        return {
                            fK_DefBranchId: parseInt($("#FK_DefBranchId").val()),
                        };


                    } else {
                        return data;
                    }
                }
            }
        },

    });

    $("#FK_DefCurrencyId").kendoDropDownList({
        filter: "contains",
        height: 300,
        dataTextField: "codeAndName",
        dataValueField: "id",
        dataSource: {
            type: "json",
            //serverFiltering: true,
            transport: {
                read: {
                    url: "/DefCurrency/GetAllCurrenciesForDDList",
                },
                parameterMap: function (data, action) {

                    if (action === "read") {
                        return {
                            fK_DefBranchId: parseInt($("#FK_DefBranchId").val()),
                        };


                    } else {
                        return data;
                    }
                }
            }
        },
        change: onSelectCurrency

    });
    function onSelectCurrency(e) {
        var DefcurrencyId = parseInt($("#FK_DefCurrencyId").val());
        $.ajax({
            url: "/CbExchangeBond/GetCurrncyDefaultFactor?id=" + DefcurrencyId,
            type: "Get",
            contentType: false,
            processData: false,
            success: function (data) {
                debugger
                if (data.isPimary) {
                    $("#CurrencyFactor").val(data.defaultFactor);
                    $("#CurrencyFactor").attr('readonly', true);
                } else {
                    $("#CurrencyFactor").val(data.defaultFactor);
                    $("#CurrencyFactor").attr('readonly', false);
                }
            }
        });
    }
});

$("#btnSave").click(function () {


    if ($("#FK_CbBankId").val() > 0)
        $("#FK_BankIdValid").text("")
    else
        $("#FK_BankIdValid").text(Resources.Required)

    if ($("#FK_DefCurrencyId").val() > 0)
        $("#FK_DefCurrencyIdValid").text("")
    else
        $("#FK_DefCurrencyIdValid").text(Resources.Required)


    if ($("#mainForm").valid() && $("#FK_DefCurrencyId").val() > 0 && $("#FK_CbBankId").val() > 0)
        $("#mainForm").submit();

});

function ChangeIsActive(e) {
    if (e.checked === true) {
        $(".disabled-input").attr("disabled", "disabled");
        $("#FK_DefFreezingReasonId").val("");
        $("#FreezingNotes").val("");
    }
    else
        $(".disabled-input").removeAttr('disabled');

}

function removeCheckEdit(Id) {

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
            $.ajax({
                url: "/CbCheck/Delete?id=" + Id,
                type: "Get",
                contentType: 'application/json; charset=utf-8',
                success: function (result) {
                    debugger;
                    if (result) {
                        swal({
                            title: Resources.DeleteSuccessResource,
                            confirmButtonText: Resources.DoneResource,
                            type: "success"
                        }, function () {
                            window.location.href = '/CbCheck/Index'
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








