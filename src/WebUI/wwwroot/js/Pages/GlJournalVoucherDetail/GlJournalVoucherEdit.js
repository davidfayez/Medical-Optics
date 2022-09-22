
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

        $("#FK_GlJournalVoucherCategoryId").data("kendoDropDownList").value("0");
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
        else {
            //  clearCreditCardInputs();
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

        var today = new Date();
        var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();

        if (e.dataItem.codeAndName == "اختر") {
            $('#TotalTaxAmount').attr('readonly', true);
            $('#TotalTaxAmount').val(0);
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
                isDiscountPercentage = $('#IsDiscountPercentage').val(),
                isTaxOnDiscountPercentage = $('#IsTaxPercentage').val(),
                taxOnDiscountAmount = parseFloat($("#TaxOnDiscountAmountForCCAndAcc").val());

            var discount = parseFloat($("#Discount").val());
            if (isDiscountPercentage == 'true')
                totalDisc = credit * (discountAmount / 100);
            else
                totalDisc = discountAmount;
            $("#Discount").val(totalDisc.toFixed(4));
            if (isTaxOnDiscountPercentage == 'true')
                totalTaxOnDiscount = totalDisc * (taxOnDiscountAmount / 100);
            else
                totalTaxOnDiscount = taxOnDiscountAmount;
            $("#TaxOnDiscount").val(totalTaxOnDiscount.toFixed(4));

            var finalDept = parseFloat(credit - totalDisc - totalTaxOnDiscount);
            $("#Credit").val(finalDept.toFixed(2));
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

    //Posting
    if ($('input[name="IsPosted"]').prop("checked") == true) {
        $("#btnAddNewJournalDetail").attr("disabled", "disabled");
        $("#btnSave").attr("disabled", "disabled");
        $("#btnSavePrint").attr("disabled", "disabled");
        $(".btnDelete").addClass('disabled');

    }
    else {
        $("#btnAddNewJournalDetail").removeAttr('disabled');
        $("#btnSave").removeAttr('disabled');
        $("#btnSavePrint").removeAttr('disabled');

    }


    $('input[name="IsPosted"]').change(function () {

        //has role
        if (!hasRoleEdit == true) {
            swal({
                title: Resources.PostingNotAllowed,
                confirmButtonText: Resources.DoneResource,
                type: "error"
            });
            return;
        }

        var post = $("#IsPosted").is(":checked");
        var data = [];
        var isClientBalanced = validateBalanceClient();
        var row = {
            id: parseInt($("#Id").val()),
            notes: String($("#Notes").val()),
            voucherCode: String($("#Serial").val())
        };
        data.push(row);

        if (post) {
            if (isClientBalanced) {
                if (!validateBalanceServer()) {
                    swal({
                        title: Resources.ChangesNotSaved,
                        text: Resources.SaveChangesFirst,
                        confirmButtonText: Resources.DoneResource,
                        type: "warning"
                    });
                    $('#IsPosted1').prop('checked', true);
                    return;
                }
                else {
                    postingUnposting(data);
                    $("#btnAddNewJournalDetail").attr("disabled", "disabled");
                    $("#btnSave").attr("disabled", "disabled");
                    $("#btnSavePrint").attr("disabled", "disabled");
                    $(".btnDelete").addClass('disabled');
                }
            }
            else {
                swal({
                    title: Resources.TotalDebitNotEqualTotalCreditResource,
                    confirmButtonText: Resources.DoneResource,
                    type: "error"
                });

                $('#IsPosted1').prop('checked', true);
                return;
            }
        }
        else {
            postingUnposting(data);
            $("#btnAddNewJournalDetail").removeAttr('disabled');
            $("#btnSave").removeAttr('disabled');
            $("#btnSavePrint").removeAttr('disabled');
            $(".btnDelete").removeClass('disabled');
            $('#IsPosted1').prop('checked', true);
        }
    });

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

    var url = window.location.pathname;
    var id = url.substring(url.lastIndexOf('/') + 1);

    if ($('input[type="checkbox"]').prop("checked") == true)
        $(".disabled-input").attr("disabled", "disabled");
    else
        $(".disabled-input").removeAttr('disabled');

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
                            /*       $("#FK_TaxesId").data("kendoDropDownList").dataSource.read();*/
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

    tempSource = new kendo.data.DataSource({
        transport: {
            read: {
                url: "/GlJournalVoucher/GetGlJournalVoucherDetailsById?id=" + id,
                Type: "GET"
            },
            parameterMap: function (options, operation) {
                if (operation !== "read" && options.models) {
                    return { models: kendo.stringify(options.models) };
                }
            }
        },
        //autoSync: true,
        batch: true,
        //pageSize: 20,
        schema: {
            model: {
                id: "id",
                fields: {
                    hdnAttachmentIds: { editable: true },
                    fK_HrEmployeeId: { validation: { required: true } },
                    fK_GlAccountForTaxId: { validation: { required: true } },
                    fK_CbDiscountTypeId: { validation: { required: true } },
                    fK_TaxesId: { validation: { required: true } },
                    fK_AppliedGlAccountId: { validation: { required: true } },
                    associatedRowKey: { validation: { required: true } },
                    fK_GlAccountId: { validation: { required: true } },
                    account: { validation: { required: true } },
                    serial: { validation: { required: true } },
                    taxName: { type: "text" },
                    taxNumber: { type: "text" },
                    taxPercentage: { type: "number" },
                    amountIncluldeTax: { type: "number" },
                    referenceNumber: { type: "number", validation: { min: 0, required: true, message: Resources.Required } },
                    referenceDate: { type: "date", validation: { required: true, message: Resources.Required } },
                    debit: { type: "number" },
                    credit: { type: "number" },
                    description: { type: "text" },
                    fK_DefCurrencyId: { defaultValue: { id: "", currencyNameAr: "" } },
                    currencyNameAr: { defaultValue: { id: "", currencyNameAr: "" } },
                    currencyFactor: { validation: { required: true } },
                    fK_CostCenterId: { defaultValue: { id: "", costCenterCode: "" } },
                    costCenter: { type: "text", validation: { required: true }, message: Resources.Required },
                    notes: { type: "text", validation: { required: true } },
                }
            }
        }
    });
    var gridBound = $("#GlJournalDetailsgrid").kendoGrid({
        dataSource: tempSource,
        scrollable: true,
        pageable: false,
        columns: [
            { field: "hdnAttachmentIds", hidden: true },
            { field: "fK_HrEmployeeId", hidden: true, format: "{0:c}", width: 120 },
            { field: "fK_CbCreditCardTypeId", hidden: true, format: "{0:c}", width: 120 },
            { field: "creditCardTypeName", hidden: true, format: "{0:c}", width: 120 },
            { field: "fK_GlAccountForDiscountId", hidden: true, format: "{0:c}", width: 120 },
            { field: "discountPercentage", hidden: true, format: "{0:c}", width: 120 },
            { field: "fK_GlAccountForTaxId", hidden: true, format: "{0:c}", width: 120 },
            { field: "fK_CbDiscountTypeId", hidden: true, format: "{0:c}", width: 120 },
            { field: "fK_TaxesId", hidden: true, format: "{0:c}", width: 120 },
            { field: "taxName", hidden: true, format: "{0:c}", width: 120 },
            { field: "employeeName", hidden: true, width: Resources.NameWidth, title: Resources.EmployeeName },
            { field: "fK_AppliedGlAccountId", hidden: true, format: "{0:c}", width: 120 },
            { field: "associatedRowKey", hidden: true, width: 120 },
            { field: "fK_GlAccountId", hidden: true, format: "{0:c}", width: 120 },
            { field: "order", hidden: true, width: Resources.InputNumberWidth, title: Resources.Serial },
            { width: Resources.InputNumberWidth, template: "<span class='counter'> </span>", title: Resources.Serial },

            {
                field: "account", title: Resources.Account, width: 300,
                template: "#: account# #: costCenter # #: employeeName # - #: description#"
            },
            { field: "serial", width: Resources.InputNumberWidth, title: Resources.VoucherCode },
            { field: "taxName", hidden: true, width: Resources.NameWidth, title: Resources.TaxName },
            { field: "taxPercentage", hidden: true, width: Resources.InputNumberWidth, title: Resources.TaxValueResource },
            { field: "amountIncluldeTax", hidden: true, width: Resources.NameWidth, title: Resources.AmountIncluldeTax },
            { field: "referenceNumber", width: Resources.NameWidth, title: Resources.ReferenceNumber },
            { field: "referenceDate", format: "{0:yyyy/MM/dd}", width: Resources.DateWidth, title: Resources.BondDate },
            { field: "debit", width: Resources.InputNumberWidth, title: Resources.Debit, editor: numberEditor, format: '{0:n2}' },
            { field: "credit", width: Resources.InputNumberWidth, title: Resources.Credit, editor: numberEditor, format: '{0:n2}' },
            { field: "description", hidden: true, width: Resources.DescriptionWidth, title: Resources.Description },
            { field: "fK_DefCurrencyId", hidden: true, format: "{0:c}", width: 120 },
            { field: "currencyName", hidden: true, width: Resources.CodeWidth, title: Resources.Currency },
            { field: "currencyFactor", hidden: true, width: Resources.NameWidth, title: Resources.CurrencyFactor },
            { field: "fK_CostCenterId", hidden: true, width: 140, title: Resources.CostCenterCode },
            { field: "taxNumber", hidden: true, width: Resources.InputNumberWidth, title: Resources.TaxNumber },
            { field: "costCenter", hidden: true, width: Resources.CodeWidth, title: Resources.CostCenter },
            { field: "notes", hidden: true, width: Resources.NoteWidth, title: Resources.Notes },
            { width: Resources.DoubleActionWidth, template: "<a  class='btn btn-danger btn-sm btnDelete' ><i class='fas fa-trash-alt'></i></a> <a class='btn btn-success btn-sm btnEdit'><i class='fas fa-edit'></i></a> <button type='button' class='btn btn-info btn-sm btnFiles'><i class='fas fa-paperclip'></i></button>" },
        ],
        editable: false,
        selectable: "multiple, cell",
        noRecords: true,
        sortable: true,
        reorderable: true,
        groupable: true,
        resizable: true,
        messages: {
            noRecords: "There is no data on current page"
        },
        dataBound: function (e) {
            e.sender.items().each(function () {
                var dataItem = e.sender.dataItem(this);
                kendo.bind(this, dataItem);
                if (dataItem.fK_TaxesId > 0 && dataItem.credit == 0 && dataItem.debit == 0) {
                    var $row = $('#GlJournalDetailsgrid').find("[data-uid='" + dataItem.uid + "']");
                    $row.hide();
                }
            })

            if ($('input[name="IsPosted"]').prop("checked") == true) {
                $("#btnAddNewJournalDetail").attr("disabled", "disabled");
                $("#btnSave").attr("disabled", "disabled");
                $("#btnSavePrint").attr("disabled", "disabled");
                $(".btnDelete").addClass('disabled');
                $(".btnEdit").addClass('disabled');

            }
            else {
                $("#btnAddNewJournalDetail").removeAttr('disabled');
                $("#btnSave").removeAttr('disabled');
                $("#btnSavePrint").removeAttr('disabled');

            }
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
        var associatedRowKey = dataItem.associatedRowKey;

        $("#uid").val(dataItem.uid);
        $("#FK_GlAccountId").val(dataItem.fK_GlAccountId);
        $("#FK_HrEmployeeId").val(dataItem.fK_HrEmployeeId);
        $("#FK_CbCreditCardTypeId").data("kendoDropDownList").value("0");
        $("#FK_CbCreditCardTypeId").data("kendoDropDownList").dataSource.read();
        $("#hdnAttachmentDetailIds").val(dataItem.hdnAttachmentIds);
        var modulePageDetail = $('#hdnModulePageDetail').val();

        var url = '/Attachment/Get?modulePage=' + modulePageDetail + '&refId=' + 0 + '&attachmentIds=' + dataItem.hdnAttachmentIds + '&redirect=' + "ViewDetails";
        var divAttachmentDetailList = $('#divAttachmentDetailList');
        divAttachmentDetailList.load(url);
        // $("#Serial").val(dataItem.serial);
        $("#accountAutoComplete").data("kendoDropDownList").value(dataItem.fK_GlAccountId);

        var empId = dataItem.fK_HrEmployeeId;
        if (empId == null || isNaN(empId))
            empId = 0
        if (empId > 0)
            $("#FK_TaxesId").data("kendoDropDownList").enable(false);
        $("#FK_HrEmployeeId").data("kendoDropDownList").value(empId);
        $("#accountAutoComplete").data("kendoDropDownList").dataSource.read();
        $("#AccountName").val(dataItem.accountName);
        $("#ReferenceNumber").val(dataItem.referenceNumber);
        $("#Debit").val(parseFloat(dataItem.debit.toString().replace(/\,/g, '')));
        $("#Credit").val(parseFloat(dataItem.credit.toString().replace(/\,/g, '')));
        $("#Description").val(dataItem.description);
        $("#costCenterAutoComplete").data("kendoDropDownList").value(dataItem.fK_CostCenterId);
        $("#FK_CostCenterId").val(parseInt(dataItem.fK_CostCenterId));
        $("#CostCenterName").val(dataItem.costCenterName);

        if (uid != null) {
            var data = grid.dataSource.data();
            var res = $.grep(data, function (d) {
                return d.associatedRowKey == associatedRowKey;
            });
            debugger
            var hasCreditType = res.filter(function (r) { return r.fK_CbCreditCardTypeId > 0 });
            for (var i = 0; i < res.length; i++) {
                debugger
                if (res[i].fK_TaxesId > 0 && res[i].fK_GlAccountForTaxId != null /*&& res[i].fK_AppliedGlAccountId */!= null && hasCreditType.length == 0) {
                    debugger
                    $("#FK_TaxesId").data("kendoDropDownList").enable(true);
                    $("#FK_TaxesId").data("kendoDropDownList").value(res[i].fK_TaxesId); 
                   // $("#FK_TaxesId").data("kendoDropDownList").value(res[i].fK_TaxesId);

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


                    $("#TaxPercentage").val(res[i].taxPercentage);
                    $("#TaxNumber").val(res[i].taxNumber);
                    $("#AmountIncluldeTax").val(res[i].amountIncluldeTax);
                    $("#FK_AppliedGlAccountId").val(res[i].fK_AppliedGlAccountId);
                    $("#FK_GlAccountForTaxId").val(res[i].fK_GlAccountForTaxId);
                    $("#TaxName").val(res[i].taxName);

                    if (res[i].debit != 0)
                        $("#TotalTaxAmount").val(parseFloat(res[i].debit.toString().replace(/\,/g, '')));

                    if (res[i].credit != 0)
                        $("#TotalTaxAmount").val(parseFloat(res[i].credit.toString().replace(/\,/g, '')));

                    if (res[i].amountIncluldeTax > 0 && res[i].credit != 0) {
                        $("#IsAmountIncluldeTax").prop('checked', true);
                        $("#Credit").val(res[i].amountIncluldeTax);
                    }
                    if (res[i].amountIncluldeTax > 0 && res[i].debit != 0) {
                        $("#IsAmountIncluldeTax").prop('checked', true);
                        $("#Debit").val(res[i].amountIncluldeTax);
                    }
                    $('#IsAmountIncluldeTax').prop("disabled", false);

                }
                if (res[i].fK_TaxesId > 0 && res[i].fK_GlAccountForTaxId > 0 && res[i].fK_AppliedGlAccountId != null && hasCreditType.length > 0) {
                    //$("#FK_TaxesId").data("kendoDropDownList").value(res[i].FK_TaxesId);
                    $("#FK_TaxesIdForCCAndAcc").val(res[i].fK_TaxesId);
                    $("#FK_GlAccountForTaxId").val(res[i].fK_GlAccountForTaxId);
                    $("#TaxNumber").val(res[i].taxNumber);
                    $("#FK_AppliedGlAccountId").val(res[i].fK_AppliedGlAccountId);
                    $("#TaxNameForCCAndAcc").val(res[i].taxName);

                    //  $("#TaxOnDiscountAmountForCCAndAcc").val(res[i].taxPercentage);

                    if (res[i].debit != 0)
                        $("#TaxOnDiscount").val(parseFloat(res[i].debit.toString().replace(/\,/g, '')));

                    if (res[i].credit != 0)
                        $("#TaxOnDiscount").val(parseFloat(res[i].credit.toString().replace(/\,/g, '')));

                }
                var fK_CbDiscountTypeId = res[i].fK_CbDiscountTypeId;
                if (res[i].fK_CbDiscountTypeId > 0 && res[i].fK_CbCreditCardTypeId != undefined && res[i].fK_AppliedGlAccountId != undefined && hasCreditType.length > 0) {
                    $("#FK_TaxesId").data("kendoDropDownList").enable(false);
                    $("#FK_TaxesId").data("kendoDropDownList").value(0);
                    $("#TaxPercentage").val('');
                    $("#FK_CbDiscountTypeId").val(res[i].fK_CbDiscountTypeId);
                    $("#FK_GlAccountForDiscountId").val(res[i].fK_GlAccountForDiscountId);
                    //$("#FK_CbCreditCardTypeId").val(res[i].fK_CbCreditCardTypeId)
                    $("#DiscountPercentage").val(res[i].discountPercentage);
                    //  $("#FK_CbCreditCardTypeId").data("kendoDropDownList").value(res[i].fK_CbCreditCardTypeId);
                    $("#FK_AppliedGlAccountId").val(res[i].fK_AppliedGlAccountId);

                    if (res[i].debit != 0)
                        $("#Discount").val(parseFloat(res[i].debit.toString().replace(/\,/g, '')));

                    if (res[i].credit != 0)
                        $("#Discount").val(parseFloat(res[i].credit.toString().replace(/\,/g, '')));


                    var cbCreditCardTypeId = res[i].fK_CbCreditCardTypeId;
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
        }

        var ReferenceDate = dataItem.referenceDate;
        var referenceDate = ReferenceDate.getFullYear() + "-" + ("0" + (ReferenceDate.getMonth() + 1)).slice(-2) + "-" + ("0" + ReferenceDate.getDate()).slice(-2);
        $('#ReferenceDate').val(referenceDate);
    }

    tempSource.fetch(function () {
        setGridSerial();
        var grid = $("#GlJournalDetailsgrid").data("kendoGrid");
        grid.tbody.find("tr[role='row']").each(function () {

            var model = grid.dataItem(this);
            if (model != undefined && model.fK_TaxesId > 0 && model.fK_AppliedGlAccountId != null) {
                $(this).find(".btnDelete").addClass("k-state-disabled");
                $(this).find(".btnEdit").addClass("k-state-disabled");
                $(this).find(".btnFiles").addClass("k-state-disabled");

            }
            if (model != undefined && model.fK_CbDiscountTypeId > 0 && model.fK_AppliedGlAccountId != null) {
                $(this).find(".btnDelete").addClass("k-state-disabled");
                $(this).find(".btnEdit").addClass("k-state-disabled");
                $(this).find(".btnFiles").addClass("k-state-disabled");

            }
        });
        getTotalDebit();
        getTotalCredit();
        getTotalBalance();

    });

    function removeBondDetailRow() {

        var TotalDebit = parseInt($("#TotalDebit").val());
        var TotalCredit = parseInt($("#TotalCredit").val());

        var row = $(this).closest("tr"),
            grid = $("#GlJournalDetailsgrid").data("kendoGrid"),
            dataItem = grid.dataItem(row),
            dataSource = $("#GlJournalDetailsgrid").data("kendoGrid").dataSource;
        //var uid = dataItem.associatedRowKey;
        var data = grid.dataSource.data();
        var res = $.grep(data, function (d) {
            return d.associatedRowKey == dataItem.associatedRowKey;
        });
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
                if (dataItem.id == "") {
                    if (dataSource.remove(dataItem)) {
                        swal({
                            title: Resources.DeleteSuccessResource,
                            confirmButtonText: Resources.DoneResource,
                            type: "success"
                        });

                        for (var i = 0; i < res.length; i++) {
                            if (res[i].associatedRowKey == dataItem.uid) {
                                dataSource.remove(res[i]);
                            }


                        }
                        setGridSerial();
                        grid.tbody.find("tr[role='row']").each(function () {

                            var model = grid.dataItem(this);

                            if (model != undefined && (model.fK_TaxesId > 0 && model.fK_AppliedGlAccountId != null) || (model.fK_GlAccountForDiscountId > 0 && model.fK_AppliedGlAccountId != null)) {
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
                } else {
                    $.ajax({
                        url: "/GlJournalVoucher/DeleteDetail?id=" + dataItem.id + "&associatedRowKey=" + dataItem.associatedRowKey,
                        type: "Get",
                        contentType: 'application/json; charset=utf-8',
                        success: function (result) {

                            if (result) {
                                dataSource.remove(dataItem)
                                swal({
                                    title: Resources.DeleteSuccessResource,
                                    confirmButtonText: Resources.DoneResource,
                                    type: "success"
                                }, function () {

                                    for (var i = 0; i < res.length; i++) {
                                        if (res[i].associatedRowKey == dataItem.associatedRowKey) {
                                            dataSource.remove(res[i]);
                                        }


                                    }
                                    setGridSerial();
                                    grid.tbody.find("tr[role='row']").each(function () {

                                        var model = grid.dataItem(this);

                                        if (model != undefined && (model.fK_TaxesId > 0 && model.FK_AppliedGlAccountId != null) || (model.fK_GlAccountForDiscountId > 0 && model.FK_AppliedGlAccountId != null)) {
                                            $(this).find(".btnDelete").addClass("k-state-disabled");
                                            $(this).find(".btnEdit").addClass("k-state-disabled");
                                            $(this).find(".btnFiles").addClass("k-state-disabled");

                                        }
                                    });


                                    getTotalDebit();
                                    getTotalCredit();
                                    getTotalBalance();

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
                }


            }, 3000);
        });
    }
    $("#btnAddNewJournalDetail").on('click', function () {

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
            CostCenterName = $("#CostCenterName").val(),
            FK_CbCreditCardTypeId = parseInt($("#FK_CbCreditCardTypeId").val()),
            CreditCardTypeName = $("#FK_CbCreditCardTypeId").data("kendoDropDownList").text(),
            Discount = $("#Discount").val(),
            DiscountPercentage = $("#DiscountAmount").val(),
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
        var TaxDebitAmount = 0,
            TaxCreditAmount = 0,
            DiscountDebitAmount = 0,
            DiscountCreditAmount = 0;
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
            var Index = parseInt($("#Index").val());
            var grid = $("#GlJournalDetailsgrid").data("kendoGrid");
            var data = grid.dataSource.data();
            var res = $.grep(data, function (d) {
                return d.uid == uid;
            });
            if (!isNaN(Index))
                totalRecords = Index - 1;

            if (uid != "" && res.length > 0) {
                var grid = $("#GlJournalDetailsgrid").data("kendoGrid");
                var row = $("#GlJournalDetailsgrid").data("kendoGrid")
                    .tbody
                    .find("tr[data-uid='" + uid + "']");

                var grid = $("#GlJournalDetailsgrid").data("kendoGrid");
                var dataItem = grid.dataItem(row);
                var associatedRowKey = dataItem.associatedRowKey;
                var rowIndex = dataItem.order - 1;
                var data = grid.dataSource.data();
                var res = $.grep(data, function (d) {
                    return d.associatedRowKey == associatedRowKey;
                });
                var hasDetails = false;
                var hasCreditType = res.filter(function (r) { return r.fK_CbCreditCardTypeId > 0 });


                for (var i = 0; i < res.length; i++) {
                    debugger
                    if (res[i].fK_TaxesId > 0 && FK_TaxesIdForCCAndAcc == 0 && res[i].fK_GlAccountForTaxId > 0 && res[i].fK_AppliedGlAccountId > 0 && hasCreditType.length == 0 && res[i].fK_GlAccountForTaxId == res[i].fK_GlAccountId) {
                        hasDetails = true;
                        if ($("#IsAmountIncluldeTax").prop("checked") == true && Debit > 0) {
                            AmountIncluldeTax = parseFloat(Debit).toFixed(2);
                            Debit = parseFloat(parseFloat(Debit) - parseFloat($("#TotalTaxAmount").val())).toFixed(2);
                        }
                        if ($("#IsAmountIncluldeTax").prop("checked") == true && Credit > 0) {
                            AmountIncluldeTax = parseFloat(Credit).toFixed(2);
                            Credit = parseFloat(parseFloat(Credit) - parseFloat($("#TotalTaxAmount").val())).toFixed(2);
                        }


                        var TaxRow = $("#GlJournalDetailsgrid").data("kendoGrid")
                            .tbody
                            .find("tr[data-uid='" + res[i].uid + "']");

                        var TaxdataItem = grid.dataItem(TaxRow);
                        if (Debit != 0)
                            TaxDebitAmount = $("#TotalTaxAmount").val().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
                        if (Credit != 0)
                            TaxCreditAmount = $("#TotalTaxAmount").val().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
                        if (FK_TaxesId != 0) {
                            TaxdataItem.set("fK_TaxesId", FK_TaxesId);
                            TaxdataItem.set("taxPercentage", TaxPercentage);
                            TaxdataItem.set("amountIncluldeTax", AmountIncluldeTax);
                            TaxdataItem.set("fK_AppliedGlAccountId", FK_GlAccountId);
                            TaxdataItem.set("taxName", TaxName);
                            TaxdataItem.set("account", TaxName);
                            TaxdataItem.set("totalTaxAmount", TotalTaxAmount);
                            TaxdataItem.set("serial", Serial);
                            TaxdataItem.set("fK_GlAccountId", FK_GlAccountId);
                            TaxdataItem.set("fK_GlAccountForTaxId", FK_GlAccountForTaxId);
                            TaxdataItem.set("associatedRowKey", res[i].associatedRowKey);
                            TaxdataItem.set("referenceNumber", ReferenceNumber);
                            TaxdataItem.set("referenceDate", ReferenceDate);
                            TaxdataItem.set("debit", TaxDebitAmount);
                            TaxdataItem.set("credit", TaxCreditAmount);
                            TaxdataItem.set("description", Description);
                            TaxdataItem.set("fK_DefCurrencyId", FK_DefCurrencyId);
                            TaxdataItem.set("currencyName", CurrencyName);
                            TaxdataItem.set("currencyFactor", CurrencyFactor);
                            TaxdataItem.set("costCenter", CostCenter);
                            TaxdataItem.set("fK_CostCenterId", FK_CostCenterId);
                            TaxdataItem.set("notes", Notes);
                            TaxdataItem.set("taxNumber", TaxNumber);
                            TaxdataItem.set("fK_HrEmployeeId", FK_HrEmployeeId);
                            TaxdataItem.set("employeeName", EmployeeName);
                            TaxdataItem.set("associatedRowKey", uid);

                        }
                        else {
                            var dataSource = $("#GlJournalDetailsgrid").data("kendoGrid").dataSource;
                            dataSource.remove(TaxdataItem);
                        }

                        dataItem.set("hdnAttachmentIds", hdnAttachmentIds);
                        dataItem.set("fK_GlAccountId", FK_GlAccountId);
                        dataItem.set("serial", Serial);
                        dataItem.set("account", Account);
                        dataItem.set("referenceNumber", ReferenceNumber);
                        dataItem.set("referenceDate", ReferenceDate);
                        dataItem.set("debit", Debit.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,"));
                        dataItem.set("credit", Credit.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,"));
                        dataItem.set("description", Description);
                        dataItem.set("fK_DefCurrencyId", FK_DefCurrencyId);
                        dataItem.set("currencyName", CurrencyName);
                        dataItem.set("currencyFactor", CurrencyFactor);
                        dataItem.set("costCenter", CostCenter);
                        dataItem.set("fK_CostCenterId", FK_CostCenterId);
                        dataItem.set("fK_HrEmployeeId", FK_HrEmployeeId);
                        dataItem.set("employeeName", EmployeeName);
                        dataItem.set("fK_TaxesId", FK_TaxesId);
                        dataItem.set("fK_GlAccountForTaxId", FK_GlAccountForTaxId);
                        dataItem.set("taxPercentage", TaxPercentage);
                        hasDetails = true;
                    }
                    else if (res[i].fK_TaxesId > 0 && FK_TaxesIdForCCAndAcc != 0 && res[i].fK_CbDiscountTypeId == null && res[i].fK_AppliedGlAccountId > 0) {
                        hasDetails = true;
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
                        if (FK_TaxesIdForCCAndAcc != 0 && hasCreditType.length > 0) {

                            TaxdataItemForCCAndAcc.set("fK_TaxesId", FK_TaxesIdForCCAndAcc);
                            TaxdataItemForCCAndAcc.set("fK_GlAccountForTaxId", FK_GlAccountForTaxId);
                            TaxdataItemForCCAndAcc.set("fK_AppliedGlAccountId", FK_GlAccountId);
                            TaxdataItemForCCAndAcc.set("taxName", TaxNameForCCAndAcc);
                            TaxdataItemForCCAndAcc.set("account", TaxNameForCCAndAcc);
                            TaxdataItemForCCAndAcc.set("serial", Serial);
                            TaxdataItemForCCAndAcc.set("fK_GlAccountId", FK_GlAccountForTaxId);
                            TaxdataItemForCCAndAcc.set("associatedRowKey", res[i].associatedRowKey);
                            TaxdataItemForCCAndAcc.set("referenceNumber", ReferenceNumber);
                            TaxdataItemForCCAndAcc.set("referenceDate", ReferenceDate);
                            TaxdataItemForCCAndAcc.set("debit", TaxDebitAmount);
                            TaxdataItemForCCAndAcc.set("credit", TaxCreditAmount);
                            TaxdataItemForCCAndAcc.set("description", Description);
                            TaxdataItemForCCAndAcc.set("fK_DefCurrencyId", FK_DefCurrencyId);
                            TaxdataItemForCCAndAcc.set("currencyName", CurrencyName);
                            TaxdataItemForCCAndAcc.set("currencyFactor", CurrencyFactor);
                            TaxdataItemForCCAndAcc.set("costCenter", CostCenter);
                            TaxdataItemForCCAndAcc.set("fK_CostCenterId", FK_CostCenterId);
                            TaxdataItemForCCAndAcc.set("notes", Notes);
                            TaxdataItemForCCAndAcc.set("taxNumber", TaxNumber);
                            TaxdataItemForCCAndAcc.set("fK_HrEmployeeId", FK_HrEmployeeId);
                            TaxdataItemForCCAndAcc.set("employeeName", EmployeeName);
                            TaxdataItemForCCAndAcc.set("associatedRowKey", uid);
                        }
                        else {
                            var dataSource = $("#GlJournalDetailsgrid").data("kendoGrid").dataSource;
                            dataSource.remove(TaxdataItemForCCAndAcc);
                        }

                    }
                    else if (res[i].fK_CbDiscountTypeId > 0 && hasCreditType.length > 0) {
                        hasDetails = true;
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
                        DiscountdataItem.set("fK_GlAccountId", FK_GlAccountForDiscountId);
                        DiscountdataItem.set("fK_AppliedGlAccountId", FK_GlAccountId);
                        DiscountdataItem.set("fK_CbDiscountTypeId", FK_CbDiscountTypeId);
                        DiscountdataItem.set("fK_CbCreditCardTypeId", FK_CbCreditCardTypeId);
                        DiscountdataItem.set("account", AppliedAccountForDiscountCCAndAcc);
                        DiscountdataItem.set("serial", Serial);
                        DiscountdataItem.set("associatedRowKey", res[i].associatedRowKey);
                        DiscountdataItem.set("referenceNumber", ReferenceNumber);
                        DiscountdataItem.set("referenceDate", ReferenceDate);
                        DiscountdataItem.set("debit", DiscountDebitAmount);
                        DiscountdataItem.set("credit", DiscountCreditAmount);
                        DiscountdataItem.set("description", Description);
                        DiscountdataItem.set("fK_DefCurrencyId", FK_DefCurrencyId);
                        DiscountdataItem.set("currencyName", CurrencyName);
                        DiscountdataItem.set("currencyFactor", CurrencyFactor);
                        DiscountdataItem.set("costCenter", CostCenter);
                        DiscountdataItem.set("fK_CostCenterId", FK_CostCenterId);
                        DiscountdataItem.set("notes", Notes);
                        DiscountdataItem.set("taxNumber", TaxNumber);
                        DiscountdataItem.set("fK_HrEmployeeId", FK_HrEmployeeId);
                        DiscountdataItem.set("employeeName", EmployeeName);
                        DiscountdataItem.set("associatedRowKey", uid);
                    }
                    else {

                        dataItem.set("hdnAttachmentIds", hdnAttachmentIds);
                        dataItem.set("fK_GlAccountId", FK_GlAccountId);
                        dataItem.set("serial", Serial);
                        dataItem.set("account", Account);
                        dataItem.set("associatedRowKey", uid);

                        dataItem.set("referenceNumber", ReferenceNumber);
                        dataItem.set("referenceDate", ReferenceDate);
                        dataItem.set("debit", Debit.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,"));
                        dataItem.set("credit", Credit.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,"));
                        dataItem.set("description", Description);
                        dataItem.set("fK_DefCurrencyId", FK_DefCurrencyId);
                        dataItem.set("currencyName", CurrencyName);
                        dataItem.set("currencyFactor", CurrencyFactor);
                        dataItem.set("costCenter", CostCenter);
                        dataItem.set("fK_CostCenterId", FK_CostCenterId);
                        dataItem.set("fK_HrEmployeeId", FK_HrEmployeeId);
                        dataItem.set("employeeName", EmployeeName);
                        if (FK_TaxesIdForCCAndAcc != 0)
                            dataItem.set("fK_TaxesId", FK_TaxesIdForCCAndAcc);
                        else
                            dataItem.set("fK_TaxesId", FK_TaxesId);
                        dataItem.set("taxPercentage", TaxPercentage);


                    }
                }
      
                if (res.length > 0)
                    hasDetails = true


                if (!hasDetails) {

                    if (FK_TaxesId != 0) {
                        if ($("#IsAmountIncluldeTax").prop("checked") == true && Debit > 0) {
                            AmountIncluldeTax = parseFloat(Debit).toFixed(2);
                            Debit = parseFloat(parseFloat(Debit) - parseFloat($("#TotalTaxAmount").val())).toFixed(2);
                        }
                        if ($("#IsAmountIncluldeTax").prop("checked") == true && Credit > 0) {
                            AmountIncluldeTax = parseFloat(Credit).toFixed(2);
                            Credit = parseFloat(parseFloat(Credit) - parseFloat($("#TotalTaxAmount").val())).toFixed(2);
                        }

                        if (Debit > 0)
                            TaxDebitAmount = parseFloat($("#TotalTaxAmount").val()).toFixed(2).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
                        if (Credit > 0)
                            TaxCreditAmount = parseFloat($("#TotalTaxAmount").val()).toFixed(2).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");

                        tempSource.insert(rowIndex, {
                            fK_GlAccountId: FK_AppliedGlAccountId,
                            fK_AppliedGlAccountId: FK_GlAccountId,
                            fK_TaxesId: FK_TaxesId,
                            fK_GlAccountForTaxId: FK_AppliedGlAccountId,
                            serial: Serial,
                            account: TaxName,
                            taxName: TaxName,
                            associatedRowKey: uid,
                            taxPercentage: TaxPercentage,
                            taxNumber: TaxNumber,
                            totalTaxAmount: TotalTaxAmount,
                            amountIncluldeTax: AmountIncluldeTax,
                            referenceNumber: ReferenceNumber,
                            referenceDate: ReferenceDate,
                            debit: TaxDebitAmount,
                            credit: TaxCreditAmount,
                            description: Description,
                            fK_DefCurrencyId: FK_DefCurrencyId,
                            currencyName: CurrencyName,
                            currencyFactor: CurrencyFactor,
                            costCenter: CostCenter,
                            fK_CostCenterId: FK_CostCenterId,
                            fK_HrEmployeeId: FK_HrEmployeeId,
                            employeeName: EmployeeName,
                            notes: Notes,

                        });
                    }

                    else if (FK_CbCreditCardTypeId != 0) {

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
                            fK_GlAccountId: FK_GlAccountForTaxId,
                            fK_GlAccountForTaxId: FK_GlAccountForTaxId,
                            fK_AppliedGlAccountId: FK_GlAccountId,
                            fK_TaxesId: FK_TaxesIdForCCAndAcc,
                            serial: Serial,
                            account: TaxNameForCCAndAcc,
                            taxName: TaxNameForCCAndAcc,
                            creditCardTypeName: CreditCardTypeName,
                            associatedRowKey: uid,
                            TaxPercentage: parseFloat(TaxOnDiscountAmountForCCAndAcc),
                            taxNumber: TaxNumber,
                            referenceNumber: ReferenceNumber,
                            referenceDate: ReferenceDate,
                            debit: TaxDebitAmount,
                            credit: TaxCreditAmount,
                            description: Description,
                            fK_DefCurrencyId: FK_DefCurrencyId,
                            currencyName: CurrencyName,
                            currencyFactor: CurrencyFactor,
                            costCenter: CostCenter,
                            fK_CostCenterId: FK_CostCenterId,
                            fK_HrEmployeeId: FK_HrEmployeeId,
                            employeeName: EmployeeName,
                            notes: Notes,

                        });

                        //Discount Row
                        tempSource.insert(rowIndex, {
                            fK_GlAccountId: FK_GlAccountForDiscountId,
                            fK_GlAccountForDiscountId: FK_GlAccountForDiscountId,
                            fK_AppliedGlAccountId: FK_GlAccountId,
                            fK_CbDiscountTypeId: FK_CbDiscountTypeId,
                            fK_CbCreditCardTypeId: FK_CbCreditCardTypeId,
                            creditCardTypeName: CreditCardTypeName,
                            serial: Serial,
                            account: AppliedAccountForDiscountCCAndAcc,
                            discountPercentage: DiscountPercentage,
                            associatedRowKey: uid,
                            referenceNumber: ReferenceNumber,
                            referenceDate: ReferenceDate,
                            debit: DiscountDebitAmount,
                            credit: DiscountCreditAmount,
                            description: Description,
                            fK_DefCurrencyId: FK_DefCurrencyId,
                            currencyName: CurrencyName,
                            currencyFactor: CurrencyFactor,
                            costCenter: CostCenter,
                            fK_CostCenterId: FK_CostCenterId,
                            fK_HrEmployeeId: FK_HrEmployeeId,
                            employeeName: EmployeeName,
                            notes: Notes,

                        });
                    }
                }
            }
            else if (FK_TaxesId != 0) {

                if ($("#IsAmountIncluldeTax").prop("checked") == true && Debit > 0) {
                    AmountIncluldeTax = parseFloat(Debit).toFixed(2);
                    Debit = parseFloat(parseFloat(Debit) - parseFloat($("#TotalTaxAmount").val())).toFixed(2);
                }
                if ($("#IsAmountIncluldeTax").prop("checked") == true && Credit > 0) {
                    AmountIncluldeTax = parseFloat(Credit).toFixed(2);
                    Credit = parseFloat(parseFloat(Credit) - parseFloat($("#TotalTaxAmount").val())).toFixed(2);
                }

                tempSource.insert(totalRecords, {
                    hdnAttachmentIds: hdnAttachmentIds,
                    fK_GlAccountId: FK_GlAccountId,
                    fK_GlAccountForTaxId: FK_AppliedGlAccountId,
                    fK_TaxesId: FK_TaxesId,
                    serial: Serial,
                    account: Account,
                    referenceNumber: ReferenceNumber,
                    referenceDate: ReferenceDate,
                    debit: Debit,
                    credit: Credit,
                    description: Description,
                    fK_DefCurrencyId: FK_DefCurrencyId,
                    currencyName: CurrencyName,
                    currencyFactor: CurrencyFactor,
                    costCenter: CostCenter,
                    fK_CostCenterId: FK_CostCenterId,
                    fK_HrEmployeeId: FK_HrEmployeeId,
                    employeeName: EmployeeName,
                    notes: Notes,
                    taxName: TaxName,
                    taxPercentage: TaxPercentage,
                    taxNumber: TaxNumber,
                    amountIncluldeTax: AmountIncluldeTax,

                });
                var Grid = $("#GlJournalDetailsgrid").data("kendoGrid");
                var GridData = Grid.dataSource.view();
                GridData[totalRecords].associatedRowKey = GridData[totalRecords].uid;
                var Uid = GridData[totalRecords].uid;

                if (Debit > 0)
                    TaxDebitAmount = parseFloat($("#TotalTaxAmount").val()).toFixed(2).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
                if (Credit > 0)
                    TaxCreditAmount = parseFloat($("#TotalTaxAmount").val()).toFixed(2).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");

                tempSource.insert(totalRecords, {
                    fK_GlAccountId: FK_AppliedGlAccountId,
                    fK_GlAccountForTaxId: FK_AppliedGlAccountId,
                    fK_AppliedGlAccountId: FK_GlAccountId,
                    fK_TaxesId: FK_TaxesId,
                    serial: Serial,
                    account: TaxName,
                    taxName: TaxName,
                    associatedRowKey: Uid,
                    taxPercentage: TaxPercentage,
                    taxNumber: TaxNumber,
                    totalTaxAmount: TotalTaxAmount,
                    amountIncluldeTax: AmountIncluldeTax,
                    referenceNumber: ReferenceNumber,
                    referenceDate: ReferenceDate,
                    debit: TaxDebitAmount,
                    credit: TaxCreditAmount,
                    description: Description,
                    fK_DefCurrencyId: FK_DefCurrencyId,
                    currencyName: CurrencyName,
                    currencyFactor: CurrencyFactor,
                    costCenter: CostCenter,
                    fK_CostCenterId: FK_CostCenterId,
                    fK_HrEmployeeId: FK_HrEmployeeId,
                    employeeName: EmployeeName,
                    notes: Notes,

                });

            }
            else if (FK_CbCreditCardTypeId != 0) {

                tempSource.insert(totalRecords, {
                    hdnAttachmentIds: hdnAttachmentIds,
                    fK_GlAccountId: FK_GlAccountId,
                    serial: Serial,
                    account: Account,
                    creditCardTypeName: CreditCardTypeName,
                    referenceNumber: ReferenceNumber,
                    referenceDate: ReferenceDate,
                    debit: debitFormated,
                    credit: creditFormated,
                    description: Description,
                    fK_DefCurrencyId: FK_DefCurrencyId,
                    currencyName: CurrencyName,
                    currencyFactor: CurrencyFactor,
                    costCenter: CostCenter,
                    fK_CostCenterId: FK_CostCenterId,
                    fK_HrEmployeeId: FK_HrEmployeeId,
                    employeeName: EmployeeName,
                    notes: Notes,
                    fK_GlAccountForTaxId: FK_GlAccountForTaxId,
                    fK_TaxesId: FK_TaxesIdForCCAndAcc,
                    taxPercentage: parseFloat(TaxOnDiscountAmountForCCAndAcc),
                    taxNumber: TaxNumber,
                    fK_GlAccountForDiscountId: FK_GlAccountForDiscountId,
                    discountPercentage: DiscountPercentage,

                });
                var Grid = $("#GlJournalDetailsgrid").data("kendoGrid");
                var GridData = Grid.dataSource.view();
                GridData[totalRecords].associatedRowKey = GridData[totalRecords].uid;
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
                    fK_GlAccountId: FK_GlAccountForTaxId,
                    fK_GlAccountForTaxId: FK_GlAccountForTaxId,
                    fK_AppliedGlAccountId: FK_GlAccountId,
                    fK_TaxesId: FK_TaxesIdForCCAndAcc,
                    serial: Serial,
                    account: TaxNameForCCAndAcc,
                    taxName: TaxNameForCCAndAcc,
                    associatedRowKey: Uid,
                    TaxPercentage: parseFloat(TaxOnDiscountAmountForCCAndAcc),
                    taxNumber: TaxNumber,
                    referenceNumber: ReferenceNumber,
                    referenceDate: ReferenceDate,
                    debit: TaxDebitAmount,
                    credit: TaxCreditAmount,
                    description: Description,
                    fK_DefCurrencyId: FK_DefCurrencyId,
                    currencyName: CurrencyName,
                    currencyFactor: CurrencyFactor,
                    costCenter: CostCenter,
                    fK_CostCenterId: FK_CostCenterId,
                    fK_HrEmployeeId: FK_HrEmployeeId,
                    employeeName: EmployeeName,
                    notes: Notes,

                });

                //Discount Row
                tempSource.insert(totalRecords, {
                    fK_GlAccountId: FK_GlAccountForDiscountId,
                    fK_GlAccountForDiscountId: FK_GlAccountForDiscountId,
                    fK_AppliedGlAccountId: FK_GlAccountId,
                    fK_CbDiscountTypeId: FK_CbDiscountTypeId,
                    fK_CbCreditCardTypeId: FK_CbCreditCardTypeId,
                    creditCardTypeName: CreditCardTypeName,
                    serial: Serial,
                    account: AppliedAccountForDiscountCCAndAcc,
                    discountPercentage: DiscountPercentage,
                    associatedRowKey: Uid,
                    referenceNumber: ReferenceNumber,
                    referenceDate: ReferenceDate,
                    debit: DiscountDebitAmount,
                    credit: DiscountCreditAmount,
                    description: Description,
                    fK_DefCurrencyId: FK_DefCurrencyId,
                    currencyName: CurrencyName,
                    currencyFactor: CurrencyFactor,
                    costCenter: CostCenter,
                    fK_CostCenterId: FK_CostCenterId,
                    fK_HrEmployeeId: FK_HrEmployeeId,
                    employeeName: EmployeeName,
                    notes: Notes,

                });
            }
            else {
                tempSource.insert(totalRecords, {
                    hdnAttachmentIds: hdnAttachmentIds,
                    fK_GlAccountId: FK_GlAccountId,
                    serial: Serial,
                    account: Account,
                    referenceNumber: ReferenceNumber,
                    referenceDate: ReferenceDate,
                    debit: debitFormated,
                    credit: creditFormated,
                    description: Description,
                    fK_DefCurrencyId: FK_DefCurrencyId,
                    currencyName: CurrencyName,
                    currencyFactor: CurrencyFactor,
                    costCenter: CostCenter,
                    fK_CostCenterId: FK_CostCenterId,
                    fK_HrEmployeeId: FK_HrEmployeeId,
                    employeeName: EmployeeName,
                    notes: Notes,

                });

            }

            var grid = $("#GlJournalDetailsgrid").data("kendoGrid");
            debugger
            grid.refresh();
            setGridSerial();
            grid.tbody.find("tr[role='row']").each(function () {
                var model = grid.dataItem(this);
                debugger
                if (model != undefined && model.fK_TaxesId > 0 && model.fK_AppliedGlAccountId != null) {
                    $(this).find(".btnDelete").addClass("k-state-disabled");
                    $(this).find(".btnEdit").addClass("k-state-disabled");
                    $(this).find(".btnFiles").addClass("k-state-disabled");

                }

                if (model != undefined && model.fK_CbDiscountTypeId > 0 && model.fK_AppliedGlAccountId != null) {
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
});


function ClearFormDetails() {
    $("#AccountName").val("");
    $("#Debit").val("");
    $("#Credit").val("");
    $("#ReferenceNumber").val("");
    $("#FK_DefCurrencyId").val("");
    $("#CurrencyFactor").val("");
    $("#Notes").val("");
    $("#uid").val("");
    $("#FK_TaxesId").data("kendoDropDownList").value(0);
    $("#FK_HrEmployeeId").data("kendoDropDownList").value(0);
    $("#TaxPercentage").val("");
    $("#TaxNumber").val("");
    $("#TotalTaxAmount").val("");
    $("#IsAmountIncluldeTax").prop('checked', false);
    $('#TotalTaxAmount').attr('readonly', true);
    $('#IsAmountIncluldeTax').prop("disabled", true);
    $("#FK_TaxesId").data("kendoDropDownList").enable(true);

    $("#FK_CbCreditCardTypeId").data("kendoDropDownList").value(0);
    $("#Discount").val("");
    $("#TaxOnDiscount").val("");
    $("#hdnAttachmentDetailIds").val("0");

    var modulePageDetail = $('#hdnModulePageDetail').val();

    var url = '/Attachment/Get?modulePage=' + modulePageDetail + '&refId=' + 0 + '&attachmentIds=' + 0 + '&redirect=' + "ViewDetails";
    var divAttachmentDetailList = $('#divAttachmentDetailList');
    divAttachmentDetailList.load(url);
}

/*Refactor Edit Voucher*/

function validateBalanceClient() {

    var totalDebit = parseFloat($("#TotalDebit").val());
    var totalCredit = parseFloat($("#TotalCredit").val());
    if (totalDebit != totalCredit) {
        return false;
    }
    else
        return true;
}
function validateBalanceServer() {
    var id = parseInt($("#Id").val());
    var isBalanced = false;
    var totalDebit = parseFloat($("#TotalDebit").val());
    var totalCredit = parseFloat($("#TotalCredit").val());
    $.ajax({
        url: '/GlJournalVoucher/GetVoucherDetailsDebitCredit',
        type: 'GET',
        async: false,
        data: { voucherId: id },
        success: function (result) {
            if (result.debit == totalDebit && result.credit == totalCredit) {
                isBalanced = true;
            }
            else {
                isBalanced = false;
            }
        },
        error: function (err, xqr, txt) {

        }
    });
    return isBalanced;
}

function postingUnposting(data) {
    var url = '/GlJournalVoucher/UpdateVoucherPosting';
    var post = $("#IsPosted").is(":checked");
    if (!post)
        var url = '/GlJournalVoucher/UpdateVoucherUnposting';

    swal({
        title: Resources.PostingResource,
        text: Resources.PostingConfirm,
        type: "info",
        showCancelButton: true,
        confirmButtonText: Resources.PostingUnPostingResource,
        cancelButtonText: Resources.CancelResource,
        closeOnConfirm: false,
        showLoaderOnConfirm: true
    }, function () {
        setTimeout(function () {
            $.ajax({
                url: url,
                type: 'POST',
                data: { vouchers: data },
                success: function (result) {

                    if (result) {

                        swal({
                            title: Resources.DoneResource,
                            confirmButtonText: Resources.DoneResource,
                            type: "success"
                        });
                    }
                    else {
                        swal({
                            title: Resources.ErrorMsgResource,
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

function prepareVoucher() {
    var isActive = $("input[name='IsActive']:checked").val();
    if (isActive == "true")
        isActive = true;
    else
        isActive = false;
    var freezing = parseInt($("#FK_DefFreezingReasonId").val());
    var isPosted = $("input[name='IsPosted']:checked").val();
    if (isPosted == "true")
        isPosted = true;
    else
        isPosted = false;

    var details = [];
    details = prepearVoucherDetails();

    var voucher = {
        Id: parseInt($('#Id').val()),
        VoucherDate: new Date($("#VoucherDate").val()),
        Serial: parseInt($("#Serial").val()),
        FK_GlJournalVoucherCategoryId: $("#FK_GlJournalVoucherCategoryId").val(),
        IsPosted: isPosted,
        IsActive: isActive,
        FK_DefFreezingReasonId: freezing,
        BranchId: parseInt($("#FK_DefBranchId").val()),
        Notes: $("#Notes").val(),
        ListDetails: details,
    };
    return voucher;
}
function prepearVoucherDetails() {
    var List = [];
    var isActive = $("input[name='IsActive']:checked").val();
    if (isActive == "true")
        isActive = true;
    else
        isActive = false;
    var gridData = $('#GlJournalDetailsgrid').data("kendoGrid").dataSource.data();
    for (var i = 0; i < gridData.length; i++) {
        var defCurrencyId;
        var CostCenterId;
        if (gridData[i].debit == '' || gridData[i].debit == null) {
            gridData[i].debit = 0;
        }
        if (gridData[i].credit == '' || gridData[i].credit == null) {
            gridData[i].credit = 0;
        }
        if (gridData[i].notes == undefined)
            gridData[i].notes = null;
        if (gridData[i].description == undefined)
            gridData[i].description = null;
        if (isNaN(gridData[i].id) == true || gridData[i].id != "") {
            defCurrencyId = gridData[i].fK_DefCurrencyId;
            CostCenterId = gridData[i].fK_CostCenterId;
            if (isNaN(CostCenterId))
                CostCenterId = null;
        }
        else {
            defCurrencyId = gridData[i].fK_DefCurrencyId;
            CostCenterId = gridData[i].fK_CostCenterId;
            if (isNaN(CostCenterId))
                CostCenterId = 0;

        }
        var refDate = new Date(gridData[i].referenceDate)
        rafranDate = refDate.getFullYear() + "-" + ("0" + (refDate.getMonth() + 1)).slice(-2) + "-" + ("0" + refDate.getDate()).slice(-2);
        var data = {
            Seria: parseInt(gridData[i].serial),
            Order: parseInt(gridData[i].order),
            Id: parseInt(gridData[i].id),
            FK_GlAccountId: parseInt(gridData[i].fK_GlAccountId),
            hdnAttachmentIds: gridData[i].hdnAttachmentIds,
            FK_CbDiscountTypeId: parseInt(gridData[i].fK_CbDiscountTypeId),
            FK_GlAccountForDiscountId: parseInt(gridData[i].fK_GlAccountForDiscountId),
            FK_GlAccountForTaxId: parseInt(gridData[i].fK_GlAccountForTaxId),
            FK_CbCreditCardTypeId: parseInt(gridData[i].fK_CbCreditCardTypeId),
            CreditCardTypeName: gridData[i].creditCardTypeName,
            AccountCode: "",
            AccountName: "",
            CostCenterName: "",
            FK_TaxesId: gridData[i].fK_TaxesId,
            FK_AppliedGlAccountId: parseInt(gridData[i].fK_AppliedGlAccountId),
            TaxPercentage: gridData[i].taxPercentage,
            DiscountPercentage: parseFloat(gridData[i].discountPercentage),
            TaxNumber: gridData[i].taxNumber,
            TaxName: gridData[i].taxName,
            AssociatedRowKey: gridData[i].associatedRowKey,
            AmountIncluldeTax: parseFloat(gridData[i].amountIncluldeTax),
            FK_DefCurrencyId: parseInt(defCurrencyId),
            FK_CostCenterId: CostCenterId,
            FK_HrEmployeeId: parseInt(gridData[i].fK_HrEmployeeId),
            ReferenceNumber: String(gridData[i].referenceNumber),
            ReferenceDate: new Date(rafranDate),
            CurrencyFactor: parseFloat(gridData[i].currencyFactor),
            Debit: parseFloat(gridData[i].debit.toString().replace(/\,/g, '')),
            Credit: parseFloat(gridData[i].credit.toString().replace(/\,/g, '')),
            Notes: gridData[i].notes,
            Description: gridData[i].description,
        }

        List.push(data);

    }
    return List;
}
function validateVoucher(voucher) {

    var isPosted = $("#IsPosted").is(":checked");
    var List = voucher.ListDetails;
    if (List.length == 0) {
        return 'noDetails';
    }
    else if ($("#Serial").val() == "") {
        return 'noSerial';
    }
    //else if (parseInt($("#TotalDebit").val()) != parseInt($("#TotalCredit").val()) && isPosted == true) {
    //    return 'notBalanced';
    //}
    else if (String($("#FK_GlJournalVoucherCategoryId").val()) == "0") {
        return 'noCategory';
    }
    else {
        return 'valid';
    }
}
function validateVoucherDetails(details) {
    var listValid = true;
    for (var i = 0; i < details.length; i++) {
        if (isNaN(details[i].FK_CostCenterId) || details[i].FK_CostCenterId == "")
            details[i].FK_CostCenterId = null;
        if (details[i].FK_TaxesId == undefined)
            details[i].FK_TaxesId = null;
        if (details[i].FK_AppliedGlAccountId == undefined)
            details[i].FK_AppliedGlAccountId = null;
        if (details[i].TaxPercentage == undefined)
            details[i].TaxPercentage = null;
        if (details[i].AmountIncluldeTax == undefined)
            details[i].AmountIncluldeTax = null;
        if (details[i].AssociatedRowKey == undefined)
            details[i].AssociatedRowKey = null;
        if (isNaN(details[i].Id) || details[i].Id == "")
            details[i].Id = null;
        var accountId = details[i].FK_GlAccountId;
        var currencyId = details[i].FK_DefCurrencyId;
        var currencyFactor = details[i].CurrencyFactor;
        var debit = details[i].Debit;
        var credit = details[i].Credit;
        var description = details[i].Description;

        if (isNaN(accountId) || isNaN(currencyId) || isNaN(currencyFactor) || description == undefined) {
            listValid = false;
            break;
        }
    }
    return listValid;
}


function editValidVoucher(voucher, withPrint) {

    $.ajax({
        url: "/GlJournalVoucher/EditVoucher",
        type: "Post",
        cache: false,
        async: false,
        processData: false,
        data: JSON.stringify(voucher),
        contentType: 'application/json',
        success: function (result) {

            if (result) {

                swal({
                    title: Resources.SavedSuccessfullyResource,
                    confirmButtonText: Resources.DoneResource,
                    type: "success"
                }, function () {
                    setTimeout(function () {
                        debugger
                        if (!withPrint) {
                            window.location.href = '/GlJournalVoucher/EditVoucher/' + voucher.Id;
                        }
                        else {
                            Object.assign(document.createElement('a'), { target: '_blank', href: '/GlJournalVoucher/GlJournalVoucherDetailsReport/' + voucher.Id }).click();
                            window.location.href = '/GlJournalVoucher/EditVoucher/' + voucher.Id;
                        }
                    }, 3000);
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

function validateEdit(withPrint) {

    var voucher = prepareVoucher();
    var validateMaster = validateVoucher(voucher);
    if (validateMaster == 'valid') {
        var isDetailsValid = validateVoucherDetails(voucher.ListDetails);
        if (isDetailsValid) {
            editValidVoucher(voucher, withPrint);
            //$.ajax({
            //    url: "/GlFinancialPeriod/CheckDateFinancialPeriod?date=" + $("#VoucherDate").val(),
            //    async: false,
            //    success: function (result) {
            //        if (result == true) {
            //            setTimeout(function () {
            //                editValidVoucher(voucher, withPrint);
            //            }, 3000);

            //        } else if (result == false) {
            //            swal({
            //                title: Resources.DateOutOfFinancialPeriod,
            //                text: "",
            //                type: "info",
            //                showCancelButton: true,
            //                confirmButtonText: Resources.DoneResource,
            //                cancelButtonText: Resources.ContinueResource,
            //                closeOnConfirm: false,
            //                showLoaderOnConfirm: true
            //            }, function () {
            //                setTimeout(function () {
            //                    editValidVoucher(voucher, withPrint);
            //                }, 3000);
            //            });

            //        } else {
            //            swal({
            //                title: Resources.InvalidFinancialPeriod,
            //                confirmButtonText: Resources.DoneResource,
            //                type: "error"
            //            });
            //        }

            //    }
            //});
        }
        else {
            swal({
                title: Resources.DataNotCompletedResource,
                confirmButtonText: Resources.DoneResource,
                type: "error"
            });
            return;
        }
    }
    else {
        switch (validateMaster) {
            case noDetails:
                swal({
                    title: Resources.GridLengthZeroResource,
                    confirmButtonText: Resources.DoneResource,
                    type: "error"
                }, function () {
                });
                break;
            case noSerial:
                swal({
                    title: Resources.NoCodingCreatedResource,
                    confirmButtonText: Resources.DoneResource,
                    type: "error"
                }, function () {
                });
                break;
            case noCategory:
                swal({
                    title: Resources.GlJournalVoucherCategoryNotExistResource,
                    confirmButtonText: Resources.DoneResource,
                    type: "error"
                }, function () {

                });
                break;
            default:

        }
    }
}

function edit(withPrint) {

    var post = $("#IsPosted").is(":checked");
    var isClientBalanced = validateBalanceClient();

    if (!isClientBalanced) {
        if (post) {
            swal({
                title: Resources.TotalDebitNotEqualTotalCreditResource,
                confirmButtonText: Resources.DoneResource,
                type: "error"
            }, function () {
                setTimeout(function () { }, 3000);
            });
            return;
        }
        else {

            swal({
                title: Resources.TotalDebitNotEqualTotalCreditResource,
                text: "",
                type: "info",
                showCancelButton: true,
                confirmButtonText: Resources.ContinueResource,
                cancelButtonText: Resources.CancelResource,
                closeOnConfirm: false,
                showLoaderOnConfirm: true
            }, function () {
                setTimeout(function () { validateEdit(withPrint); }, 3000);

            });
        }

    }
    else {
        validateEdit(withPrint);
    }
}

function editVoucher() {

    edit(false);
}
function editVoucherAndPrint() {
    edit(true);
}

function checkPeriodAndEditVoucher() {

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
                                editVoucher();
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
                        editVoucher();
                    }
                }
            });
        }
    });

}

function checkPeriodAndEditVoucherAndPrint() {

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
                                editVoucherAndPrint();
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
                        editVoucherAndPrint();
                    }
                }
            });
        }
    });
}

/*End Refactor Edit Voucher*/



function ChangeIsActive(e) {
    if (e.checked === true) {
        $(".disabled-input").attr("disabled", "disabled");
        $("#FK_DefFreezingReasonId").val("");
        $("#Notes").val("");
    }
    else
        $(".disabled-input").removeAttr('disabled');

}

function getTotalDebit() {

    var totalRecords = $("#GlJournalDetailsgrid").data("kendoGrid").dataSource.data().length;
    $("#OperationsNumbers").val(totalRecords);
    var DebitTotal = 0;
    var grid = $("#GlJournalDetailsgrid").data("kendoGrid");
    var gridData = grid.dataSource.view();

    for (var i = 0; i < gridData.length; i++) {
        if (gridData[i].debit == '' || gridData[i].debit == null) {
            gridData[i].debit = 0;
        }
        DebitTotal += parseFloat(gridData[i].debit.toString().replace(/\,/g, ''));
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
        if (gridData[i].credit == '' || gridData[i].credit == null) {
            gridData[i].credit = 0;
        }
        CreditTotal += parseFloat(gridData[i].credit.toString().replace(/\,/g, ''));
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

function PrintVoucher() {
    Object.assign(document.createElement('a'), { target: '_blank', href: '/GlJournalVoucher/GlJournalVoucherDetailsReport/' + $('#Id').val() }).click();

}
