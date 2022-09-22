$(document).ready(function () {

    $('#DefBranches').change(function () {

        $("#FK_GlAccountId").val(0);
        $("#AccountName").val("");
        $("#accountAutoComplete").data("kendoDropDownList").value(0);
        $("#accountAutoComplete").data("kendoDropDownList").dataSource.read();

        $("#FK_CostCenterId").val(0);
        $("#CostCenterName").val("");
        $("#costCenterAutoComplete").data("kendoDropDownList").value(0);
        $("#costCenterAutoComplete").data("kendoDropDownList").dataSource.read();

        $("#FK_GlJournalVoucherCategoryId").data("kendoDropDownList").value("1");
        $("#FK_GlJournalVoucherCategoryId").data("kendoDropDownList").dataSource.read();

        $("#FK_TaxesId").data("kendoDropDownList").value("0");
        $("#FK_TaxesId").data("kendoDropDownList").dataSource.read();

        $("#FK_CbCreditCardTypeId").data("kendoDropDownList").value("0");
        $("#FK_CbCreditCardTypeId").data("kendoDropDownList").dataSource.read();

        $("#FK_HrEmployeeId").data("kendoDropDownList").value("0");
        $("#FK_HrEmployeeId").data("kendoDropDownList").dataSource.read();

        GetNextSerial();
    });

    $('#refreshGLAccount').click(function () {

        $("#iRefreshGLAccount").addClass("fa-spin");
        $("#FK_GlAccountId").val(0);
        $("#accountAutoComplete").data("kendoDropDownList").value(0);
        $("#accountAutoComplete").data("kendoDropDownList").dataSource.read().then(function () {
            $("#iRefreshGLAccount").removeClass("fa-spin");
        });


    });

    $('#refreshTaxCategory').click(function () {

        $("#iRefreshTaxCategory").addClass("fa-spin");
        $("#TaxPercentage").val("");
        $("#Debit").val("");
        $("#Credit").val("");
        $("#TotalTaxAmount").val("");
        $('#TotalTaxAmount').attr('readonly', true);
        $("#IsAmountIncluldeTax").prop('checked', false);
        $('#IsAmountIncluldeTax').prop("disabled", true);
        $("#FK_TaxesId").data("kendoDropDownList").value("0");
        $("#FK_TaxesId").data("kendoDropDownList").dataSource.read().then(function () {
            $("#iRefreshTaxCategory").removeClass("fa-spin");
        });

    });

    $('#clearGLAccount').click(function () {

        $("#FK_GlAccountId").val(0);
        $("#accountAutoComplete").data("kendoDropDownList").value(0);
    });

    $('#clearDescription').click(function () {
        $("#Description").val("");
    });

    $('#editSerial').click(function () {

        if ($('#Serial').is('[readonly]')) {
            $("#Serial").attr("readonly", false);
            $(this).removeClass("text-success");
            $(this).addClass("text-danger");

        } else {
            $("#Serial").attr("readonly", true);
            $(this).removeClass("text-danger");
            $(this).addClass("text-success");

        }
    });
    var now = new Date(),
        today = now.getFullYear() + "-" + ("0" + (now.getMonth() + 1)).slice(-2) + "-" + ("0" + now.getDate()).slice(-2);
    $('#ReferenceDate').val(today);

    var FK_PrimaryCurrencyId = 1;
    var PrimaryCurrencyFactor = 1;

    $.ajax({
        url: "/GlJournalVoucher/GetPrimaryCurrency",
        type: "Get",
        contentType: false,
        processData: false,
        success: function (data) {

            FK_PrimaryCurrencyId = data.id;
            PrimaryCurrencyFactor = data.defaultFactor;
        }
    });
    $("#FK_CbCreditCardTypeId").kendoDropDownList({
        filter: "contains",
        height: 300,
        dataTextField: "codeAndName",
        dataValueField: "id",
        dataSource: {
            type: "json",
            //serverFiltering: true,
            transport: {
                read: {
                    url: "/CbCreditCardTypeGlAccount/GetAllCreditCardTypeByGlAccountIdForDDL",
                },
                parameterMap: function (data, action) {

                    if (action === "read") {
                        return {
                            id: $("#FK_GlAccountId").val(),
                            fK_DefBranchId: parseInt($("#FK_DefBranchId").val()),
                        };


                    } else {
                        return data;
                    }
                }
            }
        },
        select: CbCreditCardType

    });


    function clearCreditCardInputs() {
        $("#FK_GlAccountForDiscountId").val('');
        $("#AccountNameForDiscount").val('');
        $("#AccountCodeForDiscount").val('');
        $("#DiscountAmount").val('');
        $("#DiscountType").val('');
        $("#FK_CbDiscountTypeId").val('');

        $("#FK_GlAccountForTaxId").val('');
        $("#FK_TaxesIdForCCAndAcc").val('');
        $("#TaxNameForCCAndAcc").val('');
        $("#TaxAccountForCCAndAcc").val('');
        $("#TaxCodeForCCAndAcc").val('');
        $("#TaxOnDiscountAmountForCCAndAcc").val('');
        $('#Discount').val('');
        $('#TaxOnDiscount').val('');
        $('#Debit').val(0);
        $('#Credit').val(0);

    }

    function CbCreditCardType(e) {
        clearCreditCardInputs();
        if (e.dataItem.id > 0) {
            $.ajax({
                type: "Get",
                url: "/CbCreditCardTypeGlAccount/GetRelatedDataByGlAccIdAndCCTypeId?accId=" + $("#FK_GlAccountId").val() + "&CCTypeId=" + e.dataItem.id + "&fK_DefBranchId=" + $("#FK_DefBranchId").val(),
                data: "name=John&location=Boston",
                dataType: "json",
                success: function (result) {

                    var debit = parseFloat($('#Debit').val());
                    var credit = parseFloat($('#Credit').val());
                    if (result.id > 0) {
                        $("#FK_GlAccountForDiscountId").val(result.fK_GlAccountForDiscountId);
                        $("#AccountNameForDiscount").val(result.accountNameForDiscount);
                        $("#AccountCodeForDiscount").val(result.accountCodeForDiscount);
                        $("#DiscountAmount").val(result.discountAmount);
                        $("#IsDiscountPercentage").val(result.isDiscountPercentage);
                        $("#DiscountType").val(result.discountType);
                        $("#FK_CbDiscountTypeId").val(result.fK_CbDiscountTypeId);

                        $("#FK_GlAccountForTaxId").val(result.fK_GlAccountForTaxId);
                        $("#FK_TaxesIdForCCAndAcc").val(result.fK_TaxesId);
                        $("#TaxNameForCCAndAcc").val(result.taxName);
                        $("#TaxAccountForCCAndAcc").val(result.taxAccount);
                        $("#TaxCodeForCCAndAcc").val(result.taxCode);
                        $("#TaxOnDiscountAmountForCCAndAcc").val(result.taxOnDiscountAmount);
                        $("#IsTaxPercentage").val(result.isTaxPercentage);
                        var totalDisc = 0;
                        var totalTaxOnDiscount = 0;
                        if (debit > 0) {

                            if (result.isDiscountPercentage == 'true')
                                totalDisc = debit * (result.discountAmount / 100);
                            else
                                totalDisc = result.discountAmount
                            $("#Discount").val(totalDisc.toFixed(4));
                            if (result.isTaxPercentage == 'true')
                                totalTaxOnDiscount = totalDisc * (result.taxOnDiscountAmount / 100);
                            else
                                totalTaxOnDiscount = result.taxOnDiscountAmount;
                            $("#TaxOnDiscount").val(totalTaxOnDiscount.toFixed(4));

                            var finalDept = parseFloat(debit - totalDisc - totalTaxOnDiscount);
                            $("#Debit").val(finalDept.toFixed(2));
                            $('#Credit').val(0);
                        }

                        if (credit > 0) {
                            if (result.isDiscountPercentage == 'true')
                                totalDisc = credit * (result.discountAmount / 100);
                            else
                                totalDisc = result.discountAmount
                            $("#Discount").val(totalDisc.toFixed(4));
                            if (result.isTaxPercentage == 'true')
                                totalTaxOnDiscount = totalDisc * (result.taxOnDiscountAmount / 100);
                            else
                                totalTaxOnDiscount = result.taxOnDiscountAmount;

                            $("#TaxOnDiscount").val(totalTaxOnDiscount.toFixed(4));

                            var finalCredit = parseFloat(credit - totalDisc - totalTaxOnDiscount);
                            $("#Credit").val(finalCredit.toFixed(2));
                            $('#Debit').val(0);
                        }


                    } else {

                    }
                }
            });
        }



    }
    $("#FK_TaxesId").kendoDropDownList({
        filter: "contains",
        height: 300,
        dataTextField: "codeAndName",
        dataValueField: "id",
        dataSource: {
            type: "json",
            //serverFiltering: true,
            transport: {
                read: {
                    url: "/Taxes/GetAllTaxesForDDList",
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
        select: onSelectTaxes

    });

    function onSelectTaxes(e) {
        debugger;
        var today = new Date();
        var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();

        if (e.dataItem.codeAndName == "اختر") {
            $('#TotalTaxAmount').attr('readonly', true);
            $("#IsAmountIncluldeTax").prop('checked', false);
            $('#IsAmountIncluldeTax').prop("disabled", true);

            $('#FK_TaxesId').data("kendoDropDownList").value(0);
            $("#FK_AppliedGlAccountId").val(null);
            $("#AppliedAccountCode").val("");
            $("#AppliedAccountName").val("");
            $("#TaxPercentage").val("");
            $("#TaxName").val("");
        }
        else {
            $('#TotalTaxAmount').attr('readonly', false);
            $('#IsAmountIncluldeTax').prop("disabled", false);

            $.ajax({
                type: "POST",
                url: "/Taxes/IsInDateRange?id=" + e.dataItem.id + "&today=" + date,
                data: "name=John&location=Boston",
                dataType: "json",
                success: function (response) {
                    ;
                    if (response) {

                        $("#FK_AppliedGlAccountId").val(e.dataItem.fK_GlAccountId);
                        $("#AppliedAccountCode").val(e.dataItem.accountCode);
                        $("#AppliedAccountName").val(e.dataItem.accountName);
                        $("#TaxPercentage").val(e.dataItem.amount);
                        $("#TaxName").val(e.dataItem.taxNameAr);

                    } else {
                        swal({
                            title: Resources.TaxTypeOutofDateRange,
                            confirmButtonText: Resources.DoneResource,
                            type: "error"
                        });

                        $('#FK_TaxesId').data("kendoDropDownList").value(0);
                        $("#FK_AppliedGlAccountId").val(null);
                        $("#AppliedAccountCode").val("");
                        $("#AppliedAccountName").val("");
                        $("#TaxPercentage").val("");
                        $("#TaxName").val("");



                    }
                }
            });
        }
        $('#TotalTaxAmount').val(0);
        $('#Debit').val(0);
        $('#Credit').val(0);

    }


    $("#Debit").change(function () {

        if ($("#FK_GlAccountForDiscountId").val() > 0 && $("#FK_TaxesIdForCCAndAcc").val() > 0) {

            var totalDisc = 0,
                totalTaxOnDiscount = 0,
                debit = parseFloat($('#Debit').val()),
                discountAmount = parseFloat($("#DiscountAmount").val()),
                isDiscountPercentage = $('#IsDiscountPercentage').val(),
                isTaxOnDiscountPercentage = $('#IsTaxPercentage').val(),
                taxOnDiscountAmount = parseFloat($("#TaxOnDiscountAmountForCCAndAcc").val());
            // var credit = parseFloat($('#Credit').val());

            var discount = parseFloat($("#Discount").val());
            if (isDiscountPercentage == 'true') {
                totalDisc = debit * (discountAmount / 100);
            }
            else {
                totalDisc = discountAmount;
            }
            $("#Discount").val(totalDisc.toFixed(4));
            if (isTaxOnDiscountPercentage == 'true') {
                totalTaxOnDiscount = totalDisc * (taxOnDiscountAmount / 100);
            }
            else {
                totalTaxOnDiscount = taxOnDiscountAmount;
            }
            $("#TaxOnDiscount").val(totalTaxOnDiscount.toFixed(4));

            var finalDept = parseFloat(debit - totalDisc - totalTaxOnDiscount);
            $("#Debit").val(finalDept.toFixed(2));
            $('#Credit').val(0);

        } else {


            $("#Credit").val(0);
            $("#TotalTaxAmount").val(0);
            var debitValue = parseFloat($(this).val()),
                taxPercentage = parseFloat($("#TaxPercentage").val());
            var result = 0;

            if ($("#IsAmountIncluldeTax").prop("checked") == true && debitValue > 0) {
                var debitWithoutTax = parseFloat(debitValue / (1 + (taxPercentage / 100))).toFixed(2);
                result = parseFloat(debitValue - debitWithoutTax).toFixed(2);
            }


            else {
                result = debitValue * (taxPercentage / 100).toFixed(2);
            }
            //  SetTaxValue();
            $("#TotalTaxAmount").val(result);
        }
    });

    $("#Credit").change(function () {


        if ($("#FK_GlAccountForDiscountId").val() > 0 && $("#FK_TaxesIdForCCAndAcc").val() > 0) {

            var totalDisc = 0,
                totalTaxOnDiscount = 0,
                credit = parseFloat($('#Credit').val()),
                discountAmount = parseFloat($("#DiscountAmount").val()),
                taxOnDiscountAmount = parseFloat($("#TaxOnDiscountAmountForCCAndAcc").val()),
                isDiscountPercentage = $('#IsDiscountPercentage').val(),
                isTaxOnDiscountPercentage = $('#IsTaxPercentage').val();

            var discount = parseFloat($("#Discount").val());
            if (isDiscountPercentage == 'true')
                totalDisc = credit * (discountAmount / 100);
            else
                totalDisc = discountAmount;

            $("#Discount").val(totalDisc.toFixed(4));
            if (isTaxOnDiscountPercentage == 'true') {
                totalTaxOnDiscount = totalDisc * (taxOnDiscountAmount / 100);
            }
            else {
                totalTaxOnDiscount = taxOnDiscountAmount;
            }
            $("#TaxOnDiscount").val(totalTaxOnDiscount.toFixed(4));
            var finalCredit = parseFloat(credit - totalDisc - totalTaxOnDiscount);
            $("#Credit").val(finalCredit.toFixed(2));
            $('#Debit').val(0);


        } else {
            $("#Debit").val(0);
            $("#TotalTaxAmount").val(0);
            var creditValue = parseFloat($(this).val()),
                taxPercentage = parseFloat($("#TaxPercentage").val());
            var result = 0;

            if ($("#IsAmountIncluldeTax").prop("checked") == true && creditValue > 0) {
                var creditWithoutTax = parseFloat(creditValue / (1 + (taxPercentage / 100))).toFixed(2);
                result = parseFloat(creditValue - creditWithoutTax).toFixed(2);
            }


            else {
                result = creditValue * (taxPercentage / 100).toFixed(2);
            }
            //  SetTaxValue();
            $("#TotalTaxAmount").val(result);
        }
    });

    $("#FK_HrEmployeeId").kendoDropDownList({
        filter: "contains",
        height: 300,
        dataTextField: "codeAndName",
        dataValueField: "id",
        dataSource: {
            type: "json",
            //serverFiltering: true,
            transport: {
                read: {
                    url: "/HrEmployee/GetAllEmployeeForDDList",
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
        select: onSelectEmployee

    });
    function onSelectEmployee(e) {
        ;
        var x = e.dataItem.codeAndName;
        if (e.dataItem.codeAndName == "اختر") {
            $("#FK_TaxesId").data("kendoDropDownList").enable(true);
            //dropdownlist.enable(false);
        }
        else {

            if (parseInt($("#FK_GlAccountId").val()) > 0) {
                $("#FK_TaxesId").data("kendoDropDownList").value("0");
                $('#TaxPercentage').val('');
                $("#FK_TaxesId").data("kendoDropDownList").dataSource.read();
                $("#FK_TaxesId").data("kendoDropDownList").enable(false);
            }

        }

    }

    // cost center
    $("#costCenterAutoComplete").kendoDropDownList({
        filter: "contains",
        height: 300,
        dataTextField: "codeAndName",
        dataValueField: "id",

        dataSource: {
            type: "json",
            //serverFiltering: true,
            transport: {
                read: {
                    url: "/CostCenter/GetAllCostCentersForDDList",
                },
                parameterMap: function (data, action) {

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
        select: onSelectCostCenter
    });

    function onSelectCostCenter(e) {
        $("#FK_CostCenterId").val(e.dataItem.id);
        $("#CostCenterName").val(e.dataItem.costCenterNameAr);
    }

    $("#FK_GlJournalVoucherCategoryId").kendoDropDownList({
        filter: "contains",
        height: 300,
        dataTextField: "codeAndName",
        dataValueField: "id",

        dataSource: {
            type: "json",
            //serverFiltering: true,
            transport: {
                read: {
                    url: "/GlJournalVoucher/GetAllCategoriesForDDList",
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
    $("#FK_GlJournalVoucherCategoryId").data("kendoDropDownList").value("1");
    var currencyFactorVal = $("#CurrencyFactor").val();
    if (currencyFactorVal == 1)
        $('#CurrencyFactor').attr('readonly', true);
    else
        $('#CurrencyFactor').attr('readonly', false);

    $("#FK_DefCurrencyId").change(function (e) {
        //var kendoDate = $("#datetimepicker").data("kendoDatePicker");
        var voucherDate = new Date($("#VoucherDate").val());
        var DefcurrencyId = parseInt($("#FK_DefCurrencyId").val());
        $.ajax({
            url: "/GlJournalVoucher/GetCurrencyFactorByIdInPeriod?id=" + DefcurrencyId + "&period=" + voucherDate /*voucherDate.toUTCString()*/,
            type: "Get",
            contentType: false,
            processData: false,
            success: function (data) {

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

    //Account

    $("#accountAutoComplete").kendoDropDownList({
        filter: "contains",
        height: 300,
        dataTextField: "codeAndName",
        dataValueField: "id",
        dataSource: {
            type: "json",
            //serverFiltering: true,
            transport: {
                read: {
                    url: "/GlAccount/GetAllAccountsForDDList",
                },
                parameterMap: function (data, action) {

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
        select: onSelectAccount,
        template: '<span class=\" #= isMainAccount ? "text-danger" : "" #\">#: codeAndName #</span>'
    });

    function onSelectAccount(e) {

        $("#FK_GlAccountForDiscountId").val("");
        $("#AccountNameForDiscount").val("");
        $("#DiscountAmount").val("");
        $("#DiscountType").val("");
        $('#Debit').val(0);
        $('#Credit').val(0);

        $("#FK_TaxesIdForCCAndAcc").val("");
        $("#TaxNameForCCAndAcc").val("");
        $("#TaxAccountForCCAndAcc").val("");
        $("#TaxOnDiscountAmountForCCAndAcc").val("");
        $("#Discount").val("");
        $("#TaxOnDiscount").val("");
        $("#IsTaxPercentage").val('');
        $("#IsDiscountPercentage").val('');
        $.ajax({
            type: "POST",
            url: "/GlAccount/IsMainAccount?id=" + e.dataItem.id,
            data: "name=John&location=Boston",
            dataType: "json",
            success: function (response) {


                ;
                if (response) {
                    $("#FK_GlAccountId").val(0);
                    $("#AccountName").val("");
                    $("#accountAutoComplete").data("kendoDropDownList").value(0);
                    swal({
                        title: Resources.NoTansactionCanMadeOnMainAccounts,
                        confirmButtonText: Resources.DoneResource,
                        type: "error"
                    });
                } else {
                    $("#FK_GlAccountId").val(e.dataItem.id);
                    $("#AccountName").val(e.dataItem.accountNameAr);

                    $("#FK_CbCreditCardTypeId").data("kendoDropDownList").value("0");
                    $("#FK_CbCreditCardTypeId").data("kendoDropDownList").dataSource.read().then(function () {

                        var dropDown = $("#FK_CbCreditCardTypeId").data("kendoDropDownList");
                        if (dropDown.dataSource.data().length > 1) {

                            $('#TotalTaxAmount').val('');
                            $('#TaxPercentage').val('');
                            $("#IsAmountIncluldeTax").prop('checked', false);
                            $('#IsAmountIncluldeTax').prop("disabled", true);
                            $("#FK_TaxesId").data("kendoDropDownList").value("0");
                            $("#FK_TaxesId").data("kendoDropDownList").dataSource.read();
                            $('#FK_TaxesId').attr('disabled', true);
                            $("#FK_TaxesId").data("kendoDropDownList").enable(false);

                        } else {
                            if (parseInt($("#FK_HrEmployeeId").val()) > 0) {
                                $("#FK_TaxesId").data("kendoDropDownList").value("0");
                                $('#TaxPercentage').val('');
                                $("#FK_TaxesId").data("kendoDropDownList").dataSource.read();
                                $("#FK_TaxesId").data("kendoDropDownList").enable(false);

                            }
                            else
                                $("#FK_TaxesId").data("kendoDropDownList").enable(true);
                        }

                    });

                }
            }
        });
    }



    var tempSource = new kendo.data.DataSource({

    });
    var gridBound = $("#GlJournalDetailsgrid").kendoGrid({
        dataSource: tempSource,
        //navigatable: true,
        scrollable: true,
        pageable: false,
        columns: [
            { field: "hdnAttachmentIds", hidden: true },
            { field: "FK_HrEmployeeId", hidden: true, format: "{0:c}", width: 120 },
            { field: "FK_CbCreditCardTypeId", hidden: true, format: "{0:c}", width: 120 },
            { field: "CreditCardTypeName", hidden: true, format: "{0:c}", width: 120 },
            { field: "FK_GlAccountForDiscountId", hidden: true, format: "{0:c}", width: 120 },
            { field: "DiscountPercentage", hidden: true, format: "{0:c}", width: 120 },
            { field: "FK_GlAccountForTaxId", hidden: true, format: "{0:c}", width: 120 },
            { field: "FK_CbDiscountTypeId", hidden: true, format: "{0:c}", width: 120 },
            { field: "FK_TaxesId", hidden: true, format: "{0:c}", width: 120 },
            { field: "TaxName", hidden: true, format: "{0:c}", width: 120 },
            { field: "FK_AppliedGlAccountId", hidden: true, format: "{0:c}", width: 120 },
            { field: "AssociatedRowKey", hidden: true, width: 120 },
            { field: "FK_GlAccountId", hidden: true, format: "{0:c}", width: 120 },
            { field: "order", hidden: true, width: Resources.InputNumberWidth, title: Resources.Serial },
            { width: Resources.InputNumberWidth, template: "<span class='counter'> </span>", title: Resources.Serial }, {
                field: "Account", width: Resources.NameWidth, title: Resources.Account,
                template: "#: Account# #: CostCenter # #: EmployeeName # - #: Description#"
                // template: "#: Account#  -  #: CostCenter # - #: EmployeeName #  -  #: Description#"
            },
            { field: "Serial", width: Resources.InputNumberWidth, title: Resources.VoucherCode },
            { field: "TaxName", hidden: true, width: Resources.NameWidth, title: Resources.TaxName },
            { field: "TaxPercentage", hidden: true, width: Resources.InputNumberWidth, title: Resources.TaxValueResource },
            { field: "AmountIncluldeTax", hidden: true, width: Resources.NameWidth, title: Resources.AmountIncluldeTax },
            { field: "ReferenceNumber", width: Resources.InputNumberWidth, title: Resources.ReferenceNumber },
            { field: "ReferenceDate", format: "{0:yyyy/MM/dd}", width: Resources.DateWidth, title: Resources.BondDate },
            { field: "Debit", width: Resources.InputNumberWidth, title: Resources.Debit, editor: numberEditor, format: '{0:n2}' },
            { field: "Credit", width: Resources.InputNumberWidth, title: Resources.Credit, editor: numberEditor, format: '{0:n2}' },
            { field: "Description", hidden: true, width: Resources.DescriptionWidth, title: Resources.Description },
            { field: "FK_DefCurrencyId", hidden: true, format: "{0:c}", width: 120 },
            { field: "CurrencyName", hidden: true, width: Resources.CodeWidth, title: Resources.Currency },
            { field: "CurrencyFactor", hidden: true, width: Resources.NameWidth, title: Resources.CurrencyFactor },
            { field: "FK_CostCenterId", hidden: true, width: 140, title: Resources.CostCenterCode },
            //{ field: "CostCenterCode", width: Resources.CodeWidth, title: Resources.CostCenterCode },
            { field: "TaxNumber", hidden: true, width: Resources.InputNumberWidth, title: Resources.TaxNumber },
            { field: "CostCenter", hidden: true, width: Resources.NameWidth, title: Resources.CostCenter },
            { field: "EmployeeName", hidden: true, width: Resources.NameWidth, title: Resources.EmployeeName },
            { field: "Notes", hidden: true, width: Resources.NoteWidth, title: Resources.Notes },
            { width: Resources.DoubleActionWidth, template: "<a  class='btn btn-danger btn-sm btnDelete' ><i class='fas fa-trash-alt'></i></a> <a class='btn btn-success btn-sm btnEdit'><i class='fas fa-edit'></i></a> <button type='button' class='btn btn-info btn-sm btnFiles'><i class='fas fa-paperclip'></i></button>" },
        ],
        editable: false,
        selectable: "multiple, cell",
        dataBound: function (e) {

            e.sender.items().each(function () {
                var dataItem = e.sender.dataItem(this);
                kendo.bind(this, dataItem);
                if (dataItem.FK_TaxesId > 0 && dataItem.Credit == 0 && dataItem.Debit == 0) {
                    var $row = $('#GlJournalDetailsgrid').find("[data-uid='" + dataItem.uid + "']");
                    $row.hide();
                }
            })

        },
        noRecords: true,
        sortable: true,
        reorderable: true,
        groupable: true,
        resizable: true,
        messages: {
            noRecords: "There is no data on current page"
        },

    });
    gridBound.data("kendoGrid").table.on("click", ".btnDelete", removeBondDetailRow);
    gridBound.data("kendoGrid").table.on("click", ".btnEdit", editVoucherDetailRow);
    gridBound.data("kendoGrid").table.on("click", ".btnFiles", ShowFiles);

    function ShowFiles() {

        var row = $(this).closest("tr"),
            grid = $("#GlJournalDetailsgrid").data("kendoGrid"),
            dataItem = grid.dataItem(row);

        var modulePage = $('#hdnModulePageDetail').val();
        var refrenceId = 0;//$('#hdnRefrenceId').val();
        var ids = dataItem.hdnAttachmentIds;
        var url = '/Attachment/Get?modulePage=' + modulePage + '&refId=' + refrenceId + '&attachmentIds=' + ids + '&redirect=' + "ViewOnly";
        var divAttachmentInvoiceList = $('#divAttachmentInvoiceList');
        divAttachmentInvoiceList.load(url);
        $("#Attach-file-Details").modal('toggle');
    }

    function numberEditor(container, options) {
        $('<input name="' + options.field + '"/>')
            .appendTo(container)
            .kendoNumericTextBox({
                format: "{0:n2}",
                decimals: 3,
                step: 0.001
            });
    }

    function editVoucherDetailRow() {

        ClearFormDetails();
        var row = $(this).closest("tr"),
            grid = $("#GlJournalDetailsgrid").data("kendoGrid"),
            dataItem = grid.dataItem(row);
        var uid = dataItem.uid;
        $("#uid").val(dataItem.uid);
        $("#FK_GlAccountId").val(dataItem.FK_GlAccountId);
        $("#FK_HrEmployeeId").val(dataItem.FK_HrEmployeeId);

        $("#hdnAttachmentDetailIds").val(dataItem.hdnAttachmentIds);
        var modulePageDetail = $('#hdnModulePageDetail').val();

        var url = '/Attachment/Get?modulePage=' + modulePageDetail + '&refId=' + 0 + '&attachmentIds=' + dataItem.hdnAttachmentIds + '&redirect=' + "ViewDetails";
        var divAttachmentDetailList = $('#divAttachmentDetailList');
        divAttachmentDetailList.load(url);

        $("#Serial").val(dataItem.Serial);
        // $("#accountAutoComplete").val(dataItem.AccountCode);
        $("#accountAutoComplete").data("kendoDropDownList").value(dataItem.FK_GlAccountId);
        var empId = dataItem.FK_HrEmployeeId;
        if (empId == null || isNaN(empId))
            empId = 0
        if (empId > 0)
            $("#FK_TaxesId").data("kendoDropDownList").enable(false);

        $("#FK_HrEmployeeId").data("kendoDropDownList").value(empId);

        $("#AccountName").val(dataItem.AccountName);

        $("#ReferenceNumber").val(dataItem.ReferenceNumber);
        //$("#ReferenceDate").val(new Date(dataItem.ReferenceDate));
        $("#Debit").val(parseFloat(dataItem.Debit.toString().replace(/\,/g, '')));
        $("#Credit").val(parseFloat(dataItem.Credit.toString().replace(/\,/g, '')));
        $("#Description").val(dataItem.Description);
        //CurrencyName = jQuery("#FK_DefCurrencyId option:selected").text();
        //$("#costCenterAutoComplete").val(dataItem.CostCenterCode);
        $("#costCenterAutoComplete").data("kendoDropDownList").value(dataItem.FK_CostCenterId);
        $("#FK_CostCenterId").val(parseInt(dataItem.FK_CostCenterId));
        $("#CostCenterName").val(dataItem.CostCenterName);


        var data = grid.dataSource.data();
        var res = $.grep(data, function (d) {
            return d.AssociatedRowKey == uid;
        });

        var hasCreditType = res.filter(function (r) { return r.FK_CbCreditCardTypeId > 0 });
        for (var i = 0; i < res.length; i++) {
            if (res[i].FK_TaxesId > 0 && res[i].FK_AppliedGlAccountId != undefined && hasCreditType.length == 0) {
                $("#FK_TaxesId").data("kendoDropDownList").enable(true);
                $("#FK_TaxesId").data("kendoDropDownList").value(res[i].FK_TaxesId);

                $("#FK_CbCreditCardTypeId").data("kendoDropDownList").value(0);
                $("#FK_GlAccountForDiscountId").val("");
                $("#AccountNameForDiscount").val("");
                $("#DiscountAmount").val("");
                $("#DiscountType").val("");

                $("#FK_TaxesIdForCCAndAcc").val("");
                $("#TaxNameForCCAndAcc").val("");
                $("#TaxAccountForCCAndAcc").val("");
                $("#TaxOnDiscountAmountForCCAndAcc").val("");
                $("#Discount").val("");
                $("#TaxOnDiscount").val("");

                $("#TaxPercentage").val(res[i].TaxPercentage);
                $("#TaxNumber").val(res[i].TaxNumber);
                $("#AmountIncluldeTax").val(res[i].AmountIncluldeTax);
                $("#FK_AppliedGlAccountId").val(res[i].FK_AppliedGlAccountId);
                $("#TaxName").val(res[i].TaxName);
                if (res[i].Debit != 0)
                    $("#TotalTaxAmount").val(parseFloat(res[i].Debit.toString().replace(/\,/g, '')));

                if (res[i].Credit != 0)
                    $("#TotalTaxAmount").val(parseFloat(res[i].Credit.toString().replace(/\,/g, '')));

                $('#TotalTaxAmount').attr('readonly', false);

                if (res[i].AmountIncluldeTax > 0 && res[i].Credit.toString().replace(/\,/g, '') > 0) {
                    $("#IsAmountIncluldeTax").prop('checked', true);
                    $("#Credit").val(res[i].AmountIncluldeTax);
                }
                if (res[i].AmountIncluldeTax > 0 && res[i].Debit.toString().replace(/\,/g, '') > 0) {
                    $("#IsAmountIncluldeTax").prop('checked', true);
                    $("#Debit").val(res[i].AmountIncluldeTax);
                }
                $('#IsAmountIncluldeTax').prop("disabled", false);


            }
            if (res[i].FK_TaxesId > 0 && res[i].FK_GlAccountForTaxId > 0 && res[i].FK_AppliedGlAccountId != undefined && hasCreditType.length > 0) {
                //$("#FK_TaxesId").data("kendoDropDownList").value(res[i].FK_TaxesId);
                $("#FK_TaxesIdForCCAndAcc").val(res[i].FK_TaxesId);
                $("#FK_GlAccountForTaxId").val(res[i].FK_GlAccountForTaxId);
                $("#TaxNumber").val(res[i].TaxNumber);
                $("#FK_AppliedGlAccountId").val(res[i].FK_AppliedGlAccountId);
                $("#TaxNameForCCAndAcc").val(res[i].TaxName);

                //$("#TaxOnDiscountAmountForCCAndAcc").val(res[i].TaxPercentage);

                if (res[i].Debit != 0)
                    $("#TaxOnDiscount").val(parseFloat(res[i].Debit.toString().replace(/\,/g, '')));

                if (res[i].Credit != 0)
                    $("#TaxOnDiscount").val(parseFloat(res[i].Credit.toString().replace(/\,/g, '')));

            }
            if (res[i].FK_CbDiscountTypeId > 0 && res[i].FK_CbCreditCardTypeId != undefined && res[i].FK_AppliedGlAccountId != undefined && hasCreditType.length > 0) {
                $("#FK_TaxesId").data("kendoDropDownList").enable(false);
                $("#FK_TaxesId").data("kendoDropDownList").value(0);
                $("#TaxPercentage").val('');

                $("#FK_CbDiscountTypeId").val(res[i].FK_CbDiscountTypeId);
                $("#FK_GlAccountForDiscountId").val(res[i].FK_GlAccountForDiscountId);
                $("#DiscountPercentage").val(res[i].DiscountPercentage)
                $("#FK_CbCreditCardTypeId").data("kendoDropDownList").value(res[i].FK_CbCreditCardTypeId);

                if (res[i].Debit != 0)
                    $("#Discount").val(parseFloat(res[i].Debit.toString().replace(/\,/g, '')));

                if (res[i].Credit != 0)
                    $("#Discount").val(parseFloat(res[i].Credit.toString().replace(/\,/g, '')));

                if (res[i].fK_CbCreditCardTypeId > 0) {

                    var cbCreditCardTypeId = res[i].fK_CbCreditCardTypeId;
                    $("#FK_CbCreditCardTypeId").data("kendoDropDownList").dataSource.read().then(function () {

                        $("#FK_CbCreditCardTypeId").data("kendoDropDownList").value(cbCreditCardTypeId);
                        $.ajax({
                            type: "Get",
                            url: "/CbCreditCardTypeGlAccount/GetRelatedDataByGlAccIdAndCCTypeId?accId=" + $("#FK_GlAccountId").val() + "&CCTypeId=" + cbCreditCardTypeId + "&fK_DefBranchId=" + $("#FK_DefBranchId").val(),
                            data: "name=John&location=Boston",
                            dataType: "json",
                            success: function (result) {

                                var debit = parseFloat($('#Debit').val());
                                var credit = parseFloat($('#Credit').val());
                                if (result.id > 0) {

                                    $("#FK_GlAccountForDiscountId").val(result.fK_GlAccountForDiscountId);
                                    $("#AccountNameForDiscount").val(result.accountNameForDiscount);
                                    $("#AccountCodeForDiscount").val(result.accountCodeForDiscount);
                                    $("#DiscountAmount").val(result.discountAmount);
                                    $("#DiscountType").val(result.discountType);
                                    $("#FK_CbDiscountTypeId").val(result.fK_CbDiscountTypeId);

                                    $("#FK_GlAccountForTaxId").val(result.fK_GlAccountForTaxId);
                                    $("#FK_TaxesIdForCCAndAcc").val(result.fK_TaxesId);
                                    $("#TaxNameForCCAndAcc").val(result.taxName);
                                    $("#TaxAccountForCCAndAcc").val(result.taxAccount);
                                    $("#TaxCodeForCCAndAcc").val(result.taxCode);
                                    $("#TaxOnDiscountAmountForCCAndAcc").val(result.taxOnDiscountAmount);



                                } else {
                                }
                            }
                        });
                    });
                }
            }
        }
        //$("#Notes").val(dataItem.);
        var ReferenceDate = dataItem.ReferenceDate;
        var referenceDate = ReferenceDate.getFullYear() + "-" + ("0" + (ReferenceDate.getMonth() + 1)).slice(-2) + "-" + ("0" + ReferenceDate.getDate()).slice(-2);
        $('#ReferenceDate').val(referenceDate);

        setGridSerial();
    }

    function removeBondDetailRow() {

        var TotalDebit = parseInt($("#TotalDebit").val());
        var TotalCredit = parseInt($("#TotalCredit").val());

        var row = $(this).closest("tr"),
            grid = $("#GlJournalDetailsgrid").data("kendoGrid"),
            dataItem = grid.dataItem(row);

        var uid = dataItem.uid;

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
                var dataSource = $("#GlJournalDetailsgrid").data("kendoGrid").dataSource;

                if (dataSource.remove(dataItem)) {
                    swal({
                        title: Resources.DeleteSuccessResource,
                        confirmButtonText: Resources.DoneResource,
                        type: "success"
                    });

                    setGridSerial();
                    var data = grid.dataSource.data();
                    var res = $.grep(data, function (d) {
                        return d.AssociatedRowKey == uid;
                    });
                    for (var i = 0; i < res.length; i++) {
                        if (res[i].AssociatedRowKey == dataItem.uid) {
                            dataSource.remove(res[i]);
                        }
                    }

                    grid.tbody.find("tr[role='row']").each(function () {

                        var model = grid.dataItem(this);

                        if (model != undefined && model.FK_TaxesId > 0 && model.FK_AppliedGlAccountId) {
                            $(this).find(".btnDelete").addClass("k-state-disabled");
                            $(this).find(".btnEdit").addClass("k-state-disabled");
                            $(this).find(".btnFiles").addClass("k-state-disabled");

                        }
                    });
                    getTotalDebit();
                    getTotalCredit();
                    getTotalBalance();

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

    /* End Adding in Grid*/
    $("#btnAddNewJournalDetail").on('click', function () {
        debugger;
        var FK_GlAccountId = $("#FK_GlAccountId").val(),
            Serial = $("#Serial").val(),
            Account = $("#accountAutoComplete").data("kendoDropDownList").text(),
            EmployeeName = $("#FK_HrEmployeeId").data("kendoDropDownList").text(),
            ReferenceNumber = $("#ReferenceNumber").val(),
            ReferenceDate = new Date($("#ReferenceDate").val()),
            Debit = $("#Debit").val(),
            Credit = $("#Credit").val(),
            Description = $("#Description").val(),
            FK_DefCurrencyId = FK_PrimaryCurrencyId,
            CurrencyName = jQuery("#FK_DefCurrencyId option:selected").text(),
            CurrencyFactor = PrimaryCurrencyFactor,
            CostCenter = $("#costCenterAutoComplete").data("kendoDropDownList").text(),
            FK_CostCenterId = parseInt($("#FK_CostCenterId").val()),
            FK_HrEmployeeId = parseInt($("#FK_HrEmployeeId").val()),
            FK_TaxesId = parseInt($("#FK_TaxesId").val()),
            TaxName = $("#TaxName").val(),
            FK_AppliedGlAccountId = parseInt($("#FK_AppliedGlAccountId").val()),
            TaxPercentage = parseFloat($("#TaxPercentage").val()),
            TaxNumber = $("#TaxNumber").val(),
            TotalTaxAmount = parseFloat($("#TotalTaxAmount").val()),
            AmountIncluldeTax = parseFloat(0),
            AppliedAccount = $("#AppliedAccountCode").val() + "--" + $("#AppliedAccountName").val(),
            FK_CbCreditCardTypeId = parseInt($("#FK_CbCreditCardTypeId").val()),
            CreditCardTypeName = $("#FK_CbCreditCardTypeId").data("kendoDropDownList").text(),
            DiscountPercentage = $("#DiscountAmount").val(),
            Discount = $("#Discount").val(),
            TaxOnDiscount = $("#TaxOnDiscount").val(),
            TaxOnDiscountAmountForCCAndAcc = $("#TaxOnDiscount").val(),
            FK_CbDiscountTypeId = parseInt($("#FK_CbDiscountTypeId").val()),
            FK_GlAccountForDiscountId = parseInt($("#FK_GlAccountForDiscountId").val()),
            FK_GlAccountForTaxId = parseInt($("#FK_GlAccountForTaxId").val()),
            FK_TaxesIdForCCAndAcc = parseInt($("#FK_TaxesIdForCCAndAcc").val()),
            AppliedAccountForTaxCCAndAcc = $("#TaxCodeForCCAndAcc").val() + "--" + $("#TaxAccountForCCAndAcc").val(),
            TaxCodeForCCAndAcc = $("#TaxCodeForCCAndAcc").val(),
            AppliedAccountForDiscountCCAndAcc = $("#AccountCodeForDiscount").val() + "--" + $("#AccountNameForDiscount").val(),
            TaxNameForCCAndAcc = $("#TaxNameForCCAndAcc").val(),
            uid = $("#uid").val(),
            Notes = $("#Notes").val(),
            hdnAttachmentIds = $("#hdnAttachmentDetailIds").val();


        var TaxDebitAmount = 0;
        var TaxCreditAmount = 0;
        var DiscountDebitAmount = 0;
        var DiscountCreditAmount = 0;
        if (isNaN(FK_TaxesIdForCCAndAcc))
            FK_TaxesIdForCCAndAcc = 0;


        if (FK_HrEmployeeId == 0) {
            FK_HrEmployeeId = null;
            EmployeeName = "";
        }
        else { EmployeeName = ' - ' + EmployeeName; }

        if (FK_CostCenterId == 0 || isNaN(FK_CostCenterId)) {
            CostCenterCode = "";
            CostCenter = "";
            FK_CostCenterId = 0;
        }

        else { CostCenter = ' - ' + CostCenter }
        if (FK_GlAccountId == "" || FK_GlAccountId == "0" || FK_DefCurrencyId == "" || CurrencyFactor == "" || Description == "") {
            swal({
                title: Resources.DataNotCompletedResource,
                confirmButtonText: Resources.DoneResource,
                type: "error"
            });


        }
        else if ((Debit == "" && Credit == "") || (Debit == "0" && Credit == "0")) {
            swal({
                title: Resources.DebitCreditRequiredResource,
                confirmButtonText: Resources.DoneResource,
                type: "error"
            });
        }

        else {
            var debitFormated = Debit.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
            var creditFormated = Credit.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
            var totalRecords = $("#GlJournalDetailsgrid").data("kendoGrid").dataSource.data().length;
            var data = $("#GlJournalDetailsgrid").data("kendoGrid").dataSource;
            var Index = parseInt($("#Index").val());
            if (!isNaN(Index))
                totalRecords = Index - 1;

            var grid = $("#GlJournalDetailsgrid").data("kendoGrid");
            var data = grid.dataSource.data();
            var res = $.grep(data, function (d) {
                return d.uid == uid;
            });

            if (uid != "" && res.length > 0) {
                debugger
                var grid = $("#GlJournalDetailsgrid").data("kendoGrid");
                var row = $("#GlJournalDetailsgrid").data("kendoGrid")
                    .tbody
                    .find("tr[data-uid='" + uid + "']");

                var dataItem = grid.dataItem(row);
                var dataRows = grid.items();
                var rowIndex = dataItem.order - 1;
                var data = grid.dataSource.data();
                var res = $.grep(data, function (d) {
                    return d.AssociatedRowKey == uid;
                });
                if (res.length == 0) {
                    dataItem.set("hdnAttachmentIds", hdnAttachmentIds);
                    dataItem.set("FK_GlAccountId", FK_GlAccountId);
                    dataItem.set("FK_TaxesId", FK_TaxesId);
                    dataItem.set("TaxPercentage", TaxPercentage);
                    dataItem.set("Serial", Serial);
                    dataItem.set("Account", Account);
                    dataItem.set("AssociatedRowKey", uid);
                    dataItem.set("ReferenceNumber", ReferenceNumber);
                    dataItem.set("ReferenceDate", ReferenceDate);
                    dataItem.set("Debit", debitFormated);
                    dataItem.set("Credit", creditFormated);
                    dataItem.set("Description", Description);
                    dataItem.set("FK_DefCurrencyId", FK_DefCurrencyId);
                    dataItem.set("CurrencyName", CurrencyName);
                    dataItem.set("CurrencyFactor", CurrencyFactor);
                    dataItem.set("CostCenter", CostCenter);
                    dataItem.set("FK_CostCenterId", FK_CostCenterId);
                    dataItem.set("FK_HrEmployeeId", FK_HrEmployeeId);
                    dataItem.set("EmployeeName", EmployeeName);
                }
                debugger;
                if (FK_TaxesId != 0 && res.length == 0) {
                    if (Debit > 0)
                        TaxDebitAmount = parseFloat($("#TotalTaxAmount").val()).toFixed(2).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
                    if (Credit > 0)
                        TaxCreditAmount = parseFloat($("#TotalTaxAmount").val()).toFixed(2).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");

                    tempSource.insert(rowIndex, {
                        FK_GlAccountId: FK_AppliedGlAccountId,
                        FK_AppliedGlAccountId: FK_GlAccountId,
                        FK_TaxesId: FK_TaxesId,
                        FK_GlAccountForTaxId: FK_AppliedGlAccountId,
                        Serial: Serial,
                        Account: TaxName,
                        TaxName: TaxName,
                        AssociatedRowKey: uid,
                        TaxPercentage: TaxPercentage,
                        TaxNumber: TaxNumber,
                        AmountIncluldeTax: AmountIncluldeTax,
                        ReferenceNumber: ReferenceNumber,
                        ReferenceDate: ReferenceDate,
                        Debit: TaxDebitAmount,
                        Credit: TaxCreditAmount,
                        Description: Description,
                        FK_DefCurrencyId: FK_DefCurrencyId,
                        CurrencyName: CurrencyName,
                        CurrencyFactor: CurrencyFactor,
                        CostCenter: CostCenter,
                        FK_CostCenterId: FK_CostCenterId,
                        FK_HrEmployeeId: FK_HrEmployeeId,
                        EmployeeName: EmployeeName,
                        Notes: Notes,

                    });



                }
                else if (FK_CbCreditCardTypeId != 0 && res.length == 0) {


                    if (Debit > 0) {
                        TaxDebitAmount = parseFloat($("#TaxOnDiscount").val()).toFixed(2).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
                        DiscountDebitAmount = parseFloat($("#Discount").val()).toFixed(2).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");

                    }
                    if (Credit > 0) {
                        TaxCreditAmount = parseFloat($("#TaxOnDiscount").val()).toFixed(2).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
                        DiscountCreditAmount = parseFloat($("#Discount").val()).toFixed(2).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");

                    }

                    //Tax Row
                    tempSource.insert(rowIndex, {
                        FK_GlAccountId: FK_GlAccountForTaxId,
                        FK_GlAccountForTaxId: FK_GlAccountForTaxId,
                        FK_AppliedGlAccountId: FK_GlAccountId,
                        FK_TaxesId: FK_TaxesIdForCCAndAcc,
                        Serial: Serial,
                        Account: TaxNameForCCAndAcc,
                        TaxName: TaxNameForCCAndAcc,
                        CreditCardTypeName: CreditCardTypeName,
                        AssociatedRowKey: uid,
                        TaxPercentage: parseFloat(TaxOnDiscountAmountForCCAndAcc),
                        TaxNumber: TaxNumber,
                        AmountIncluldeTax: 0,
                        DiscountPercentage: 0,
                        ReferenceNumber: ReferenceNumber,
                        ReferenceDate: ReferenceDate,
                        Debit: TaxDebitAmount,
                        Credit: TaxCreditAmount,
                        Description: Description,
                        FK_DefCurrencyId: FK_DefCurrencyId,
                        CurrencyName: CurrencyName,
                        CurrencyFactor: CurrencyFactor,
                        CostCenter: CostCenter,
                        FK_CostCenterId: FK_CostCenterId,
                        FK_HrEmployeeId: FK_HrEmployeeId,
                        EmployeeName: EmployeeName,
                        Notes: Notes,

                    });

                    //Discount Row
                    tempSource.insert(rowIndex, {
                        FK_GlAccountId: FK_GlAccountForDiscountId,
                        FK_GlAccountForDiscountId: FK_GlAccountForDiscountId,
                        FK_AppliedGlAccountId: FK_GlAccountId,
                        FK_CbDiscountTypeId: FK_CbDiscountTypeId,
                        FK_CbCreditCardTypeId: FK_CbCreditCardTypeId,
                        CreditCardTypeName: CreditCardTypeName,
                        Serial: Serial,
                        Account: AppliedAccountForDiscountCCAndAcc,
                        DiscountPercentage: DiscountPercentage,
                        AssociatedRowKey: uid,
                        ReferenceNumber: ReferenceNumber,
                        ReferenceDate: ReferenceDate,
                        Debit: DiscountDebitAmount,
                        Credit: DiscountCreditAmount,
                        Description: Description,
                        FK_DefCurrencyId: FK_DefCurrencyId,
                        CurrencyName: CurrencyName,
                        CurrencyFactor: CurrencyFactor,
                        CostCenter: CostCenter,
                        FK_CostCenterId: FK_CostCenterId,
                        FK_HrEmployeeId: FK_HrEmployeeId,
                        EmployeeName: EmployeeName,
                        Notes: Notes,
                    });
                }
                else {
                    for (var i = 0; i < res.length; i++) {
                        //(isNaN(res[i].FK_GlAccountForTaxId) || res[i].FK_GlAccountForTaxId == null)
                        if (res[i].FK_TaxesId > 0 && res[i].FK_GlAccountForTaxId != null && res[i].FK_GlAccountForTaxId > 0 && FK_TaxesIdForCCAndAcc == 0 && res[i].FK_GlAccountForTaxId == res[i].FK_GlAccountId) {
                            if ($("#IsAmountIncluldeTax").prop("checked") == true && Debit > 0) {
                                AmountIncluldeTax = parseFloat(Debit);
                                Debit = parseFloat(parseFloat(Debit) - parseFloat($("#TotalTaxAmount").val())).toFixed(2);

                            }
                            if ($("#IsAmountIncluldeTax").prop("checked") == true && Credit > 0) {
                                AmountIncluldeTax = parseFloat(Credit);
                                Credit = parseFloat(parseFloat(Credit) - parseFloat($("#TotalTaxAmount").val())).toFixed(2);

                            }
                            debugger
                            var TaxRow = $("#GlJournalDetailsgrid").data("kendoGrid")
                                .tbody
                                .find("tr[data-uid='" + res[i].uid + "']");
                            var TaxdataItem = grid.dataItem(TaxRow);
                            if (Debit > 0)
                                TaxDebitAmount = $("#TotalTaxAmount").val().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
                            if (Credit > 0)
                                TaxCreditAmount = $("#TotalTaxAmount").val().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
                            if (FK_TaxesId != 0) {
                                TaxdataItem.set("FK_TaxesId", FK_TaxesId);
                                TaxdataItem.set("TaxPercentage", TaxPercentage);
                                TaxdataItem.set("AmountIncluldeTax", AmountIncluldeTax);
                                TaxdataItem.set("FK_AppliedGlAccountId", FK_GlAccountId);
                                TaxdataItem.set("TaxName", TaxName);
                                TaxdataItem.set("Account", TaxName);
                                TaxdataItem.set("TotalTaxAmount", TotalTaxAmount);
                                TaxdataItem.set("Serial", Serial);
                                TaxdataItem.set("FK_GlAccountId", FK_AppliedGlAccountId);
                                TaxdataItem.set("FK_GlAccountForTaxId", FK_AppliedGlAccountId);
                                TaxdataItem.set("AssociatedRowKey", res[i].AssociatedRowKey);
                                TaxdataItem.set("ReferenceNumber", ReferenceNumber);
                                TaxdataItem.set("ReferenceDate", ReferenceDate);
                                TaxdataItem.set("Debit", TaxDebitAmount);
                                TaxdataItem.set("Credit", TaxCreditAmount);
                                TaxdataItem.set("Description", Description);
                                TaxdataItem.set("FK_DefCurrencyId", FK_DefCurrencyId);
                                TaxdataItem.set("CurrencyName", CurrencyName);
                                TaxdataItem.set("CurrencyFactor", CurrencyFactor);
                                TaxdataItem.set("CostCenter", CostCenter);
                                TaxdataItem.set("FK_CostCenterId", FK_CostCenterId);
                                TaxdataItem.set("Notes", Notes);
                                TaxdataItem.set("TaxNumber", TaxNumber);
                                TaxdataItem.set("FK_HrEmployeeId", FK_HrEmployeeId);
                                TaxdataItem.set("EmployeeName", EmployeeName);

                            }
                            else {
                                var dataSource = $("#GlJournalDetailsgrid").data("kendoGrid").dataSource;
                                dataSource.remove(TaxdataItem);
                            }

                        }
                        else if (res[i].FK_TaxesId > 0 && FK_TaxesIdForCCAndAcc != 0 && res[i].FK_GlAccountForTaxId > 0 && res[i].FK_AppliedGlAccountId != undefined) {

                            var TaxRowForCCAndAcc = $("#GlJournalDetailsgrid").data("kendoGrid")
                                .tbody
                                .find("tr[data-uid='" + res[i].uid + "']");
                            var TaxdataItemForCCAndAcc = grid.dataItem(TaxRowForCCAndAcc);
                            if (Debit > 0) {
                                TaxDebitAmount = parseFloat($("#TaxOnDiscount").val()).toFixed(2).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
                            }
                            if (Credit > 0) {
                                TaxCreditAmount = parseFloat($("#TaxOnDiscount").val()).toFixed(2).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
                            }
                            if (FK_TaxesIdForCCAndAcc != 0) {

                                TaxdataItemForCCAndAcc.set("FK_TaxesId", FK_TaxesIdForCCAndAcc);
                                TaxdataItemForCCAndAcc.set("FK_GlAccountForTaxId", FK_GlAccountForTaxId);
                                TaxdataItemForCCAndAcc.set("FK_AppliedGlAccountId", FK_GlAccountId);
                                TaxdataItemForCCAndAcc.set("TaxName", TaxNameForCCAndAcc);
                                TaxdataItemForCCAndAcc.set("TaxPercentage", TaxPercentage);
                                TaxdataItemForCCAndAcc.set("Account", TaxNameForCCAndAcc);
                                TaxdataItemForCCAndAcc.set("Serial", Serial);
                                TaxdataItemForCCAndAcc.set("FK_GlAccountId", FK_GlAccountForTaxId);
                                TaxdataItemForCCAndAcc.set("AssociatedRowKey", res[i].AssociatedRowKey);
                                TaxdataItemForCCAndAcc.set("ReferenceNumber", ReferenceNumber);
                                TaxdataItemForCCAndAcc.set("ReferenceDate", ReferenceDate);
                                TaxdataItemForCCAndAcc.set("Debit", TaxDebitAmount);
                                TaxdataItemForCCAndAcc.set("Credit", TaxCreditAmount);
                                TaxdataItemForCCAndAcc.set("Description", Description);
                                TaxdataItemForCCAndAcc.set("FK_DefCurrencyId", FK_DefCurrencyId);
                                TaxdataItemForCCAndAcc.set("CurrencyName", CurrencyName);
                                TaxdataItemForCCAndAcc.set("CurrencyFactor", CurrencyFactor);
                                TaxdataItemForCCAndAcc.set("CostCenter", CostCenter);
                                TaxdataItemForCCAndAcc.set("FK_CostCenterId", FK_CostCenterId);
                                TaxdataItemForCCAndAcc.set("Notes", Notes);
                                TaxdataItemForCCAndAcc.set("TaxNumber", TaxNumber);
                                TaxdataItemForCCAndAcc.set("FK_HrEmployeeId", FK_HrEmployeeId);
                                TaxdataItemForCCAndAcc.set("EmployeeName", EmployeeName);

                            }
                            else {
                                var dataSource = $("#GlJournalDetailsgrid").data("kendoGrid").dataSource;
                                dataSource.remove(TaxdataItemForCCAndAcc);
                            }

                        }
                        else if (res[i].FK_CbDiscountTypeId > 0 && res[i].FK_AppliedGlAccountId != undefined) {
                            var DiscountRow = $("#GlJournalDetailsgrid").data("kendoGrid")
                                .tbody
                                .find("tr[data-uid='" + res[i].uid + "']");
                            var DiscountdataItem = grid.dataItem(DiscountRow);
                            if (Debit > 0) {
                                DiscountDebitAmount = parseFloat($("#Discount").val()).toFixed(2).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
                            }
                            if (Credit > 0) {
                                DiscountCreditAmount = parseFloat($("#Discount").val()).toFixed(2).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
                            }
                            DiscountdataItem.set("FK_GlAccountId", FK_GlAccountForDiscountId);
                            DiscountdataItem.set("FK_AppliedGlAccountId", FK_GlAccountId);
                            DiscountdataItem.set("FK_CbDiscountTypeId", FK_CbDiscountTypeId);
                            DiscountdataItem.set("Account", AppliedAccountForDiscountCCAndAcc);
                            DiscountdataItem.set("Serial", Serial);
                            DiscountdataItem.set("AssociatedRowKey", res[i].AssociatedRowKey);
                            DiscountdataItem.set("ReferenceNumber", ReferenceNumber);
                            DiscountdataItem.set("ReferenceDate", ReferenceDate);
                            DiscountdataItem.set("Debit", DiscountDebitAmount);
                            DiscountdataItem.set("Credit", DiscountCreditAmount);
                            DiscountdataItem.set("Description", Description);
                            DiscountdataItem.set("FK_DefCurrencyId", FK_DefCurrencyId);
                            DiscountdataItem.set("CurrencyName", CurrencyName);
                            DiscountdataItem.set("CurrencyFactor", CurrencyFactor);
                            DiscountdataItem.set("CostCenter", CostCenter);
                            DiscountdataItem.set("FK_CostCenterId", FK_CostCenterId);
                            DiscountdataItem.set("Notes", Notes);
                            DiscountdataItem.set("TaxNumber", TaxNumber);
                            DiscountdataItem.set("FK_HrEmployeeId", FK_HrEmployeeId);
                            DiscountdataItem.set("EmployeeName", EmployeeName);

                        }
                        else {
                            debugger
                            //if ($("#IsAmountIncluldeTax").prop("checked") == true && Debit > 0) {
                            //    AmountIncluldeTax = parseFloat(Debit);
                            //    Debit = parseFloat(parseFloat(Debit) - parseFloat($("#TotalTaxAmount").val())).toFixed(2);

                            //}
                            //if ($("#IsAmountIncluldeTax").prop("checked") == true && Credit > 0) {
                            //    AmountIncluldeTax = parseFloat(Credit);
                            //    Credit = parseFloat(parseFloat(Credit) - parseFloat($("#TotalTaxAmount").val())).toFixed(2);

                            //}

                            dataItem.set("hdnAttachmentIds", hdnAttachmentIds);
                            dataItem.set("FK_GlAccountId", FK_GlAccountId);
                            dataItem.set("Serial", Serial);
                            dataItem.set("Account", Account);
                            dataItem.set("ReferenceNumber", ReferenceNumber);
                            dataItem.set("ReferenceDate", ReferenceDate);
                            dataItem.set("Debit", Debit);
                            dataItem.set("Credit", Credit);
                            dataItem.set("Description", Description);
                            dataItem.set("FK_DefCurrencyId", FK_DefCurrencyId);
                            dataItem.set("CurrencyName", CurrencyName);
                            dataItem.set("CurrencyFactor", CurrencyFactor);
                            dataItem.set("CostCenter", CostCenter);
                            dataItem.set("FK_CostCenterId", FK_CostCenterId);
                            dataItem.set("FK_HrEmployeeId", FK_HrEmployeeId);
                            dataItem.set("EmployeeName", EmployeeName);

                        }
                    }
                }


            }
            else if (FK_TaxesId != 0) {

                if ($("#IsAmountIncluldeTax").prop("checked") == true && Debit > 0) {
                    AmountIncluldeTax = parseFloat(Debit);
                    Debit = parseFloat(parseFloat(Debit) - parseFloat($("#TotalTaxAmount").val())).toFixed(2);

                }

                if ($("#IsAmountIncluldeTax").prop("checked") == true && Credit > 0) {
                    AmountIncluldeTax = parseFloat(Credit);
                    Credit = parseFloat(parseFloat(Credit) - parseFloat($("#TotalTaxAmount").val())).toFixed(2);

                }


                tempSource.insert(totalRecords, {
                    hdnAttachmentIds: hdnAttachmentIds,
                    FK_GlAccountId: FK_GlAccountId,
                    FK_GlAccountForTaxId: FK_AppliedGlAccountId,
                    FK_TaxesId: FK_TaxesId,
                    Serial: Serial,
                    Account: Account,
                    ReferenceNumber: ReferenceNumber,
                    ReferenceDate: ReferenceDate,
                    Debit: Debit,
                    Credit: Credit,
                    Description: Description,
                    FK_DefCurrencyId: FK_DefCurrencyId,
                    CurrencyName: CurrencyName,
                    CurrencyFactor: CurrencyFactor,
                    CostCenter: CostCenter,
                    FK_CostCenterId: FK_CostCenterId,
                    FK_HrEmployeeId: FK_HrEmployeeId,
                    EmployeeName: EmployeeName,
                    Notes: Notes,
                    TaxName: TaxName,
                    TaxPercentage: TaxPercentage,
                    TaxNumber: TaxNumber,
                    AmountIncluldeTax: AmountIncluldeTax,

                });
                debugger
                var Grid = $("#GlJournalDetailsgrid").data("kendoGrid");
                var GridData = Grid.dataSource.view();
                GridData[totalRecords].AssociatedRowKey = GridData[totalRecords].uid;
                var Uid = GridData[totalRecords].uid;

                if (Debit > 0)
                    TaxDebitAmount = parseFloat($("#TotalTaxAmount").val()).toFixed(2).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
                if (Credit > 0)
                    TaxCreditAmount = parseFloat($("#TotalTaxAmount").val()).toFixed(2).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");

                tempSource.insert(totalRecords, {
                    FK_GlAccountId: FK_AppliedGlAccountId,
                    FK_GlAccountForTaxId: FK_AppliedGlAccountId,
                    FK_AppliedGlAccountId: FK_GlAccountId,
                    FK_TaxesId: FK_TaxesId,
                    Serial: Serial,
                    Account: TaxName,
                    TaxName: TaxName,
                    AssociatedRowKey: Uid,
                    TaxPercentage: TaxPercentage,
                    TaxNumber: TaxNumber,
                    AmountIncluldeTax: AmountIncluldeTax,
                    ReferenceNumber: ReferenceNumber,
                    ReferenceDate: ReferenceDate,
                    Debit: TaxDebitAmount,
                    Credit: TaxCreditAmount,
                    Description: Description,
                    FK_DefCurrencyId: FK_DefCurrencyId,
                    CurrencyName: CurrencyName,
                    CurrencyFactor: CurrencyFactor,
                    CostCenter: CostCenter,
                    FK_CostCenterId: FK_CostCenterId,
                    FK_HrEmployeeId: FK_HrEmployeeId,
                    EmployeeName: EmployeeName,
                    Notes: Notes,

                });

            }
            else if (FK_CbCreditCardTypeId != 0) {

                tempSource.insert(totalRecords, {
                    hdnAttachmentIds: hdnAttachmentIds,
                    FK_GlAccountId: FK_GlAccountId,
                    Serial: Serial,
                    Account: Account,
                    CreditCardTypeName: CreditCardTypeName,
                    ReferenceNumber: ReferenceNumber,
                    ReferenceDate: ReferenceDate,
                    Debit: debitFormated,
                    Credit: creditFormated,
                    Description: Description,
                    FK_DefCurrencyId: FK_DefCurrencyId,
                    CurrencyName: CurrencyName,
                    CurrencyFactor: CurrencyFactor,
                    CostCenter: CostCenter,
                    FK_CostCenterId: FK_CostCenterId,
                    FK_HrEmployeeId: FK_HrEmployeeId,
                    EmployeeName: EmployeeName,
                    Notes: Notes,
                    FK_GlAccountForTaxId: FK_GlAccountForTaxId,
                    FK_TaxesId: FK_TaxesIdForCCAndAcc,
                    TaxPercentage: parseFloat(TaxOnDiscountAmountForCCAndAcc),
                    TaxNumber: TaxNumber,
                    FK_GlAccountForDiscountId: FK_GlAccountForDiscountId,
                    DiscountPercentage: DiscountPercentage,

                });
                var Grid = $("#GlJournalDetailsgrid").data("kendoGrid");
                var GridData = Grid.dataSource.view();
                GridData[totalRecords].AssociatedRowKey = GridData[totalRecords].uid;
                var Uid = GridData[totalRecords].uid;

                if (Debit > 0) {
                    TaxDebitAmount = parseFloat($("#TaxOnDiscount").val()).toFixed(2).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
                    DiscountDebitAmount = parseFloat($("#Discount").val()).toFixed(2).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");

                }
                if (Credit > 0) {
                    TaxCreditAmount = parseFloat($("#TaxOnDiscount").val()).toFixed(2).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
                    DiscountCreditAmount = parseFloat($("#Discount").val()).toFixed(2).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");

                }

                //Tax Row
                tempSource.insert(totalRecords, {
                    FK_GlAccountId: FK_GlAccountForTaxId,
                    FK_GlAccountForTaxId: FK_GlAccountForTaxId,
                    FK_AppliedGlAccountId: FK_GlAccountId,
                    FK_TaxesId: FK_TaxesIdForCCAndAcc,
                    Serial: Serial,
                    Account: TaxNameForCCAndAcc,
                    CreditCardTypeName: CreditCardTypeName,
                    TaxName: TaxNameForCCAndAcc,
                    AssociatedRowKey: Uid,
                    TaxPercentage: parseFloat(TaxOnDiscountAmountForCCAndAcc),
                    TaxNumber: TaxNumber,
                    AmountIncluldeTax: 0,
                    DiscountPercentage: 0,
                    ReferenceNumber: ReferenceNumber,
                    ReferenceDate: ReferenceDate,
                    Debit: TaxDebitAmount,
                    Credit: TaxCreditAmount,
                    Description: Description,
                    FK_DefCurrencyId: FK_DefCurrencyId,
                    CurrencyName: CurrencyName,
                    CurrencyFactor: CurrencyFactor,
                    CostCenter: CostCenter,
                    FK_CostCenterId: FK_CostCenterId,
                    FK_HrEmployeeId: FK_HrEmployeeId,
                    EmployeeName: EmployeeName,
                    Notes: Notes,

                });

                //Discount Row
                tempSource.insert(totalRecords, {
                    FK_GlAccountId: FK_GlAccountForDiscountId,
                    FK_GlAccountForDiscountId: FK_GlAccountForDiscountId,
                    FK_AppliedGlAccountId: FK_GlAccountId,
                    FK_CbDiscountTypeId: FK_CbDiscountTypeId,
                    FK_CbCreditCardTypeId: FK_CbCreditCardTypeId,
                    CreditCardTypeName: CreditCardTypeName,
                    Serial: Serial,
                    Account: AppliedAccountForDiscountCCAndAcc,
                    DiscountPercentage: DiscountPercentage,
                    AssociatedRowKey: Uid,
                    ReferenceNumber: ReferenceNumber,
                    ReferenceDate: ReferenceDate,
                    Debit: DiscountDebitAmount,
                    Credit: DiscountCreditAmount,
                    Description: Description,
                    FK_DefCurrencyId: FK_DefCurrencyId,
                    CurrencyName: CurrencyName,
                    CurrencyFactor: CurrencyFactor,
                    CostCenter: CostCenter,
                    FK_CostCenterId: FK_CostCenterId,
                    FK_HrEmployeeId: FK_HrEmployeeId,
                    EmployeeName: EmployeeName,
                    Notes: Notes,
                });
            }
            else {
                tempSource.insert(totalRecords, {
                    hdnAttachmentIds: hdnAttachmentIds,
                    FK_GlAccountId: FK_GlAccountId,
                    Serial: Serial,
                    Account: Account,
                    ReferenceNumber: ReferenceNumber,
                    ReferenceDate: ReferenceDate,
                    Debit: debitFormated,
                    Credit: creditFormated,
                    Description: Description,
                    FK_DefCurrencyId: FK_DefCurrencyId,
                    CurrencyName: CurrencyName,
                    CurrencyFactor: CurrencyFactor,
                    CostCenter: CostCenter,
                    FK_CostCenterId: FK_CostCenterId,
                    FK_HrEmployeeId: FK_HrEmployeeId,
                    EmployeeName: EmployeeName,
                    Notes: Notes,

                });
            }

            var grid = $("#GlJournalDetailsgrid").data("kendoGrid");
            tempSource.sync();
            grid.refresh();
            setGridSerial();

            grid.tbody.find("tr[role='row']").each(function () {

                var model = grid.dataItem(this);

                if (model != undefined && model.FK_TaxesId > 0 && model.FK_AppliedGlAccountId != undefined) {
                    $(this).find(".btnDelete").addClass("k-state-disabled");
                    $(this).find(".btnEdit").addClass("k-state-disabled");
                    $(this).find(".btnFiles").addClass("k-state-disabled");
                }

                if (model != undefined && model.FK_CbDiscountTypeId > 0 && model.FK_AppliedGlAccountId != undefined) {
                    $(this).find(".btnDelete").addClass("k-state-disabled");
                    $(this).find(".btnEdit").addClass("k-state-disabled");
                    $(this).find(".btnFiles").addClass("k-state-disabled");

                }
            });

            getTotalDebit();
            getTotalCredit();
            getTotalBalance();
            ClearFormDetails();
        }


    });

    /* End Adding in Grid*/

});


function ClearFormDetails() {
    // $("#FK_GlAccountId").val("");
    // $("#accountAutoComplete").val("");
    //  $("#AccountName").val("");
    $("#Debit").val("");
    $("#Credit").val("");
    //$("#Description").val("");
    $("#ReferenceNumber").val("");
    $("#FK_DefCurrencyId").val("");
    $("#CurrencyFactor").val("");
    // $("#costCenterAutoComplete").val("");
    //$("#FK_CostCenterId").val("");
    //$("#CostCenterName").val("");
    $("#uid").val("");
    //$("#accountAutoComplete").data("kendoDropDownList").value(0);
    //$("#costCenterAutoComplete").data("kendoDropDownList").value(0);
    $("#FK_TaxesId").data("kendoDropDownList").value(0);
    $("#FK_HrEmployeeId").data("kendoDropDownList").value(0);

    $("#TaxPercentage").val("");
    $("#TaxNumber").val("");
    $("#TotalTaxAmount").val("");
    $("#IsAmountIncluldeTax").prop('checked', false);
    $('#TotalTaxAmount').attr('readonly', true);
    $('#IsAmountIncluldeTax').prop("disabled", true);
    //$("#IsAmountIncluldeTax").prop("checked") == false;
    $("#FK_TaxesId").data("kendoDropDownList").enable(true);

    $("#FK_CbCreditCardTypeId").data("kendoDropDownList").value(0);
    $("#Discount").val("");
    $("#TaxOnDiscount").val("");

    $("#hdnAttachmentDetailIds").val("0");

    var modulePageDetail = $('#hdnModulePageDetail').val();

    var url = '/Attachment/Get?modulePage=' + modulePageDetail + '&refId=' + 0 + '&attachmentIds=' + 0 + '&redirect=' + "ViewDetails";
    var divAttachmentDetailList = $('#divAttachmentDetailList');
    divAttachmentDetailList.load(url);
    //$("#Description").val(""); 
}

function checkPeriodAndSave() {

    var openedPeriodCount = 0;
    $.ajax({
        url: "/GlFinancialPeriod/GetOpenPeriodsCount",
        type: "Get",
        contentType: false,
        processData: false,
        success: function (result) {
            
            openedPeriodCount = result;
            $.ajax({
                url: "/GlFinancialPeriod/IsDateInOpenPeriod?date=" + $("#VoucherDate").val(),
                type: "Get",
                contentType: false,
                processData: false,
                success: function (result) {

                    if (result && openedPeriodCount > 1) {
                        swal({
                            title: Resources.WarningResource,
                            text: Resources.ThereIsMoreThanOneFinancialPeriodOpen,
                            type: "info",
                            showCancelButton: true,
                            confirmButtonText: Resources.ContinueResource,
                            cancelButtonText: Resources.CancelResource,
                            closeOnConfirm: false,
                            showLoaderOnConfirm: true
                        }, function () {
                            setTimeout(function () {
                                saveVoucher();
                            }, 1000);
                        });
                    }
                    else if (!result) {
                        swal({
                            title: Resources.VoucherDateOutsideOpenPeriods,
                            confirmButtonText: Resources.CancelResource,
                            type: "error"
                        }, function () {
                        });

                    } else {
                        saveVoucher();
                    }
                }
            });
        }
    });


}

function checkPeriodAndSavePrint() {
    var openedPeriodCount = 0;
    $.ajax({
        url: "/GlFinancialPeriod/GetOpenPeriodsCount",
        type: "Get",
        contentType: false,
        processData: false,
        success: function (result) {

            openedPeriodCount = result;
            $.ajax({
                url: "/GlFinancialPeriod/IsDateInOpenPeriod?date=" + $("#VoucherDate").val(),
                type: "Get",
                contentType: false,
                processData: false,
                success: function (result) {

                    if (result && openedPeriodCount > 1) {
                        swal({
                            title: Resources.WarningResource,
                            text: Resources.ThereIsMoreThanOneFinancialPeriodOpen,
                            type: "info",
                            showCancelButton: true,
                            confirmButtonText: Resources.ContinueResource,
                            cancelButtonText: Resources.CancelResource,
                            closeOnConfirm: false,
                            showLoaderOnConfirm: true
                        }, function () {
                            setTimeout(function () {
                                saveVoucherAndPrint();
                            }, 1000);
                        });
                    }
                    else if (!result) {
                        swal({
                            title: Resources.VoucherDateOutsideOpenPeriods,
                            confirmButtonText: Resources.CancelResource,
                            type: "error"
                        }, function () {
                        });

                    } else {
                        saveVoucherAndPrint();
                    }
                }
            });
        }
    });

}

function saveVoucher() {
    var FK_DefCurrencyId = 1;
    var CurrencyFactor = 1;

    $.ajax({
        url: "/GlJournalVoucher/GetPrimaryCurrency",
        type: "Get",
        contentType: false,
        processData: false,
        success: function (data) {

            FK_DefCurrencyId = data.id;
            CurrencyFactor = data.defaultFactor;
        }
    });
    var List = [];
    var gridData = $('#GlJournalDetailsgrid').data("kendoGrid").dataSource.data();
    for (var i = 0; i < gridData.length; i++) {
        if (gridData[i].Debit == '' || gridData[i].Debit == null) {
            gridData[i].Debit = 0;
        }
        if (gridData[i].Credit == '' || gridData[i].Credit == null) {
            gridData[i].Credit = 0;
        }
        if (gridData[i].Notes == undefined)
            gridData[i].Notes = null;
        if (gridData[i].Description == undefined)
            gridData[i].Description = null;
        var data = {
            Order: parseInt(gridData[i].order),
            FK_GlAccountId: parseInt(gridData[i].FK_GlAccountId),
            FK_CbDiscountTypeId: parseInt(gridData[i].FK_CbDiscountTypeId),
            FK_GlAccountForDiscountId: parseInt(gridData[i].FK_GlAccountForDiscountId),
            FK_GlAccountForTaxId: parseInt(gridData[i].FK_GlAccountForTaxId),
            FK_CbCreditCardTypeId: parseInt(gridData[i].FK_CbCreditCardTypeId),
            CreditCardTypeName: gridData[i].CreditCardTypeName,
            AccountCode: "",
            AccountName: "",
            CostCenterName: "",
            FK_TaxesId: gridData[i].FK_TaxesId,
            FK_AppliedGlAccountId: parseInt(gridData[i].FK_AppliedGlAccountId),
            TaxPercentage: gridData[i].TaxPercentage,
            DiscountPercentage: parseFloat(gridData[i].DiscountPercentage),
            TaxNumber: gridData[i].TaxNumber,
            TaxName: gridData[i].TaxName,
            hdnAttachmentIds: gridData[i].hdnAttachmentIds,
            AssociatedRowKey: gridData[i].AssociatedRowKey,
            AmountIncluldeTax: gridData[i].AmountIncluldeTax,
            FK_DefCurrencyId: FK_DefCurrencyId,
            FK_CostCenterId: parseInt(gridData[i].FK_CostCenterId),
            ReferenceNumber: String(gridData[i].ReferenceNumber),
            ReferenceDate: new Date(gridData[i].ReferenceDate),
            CurrencyFactor: CurrencyFactor,
            Debit: parseFloat(gridData[i].Debit.toString().replace(/\,/g, '')),
            Credit: parseFloat(gridData[i].Credit.toString().replace(/\,/g, '')),
            FK_HrEmployeeId: parseInt(gridData[i].FK_HrEmployeeId),
            Notes: null,
            Description: gridData[i].Description,
        }

        List.push(data);

    }

    var isPosted = $("input[name='IsPosted']:checked").val();
    if (isPosted == "true")
        isPosted = true;
    else
        isPosted = false;

    var Obj = {
        //Id: parseInt($('#Id').val()),
        Serial: parseInt($("#Serial").val()),
        VoucherDate: new Date($("#VoucherDate").val()),
        FK_GlJournalVoucherCategoryId: String($("#FK_GlJournalVoucherCategoryId").val()),
        IsPosted: isPosted,
        ListDetails: List,
        CurrencyFactor: CurrencyFactor,
        FK_DefCurrencyId: FK_DefCurrencyId,
        BranchId: parseInt($("#FK_DefBranchId").val()),
        hdnAttachmentIds: $("#hdnAttachmentIds").val(),
        Categories: [],
        Currencies: []
    };

    if (List.length == 0) {

        swal({
            title: Resources.GridLengthZeroResource,
            confirmButtonText: Resources.DoneResource,
            type: "error"
        }, function () {
        });

    }
    else if ($("#Serial").val() == "") {
        swal({
            title: Resources.NoCodingCreatedResource,
            confirmButtonText: Resources.DoneResource,
            type: "error"
        }, function () {
        });
    }
    else if (parseInt($("#TotalDebit").val()) != parseInt($("#TotalCredit").val()) && isPosted == true) {
        swal({
            title: Resources.TotalDebitNotEqualTotalCreditResource,
            confirmButtonText: Resources.DoneResource,
            type: "error"
        }, function () {

        });
    }
    else if (String($("#FK_GlJournalVoucherCategoryId").val()) == "0") {
        swal({
            title: Resources.GlJournalVoucherCategoryNotExistResource,
            confirmButtonText: Resources.DoneResource,
            type: "error"
        }, function () {

        });
    }
    else {

        var listValid = true;
        for (var i = 0; i < List.length; i++) {
            if (isNaN(List[i].FK_CostCenterId) || List[i].FK_CostCenterId == 0)
                List[i].FK_CostCenterId = null;
            if (List[i].FK_TaxesId == undefined)
                List[i].FK_TaxesId = null;
            if (List[i].FK_AppliedGlAccountId == undefined)
                List[i].FK_AppliedGlAccountId = null;
            if (List[i].TaxPercentage == undefined)
                List[i].TaxPercentage = null;
            if (List[i].AmountIncluldeTax == undefined)
                List[i].AmountIncluldeTax = null;
            if (List[i].AssociatedRowKey == undefined)
                List[i].AssociatedRowKey = null;
            var accountId = List[i].FK_GlAccountId;
            var currencyId = List[i].FK_DefCurrencyId;
            var currencyFactor = List[i].CurrencyFactor;
            var debit = List[i].Debit;
            var credit = List[i].Credit;
            var description = List[i].Description;
            //if ( debit == 0 && credit == 0) {
            //    listValid = true;
            //    //break;
            //}
            if (isNaN(accountId) || isNaN(currencyId) || isNaN(currencyFactor) || description == undefined) {
                listValid = false;
                swal({
                    title: Resources.DataNotCompletedResource,
                    confirmButtonText: Resources.DoneResource,
                    type: "error"
                });

                break;
            }
        }
        if (listValid) {
            $.ajax({
                url: "/GlJournalVoucher/SaveVouchers",
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
                            //Object.assign(document.createElement('a'), { target: '_blank', href: 'GlJournalVoucherDetailsReport/' + result }).click();
                            window.location.href = '/GlJournalVoucher/Index';
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
            //$.ajax({
            //    url: "/GlFinancialPeriod/CheckDateFinancialPeriod?date=" + $("#VoucherDate").val(),
            //    type: "GET",
            //    success: function (result) {
            //        if (result == true) {


            //        } else if (result == false) {
            //            swal({
            //                title: Resources.DateOutOfFinancialPeriod,
            //                text: "",
            //                type: "info",
            //                showCancelButton: true,
            //                confirmButtonText: Resources.DoneResource,
            //                cancelButtonText: Resources.CancelResource,
            //                closeOnConfirm: false,
            //                showLoaderOnConfirm: true
            //            }, function () {
            //                $.ajax({
            //                    url: "/GlJournalVoucher/SaveVouchers",
            //                    type: "Post",
            //                    cache: false,
            //                    processData: false,
            //                    data: JSON.stringify(Obj),
            //                    contentType: 'application/json',
            //                    success: function (result) {

            //                        if (result) {

            //                            swal({
            //                                title: Resources.SavedSuccessfullyResource,
            //                                confirmButtonText: Resources.DoneResource,
            //                                type: "success"
            //                            }, function () {
            //                                //Object.assign(document.createElement('a'), { target: '_blank', href: 'GlJournalVoucherDetailsReport/' + result }).click();
            //                                window.location.href = '/GlJournalVoucher/Index';
            //                            });
            //                        }
            //                        else {
            //                            swal({
            //                                title: Resources.DefaultErrorMessageResource,
            //                                confirmButtonText: Resources.DoneResource,
            //                                type: "error"
            //                            });
            //                        }
            //                    }
            //                });
            //            });

            //        } else {
            //            swal({
            //                title: Resources.InvalidFinancialPeriod,
            //                confirmButtonText: Resources.DoneResource,
            //                type: "error"
            //            });
            //        }

            //    }
            //})
        }

    }
    //}
}

function saveVoucherAndPrint() {
    var FK_DefCurrencyId = 1;
    var CurrencyFactor = 1;

    $.ajax({
        url: "/GlJournalVoucher/GetPrimaryCurrency",
        type: "Get",
        contentType: false,
        processData: false,
        success: function (data) {

            FK_DefCurrencyId = data.id;
            CurrencyFactor = data.defaultFactor;
        }
    });
    var List = [];
    var gridData = $('#GlJournalDetailsgrid').data("kendoGrid").dataSource.data();
    for (var i = 0; i < gridData.length; i++) {
        if (gridData[i].Debit == '' || gridData[i].Debit == null) {
            gridData[i].Debit = 0;
        }
        if (gridData[i].Credit == '' || gridData[i].Credit == null) {
            gridData[i].Credit = 0;
        }
        if (gridData[i].Notes == undefined)
            gridData[i].Notes = null;
        if (gridData[i].Description == undefined)
            gridData[i].Description = null;
        var data = {
            Order: parseInt(gridData[i].order),
            FK_GlAccountId: parseInt(gridData[i].FK_GlAccountId),
            FK_CbDiscountTypeId: parseInt(gridData[i].FK_CbDiscountTypeId),
            FK_GlAccountForDiscountId: parseInt(gridData[i].FK_GlAccountForDiscountId),
            FK_GlAccountForTaxId: parseInt(gridData[i].FK_GlAccountForTaxId),
            FK_CbCreditCardTypeId: parseInt(gridData[i].FK_CbCreditCardTypeId),
            CreditCardTypeName: gridData[i].CreditCardTypeName,
            AccountCode: "",
            AccountName: "",
            CostCenterName: "",
            FK_TaxesId: gridData[i].FK_TaxesId,
            FK_AppliedGlAccountId: parseInt(gridData[i].FK_AppliedGlAccountId),
            TaxPercentage: gridData[i].TaxPercentage,
            DiscountPercentage: parseFloat(gridData[i].DiscountPercentage),
            TaxNumber: gridData[i].TaxNumber,
            TaxName: gridData[i].TaxName,
            hdnAttachmentIds: gridData[i].hdnAttachmentIds,
            AssociatedRowKey: gridData[i].AssociatedRowKey,
            AmountIncluldeTax: gridData[i].AmountIncluldeTax,
            FK_DefCurrencyId: FK_DefCurrencyId,
            FK_CostCenterId: parseInt(gridData[i].FK_CostCenterId),
            ReferenceNumber: String(gridData[i].ReferenceNumber),
            ReferenceDate: new Date(gridData[i].ReferenceDate),
            CurrencyFactor: CurrencyFactor,
            Debit: parseFloat(gridData[i].Debit.toString().replace(/\,/g, '')),
            Credit: parseFloat(gridData[i].Credit.toString().replace(/\,/g, '')),
            FK_HrEmployeeId: parseInt(gridData[i].FK_HrEmployeeId),
            Notes: null,
            Description: gridData[i].Description,
        }

        List.push(data);

    }

    var isPosted = $("input[name='IsPosted']:checked").val();
    if (isPosted == "true")
        isPosted = true;
    else
        isPosted = false;

    var Obj = {
        Serial: parseInt($("#Serial").val()),
        VoucherDate: new Date($("#VoucherDate").val()),
        FK_GlJournalVoucherCategoryId: String($("#FK_GlJournalVoucherCategoryId").val()),
        IsPosted: isPosted,
        ListDetails: List,
        CurrencyFactor: CurrencyFactor,
        FK_DefCurrencyId: FK_DefCurrencyId,
        BranchId: parseInt($("#FK_DefBranchId").val()),
        hdnAttachmentIds: $("#hdnAttachmentIds").val(),
        Categories: [],
        Currencies: []
    };

    if (List.length == 0) {

        swal({
            title: Resources.GridLengthZeroResource,
            confirmButtonText: Resources.DoneResource,
            type: "error"
        }, function () {
        });

    }
    else if ($("#Serial").val() == "") {
        swal({
            title: Resources.NoCodingCreatedResource,
            confirmButtonText: Resources.DoneResource,
            type: "error"
        }, function () {
        });
    }
    else if (parseInt($("#TotalDebit").val()) != parseInt($("#TotalCredit").val()) && isPosted == true) {
        swal({
            title: Resources.TotalDebitNotEqualTotalCreditResource,
            confirmButtonText: Resources.DoneResource,
            type: "error"
        }, function () {

        });
    }
    else if (String($("#FK_GlJournalVoucherCategoryId").val()) == "0") {
        swal({
            title: Resources.GlJournalVoucherCategoryNotExistResource,
            confirmButtonText: Resources.DoneResource,
            type: "error"
        }, function () {

        });
    }
    else {

        var listValid = true;
        for (var i = 0; i < List.length; i++) {
            if (isNaN(List[i].FK_CostCenterId) || List[i].FK_CostCenterId == 0)
                List[i].FK_CostCenterId = null;
            if (List[i].FK_TaxesId == undefined)
                List[i].FK_TaxesId = null;
            if (List[i].FK_AppliedGlAccountId == undefined)
                List[i].FK_AppliedGlAccountId = null;
            if (List[i].TaxPercentage == undefined)
                List[i].TaxPercentage = null;
            if (List[i].AmountIncluldeTax == undefined)
                List[i].AmountIncluldeTax = null;
            if (List[i].AssociatedRowKey == undefined)
                List[i].AssociatedRowKey = null;
            var accountId = List[i].FK_GlAccountId;
            var currencyId = List[i].FK_DefCurrencyId;
            var currencyFactor = List[i].CurrencyFactor;
            var debit = List[i].Debit;
            var credit = List[i].Credit;
            var description = List[i].Description;
            if (isNaN(accountId) || isNaN(currencyId) || isNaN(currencyFactor) || description == undefined) {
                listValid = false;
                swal({
                    title: Resources.DataNotCompletedResource,
                    confirmButtonText: Resources.DoneResource,
                    type: "error"
                });

                break;
            }
        }
        if (listValid) {
            $.ajax({
                url: "/GlJournalVoucher/SaveVouchers",
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
                            Object.assign(document.createElement('a'), { target: '_blank', href: 'GlJournalVoucherDetailsReport/' + result }).click();
                            window.location.href = '/GlJournalVoucher/Index';
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

            //$.ajax({
            //    url: "/GlFinancialPeriod/CheckDateFinancialPeriod?date=" + $("#VoucherDate").val(),
            //    type: "GET",
            //    success: function (result) {
            //        if (result == true) {


            //        } else if (result == false) {
            //            swal({
            //                title: Resources.DateOutOfFinancialPeriod,
            //                text: "",
            //                type: "info",
            //                showCancelButton: true,
            //                confirmButtonText: Resources.DoneResource,
            //                cancelButtonText: Resources.CancelResource,
            //                closeOnConfirm: false,
            //                showLoaderOnConfirm: true
            //            }, function () {
            //                $.ajax({
            //                    url: "/GlJournalVoucher/SaveVouchers",
            //                    type: "Post",
            //                    cache: false,
            //                    processData: false,
            //                    data: JSON.stringify(Obj),
            //                    contentType: 'application/json',
            //                    success: function (result) {

            //                        if (result) {

            //                            swal({
            //                                title: Resources.SavedSuccessfullyResource,
            //                                confirmButtonText: Resources.DoneResource,
            //                                type: "success"
            //                            }, function () {
            //                                Object.assign(document.createElement('a'), { target: '_blank', href: 'GlJournalVoucherDetailsReport/' + result }).click();
            //                                window.location.href = '/GlJournalVoucher/Index';
            //                            });
            //                        }
            //                        else {
            //                            swal({
            //                                title: Resources.DefaultErrorMessageResource,
            //                                confirmButtonText: Resources.DoneResource,
            //                                type: "error"
            //                            });
            //                        }
            //                    }
            //                });
            //            });

            //        } else {
            //            swal({
            //                title: Resources.InvalidFinancialPeriod,
            //                confirmButtonText: Resources.DoneResource,
            //                type: "error"
            //            });
            //        }

            //    }
            //})
        }

    }
    //}
}



function getTotalDebit() {

    var totalRecords = $("#GlJournalDetailsgrid").data("kendoGrid").dataSource.data().length;
    $("#OperationsNumbers").val(totalRecords);
    var DebitTotal = 0;
    var grid = $("#GlJournalDetailsgrid").data("kendoGrid");
    var gridData = grid.dataSource.view();

    for (var i = 0; i < gridData.length; i++) {
        DebitTotal += parseFloat(gridData[i].Debit.toString().replace(/\,/g, ''));
    }
    $("#TotalDebit").val(DebitTotal.toFixed(2));

}

function getTotalCredit() {

    var totalRecords = $("#GlJournalDetailsgrid").data("kendoGrid").dataSource.data().length;
    $("#OperationsNumbers").val(totalRecords);
    var CreditTotal = 0
    var grid = $("#GlJournalDetailsgrid").data("kendoGrid");
    var gridData = grid.dataSource.view();
    for (var i = 0; i < gridData.length; i++) {
        CreditTotal += parseFloat(gridData[i].Credit.toString().replace(/\,/g, ''));
    }
    $("#TotalCredit").val(CreditTotal.toFixed(2));

}


function getTotalBalance() {
    var totalCredit = parseFloat($("#TotalCredit").val());
    var totalDebit = parseFloat($("#TotalDebit").val());
    var totalBalance = Math.abs(totalDebit - totalCredit);
    $("#TotalBalance").val(totalBalance.toFixed(2));
    if (totalBalance != 0)
        $("#TotalBalance").addClass("text-danger");
    else
        $("#TotalBalance").removeClass("text-danger");

}

function GetNextSerial() {

    $.ajax({
        url: "/GlJournalVoucher/GetNextSerial?branchId=" + parseInt($("#FK_DefBranchId").val()),
        type: "Get",
        contentType: false,
        processData: false,
        success: function (result) {

            if (result > 0) {
                $("#Serial").val(result);
            }
        }
    });
}

function setGridSerial() {
    var counter = 1;
    var index = 1;
    var grid = $("#GlJournalDetailsgrid").data("kendoGrid");
    var items = grid.dataSource.data();
    for (var i = 0; i < items.length; i++) {
        items[i].set("order", counter);
        counter += 1;
    }
    grid.tbody.find("tr[role='row']").each(function () {
        $(this).find(".counter").text(index);
        index += 1;

    });
}





