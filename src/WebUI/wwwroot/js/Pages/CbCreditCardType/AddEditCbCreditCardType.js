$(document).ready(function () {



    //Active in Create
    $('input[type=radio][name=IsActive]').change(function () {
        if (this.value == "true") {
            $(".disabled-input").attr("disabled", "disabled");
            $("#frezzingReasonBtn").attr("disabled", "disabled");
            $("#FK_DefFreezingReasonId").val("");
            $("#FreezingNotes").val("");
        }
        else {
            $(".disabled-input").removeAttr('disabled');
            $("#frezzingReasonBtn").removeAttr("disabled");

        }


    });


    //Active 
    var activeVal = $('input[name="IsActive"]:checked').val();
    if (activeVal == undefined) {
        $(".disabled-input").removeAttr('disabled');
        $("#frezzingReasonBtn").removeAttr("disabled");

    }

    $("#Amount").change(function () {
        var Amount = parseInt($("#Amount").val());
        if ($('#customControlInline4').is(':checked') && Amount > 100) {
            $("#Amount").val("");
            swal({
                title: Resources.PercentageLessThan100Resource,
                confirmButtonText: Resources.DoneResource,
                type: "error"
            });
        }
    });

    $("#customControlInline4").change(function () {
        var Amount = parseInt($("#Amount").val());
        if ($('#customControlInline4').is(':checked') && Amount > 100) {
            $("#Amount").val("");
            swal({
                title: Resources.PercentageLessThan100Resource,
                confirmButtonText: Resources.DoneResource,
                type: "error"
            });
        }
    });
    /* *********  */
    dataSourceDdlTree = new kendo.data.HierarchicalDataSource({
        transport: {
            read: {
                url: "/GlAccount/GetAllAccountsForDDLTree",
                Type: "GET"
            }
        },
        schema: {
            model: {
                id: "id",
                hasChildren: "hasChildren"
            }
        }
    });

    $("#FK_GlAccountForDiscountId").kendoDropDownTree({
        placeholder: Resources.Choose,
        dataSource: dataSourceDdlTree,
        height: 300,
        dataTextField: "accountNameAr",
        dataValueField: "id",
        filter: "contains",
        //checkboxes: true,
        //checkAll: true,
        autoClose: false,
        //change: onChangeDdlTree
    });
    taxdataSourceDdlTree = new kendo.data.HierarchicalDataSource({
        transport: {
            read: {
                url: "/GlAccount/GetAllAccountsForDDLTree",
                Type: "GET"
            }
        },
        schema: {
            model: {
                id: "id",
                hasChildren: "hasChildren"
            }
        }
    });
    $("#FK_GlAccountForTaxId").kendoDropDownTree({
        placeholder: Resources.Choose,
        dataSource: taxdataSourceDdlTree,
        height: 300,
        dataTextField: "accountNameAr",
        dataValueField: "id",
        filter: "contains",
        //checkboxes: true,
        //checkAll: true,
        autoClose: false,
        //change: onChangeDdlTree
    });

    $("#FK_GlAccountId").kendoDropDownList({
        filter: "contains",
        height: 300,
        dataTextField: "codeAndName",
        dataValueField: "id",
        dataSource: {
            type: "json",
            //serverFiltering: true,
            transport: {
                read: {
                    url: "/CbCashAndBankAccount/GetGlAccountsForCashAndBank",//GetAllAccountsForDDLTree",
                },
                parameterMap: function (data, action) {
                    debugger
                    if (action === "read") {
                        if (Object.keys(data).length > 0 && data.filter != undefined && data.filter.filters["length"] > 0) {
                            return {
                                code: data.filter.filters[0].value,
                                defBranchId: parseInt($("#FK_DefBranchId").val()),
                            };
                        } else {
                            return {
                                code: "",
                                defBranchId: parseInt($("#FK_DefBranchId").val()),
                            };
                        }

                    } else {
                        return data;
                    }
                }
            }
        },
        // select: onCashAndBankSelect
    });
    $("#FK_CbDiscountTypeId").kendoDropDownList({
        filter: "contains",
        height: 300,
        dataTextField: "codeAndName",
        dataValueField: "id",
        dataSource: {
            type: "json",
            //serverFiltering: true,
            transport: {
                read: {
                    url: "/CbDiscountType/GetAllDiscountTypeForDDList",
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
    /* *********  */
    //dataSourceDdlTreeCbAccount = new kendo.data.HierarchicalDataSource({


    //    transport: {
    //        read: {
    //            url: "/CbCashAndBankAccount/GetGlAccountsForCashAndBank",
    //            type: "json",
    //        },
    //        parameterMap: function (data, action) {

    //            if (action === "read") {
    //                return {
    //                    id: data.id,
    //                    defBranchId: parseInt($("#FK_DefBranchId").val()),
    //                };
    //            } else {
    //                return data;
    //            }
    //        }
    //    },
    //    schema: {
    //        model: {
    //            id: "id",
    //            hasChildren: "hasChildren"
    //        }
    //    }
    //});
    //$("#FK_GlAccountId").kendoDropDownTree({
    //    placeholder: Resources.Choose,
    //    dataSource: dataSourceDdlTreeCbAccount,
    //    height: 300,
    //    dataTextField: "accountNameAr",
    //    dataValueField: "id",
    //    //checkboxes: true,
    //    //checkAll: true,
    //    autoClose: false,

    //});


});

function onSelect(e) {
    debugger;
    var item = e.dataItem;
    $("#FK_GlAccountId").val(e.dataItem.id);
    $("#AccountName").val(e.dataItem.accountNameAr);


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

            if (response != null) {
                $("#FK_GlAccountId").val(response.id);

            } else {
                $("#FK_GlAccountId").val(null);
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
        $("#frezzingReasonBtn").attr("disabled", "disabled");
        $("#FK_DefFreezingReasonId").val("");
        $("#FreezingNotes").val("");
    }
    else {
        $("#frezzingReasonBtn").removeAttr("disabled");
        $(".disabled-input").removeAttr('disabled');

    }

}


function removeCreditCardType(id) {

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
                url: "/CbCreditCardType/Delete?id=" + id,
                type: "Get",
                contentType: 'application/json; charset=utf-8',
                success: function (result) {

                    if (result) {
                        swal({
                            title: Resources.DeleteSuccessResource,
                            confirmButtonText: Resources.DoneResource,
                            type: "success"
                        }, function () {
                            window.location.href = '/CbCreditCardType/Index'
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





$("#btnSave").on('click', function () {
    if ($("#FK_GlAccountId").val() == 0 || $("#FK_GlAccountId").val() == "")
        $("#glAccountvalidation").show();
    else
        $("#glAccountvalidation").hide();



    if ($("#formCreditCard").valid() && $("#FK_GlAccountId").val() > 0)
        $("#formCreditCard").submit()

});

