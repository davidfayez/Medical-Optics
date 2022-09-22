
$(document).ready(function () {
    $('#DefBranches,input[type=radio][name=AccountType]').change(function () {
       
        $("#FK_GlAccountId").data("kendoDropDownTree").value("");
        $("#FK_GlAccountId").data("kendoDropDownTree").dataSource.read();

    });


    // kendoDropDownTree for  Cb Cash And Bank Account

    dataSourceDdlTreeCbAccount = new kendo.data.HierarchicalDataSource({


        transport: {
            read: {
                url: "/CbCashAndBankAccount/GetAllAccountsForDDLTree",
                type: "json",
            },
            parameterMap: function (data, action) {

                if (action === "read") {
                    return {
                        id: data.id,
                        defBranchId: parseInt($("#FK_DefBranchId").val()),
                    };
                } else {
                    return data;
                }
            }
        },
        schema: {
            model: {
                id: "id",
                hasChildren: "hasChildren"
            }
        }
    });
    $("#FK_ParentId").kendoDropDownTree({
        placeholder: Resources.Choose,
        dataSource: dataSourceDdlTreeCbAccount,
        height: 300,
        dataTextField: "codeAndName",
        dataValueField: "id",
        //checkboxes: true,
        //checkAll: true,
        autoClose: false,

    });



    // kendoDropDownTree for gl account
    editFirstLoad = true;
    dataSourceDdlTree = new kendo.data.HierarchicalDataSource({
        transport: {
            read: {
                url: "/GlAccount/GetAllAccountsForDDLTree",
                Type: "GET",

            },
            parameterMap: function (data, action) {
                subAccTypeId = $('input[name="AccountType"]:checked').val();
                debugger
                if (subAccTypeId == 1)
                    subAccTypeId = 2;//صندوق
                else if (subAccTypeId == 2)
                    subAccTypeId = 3;//بنك
                else if (subAccTypeId == 3)
                    subAccTypeId = 4;//بطاقه ائتمان
                else if (subAccTypeId == 4)
                    subAccTypeId = 5;//تسوية

                if (action === "read") {
                    return {
                        id: data.id,
                        defBranchId: parseInt($("#FK_DefBranchId").val()),
                        subAccType: subAccTypeId
                    };
                } else {
                    return data;
                }
            }
        },
        schema: {
            model: {
                id: "id",
                hasChildren: "hasChildren"
            }
        }
    });

    $("#FK_GlAccountId").kendoDropDownTree({
        placeholder: Resources.Choose,
        dataSource: dataSourceDdlTree,
        height: 300,
        dataTextField: "codeAndName",
        dataValueField: "id",
        //checkboxes: true,
        //checkAll: true,
        autoClose: false,
        change: onChangeDdlTree
    });
    function onChangeDdlTree() {

        if (!editFirstLoad || $("#hdnRefrenceId").val() == 0) {
            GetNextSubAccountCode();
        }
        editFirstLoad = false;
    }

    //Active in Create
    $('input[type=radio][name=IsActive]').change(function () {

        if (this.value == "True") {
            $(".disabled-input").attr("disabled", "disabled");
            $("#FK_DefFreezingReasonId").val("");
            $("#FreezingNotes").val("");
            $("#frezzingReasonBtn").attr("disabled", "disabled");

        }
        else {
            $("#frezzingReasonBtn").removeAttr("disabled");
            $(".disabled-input").removeAttr('disabled');

        }
    });

    //Active In Edit
    var activeVal = $('input[name="IsActive"]:checked').val();
    if (activeVal == undefined) {
        $(".disabled-input").removeAttr('disabled');
        $("#frezzingReasonBtn").removeAttr("disabled");

    }

    //Account Type
    var selectedVal = $('input[name="AccountType"]:checked').val();
    $("#FK_CbAccountTypeId").val(selectedVal);

    if (selectedVal == 3) {
        $("#Bank").hide();
        $("#CbCreditMachine").show();
    }
    else if (selectedVal == 2) {
        $("#CbCreditMachine").hide();
        $("#Bank").show();
    }
    else {
        $("#CbCreditMachine").hide();
        $("#Bank").hide();
    }


    $('input[type=radio][name=AccountType]').change(function () {
        if (this.value == 3) {
            $("#FK_CbAccountTypeId").val(this.value);
            $("#CbCreditMachine").show();
            $("#Bank").hide();
        }
        else if (this.value == 2) {
            $("#FK_CbAccountTypeId").val(this.value);
            $("#CbCreditMachine").hide();
            $("#Bank").show();
        }
        else {

            $("#FK_CbAccountTypeId").val(this.value);
            $("#CbCreditMachine").hide();
            $("#Bank").hide();
        }
    });

    //cash Bank AutoComplete
    var cashBankAccountCodeDataSource = new kendo.data.DataSource({

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
    $("#cashBankAccountAutoComplete").kendoAutoComplete({

        dataSource: cashBankAccountCodeDataSource,
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
        minLength: 1,
        placeholder: Resources.AutocompleateChoose
    });

    //Account AutoComplete
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

function onCashSelect(e) {

    var item = e.dataItem;
    $("#FK_ParentId").val(e.dataItem.id);
    $("#cashBankAccountName").val(e.dataItem.accountNameAr);


}
function onCashChange(e) {

    var code = this.value();

    $.ajax({
        type: "POST",
        url: "/CbCashAndBankAccount/CheckAccountCodeExist?code=" + code,
        data: "name=John&location=Boston",
        dataType: "json",
        success: function (response) {

            if (response != null) {
                $("#FK_ParentId").val(response.id);
                $("#cashBankAccountName").val(response.accountNameAr);
            } else {
                $("#FK_ParentId").val(null);
                $("#cashBankAccountName").val("");

                swal({
                    title: Resources.AccountCodeNotFoundResource,
                    confirmButtonText: Resources.DoneResource,
                    type: "error"
                });
            }

        }
    });
}

function onSelect(e) {

    var item = e.dataItem;
    $("#FK_GlAccountId").val(e.dataItem.id);
    $("#AccountName").val(e.dataItem.accountNameAr);


}
function onChange(e) {

    var code = this.value();

    $.ajax({
        type: "POST",
        url: "/GlAccount/CheckAccountCodeExist?code=" + code,
        data: "name=John&location=Boston",
        dataType: "json",
        success: function (response) {

            if (response != null) {
                $("#FK_GlAccountId").val(response.id);
                $("#AccountName").val(response.accountNameAr);

            } else {
                $("#FK_GlAccountId").val(null);
                $("#AccountName").val("");
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
        $("#frezzingReasonBtn").attr("disabled", "disabled");

    }
    else {
        $("#frezzingReasonBtn").removeAttr("disabled");
        $(".disabled-input").removeAttr('disabled');

    }

}

function GetNextSubAccountCode() {
    //Get Next SubAccount Code

    var accountType = $('input[name="AccountType"]:checked').val();

    if (accountType == 1)
        accountType = 2;
    else if (accountType == 2)
        accountType = 3;
    else if (accountType == 3)
        accountType = 4;
    else if (accountType == 4)
        accountType = 5;

    if ($('#FK_GlAccountId').val() > 0) {
        $.ajax({
            type: "POST",
            url: "/GlAccount/GetNextSubAccountCode?parentId=" + $('#FK_GlAccountId').val() + "&subTypeId=" + accountType + "&defBranchId=" + $('#FK_DefBranchId').val(),
            data: "name=John&location=Boston",
            dataType: "json",
            success: function (result) {

                if (result != null) {
                    $("#AccountCode").val(result);
                } else {

                }

            }
        });
    }

}

$("#btnSubmit").on('click', function () {
    if ($("#FK_GlAccountId").val() == 0 || $("#FK_GlAccountId").val() == "")
        $("#glAccountvalidation").show();
    else
        $("#glAccountvalidation").hide();
    if ($("#mainFormCbAccount").valid() && $("#FK_GlAccountId").val() > 0) {
        $("#mainFormCbAccount").submit();
    }
});




function removeAccount(id) {

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
                url: "/CbCashAndBankAccount/Delete?id=" + id,
                type: "Get",
                contentType: 'application/json; charset=utf-8',
                success: function (result) {

                    if (result) {
                        swal({
                            title: Resources.DeleteSuccessResource,
                            confirmButtonText: Resources.DoneResource,
                            type: "success"
                        }, function () {
                            window.location.href = '/CbCashAndBankAccount/Index'
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

