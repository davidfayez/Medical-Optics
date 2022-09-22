$(document).ready(function () {

    $('#DefBranches').change(function () {
        $("#AccountId").val(0);
        $("#accountName").val("");
        $("#accountAutoCompleteBondAdd").data("kendoDropDownList").value(0);
        $("#accountAutoCompleteBondAdd").data("kendoDropDownList").dataSource.read();

        $("#CostCenterId").val(0);
        $("#CostCenterName").val("");
        $("#costCenterAutoCompleteBondAdd").data("kendoDropDownList").value(0);
        $("#costCenterAutoCompleteBondAdd").data("kendoDropDownList").dataSource.read();

        $("#FK_DefDocumentTypeId").data("kendoDropDownList").value(0);
        $("#FK_DefDocumentTypeId").data("kendoDropDownList").dataSource.read();

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
        $("#AccountId").val(0);
        $("#accountAutoCompleteBondAdd").data("kendoDropDownList").value(0);
        $("#accountAutoCompleteBondAdd").data("kendoDropDownList").dataSource.read().then(function () {
            $("#iRefreshGLAccount").removeClass("fa-spin");
        });


    });

    $('#refreshTaxCategory').click(function () {

        $("#iRefreshTaxCategory").addClass("fa-spin");
        $("#TaxPercentage").val("");
        $("#debit").val("");
        $("#credit").val("");
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

        $("#AccountId").val("");
        $("#accountAutoCompleteBondAdd").data("kendoDropDownList").value(0);
    });

    $('#clearDescription').click(function () {
        $("#description").val("");
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
                            id: $("#AccountId").val(),
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
                url: "/CbCreditCardTypeGlAccount/GetRelatedDataByGlAccIdAndCCTypeId?accId=" + $("#AccountId").val() + "&CCTypeId=" + e.dataItem.id + "&fK_DefBranchId=" + $("#FK_DefBranchId").val(),
                data: "name=John&location=Boston",
                dataType: "json",
                success: function (result) {
                    debugger
                    var debit = parseFloat($('#debit').val());
                    var credit = parseFloat($('#credit').val());
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


                        var totalDisc = 0;
                        var totalTaxOnDiscount = 0;
                        if (debit > 0) {


                            totalDisc = debit * (result.discountAmount / 100);
                            $("#Discount").val(totalDisc.toFixed(2));
                            totalTaxOnDiscount = totalDisc * (result.taxOnDiscountAmount / 100);
                            $("#TaxOnDiscount").val(totalTaxOnDiscount.toFixed(2));


                            var finalDept = parseFloat(debit - totalDisc - totalTaxOnDiscount);
                            $("#debit").val(finalDept.toFixed(2));
                            $('#credit').val(0);
                        }

                        if (credit > 0) {
                            totalDisc = credit * (result.discountAmount / 100);
                            $("#Discount").val(totalDisc.toFixed(2));
                            totalTaxOnDiscount = totalDisc * (result.taxOnDiscountAmount / 100);
                            $("#TaxOnDiscount").val(totalTaxOnDiscount.toFixed(2));

                            var finalDept = parseFloat(credit - totalDisc - totalTaxOnDiscount);
                            $("#credit").val(finalDept.toFixed(2));
                            $('#debit').val(0);
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
            $('#TotalTaxAmount').val(0);

            //$('#TotalTaxAmount').attr("disabled")
            $("#IsAmountIncluldeTax").prop('checked', false);
            $('#IsAmountIncluldeTax').prop("disabled", true);
        }
        else {
            $('#TotalTaxAmount').attr('readonly', false);
            //$('#TotalTaxAmount').removeAttr("disabled")
            $('#IsAmountIncluldeTax').prop("disabled", false);
        }
        $.ajax({
            type: "POST",
            url: "/Taxes/IsInDateRange?id=" + e.dataItem.id + "&today=" + date,
            data: "name=John&location=Boston",
            dataType: "json",
            success: function (response) {
                debugger;
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

        $('#TotalTaxAmount').val(0);
        $('#debit').val(0);
        $('#credit').val(0);
    }

    $("#debit").change(function () {

        if ($("#FK_GlAccountForDiscountId").val() > 0 && $("#FK_TaxesIdForCCAndAcc").val() > 0) {

            var totalDisc = 0,
                totalTaxOnDiscount = 0,
                debit = parseFloat($('#debit').val()),
                discountAmount = parseFloat($("#DiscountAmount").val()),
                taxOnDiscountAmount = parseFloat($("#TaxOnDiscountAmountForCCAndAcc").val());

            totalDisc = debit * (discountAmount / 100);
            $("#Discount").val(totalDisc.toFixed(2));
            totalTaxOnDiscount = totalDisc * (taxOnDiscountAmount / 100);
            $("#TaxOnDiscount").val(totalTaxOnDiscount.toFixed(2));
            var finalDept = parseFloat(debit - totalDisc - totalTaxOnDiscount);
            $("#debit").val(finalDept.toFixed(2));
            $('#credit').val(0);


        } else {
            $("#credit").val(0);
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

    $("#credit").change(function () {
        if ($("#FK_GlAccountForDiscountId").val() > 0 && $("#FK_TaxesIdForCCAndAcc").val() > 0) {

            var totalDisc = 0,
                totalTaxOnDiscount = 0,
                credit = parseFloat($('#credit').val()),
                discountAmount = parseFloat($("#DiscountAmount").val()),
                taxOnDiscountAmount = parseFloat($("#TaxOnDiscountAmountForCCAndAcc").val());

            totalDisc = credit * (discountAmount / 100);
            $("#Discount").val(totalDisc.toFixed(2));
            totalTaxOnDiscount = totalDisc * (taxOnDiscountAmount / 100);
            $("#TaxOnDiscount").val(totalTaxOnDiscount.toFixed(2));
            var finalDept = parseFloat(credit - totalDisc - totalTaxOnDiscount);
            $("#credit").val(finalDept.toFixed(2));
            $('#debit').val(0);


        } else {
            $("#debit").val(0);
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
            if (parseInt($("#AccountId").val()) > 0) {
                $("#FK_TaxesId").data("kendoDropDownList").value("0");
                $('#TaxPercentage').val('');
                $("#FK_TaxesId").data("kendoDropDownList").dataSource.read();
                $("#FK_TaxesId").data("kendoDropDownList").enable(false);
            }
        }

    }


    if ($('input[type="checkbox"]').prop("checked") == true)
        $(".disabled-input").attr("disabled", "disabled");
    else
        $(".disabled-input").removeAttr('disabled');


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




    var url = window.location.pathname;
    var id = url.substring(url.lastIndexOf('/') + 1);



    // Account 

    $("#accountAutoCompleteBondAdd").kendoDropDownList({
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

        $.ajax({
            type: "POST",
            url: "/GlAccount/IsMainAccount?id=" + e.dataItem.id,
            data: "name=John&location=Boston",
            dataType: "json",
            success: function (response) {

                if (response) {
                    $("#AccountId").val(0);
                    $("#accountName").val("");
                    $("#accountAutoCompleteBondAdd").data("kendoDropDownList").value(0);
                    swal({
                        title: Resources.NoTansactionCanMadeOnMainAccounts,
                        confirmButtonText: Resources.DoneResource,
                        type: "error"
                    });
                } else {
                    $("#AccountId").val(e.dataItem.id);
                    $("#accountName").val(e.dataItem.accountNameAr);

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


    // CostCenter 

    $("#costCenterAutoCompleteBondAdd").kendoDropDownList({
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
        select: onSelectCostCenter
    });

    function onSelectCostCenter(e) {
        $("#CostCenterId").val(e.dataItem.id);
        $("#CostCenterName").val(e.dataItem.costCenterNameAr);
    }

    $("#FK_DefDocumentTypeId").kendoDropDownList({
        filter: "contains",
        height: 300,
        dataTextField: "codeAndName",
        dataValueField: "id",
        dataSource: {
            type: "json",
            //serverFiltering: true,
            transport: {
                read: {
                    url: "/GlBond/GetAllDocumentTypesForDDList",
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

    //Change Currency
    var currencyFactorVal = $("#CurrencyFactor").val();
    if (currencyFactorVal == 1)
        $('#CurrencyFactor').attr('readonly', true);
    else
        $('#CurrencyFactor').attr('readonly', false);
    $("#FK_DefCurrencyId").change(function () {

        var currnencyId = $(this).val();
        $.ajax({
            type: "POST",
            url: "/CbExchangeBond/GetCurrncyDefaultFactor?id=" + currnencyId,
            dataType: "json",
            success: function (response) {

                if (response != null) {
                    if (response.isPimary) {
                        $("#CurrencyFactor").val(1);
                        $("#CurrencyFactor").attr('readonly', true);
                    } else {
                        $("#CurrencyFactor").val(response.defaultFactor);
                        $("#CurrencyFactor").attr('readonly', false);
                    }

                }

            }
        });

    });


    tempSource = new kendo.data.DataSource();

    LoadGridBondDetails();
    function LoadGridBondDetails() {
        tempSource = new kendo.data.DataSource({
            transport: {
                read: {
                    url: "/GlBond/GetGlBondDetailsById?id=" + id,
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
                        //Id: { editable: true },
                        paymentId: { editable: true },
                        newPayment: { type: "text", editable: true },
                        numberOfSettlement: { editable: true },
                        period: { editable: true },
                        paymentPaid: { editable: true },
                        numberPerPeriod: { editable: true },
                        dueDate: { type: "date", editable: true },
                        fK_CbCreditCardTypeId: { validation: { required: true } },
                        creditCardTypeName: { editable: true },
                        fK_GlAccountForDiscountId: { editable: true },
                        discountPercentage: { editable: true },
                        fK_GlAccountForTaxId: { editable: true },
                        fK_CbDiscountTypeId: { editable: true },
                        fK_TaxesId: { validation: { required: true } },
                        fK_AppliedGlAccountId: { validation: { required: true } },
                        associatedRowKey: { validation: { required: true } },
                        fK_GlAccountId: { validation: { required: true } },
                        //accountCode: { validation: { required: true } },
                        account: { validation: { required: true } },
                        serial: { type: "number", validation: { min: 1, required: true } },
                        taxName: { type: "text" },
                        taxPercentage: { type: "number" },
                        taxNumber: { type: "text" },
                        employeeName: { type: "text" },
                        amountIncluldeTax: { type: "number" },
                        debit: { type: "number", validation: { required: true, min: 1 } },
                        credit: { type: "number", validation: { required: true, min: 1 } },
                        description: { type: "text", validation: { required: true } },
                        referenceNumber: { type: "number", validation: { min: 1, required: true } },
                        referenceDate: { type: "date", validation: { min: 1, required: true } },
                        fK_DefCurrencyId: { defaultValue: { id: "", currencyNameAr: "" } },
                        currencyName: { defaultValue: { id: "", currencyNameAr: "" } },
                        currencyFactor: { validation: { required: true } },
                        fK_CostCenterId: { defaultValue: { id: "", costCenterCode: "" } },
                        //costCenterCode: { defaultValue: { id: "", costCenterCode: "" } },
                        costCenter: { type: "text" },
                        costCenterName: { type: "text" },
                        notes: { type: "text" }


                    }
                }
            }
        });

        var gridBound = $("#BondsDetailEditgrid").kendoGrid({
            dataSource: tempSource,
            navigatable: false,
            pageable: false,
            scrollable: true,
            //height: 550,
            columns: [
                { field: "paymentId", hidden: true },
                { field: "newPayment", hidden: true },
                { field: "numberOfSettlement", hidden: true },
                { field: "period", hidden: true },
                { field: "numberPerPeriod", hidden: true },
                { field: "paymentPaid", hidden: true },
                { field: "dueDate", hidden: true },
                { field: "fK_HrEmployeeId", hidden: true, format: "{0:c}", width: 120 },
                { field: "fK_CbCreditCardTypeId", hidden: true, format: "{0:c}", width: 120 },
                { field: "creditCardTypeName", hidden: true, format: "{0:c}", width: 120 },
                { field: "fK_GlAccountForDiscountId", hidden: true, format: "{0:c}", width: 120 },
                { field: "discountPercentage", hidden: true, format: "{0:c}", width: 120 },
                { field: "fK_GlAccountForTaxId", hidden: true, format: "{0:c}", width: 120 },
                { field: "fK_CbDiscountTypeId", hidden: true, format: "{0:c}", width: 120 },
                { field: "fK_TaxesId", hidden: true, format: "{0:c}", width: 120 },
                { field: "employeeName", hidden: true, format: "{0:c}", width: 120 },
                { field: "taxName", hidden: true, format: "{0:c}", width: 120 },
                { field: "fK_AppliedGlAccountId", hidden: true, format: "{0:c}", width: 120 },
                { field: "associatedRowKey", hidden: true, width: 120 },
                { field: "fK_GlAccountId", hidden: true, format: "{0:c}", width: 120 },
                //{ field: "accountCode", title: Resources.AccountCodeResource, format: "{0:c}", width: Resources.NameWidth },
                { field: "order", hidden: true, width: Resources.InputNumberWidth, title: Resources.Serial },
                { width: Resources.InputNumberWidth, template: "<span class='counter'> </span>", title: Resources.Serial },
                {
                    field: "account", title: Resources.Account, width: 300,
                    template: "#: account # #: costCenter # #: employeeName # - #: description #"
                },
                { field: "serial", width: Resources.InputNumberWidth, title: Resources.VoucherCode },
                { field: "taxName", hidden: true, width: Resources.NameWidth, title: Resources.TaxName },
                { field: "taxPercentage", hidden: true, width: Resources.InputNumberWidth, title: Resources.TaxValueResource },
                //{ field: "totalTaxAmount", width: Resources.InputNumberWidth, title: Resources.TotalTaxAmount },
                { field: "amountIncluldeTax", hidden: true, width: Resources.NameWidth, title: Resources.AmountIncluldeTax },
                { field: "referenceNumber", width: Resources.NameWidth, title: Resources.ReferenceNumber },
                { field: "referenceDate", format: "{0:yyyy/MM/dd}", width: Resources.DateWidth, title: Resources.ReferenceDate },
                { field: "debit", title: Resources.Debit, width: Resources.InputNumberWidth, editor: numberEditor, format: '{0:n2}' },
                { field: "credit", title: Resources.Credit, width: Resources.InputNumberWidth, editor: numberEditor, format: '{0:n2}' },
                { field: "fK_DefCurrencyId", format: "{0:c}", hidden: true },
                { field: "currencyName", hidden: true, width: Resources.TypeWidth, title: Resources.Currency },
                { field: "currencyFactor", hidden: true, width: Resources.AmountWidth, title: Resources.CurrencyFactor },
                { field: "fK_CostCenterId", hidden: true, width: Resources.CodeWidth, title: Resources.CostCenterCode },
                //{ field: "costCenterCode", width: Resources.CodeWidth, title: Resources.CostCenterCodeResource },
                { field: "taxNumber", hidden: true, width: Resources.InputNumberWidth, title: Resources.TaxNumber },
                { field: "costCenterName", hidden: true, width: Resources.NameWidth, title: Resources.CostCenter },
                { field: "description", hidden: true, width: Resources.DescriptionWidth, title: Resources.Description },
                { field: "notes", hidden: true, width: Resources.NoteWidth, title: Resources.Notes },
                { width: Resources.DoubleActionWidth, template: "#if(credit != null && credit !='' && credit !='0' && credit != '0.00'){#<button type='button' class='btn btn-success btn-sm btnAddPayment' >" + Resources.Payment + "</button>#}#" },
                //{ width: Resources.DoubleActionWidth, template: "<button type='button' class='btn btn-success btn-sm btnAddPayment' >" + Resources.Payment + "</button>" },
                { width: Resources.DoubleActionWidth, template: "<a  class='btn btn-danger btn-sm btnDelete' ><i class='fas fa-trash-alt'></i></a> <a class='btn btn-success btn-sm btnEdit'><i class='fas fa-edit'></i></a>" }
            ],
            editable: false,
            noRecords: true,
            dataBound: function (e) {
                e.sender.items().each(function () {
                    var dataItem = e.sender.dataItem(this);
                    kendo.bind(this, dataItem);
                    if (dataItem.fK_TaxesId > 0 && dataItem.credit == 0 && dataItem.debit == 0) {
                        var $row = $('#BondsDetailEditgrid').find("[data-uid='" + dataItem.uid + "']");
                        $row.hide();
                    }
                })
                CheckIsPosted();
            },
            messages: {
                noRecords: "There is no data on current page"
            },
            selectable: "multiple, cell"
        });

        gridBound.data("kendoGrid").table.on("click", ".btnAddPayment", AddPayment);
        gridBound.data("kendoGrid").table.on("click", ".btnDelete", removeRow);
        gridBound.data("kendoGrid").table.on("click", ".btnEdit", editVoucherDetailRow);
        function numberEditor(container, options) {
            $('<input name="' + options.field + '"/>')
                .appendTo(container)
                .kendoNumericTextBox({
                    format: "{0:n2}",
                    decimals: 3,
                    step: 0.001
                });
        }
        tempSource.fetch(function () {
            var data = tempSource.data();
            var grid = $("#BondsDetailEditgrid").data("kendoGrid");
            grid.tbody.find("tr[role='row']").each(function () {

                var model = grid.dataItem(this);
                if (model != undefined && model.fK_TaxesId > 0 && model.fK_AppliedGlAccountId != null) {
                    $(this).find(".btnDelete").addClass("k-state-disabled");
                    $(this).find(".btnEdit").addClass("k-state-disabled");
                    $(this).find(".btnAddPayment").addClass("k-state-disabled");

                }

                if (model != undefined && model.fK_CbDiscountTypeId > 0 && model.fK_AppliedGlAccountId != null) {
                    $(this).find(".btnDelete").addClass("k-state-disabled");
                    $(this).find(".btnEdit").addClass("k-state-disabled");
                    $(this).find(".btnAddPayment").addClass("k-state-disabled");

                }
            });

            getTotalDebit();
            getTotalCredit();
            getTotalBalance();
            setGridSerial();
        });
    }
    $("#btnAddNewBondDetail").on('click', function () {

        var glAccountId = $("#AccountId").val(),
            account = $("#accountAutoCompleteBondAdd").data("kendoDropDownList").text(),
            EmployeeName = $("#FK_HrEmployeeId").data("kendoDropDownList").text(),
            accountName = $("#accountName").val(),
            costCenterId = $("#CostCenterId").val(),
            costCenter = $("#costCenterAutoCompleteBondAdd").data("kendoDropDownList").text(),
            costCenterName = $("#CostCenterName").val(),
            currencyId = 1,
            currencyName = $("#FK_DefCurrencyId option:selected").text(),
            currencyFactor = 1,
            debit = $("#debit").val(),
            credit = $("#credit").val(),
            description = $("#description").val(),
            referenceNumber = $("#referenceNumber").val(),
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
            FK_HrEmployeeId = parseInt($("#FK_HrEmployeeId").val()),
            FK_GlAccountForDiscountId = parseInt($("#FK_GlAccountForDiscountId").val()),
            FK_GlAccountForTaxId = parseInt($("#FK_GlAccountForTaxId").val()),
            FK_TaxesIdForCCAndAcc = parseInt($("#FK_TaxesIdForCCAndAcc").val()),
            AppliedAccountForTaxCCAndAcc = $("#TaxCodeForCCAndAcc").val() + "--" + $("#TaxAccountForCCAndAcc").val(),
            TaxCodeForCCAndAcc = $("#TaxCodeForCCAndAcc").val(),
            AppliedAccountForDiscountCCAndAcc = $("#AccountCodeForDiscount").val() + "--" + $("#AccountNameForDiscount").val(),
            TaxNameForCCAndAcc = $("#TaxNameForCCAndAcc").val(),

            serial = $("#Serial").val(),
            referenceDate = new Date($("#ReferenceDate").val()),
            uid = $("#uid").val(),
            notes = $("#notes").val();
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

        if (costCenterId == 0 || isNaN(costCenterId)) {
            costCenter = "";
            costCenterCode = "";
            costCenterId = 0;
        }
        else { costCenter = ' - ' + costCenter }


        if (glAccountId == "" || glAccountId == "0") {
            swal({
                title: Resources.ChooseAccountResource,
                confirmButtonText: Resources.DoneResource,
                type: "error"
            });
        }
        else if (currencyId == "") {
            swal({
                title: Resources.ChooseResource + "  " + Resources.CurrencyResource,
                confirmButtonText: Resources.DoneResource,
                type: "error"
            });
        }
        else if ((debit == "" && credit == "") || (debit == "0" && credit == "0")) {
            swal({
                title: Resources.DebitCreditRequiredResource,
                confirmButtonText: Resources.DoneResource,
                type: "error"
            });
        }
        else if (description == "") {
            swal({
                title: Resources.EnterRequiredResource + " " + Resources.Description,
                confirmButtonText: Resources.DoneResource,
                type: "error"
            });
        }
        else if (referenceNumber == "") {
            swal({
                title: Resources.EnterRequiredResource + " " + Resources.ReferenceNumber,
                confirmButtonText: Resources.DoneResource,
                type: "error"
            });
        }
        else {

            var debitFormated = parseFloat(debit).toFixed(2).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
            var creditFormated = parseFloat(credit).toFixed(2).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
            var totalRecords = $("#BondsDetailEditgrid").data("kendoGrid").dataSource.data().length;
            var Index = parseInt($("#Index").val());
            if (!isNaN(Index))
                totalRecords = Index - 1;

            var grid = $("#BondsDetailEditgrid").data("kendoGrid");
            var data = grid.dataSource.data();
            var res = $.grep(data, function (d) {
                return d.uid == uid;
            });
            debugger
            if (uid != "" && res.length > 0) {
                var grid = $("#BondsDetailEditgrid").data("kendoGrid");
                var row = $("#BondsDetailEditgrid").data("kendoGrid")
                    .tbody
                    .find("tr[data-uid='" + uid + "']");
                var dataItem = grid.dataItem(row);
                var rowIndex = dataItem.order - 1;
                dataItem.set("fK_GlAccountId", glAccountId);
                dataItem.set("serial", serial);
                dataItem.set("account", account);
                dataItem.set("referenceNumber", referenceNumber);
                dataItem.set("referenceDate", referenceDate);
                dataItem.set("debit", debitFormated);
                dataItem.set("credit", creditFormated);
                dataItem.set("description", description);
                dataItem.set("fK_DefCurrencyId", currencyId);
                dataItem.set("currencyName", currencyName);
                dataItem.set("currencyFactor", currencyFactor);
                dataItem.set("fK_CostCenterId", costCenterId);
                dataItem.set("costCenter", costCenter);
                dataItem.set("costCenterName", costCenter);
                dataItem.set("fK_HrEmployeeId", FK_HrEmployeeId);
                dataItem.set("employeeName", EmployeeName);

                var associatedRowKey = dataItem.associatedRowKey;


                var data = grid.dataSource.data();
                var res = $.grep(data, function (d) {
                    return d.associatedRowKey == associatedRowKey;
                });

                var hasCreditType = res.filter(function (r) { return r.fK_CbCreditCardTypeId > 0 });
                debugger
                var hasDetails = false;
                for (var i = 0; i < res.length; i++) {
                    if (res[i].fK_TaxesId > 0 && res[i].fK_GlAccountForTaxId > 0 && res[i].fK_AppliedGlAccountId > 0 && hasCreditType.length == 0) {
                        hasDetails = true;
                        if ($("#IsAmountIncluldeTax").prop("checked") == true && debit > 0) {
                            AmountIncluldeTax = parseFloat(debit).toFixed(2);
                            debit = parseFloat(parseFloat(debit) - parseFloat($("#TotalTaxAmount").val())).toFixed(2);
                        }

                        if ($("#IsAmountIncluldeTax").prop("checked") == true && credit > 0) {
                            AmountIncluldeTax = parseFloat(credit).toFixed(2);
                            credit = parseFloat(parseFloat(credit) - parseFloat($("#TotalTaxAmount").val())).toFixed(2);
                        }


                        var TaxRow = $("#BondsDetailEditgrid").data("kendoGrid")
                            .tbody
                            .find("tr[data-uid='" + res[i].uid + "']");
                        var TaxdataItem = grid.dataItem(TaxRow);
                        if (debit > 0)
                            TaxDebitAmount = $("#TotalTaxAmount").val().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
                        if (credit > 0)
                            TaxCreditAmount = $("#TotalTaxAmount").val().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
                        if (FK_TaxesId != 0) {
                            TaxdataItem.set("fK_TaxesId", FK_TaxesId);
                            TaxdataItem.set("taxPercentage", TaxPercentage);
                            TaxdataItem.set("amountIncluldeTax", AmountIncluldeTax);
                            TaxdataItem.set("fK_AppliedGlAccountId", glAccountId);
                            TaxdataItem.set("taxName", TaxName);
                            TaxdataItem.set("account", AppliedAccount);
                            TaxdataItem.set("totalTaxAmount", TotalTaxAmount);
                            TaxdataItem.set("serial", serial);
                            TaxdataItem.set("fK_GlAccountId", glAccountId);
                            TaxdataItem.set("fK_GlAccountForTaxId", FK_GlAccountForTaxId);
                            TaxdataItem.set("associatedRowKey", res[i].associatedRowKey);
                            TaxdataItem.set("referenceNumber", referenceNumber);
                            TaxdataItem.set("referenceDate", referenceDate);
                            TaxdataItem.set("debit", TaxDebitAmount);
                            TaxdataItem.set("credit", TaxCreditAmount);
                            TaxdataItem.set("description", description);
                            TaxdataItem.set("fK_DefCurrencyId", currencyId);
                            TaxdataItem.set("currencyName", currencyName);
                            TaxdataItem.set("currencyFactor", currencyFactor);
                            TaxdataItem.set("costCenter", costCenter);
                            TaxdataItem.set("costCenterName", costCenter);
                            TaxdataItem.set("fK_CostCenterId", costCenterId);
                            TaxdataItem.set("notes", notes);
                            TaxdataItem.set("taxNumber", TaxNumber);
                            TaxdataItem.set("fK_HrEmployeeId", FK_HrEmployeeId);
                            TaxdataItem.set("employeeName", EmployeeName);
                            TaxdataItem.set("associatedRowKey", uid);
                        }
                        else {
                            var dataSource = $("#BondsDetailEditgrid").data("kendoGrid").dataSource;
                            dataSource.remove(TaxdataItem);
                        }

                    }
                    else if (res[i].fK_TaxesId > 0 && FK_TaxesIdForCCAndAcc != 0 && res[i].fK_CbDiscountTypeId == null && res[i].fK_AppliedGlAccountId > 0) {
                        hasDetails = true;
                        var TaxRowForCCAndAcc = $("#BondsDetailEditgrid").data("kendoGrid")
                            .tbody
                            .find("tr[data-uid='" + res[i].uid + "']");
                        var TaxdataItemForCCAndAcc = grid.dataItem(TaxRowForCCAndAcc);
                        if (debit > 0) {
                            TaxDebitAmount = parseFloat($("#TaxOnDiscount").val()).toFixed(2).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
                        }
                        if (credit > 0) {
                            TaxCreditAmount = parseFloat($("#TaxOnDiscount").val()).toFixed(2).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
                        }
                        if (FK_TaxesIdForCCAndAcc != 0) {

                            TaxdataItemForCCAndAcc.set("fK_TaxesId", FK_TaxesIdForCCAndAcc);
                            TaxdataItemForCCAndAcc.set("fK_GlAccountForTaxId", FK_GlAccountForTaxId);
                            TaxdataItemForCCAndAcc.set("fK_AppliedGlAccountId", glAccountId);
                            TaxdataItemForCCAndAcc.set("taxName", TaxNameForCCAndAcc);
                            TaxdataItemForCCAndAcc.set("account", TaxNameForCCAndAcc);
                            TaxdataItemForCCAndAcc.set("serial", serial);
                            TaxdataItemForCCAndAcc.set("fK_GlAccountId", FK_GlAccountForTaxId);
                            TaxdataItemForCCAndAcc.set("associatedRowKey", res[i].associatedRowKey);
                            TaxdataItemForCCAndAcc.set("referenceNumber", referenceNumber);
                            TaxdataItemForCCAndAcc.set("referenceDate", referenceDate);
                            TaxdataItemForCCAndAcc.set("debit", TaxDebitAmount);
                            TaxdataItemForCCAndAcc.set("credit", TaxCreditAmount);
                            TaxdataItemForCCAndAcc.set("description", description);
                            TaxdataItemForCCAndAcc.set("fK_DefCurrencyId", currencyId);
                            TaxdataItemForCCAndAcc.set("currencyName", currencyName);
                            TaxdataItemForCCAndAcc.set("currencyFactor", currencyFactor);
                            TaxdataItemForCCAndAcc.set("costCenter", costCenter);
                            TaxdataItemForCCAndAcc.set("fK_CostCenterId", costCenterId);
                            TaxdataItemForCCAndAcc.set("notes", notes);
                            TaxdataItemForCCAndAcc.set("taxNumber", TaxNumber);
                            TaxdataItemForCCAndAcc.set("fK_HrEmployeeId", FK_HrEmployeeId);
                            TaxdataItemForCCAndAcc.set("employeeName", EmployeeName);
                            TaxdataItemForCCAndAcc.set("associatedRowKey", uid);
                        }
                        else {
                            var dataSource = $("#BondsDetailEditgrid").data("kendoGrid").dataSource;
                            dataSource.remove(TaxdataItemForCCAndAcc);
                        }

                    }
                    else if (res[i].fK_CbDiscountTypeId > 0 && hasCreditType.length > 0) {
                        hasDetails = true;
                        var DiscountRow = $("#BondsDetailEditgrid").data("kendoGrid")
                            .tbody
                            .find("tr[data-uid='" + res[i].uid + "']");
                        var DiscountdataItem = grid.dataItem(DiscountRow);
                        if (debit > 0) {
                            DiscountDebitAmount = parseFloat($("#Discount").val()).toFixed(2).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
                        }
                        if (credit > 0) {
                            DiscountCreditAmount = parseFloat($("#Discount").val()).toFixed(2).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
                        }
                        DiscountdataItem.set("fK_GlAccountId", FK_GlAccountForDiscountId);
                        DiscountdataItem.set("fK_AppliedGlAccountId", glAccountId);
                        DiscountdataItem.set("fK_CbDiscountTypeId", FK_CbDiscountTypeId);
                        DiscountdataItem.set("fK_CbCreditCardTypeId", FK_CbCreditCardTypeId);
                        DiscountdataItem.set("account", AppliedAccountForDiscountCCAndAcc);
                        DiscountdataItem.set("serial", serial);
                        DiscountdataItem.set("associatedRowKey", res[i].associatedRowKey);
                        DiscountdataItem.set("referenceNumber", referenceNumber);
                        DiscountdataItem.set("referenceDate", referenceDate);
                        DiscountdataItem.set("debit", DiscountDebitAmount);
                        DiscountdataItem.set("credit", DiscountCreditAmount);
                        DiscountdataItem.set("description", description);
                        DiscountdataItem.set("fK_DefCurrencyId", currencyId);
                        DiscountdataItem.set("currencyName", currencyName);
                        DiscountdataItem.set("currencyFactor", currencyFactor);
                        DiscountdataItem.set("costCenter", costCenter);
                        DiscountdataItem.set("fK_CostCenterId", costCenterId);
                        DiscountdataItem.set("notes", notes);
                        DiscountdataItem.set("taxNumber", TaxNumber);
                        DiscountdataItem.set("fK_HrEmployeeId", FK_HrEmployeeId);
                        DiscountdataItem.set("employeeName", EmployeeName);
                        DiscountdataItem.set("associatedRowKey", uid);
                    }
                    else {
                        dataItem.set("fK_GlAccountId", glAccountId);
                        dataItem.set("serial", serial);
                        dataItem.set("account", account);
                        dataItem.set("associatedRowKey", uid);
                        dataItem.set("referenceNumber", referenceNumber);
                        dataItem.set("referenceDate", referenceDate);
                        dataItem.set("debit", debit);
                        dataItem.set("credit", credit);
                        dataItem.set("description", description);
                        dataItem.set("fK_DefCurrencyId", currencyId);
                        dataItem.set("currencyName", currencyName);
                        dataItem.set("currencyFactor", currencyFactor);
                        dataItem.set("costCenter", costCenter);
                        dataItem.set("fK_CostCenterId", costCenterId);
                        dataItem.set("fK_HrEmployeeId", FK_HrEmployeeId);
                        dataItem.set("employeeName", EmployeeName);
                        dataItem.set("fK_AppliedGlAccountId", null);

                        if (FK_TaxesIdForCCAndAcc != 0)
                            dataItem.set("fK_TaxesId", FK_TaxesIdForCCAndAcc);
                        else
                            dataItem.set("fK_TaxesId", FK_TaxesId);
                        dataItem.set("taxPercentage", TaxPercentage);
                    }
                }
                debugger
                if (credit == "" || credit == 0) {
                    dataItem.set("numberOfSettlement", 0);
                    dataItem.set("numberPerPeriod", 0);
                }
                if (res.length > 0)
                    hasDetails = true
                if (!hasDetails) {

                    if (FK_TaxesId != 0) {

                        if ($("#IsAmountIncluldeTax").prop("checked") == true && debit > 0) {
                            AmountIncluldeTax = parseFloat(debit).toFixed(2);
                            debit = parseFloat(parseFloat(debit) - parseFloat($("#TotalTaxAmount").val())).toFixed(2);
                            credit = parseFloat(0).toFixed(2);
                        }

                        if ($("#IsAmountIncluldeTax").prop("checked") == true && credit > 0) {
                            AmountIncluldeTax = parseFloat(credit).toFixed(2);
                            credit = parseFloat(parseFloat(credit) - parseFloat($("#TotalTaxAmount").val())).toFixed(2);
                            debit = parseFloat(0).toFixed(2);
                        }

                        if (debit > 0)
                            TaxDebitAmount = parseFloat($("#TotalTaxAmount").val()).toFixed(2).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
                        if (credit > 0)
                            TaxCreditAmount = parseFloat($("#TotalTaxAmount").val()).toFixed(2).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");

                        tempSource.insert(rowIndex, {
                            fK_GlAccountId: FK_AppliedGlAccountId,
                            fK_AppliedGlAccountId: glAccountId,
                            fK_TaxesId: FK_TaxesId,
                            fK_GlAccountForTaxId: FK_AppliedGlAccountId,
                            serial: serial,
                            account: TaxName,
                            taxName: TaxName,
                            associatedRowKey: uid,
                            taxPercentage: TaxPercentage,
                            taxNumber: TaxNumber,
                            totalTaxAmount: TotalTaxAmount,
                            amountIncluldeTax: AmountIncluldeTax,
                            referenceNumber: referenceNumber,
                            referenceDate: referenceDate,
                            debit: TaxDebitAmount,
                            credit: TaxCreditAmount,
                            description: description,
                            fK_DefCurrencyId: currencyId,
                            currencyName: currencyName,
                            currencyFactor: currencyFactor,
                            costCenter: costCenter,
                            costCenterName: costCenter,
                            fK_CostCenterId: costCenterId,
                            fK_HrEmployeeId: FK_HrEmployeeId,
                            employeeName: EmployeeName,
                            notes: notes,

                        });

                    }
                    else if (FK_CbCreditCardTypeId != 0) {

                        if (debit > 0) {
                            TaxDebitAmount = parseFloat($("#TaxOnDiscount").val()).toFixed(2).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
                            DiscountDebitAmount = parseFloat($("#Discount").val()).toFixed(2).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");

                        }
                        if (credit > 0) {
                            TaxCreditAmount = parseFloat($("#TaxOnDiscount").val()).toFixed(2).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
                            DiscountCreditAmount = parseFloat($("#Discount").val()).toFixed(2).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");

                        }

                        //Tax Row
                        tempSource.insert(rowIndex, {
                            fK_GlAccountId: FK_GlAccountForTaxId,
                            fK_GlAccountForTaxId: FK_GlAccountForTaxId,
                            fK_AppliedGlAccountId: glAccountId,
                            fK_TaxesId: FK_TaxesIdForCCAndAcc,
                            serial: serial,
                            account: TaxNameForCCAndAcc,
                            taxName: TaxNameForCCAndAcc,
                            associatedRowKey: uid,
                            TaxPercentage: parseFloat(TaxOnDiscountAmountForCCAndAcc),
                            taxNumber: TaxNumber,
                            referenceNumber: referenceNumber,
                            referenceDate: referenceDate,
                            debit: TaxDebitAmount,
                            credit: TaxCreditAmount,
                            description: description,
                            fK_DefCurrencyId: currencyId,
                            currencyName: currencyName,
                            currencyFactor: currencyFactor,
                            costCenter: costCenter,
                            fK_CostCenterId: costCenterId,
                            fK_HrEmployeeId: FK_HrEmployeeId,
                            employeeName: EmployeeName,
                            costCenterName: costCenter,
                            notes: notes,

                        });

                        //Discount Row
                        tempSource.insert(rowIndex, {
                            fK_GlAccountId: FK_GlAccountForDiscountId,
                            fK_GlAccountForDiscountId: FK_GlAccountForDiscountId,
                            fK_AppliedGlAccountId: glAccountId,
                            fK_CbDiscountTypeId: FK_CbDiscountTypeId,
                            fK_CbCreditCardTypeId: FK_CbCreditCardTypeId,
                            creditCardTypeName: CreditCardTypeName,
                            serial: serial,
                            account: AppliedAccountForDiscountCCAndAcc,
                            discountPercentage: DiscountPercentage,
                            associatedRowKey: uid,
                            referenceNumber: referenceNumber,
                            referenceDate: referenceDate,
                            debit: DiscountDebitAmount,
                            credit: DiscountCreditAmount,
                            description: description,
                            fK_DefCurrencyId: currencyId,
                            currencyName: currencyName,
                            currencyFactor: currencyFactor,
                            costCenter: costCenter,
                            costCenterName: costCenter,
                            fK_CostCenterId: costCenterId,
                            fK_HrEmployeeId: FK_HrEmployeeId,
                            employeeName: EmployeeName,
                            notes: notes,

                        });
                    }
                }

            }
            else if (FK_TaxesId != 0) {

                if ($("#IsAmountIncluldeTax").prop("checked") == true && debit > 0) {
                    AmountIncluldeTax = parseFloat(debit).toFixed(2);
                    debit = parseFloat(parseFloat(debit) - parseFloat($("#TotalTaxAmount").val())).toFixed(2);
                    credit = parseFloat(0).toFixed(2);
                }

                if ($("#IsAmountIncluldeTax").prop("checked") == true && credit > 0) {
                    AmountIncluldeTax = parseFloat(credit).toFixed(2);
                    credit = parseFloat(parseFloat(credit) - parseFloat($("#TotalTaxAmount").val())).toFixed(2);
                    debit = parseFloat(0).toFixed(2);
                }


                tempSource.insert(totalRecords, {
                    fK_GlAccountId: glAccountId,
                    fK_GlAccountForTaxId: FK_AppliedGlAccountId,
                    fK_TaxesId: FK_TaxesId,
                    serial: serial,
                    account: account,
                    referenceNumber: referenceNumber,
                    referenceDate: referenceDate,
                    debit: debit,
                    credit: credit,
                    description: description,
                    fK_DefCurrencyId: currencyId,
                    currencyName: currencyName,
                    currencyFactor: currencyFactor,
                    costCenter: costCenter,
                    costCenterName: costCenter,
                    fK_CostCenterId: costCenterId,
                    employeeName: EmployeeName,
                    fK_HrEmployeeId: FK_HrEmployeeId,
                    notes: notes,
                    taxName: TaxName,
                    taxPercentage: TaxPercentage,
                    taxNumber: TaxNumber,
                    amountIncluldeTax: AmountIncluldeTax,

                });
                var Grid = $("#BondsDetailEditgrid").data("kendoGrid");
                var GridData = Grid.dataSource.view();
                GridData[totalRecords].associatedRowKey = GridData[totalRecords].uid;
                var Uid = GridData[totalRecords].uid;

                if (debit > 0)
                    TaxDebitAmount = parseFloat($("#TotalTaxAmount").val()).toFixed(2).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
                if (credit > 0)
                    TaxCreditAmount = parseFloat($("#TotalTaxAmount").val()).toFixed(2).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");

                tempSource.insert(totalRecords, {
                    fK_GlAccountId: FK_AppliedGlAccountId,
                    fK_GlAccountForTaxId: FK_AppliedGlAccountId,
                    fK_AppliedGlAccountId: FK_AppliedGlAccountId,
                    fK_TaxesId: FK_TaxesId,
                    serial: serial,
                    account: TaxName,
                    taxName: TaxName,
                    associatedRowKey: Uid,
                    taxPercentage: TaxPercentage,
                    taxNumber: TaxNumber,
                    totalTaxAmount: TotalTaxAmount,
                    amountIncluldeTax: AmountIncluldeTax,
                    referenceNumber: referenceNumber,
                    referenceDate: referenceDate,
                    debit: TaxDebitAmount,
                    credit: TaxCreditAmount,
                    description: description,
                    fK_DefCurrencyId: currencyId,
                    currencyName: currencyName,
                    currencyFactor: currencyFactor,
                    costCenter: costCenter,
                    costCenterName: costCenter,
                    fK_CostCenterId: costCenterId,
                    fK_HrEmployeeId: FK_HrEmployeeId,
                    employeeName: EmployeeName,
                    notes: notes,

                });

            }
            else if (FK_CbCreditCardTypeId != 0) {

                tempSource.insert(totalRecords, {
                    fK_GlAccountId: glAccountId,
                    serial: serial,
                    account: account,
                    creditCardTypeName: CreditCardTypeName,
                    referenceNumber: referenceNumber,
                    referenceDate: referenceDate,
                    debit: debitFormated,
                    credit: creditFormated,
                    description: description,
                    fK_DefCurrencyId: currencyId,
                    currencyName: currencyName,
                    currencyFactor: currencyFactor,
                    costCenter: costCenter,
                    fK_CostCenterId: costCenterId,
                    fK_HrEmployeeId: FK_HrEmployeeId,
                    employeeName: EmployeeName,
                    costCenterName: costCenter,
                    notes: notes,
                    fK_GlAccountForTaxId: FK_GlAccountForTaxId,
                    fK_TaxesId: FK_TaxesIdForCCAndAcc,
                    taxPercentage: parseFloat(TaxOnDiscountAmountForCCAndAcc),
                    taxNumber: TaxNumber,
                    fK_GlAccountForDiscountId: FK_GlAccountForDiscountId,
                    discountPercentage: DiscountPercentage,

                });
                var Grid = $("#BondsDetailEditgrid").data("kendoGrid");
                var GridData = Grid.dataSource.view();
                GridData[totalRecords].associatedRowKey = GridData[totalRecords].uid;
                var Uid = GridData[totalRecords].uid;

                if (debit > 0) {
                    TaxDebitAmount = parseFloat($("#TaxOnDiscount").val()).toFixed(2).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
                    DiscountDebitAmount = parseFloat($("#Discount").val()).toFixed(2).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");

                }
                if (credit > 0) {
                    TaxCreditAmount = parseFloat($("#TaxOnDiscount").val()).toFixed(2).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
                    DiscountCreditAmount = parseFloat($("#Discount").val()).toFixed(2).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");

                }

                //Tax Row
                tempSource.insert(totalRecords, {
                    fK_GlAccountId: FK_GlAccountForTaxId,
                    fK_GlAccountForTaxId: FK_GlAccountForTaxId,
                    fK_AppliedGlAccountId: glAccountId,
                    fK_TaxesId: FK_TaxesIdForCCAndAcc,
                    serial: serial,
                    account: TaxNameForCCAndAcc,
                    taxName: TaxNameForCCAndAcc,
                    associatedRowKey: Uid,
                    TaxPercentage: parseFloat(TaxOnDiscountAmountForCCAndAcc),
                    taxNumber: TaxNumber,
                    referenceNumber: referenceNumber,
                    referenceDate: referenceDate,
                    debit: TaxDebitAmount,
                    credit: TaxCreditAmount,
                    description: description,
                    fK_DefCurrencyId: currencyId,
                    currencyName: currencyName,
                    currencyFactor: currencyFactor,
                    costCenter: costCenter,
                    fK_CostCenterId: costCenterId,
                    fK_HrEmployeeId: FK_HrEmployeeId,
                    employeeName: EmployeeName,
                    costCenterName: costCenter,
                    notes: notes,

                });

                //Discount Row
                tempSource.insert(totalRecords, {
                    fK_GlAccountId: FK_GlAccountForDiscountId,
                    fK_GlAccountForDiscountId: FK_GlAccountForDiscountId,
                    fK_AppliedGlAccountId: glAccountId,
                    fK_CbDiscountTypeId: FK_CbDiscountTypeId,
                    fK_CbCreditCardTypeId: FK_CbCreditCardTypeId,
                    creditCardTypeName: CreditCardTypeName,
                    serial: serial,
                    account: AppliedAccountForDiscountCCAndAcc,
                    discountPercentage: DiscountPercentage,
                    associatedRowKey: Uid,
                    referenceNumber: referenceNumber,
                    referenceDate: referenceDate,
                    debit: DiscountDebitAmount,
                    credit: DiscountCreditAmount,
                    description: description,
                    fK_DefCurrencyId: currencyId,
                    currencyName: currencyName,
                    currencyFactor: currencyFactor,
                    costCenter: costCenter,
                    costCenterName: costCenter,
                    fK_CostCenterId: costCenterId,
                    fK_HrEmployeeId: FK_HrEmployeeId,
                    employeeName: EmployeeName,
                    notes: notes,

                });
            }
            else {
                tempSource.insert(totalRecords, {
                    paymentId: 0,
                    numberOfSettlement: 0,
                    serial: serial,
                    fK_GlAccountId: glAccountId,
                    account: account,
                    referenceNumber: referenceNumber,
                    serial: serial,
                    referenceDate: referenceDate,
                    debit: debitFormated,
                    credit: creditFormated,
                    description: description,
                    fK_DefCurrencyId: currencyId,
                    currencyName: currencyName,
                    currencyFactor: currencyFactor,
                    fK_CostCenterId: costCenterId,
                    fK_HrEmployeeId: FK_HrEmployeeId,
                    employeeName: EmployeeName,
                    costCenter: costCenter,
                    costCenterName: costCenter,
                    notes: notes,
                });

            }
            var grid = $("#BondsDetailEditgrid").data("kendoGrid");
            grid.refresh();
            setGridSerial();
            grid.tbody.find("tr[role='row']").each(function () {

                var model = grid.dataItem(this);
                debugger
                if (model != undefined && model.fK_TaxesId > 0 && model.fK_AppliedGlAccountId != null) {
                    $(this).find(".btnDelete").addClass("k-state-disabled");
                    $(this).find(".btnEdit").addClass("k-state-disabled");
                    $(this).find(".btnAddPayment").addClass("k-state-disabled");

                }
                if (model != undefined && model.fK_CbDiscountTypeId > 0 && model.fK_AppliedGlAccountId != null) {
                    $(this).find(".btnDelete").addClass("k-state-disabled");
                    $(this).find(".btnEdit").addClass("k-state-disabled");
                    $(this).find(".btnAddPayment").addClass("k-state-disabled");
                }
            });

            getTotalDebit();
            getTotalCredit();
            getTotalBalance();
            ClearFormDetails();

        }


    });



    function editVoucherDetailRow() {
        ClearFormDetails();
        var row = $(this).closest("tr"),
            grid = $("#BondsDetailEditgrid").data("kendoGrid"),
            dataItem = grid.dataItem(row);
        var uid = dataItem.uid;
        var associatedRowKey = dataItem.associatedRowKey;
        $("#uid").val(dataItem.uid);
        $("#AccountId").val(dataItem.fK_GlAccountId);

        var empId = dataItem.fK_HrEmployeeId;
        if (empId == null || isNaN(empId))
            empId = 0
        if (empId > 0)
            $("#FK_TaxesId").data("kendoDropDownList").enable(false);
        $("#FK_HrEmployeeId").val(empId);

        $("#Serial").val(dataItem.serial);
        $("#accountAutoCompleteBondAdd").data("kendoDropDownList").value(dataItem.fK_GlAccountId);
        $("#FK_HrEmployeeId").data("kendoDropDownList").value(empId);
        $("#accountName").val(dataItem.accountName);
        $("#referenceNumber").val(dataItem.referenceNumber);
        //$("#ReferenceDate").val(new Date(dataItem.ReferenceDate));

        $("#FK_CbCreditCardTypeId").data("kendoDropDownList").value("0");
        $("#FK_CbCreditCardTypeId").data("kendoDropDownList").dataSource.read();

        $("#debit").val(parseFloat(dataItem.debit.toString().replace(/\,/g, '')));
        $("#credit").val(parseFloat(dataItem.credit.toString().replace(/\,/g, '')));
        $("#description").val(dataItem.description);
        //CurrencyName = jQuery("#FK_DefCurrencyId option:selected").text();
        $("#costCenterAutoCompleteBondAdd").data("kendoDropDownList").value(parseInt(dataItem.fK_CostCenterId));
        $("#CostCenterId").val(parseInt(dataItem.fK_CostCenterId));
        $("#CostCenterName").val(dataItem.costCenterName);

        if (associatedRowKey != null) {
            var data = grid.dataSource.data();
            var res = $.grep(data, function (d) {
                return d.associatedRowKey == associatedRowKey;
            });
            debugger
            var hasCreditType = res.filter(function (r) { return r.fK_CbCreditCardTypeId > 0 });
            for (var i = 0; i < res.length; i++) {
                debugger
                if (res[i].fK_TaxesId > 0 && res[i].fK_GlAccountForTaxId != null && res[i].fK_AppliedGlAccountId == null && hasCreditType.length == 0) {
                    debugger
                    $("#FK_TaxesId").data("kendoDropDownList").enable(true);
                    $("#FK_TaxesId").data("kendoDropDownList").value(res[i].fK_TaxesId);

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

                    if (res[i].amountIncluldeTax > 0 && res[i].debit != 0) {
                        $("#IsAmountIncluldeTax").prop('checked', true);
                        $("#debit").val(res[i].amountIncluldeTax);
                    }
                    if (res[i].amountIncluldeTax > 0 && res[i].credit != 0) {
                        $("#IsAmountIncluldeTax").prop('checked', true);
                        $("#credit").val(res[i].amountIncluldeTax);
                    }
                    $('#IsAmountIncluldeTax').prop("disabled", false);

                }
                if (res[i].fK_TaxesId > 0 && res[i].fK_GlAccountForTaxId > 0 && res[i].fK_AppliedGlAccountId != null && hasCreditType.length > 0) {

                    $("#FK_TaxesIdForCCAndAcc").val(res[i].fK_TaxesId);
                    $("#FK_GlAccountForTaxId").val(res[i].fK_GlAccountForTaxId);
                    $("#TaxNumber").val(res[i].taxNumber);
                    $("#FK_AppliedGlAccountId").val(res[i].fK_AppliedGlAccountId);
                    $("#TaxNameForCCAndAcc").val(res[i].taxName);
                    $("#TaxOnDiscountAmountForCCAndAcc").val(res[i].taxPercentage);

                    if (res[i].debit != 0)
                        $("#TaxOnDiscount").val(parseFloat(res[i].debit.toString().replace(/\,/g, '')));

                    if (res[i].credit != 0)
                        $("#TaxOnDiscount").val(parseFloat(res[i].credit.toString().replace(/\,/g, '')));

                }
                if (res[i].fK_CbDiscountTypeId > 0 && res[i].fK_CbCreditCardTypeId != undefined && res[i].fK_AppliedGlAccountId != undefined && hasCreditType.length > 0) {
                    $("#FK_TaxesId").data("kendoDropDownList").enable(false);
                    $("#FK_TaxesId").data("kendoDropDownList").value(0);
                    $("#TaxPercentage").val('');


                    $("#FK_CbDiscountTypeId").val(res[i].fK_CbDiscountTypeId);
                    $("#FK_GlAccountForDiscountId").val(res[i].fK_GlAccountForDiscountId);
                    // $("#FK_CbCreditCardTypeId").val(res[i].fK_CbCreditCardTypeId)
                    $("#DiscountPercentage").val(res[i].discountPercentage)
                    // $("#FK_CbCreditCardTypeId").data("kendoDropDownList").value(res[i].fK_CbCreditCardTypeId);
                    $("#FK_AppliedGlAccountId").val(res[i].fK_AppliedGlAccountId);

                    if (res[i].debit != 0)
                        $("#Discount").val(parseFloat(res[i].debit.toString().replace(/\,/g, '')));

                    if (res[i].credit != 0)
                        $("#Discount").val(parseFloat(res[i].credit.toString().replace(/\,/g, '')));

                    if (res[i].fK_CbCreditCardTypeId > 0) {

                        var cbCreditCardTypeId = res[i].fK_CbCreditCardTypeId;
                        $("#FK_CbCreditCardTypeId").data("kendoDropDownList").dataSource.read().then(function () {

                            $("#FK_CbCreditCardTypeId").data("kendoDropDownList").value(cbCreditCardTypeId);
                            $.ajax({
                                type: "Get",
                                url: "/CbCreditCardTypeGlAccount/GetRelatedDataByGlAccIdAndCCTypeId?accId=" + $("#AccountId").val() + "&CCTypeId=" + cbCreditCardTypeId + "&fK_DefBranchId=" + $("#FK_DefBranchId").val(),
                                data: "name=John&location=Boston",
                                dataType: "json",
                                success: function (result) {

                                    var debit = parseFloat($('#debit').val());
                                    var credit = parseFloat($('#credit').val());
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
        //$("#Notes").val(dataItem.);
        var ReferenceDate = dataItem.referenceDate;
        var referenceDate = ReferenceDate.getFullYear() + "-" + ("0" + (ReferenceDate.getMonth() + 1)).slice(-2) + "-" + ("0" + ReferenceDate.getDate()).slice(-2);
        $('#ReferenceDate').val(referenceDate);

        getTotalDebit();
        getTotalCredit();
        getTotalBalance();
        setGridSerial();
    }

    var thisRow = "";
    function AddPayment() {

        thisRow = this;
        var row = $(this).closest("tr"),
            grid = $("#BondsDetailEditgrid").data("kendoGrid"),
            dataItem = grid.dataItem(row);
        var amount = dataItem.credit;
        var numberOfSettlement = dataItem.numberOfSettlement;
        var numberPerPeriod = dataItem.numberPerPeriod;
        var paymentId = dataItem.paymentId;
        var dueDate = new Date();

        if (dataItem.dueDate != undefined)
            dueDate = dataItem.dueDate;
        debugger
        if (numberOfSettlement != "" && numberPerPeriod != "") {

            $("#numberPerPeriod").val(parseInt(numberPerPeriod));
            $("#numberOfSettlementTimes").val(parseInt(numberOfSettlement));
            if (dataItem.period > 0 && dataItem.period != undefined)
                $("#period").val(dataItem.period);
            else
                $("#period").val(1);
            $("#DueDateEditPayment").kendoDatePicker({
                value: dueDate,
                format: '{0: dd/MM/yyyy}'
            });
        } else {
            $("#DueDateEditPayment").kendoDatePicker({
                value: dueDate,
                format: '{0: dd/MM/yyyy}',
                //dateInput: true
            });
            $("#period").val(1);
        }
        debugger

        if (dataItem.paymentPaid != undefined && dataItem.paymentPaid)
            $("#submitPaymentModal").hide();
        else
            $("#submitPaymentModal").show();


        $("#amount").val(amount);
        $("#amount").text(amount);
        $("#paymentModal").modal();

    }
    function removeRow() {


        var row = $(this).closest("tr"),
            grid = $("#BondsDetailEditgrid").data("kendoGrid"),
            dataItem = grid.dataItem(row),
            detailId = dataItem.id;
        var dataSource = $("#BondsDetailEditgrid").data("kendoGrid").dataSource;
        var totalDebit = parseFloat($("#TotalDebit").val()),
            progressNumber = parseFloat($("#DocumentSerial").val()),
            totalCredit = parseFloat($("#TotalCredit").val());

        if (dataItem.numberOfSettlement != undefined && dataItem.numberOfSettlement != 0 && dataItem.numberOfSettlement != "") {
            swal({
                title: Resources.PaymentScheduleFoundResource,
                text: Resources.PaymentScheduleFoundMsgResource,
                type: "info",
                showCancelButton: true,
                confirmButtonText: Resources.DeleteResource,
                cancelButtonText: Resources.CancelResource,
                closeOnConfirm: false,
                showLoaderOnConfirm: true
            }, function () {
                setTimeout(function () {
                    $.ajax({
                        url: "/GlBond/DeleteBondDetail?id=" + detailId + "&associatedRowKey=" + dataItem.associatedRowKey,
                        type: "Get",
                        contentType: 'application/json; charset=utf-8',
                        success: function (result) {

                            if (result) {

                                LoadGridBondDetails();

                                swal({
                                    title: Resources.DeleteSuccessResource,
                                    confirmButtonText: Resources.DoneResource,
                                    type: "success"
                                });
                                grid.tbody.find("tr[role='row']").each(function () {

                                    var model = grid.dataItem(this);
                                    if (model != undefined && model.fK_TaxesId > 0 && model.fK_AppliedGlAccountId != null) {
                                        $(this).find(".btnDelete").addClass("k-state-disabled");
                                        $(this).find(".btnEdit").addClass("k-state-disabled");
                                        $(this).find(".btnAddPayment").addClass("k-state-disabled");

                                    }
                                    if (model != undefined && model.fK_CbDiscountTypeId > 0 && model.fK_AppliedGlAccountId != null) {
                                        $(this).find(".btnDelete").addClass("k-state-disabled");
                                        $(this).find(".btnEdit").addClass("k-state-disabled");
                                        $(this).find(".btnAddPayment").addClass("k-state-disabled");
                                    }
                                });
                                getTotalDebit();
                                getTotalCredit();
                                getTotalBalance();
                                setGridSerial();
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
        else if (detailId == "") {

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


                    if (dataSource.remove(dataItem)) {
                        swal({
                            title: Resources.DeleteSuccessResource,
                            confirmButtonText: Resources.DoneResource,
                            type: "success"
                        });
                        var data = grid.dataSource.data();
                        var res = $.grep(data, function (d) {
                            return d.associatedRowKey == dataItem.uid;
                        });

                        for (var i = 0; i < res.length; i++) {
                            if (res[i].associatedRowKey == dataItem.uid) {
                                debugger
                                dataSource.remove(res[i]);
                            }


                        }

                        grid.tbody.find("tr[role='row']").each(function () {

                            var model = grid.dataItem(this);
                            if (model != undefined && model.fK_TaxesId > 0 && model.fK_AppliedGlAccountId != null) {
                                $(this).find(".btnDelete").addClass("k-state-disabled");
                                $(this).find(".btnEdit").addClass("k-state-disabled");
                                $(this).find(".btnAddPayment").addClass("k-state-disabled");

                            }
                            if (model != undefined && model.fK_CbDiscountTypeId > 0 && model.fK_AppliedGlAccountId != null) {
                                $(this).find(".btnDelete").addClass("k-state-disabled");
                                $(this).find(".btnEdit").addClass("k-state-disabled");
                                $(this).find(".btnAddPayment").addClass("k-state-disabled");
                            }
                        });
                        getTotalDebit();
                        getTotalCredit();
                        getTotalBalance();
                        setGridSerial();

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
        else {
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
                if (detailId != "") {
                    setTimeout(function () {
                        $.ajax({
                            url: "/GlBond/DeleteBondDetail?id=" + detailId + "&associatedRowKey=" + dataItem.associatedRowKey,
                            type: "Get",
                            contentType: 'application/json; charset=utf-8',
                            success: function (result) {

                                if (result) {
                                    /* dataSource.remove(dataItem)*/
                                    LoadGridBondDetails();
                                    swal({
                                        title: Resources.DeleteSuccessResource,
                                        confirmButtonText: Resources.DoneResource,
                                        type: "success"
                                    });

                                    grid.tbody.find("tr[role='row']").each(function () {

                                        var model = grid.dataItem(this);
                                        if (model != undefined && model.fK_TaxesId > 0 && model.fK_AppliedGlAccountId != null) {
                                            $(this).find(".btnDelete").addClass("k-state-disabled");
                                            $(this).find(".btnEdit").addClass("k-state-disabled");
                                            $(this).find(".btnAddPayment").addClass("k-state-disabled");

                                        }
                                        if (model != undefined && model.fK_CbDiscountTypeId > 0 && model.fK_AppliedGlAccountId != null) {
                                            $(this).find(".btnDelete").addClass("k-state-disabled");
                                            $(this).find(".btnEdit").addClass("k-state-disabled");
                                            $(this).find(".btnAddPayment").addClass("k-state-disabled");
                                        }
                                    });
                                    getTotalDebit();
                                    getTotalCredit();
                                    getTotalBalance();
                                    setGridSerial();
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
                }

            });
        }

    }


    $("#submitPaymentModal").on('click', function () {
        var numberOfSettlement = $("#numberOfSettlementTimes").val().trim(),
            period = $("#period").val(),
            numberPerPeriod = $("#numberPerPeriod").val().trim(),
            dueDATE = new Date();

        if (!$("#fromToday").is(":checked")) {
            dueDATE = new Date($("#DueDateEditPayment").data("kendoDatePicker").value().toDateString());
        }

        if (numberOfSettlement == 0 || numberOfSettlement == "")
            $("#numberOfSettlementTimesMsg").show();
        else
            $("#numberOfSettlementTimesMsg").hide();

        if (numberPerPeriod == 0 || numberPerPeriod == "")
            $("#numberPerPeriodMsg").show();
        else
            $("#numberPerPeriodMsg").hide();


        if (numberOfSettlement != 0 && numberOfSettlement != "" && numberPerPeriod != 0 && numberPerPeriod != "") {
            debugger
            var row = $(thisRow).closest("tr"),
                grid = $("#BondsDetailEditgrid").data("kendoGrid"),
                dataItem = grid.dataItem(row);
            dataItem.set('numberOfSettlement', numberOfSettlement);
            dataItem.set('period', period);
            dataItem.set('numberPerPeriod', numberPerPeriod);
            dataItem.set('dueDate', dueDATE);
            dataItem.set('newPayment', "new");

            grid.tbody.find("tr[role='row']").each(function () {

                var model = grid.dataItem(this);
                if (model != undefined && model.fK_TaxesId > 0 && model.fK_AppliedGlAccountId != null) {
                    $(this).find(".btnDelete").addClass("k-state-disabled");
                    $(this).find(".btnEdit").addClass("k-state-disabled");
                    $(this).find(".btnAddPayment").addClass("k-state-disabled");

                }
                if (model != undefined && model.fK_CbDiscountTypeId > 0 && model.fK_AppliedGlAccountId != null) {
                    $(this).find(".btnDelete").addClass("k-state-disabled");
                    $(this).find(".btnEdit").addClass("k-state-disabled");
                    $(this).find(".btnAddPayment").addClass("k-state-disabled");
                }
            });

            $(".btnClose").click();
        }




    });
    $(".btnClose").on('click', function () {

        $("#numberPerPeriod").val(0);
        $("#numberOfSettlementTimes").val(0);
        $('#divDueDate').fadeIn('slow');
        $("#numberPerPeriodMsg").hide();
        $("#numberOfSettlementTimesMsg").hide();
        $("#fromToday").prop("checked", false);
    });





    //Posting
    function CheckIsPosted() {
        if ($('input[name="IsPosted"]').prop("checked") == true) {
            debugger
            $("#btnAddNewBondDetail").attr("disabled", "disabled");
            $("#btnSave").attr("disabled", "disabled");
            $("#btnSavePrint").attr("disabled", "disabled");
            $(".btnDelete").addClass('disabled');
            $(".btnAddPayment").addClass('disabled');

        }
        else {
            $("#btnAddNewBondDetail").removeAttr('disabled');
            $("#btnSave").removeAttr('disabled');
            $("#btnSavePrint").removeAttr('disabled');

        }
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
        debugger
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
                    $("#btnAddNewBondDetail").attr("disabled", "disabled");
                    $("#btnSave").attr("disabled", "disabled");
                    $("#btnSavePrint").attr("disabled", "disabled");
                    $(".btnDelete").addClass('disabled');
                    $(".btnAddPayment").addClass('disabled');
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
            $("#btnAddNewBondDetail").removeAttr('disabled');
            $("#btnSave").removeAttr('disabled');
            $("#btnSavePrint").removeAttr('disabled');
            $(".btnDelete").removeClass('disabled');
            $(".btnAddPayment").removeClass('disabled');
            $('#IsPosted1').prop('checked', true);
        }

    });


});



function PrintBond() {
    Object.assign(document.createElement('a'), { target: '_blank', href: '/GlBond/GlBondDetailsReport/' + $('#Id').val() }).click();

}

function ChangeIsActive(e) {
    if (e.checked === true) {
        $(".disabled-input").attr("disabled", "disabled");
        $("#FK_DefFreezingReasonId").val("");
        $("#Notes").val("");
    }
    else
        $(".disabled-input").removeAttr('disabled');

}

function ClearFormDetails() {

    var primaryCurrency = $("#PrimaryCurrencyId").val();
    //$("#accountAutoCompleteBondAdd").val("");
    // $("#AccountId").val("");
    //$("#accountName").val("");
    //$("#costCenterAutoCompleteBondAdd").val("");
    //$("#CostCenterName").val("");
    //$("#CostCenterId").val("");
    $("#FK_DefCurrencyId").val(primaryCurrency);
    $("#CurrencyFactor").val(1);
    $("#CurrencyFactor").attr('readonly', true);
    $("#debit").val("");
    $("#credit").val("");
    // $("#description").val("");
    $("#referenceNumber").val("");
    $("#uid").val("");
    $("#notes").val("");
    $("#TaxNumber").val("");
    // $("#accountAutoCompleteBondAdd").data("kendoDropDownList").value(0);
    // $("#costCenterAutoCompleteBondAdd").data("kendoDropDownList").value(0);
    $("#FK_TaxesId").data("kendoDropDownList").value(0);
    $("#FK_HrEmployeeId").data("kendoDropDownList").value(0);
    $("#TaxPercentage").val("");
    $("#TotalTaxAmount").val("");
    $("#IsAmountIncluldeTax").prop('checked', false);
    $('#TotalTaxAmount').attr('readonly', true);
    $('#IsAmountIncluldeTax').prop("disabled", true);
    $("#FK_TaxesId").data("kendoDropDownList").enable(true);

    $("#FK_CbCreditCardTypeId").data("kendoDropDownList").value(0);
    $("#Discount").val("");
    $("#TaxOnDiscount").val("");
    //$("#description").val("");
}


function getTotalDebit() {

    var totalRecords = $("#BondsDetailEditgrid").data("kendoGrid").dataSource.data().length;
    $("#OperationsNumbers").val(totalRecords);
    var DebitTotal = 0;
    var grid = $("#BondsDetailEditgrid").data("kendoGrid");
    var gridData = grid.dataSource.view();

    for (var i = 0; i < grid.dataSource.data().length; i++) {
        DebitTotal += parseFloat(gridData[i].debit.toString().replace(/\,/g, ''));
    }
    $("#TotalDebit").val(DebitTotal.toFixed(2));

}

function getTotalCredit() {

    var totalRecords = $("#BondsDetailEditgrid").data("kendoGrid").dataSource.data().length;
    $("#OperationsNumbers").val(totalRecords);
    var CreditTotal = 0
    var grid = $("#BondsDetailEditgrid").data("kendoGrid");
    var gridData = grid.dataSource.view();
    for (var i = 0; i < grid.dataSource.data().length; i++) {
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
        url: "/GlBond/GetNextSerial?branchId=" + parseInt($("#FK_DefBranchId").val()),
        type: "Get",
        contentType: false,
        processData: false,
        success: function (result) {
            debugger
            if (result > 0) {
                $("#Serial").val(result);
            }
        }
    });
}

function setGridSerial() {

    var grid = $("#BondsDetailEditgrid").data("kendoGrid");
    var counter = 1;
    var index = 1;
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

function prepareBond() {
    var isPosted = $("input[name='IsPosted']:checked").val();
    var isActive = $("input[name='IsActive']:checked").val();

    if (isPosted == "true")
        isPosted = true;
    else
        isPosted = false;

    if (isActive == "true")
        isActive = true;
    else
        isActive = false;

    var vdatetimepicker = new Date($("#datetimepickerBonds").val());
    var voucherDate = String($("#VoucherDate").val());

    var details = [];
    details = prepearBondDetails();

    var bond = {
        Id: parseInt($('#Id').val()),
        VoucherDate: String(voucherDate),
        Serial: parseInt($("#Serial").val()),
        FK_DefDocumentTypeId: parseInt($("#FK_DefDocumentTypeId").val()),
        BranchId: parseInt($("#FK_DefBranchId").val()),
        IsPosted: isPosted,
        IsActive: isActive,
        FK_DefFreezingReasonId: parseInt($("#FK_DefFreezingReasonId").val()),
        Notes: $("#Notes").val(),
        ListDetails: details
    };
    return bond;
}

function prepearBondDetails() {
    var List = [];
    var listPayments = [];
    var dueDatepicker = "";
    var dueDateConverted = "";
    var gridData = $('#BondsDetailEditgrid').data("kendoGrid").dataSource.data();
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
    for (var i = 0; i < gridData.length; i++) {
        //start payment
        var detailId = gridData[i].id,
            numberOfSettlement = gridData[i].numberOfSettlement,
            numberPerPeriod = gridData[i].numberPerPeriod,
            paymentId = gridData[i].paymentId,
            newPayment = gridData[i].newPayment,
            total = parseFloat(gridData[i].credit.toString().replace(/\,/g, '')),
            amount = 0,
            period = 0,
            dueDate = new Date();
        if (paymentId == undefined)
            paymentId = 0;

        debugger
        //if (paymentId == 0 || newPayment == "new" && (numberOfSettlement != 0 && numberOfSettlement != "")) {
        if (numberOfSettlement != 0 && numberOfSettlement != "") {
            numberOfSettlement = parseInt(gridData[i].numberOfSettlement);
            numberOfSettlement = parseInt(gridData[i].numberOfSettlement);
            if (numberOfSettlement != 0 && gridData[i].credit != "")
                amount = total / numberOfSettlement;

            period = parseFloat(gridData[i].period);
            numberPerPeriod = parseInt(gridData[i].numberPerPeriod);
            dueDate = new Date(gridData[i].dueDate);

        }

        //if (numberOfSettlement != "" && numberPerPeriod != "" && paymentId == 0) {
        if (numberOfSettlement != "" && numberPerPeriod != "") {
            for (var j = 0; j < numberOfSettlement; j++) {

                if (period == 1) // Day
                {
                    if (j != 0) {
                        var day = dueDate.getDate() + numberPerPeriod,
                            month = dueDate.getMonth(),
                            year = dueDate.getFullYear();
                        dueDate = new Date(year, month, day);
                    }


                }
                else if (period == 2) //Week
                {
                    if (j != 0) {
                        var day = dueDate.getDate() + (numberPerPeriod * 7),
                            month = dueDate.getMonth(),
                            year = dueDate.getFullYear();
                        dueDate = new Date(year, month, day);
                    }
                }
                else if (period == 3) //Month
                {
                    if (j != 0) {
                        var day = dueDate.getDate(),
                            month = dueDate.getMonth() + numberPerPeriod,
                            year = dueDate.getFullYear();
                        dueDate = new Date(year, month, day);
                    }
                }
                else if (period == 3) //Year
                {
                    if (j != 0) {
                        var day = dueDate.getDate(),
                            month = dueDate.getMonth(),
                            year = dueDate.getFullYear() + numberPerPeriod;
                        dueDate = new Date(year, month, day);
                    }
                }
                dueDatepicker = new Date(dueDate);
                dueDateConverted = dueDatepicker.getFullYear() + '-' + (dueDatepicker.getMonth() + 1) + '-' + dueDatepicker.getDate();
                var paymentData = {
                    PaymentId: paymentId,
                    NumberOfSettlement: numberOfSettlement,
                    Period: period,
                    NumberPerPeriod: numberPerPeriod,
                    Amount: amount,
                    Total: total,
                    DueDate: dueDateConverted
                }
                listPayments.push(paymentData);
            }
        }
        else {
            dueDatepicker = new Date(dueDate);
            dueDateConverted = dueDatepicker.getFullYear() + '-' + (dueDatepicker.getMonth() + 1) + '-' + dueDatepicker.getDate();

            var paymentData = {
                PaymentId: paymentId,
                NumberOfSettlement: 0,
                Period: 0,
                NumberPerPeriod: 0,
                Amount: 0,
                Total: 0,
                DueDate: dueDateConverted
            }
            listPayments.push(paymentData);
        }
        //new Date($("#datetimepicker").data("kendoDatePicker").value().toDateString())
        var CurrencyId = 0,
            CostCenterId;
        if (detailId == "") {
            detailId = 0;
            CurrencyId = parseInt(gridData[i].fK_DefCurrencyId);
            CostCenterId = parseInt(gridData[i].fK_CostCenterId);
            if (CostCenterId == 0)
                CostCenterId = null;
        }
        else {
            CurrencyId = parseInt(gridData[i].fK_DefCurrencyId);
            CostCenterId = parseInt(gridData[i].fK_CostCenterId);
            if (CostCenterId == 0)
                CostCenterId = null;
        }

        var refDate = new Date(gridData[i].referenceDate);
        rafranDate = refDate.getFullYear() + "-" + ("0" + (refDate.getMonth() + 1)).slice(-2) + "-" + ("0" + refDate.getDate()).slice(-2);

        var data = {
            Id: detailId,
            Order: parseInt(gridData[i].order),
            FK_GlAccountId: parseInt(gridData[i].fK_GlAccountId),
            FK_CbDiscountTypeId: parseInt(gridData[i].fK_CbDiscountTypeId),
            FK_GlAccountForDiscountId: parseInt(gridData[i].fK_GlAccountForDiscountId),
            FK_GlAccountForTaxId: parseInt(gridData[i].fK_GlAccountForTaxId),
            FK_CbCreditCardTypeId: parseInt(gridData[i].fK_CbCreditCardTypeId),
            CreditCardTypeName: gridData[i].creditCardTypeName,
            FK_DefCurrencyId: FK_DefCurrencyId,
            FK_CostCenterId: CostCenterId,
            ReferenceNumber: String(gridData[i].referenceNumber),
            ReferenceDate: new Date(gridData[i].referenceDate),
            CurrencyFactor: parseFloat(CurrencyFactor),
            //  Debit: parseFloat(gridData[i].debit),
            //    Credit: parseFloat(gridData[i].credit),
            Debit: parseFloat(gridData[i].debit.toString().replace(/\,/g, '')),
            Credit: parseFloat(gridData[i].credit.toString().replace(/\,/g, '')),
            Notes: null,
            FK_TaxesId: gridData[i].fK_TaxesId,
            TaxNumber: gridData[i].taxNumber,
            TaxName: gridData[i].taxName,
            FK_AppliedGlAccountId: parseInt(gridData[i].fK_AppliedGlAccountId),
            TaxPercentage: gridData[i].taxPercentage,
            DiscountPercentage: parseFloat(gridData[i].discountPercentage),
            AssociatedRowKey: gridData[i].associatedRowKey,
            AmountIncluldeTax: parseFloat(gridData[i].amountIncluldeTax),
            NumberOfSettlement: parseInt(gridData[i].numberOfSettlement),
            Period: parseInt(gridData[i].period),
            NumberPerPeriod: parseInt(gridData[i].numberPerPeriod),
            DueDate: gridData[i].dueDate,
            Description: gridData[i].description,
            FK_HrEmployeeId: parseInt(gridData[i].fK_HrEmployeeId),
            ListPayments: listPayments
        }
        // end payment
        List.push(data);
        listPayments = [];
    }
    return List;
}

function validateBond(bond) {

    var List = bond.ListDetails;
    if (List.length == 0) {
        return 'noDetails';
    }
    else if ($("#Serial").val() == "") {
        return 'noSerial';
    }
    //else if (parseInt($("#TotalDebit").val()) != parseInt($("#TotalCredit").val()) && isPosted == true) {
    //    return 'notBalanced';
    //}
    else if (String($("#FK_DefDocumentTypeId").val()) == "0") {
        return 'noDocumentType';
    }
    else {
        return 'valid';
    }
}

function validateBondDetails(details) {
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
            details[i].Id = 0;
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

function editValidBond(bond, withPrint) {

    $.ajax({
        url: "/GlBond/EditBond",
        type: "Post",
        cache: false,
        async: false,
        processData: false,
        data: JSON.stringify(bond),
        contentType: 'application/json',
        success: function (result) {

            if (result) {

                swal({
                    title: Resources.SavedSuccessfullyResource,
                    confirmButtonText: Resources.DoneResource,
                    type: "success"
                }, function () {
                    setTimeout(function () {
                        if (!withPrint) {
                            window.location.href = '/GlBond/Edit/' + bond.Id;
                        }
                        else {
                            Object.assign(document.createElement('a'), { target: '_blank', href: '/GlBond/GlBondDetailsReport/' + bond.Id }).click();
                            window.location.href = '/GlBond/Edit/' + bond.Id;
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

    var voucher = prepareBond();

    var validateMaster = validateBond(voucher);
    if (validateMaster == 'valid') {
        var isDetailsValid = validateBondDetails(voucher.ListDetails);
        if (isDetailsValid) {
            editValidBond(voucher, withPrint);
            //$.ajax({
            //    url: "/GlFinancialPeriod/CheckDateFinancialPeriod?date=" + $("#VoucherDate").val(),
            //    async: false,
            //    success: function (result) {
            //        if (result == true) {
            //            setTimeout(function () {
            //                editValidBond(voucher, withPrint);
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
            //                    editValidBond(voucher, withPrint);
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
            case "noDetails":
                swal({
                    title: Resources.GridLengthZeroResource,
                    confirmButtonText: Resources.DoneResource,
                    type: "error"
                }, function () {
                });
                break;
            case "noSerial":
                swal({
                    title: Resources.NoCodingCreatedResource,
                    confirmButtonText: Resources.DoneResource,
                    type: "error"
                }, function () {
                });
                break;
            case "noDocumentType":
                swal({
                    title: Resources.PayBondTypeRequiredResource,
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
    debugger
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
function editBond() {

    if ($("#formBond").valid())
        edit(false);

}

function editBondAndPrint() {
    if ($("#formBond").valid())
        edit(true);
}

function checkPeriodAndEditBond() {

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
                                editBond();
                            }, 1000);
                        });
                    }
                    else if (!result) {
                        swal({
                            title: Resources.BondDateOutsideOpenPeriods,
                            confirmButtonText: Resources.CancelResource,
                            type: "error"
                        }, function () {
                        });

                    } else {
                        editBond();
                    }
                }
            });
        }
    });

}

function checkPeriodAndEditBondAndPrint() {

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
                                editBondAndPrint();
                            }, 1000);
                        });
                    }
                    else if (!result) {
                        swal({
                            title: Resources.BondDateOutsideOpenPeriods,
                            confirmButtonText: Resources.CancelResource,
                            type: "error"
                        }, function () {
                        });

                    } else {
                        editBondAndPrint();
                    }
                }
            });
        }
    });
}
/*End Refactor Edit Voucher*/