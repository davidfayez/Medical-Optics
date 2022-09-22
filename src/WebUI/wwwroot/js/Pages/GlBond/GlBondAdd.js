
$(document).ready(function () {

    $('#DefBranches').change(function () {
        $("#AccountId").val(0);
        $("#accountName").val("");
        $("#accountAutoCompleteBondAdd").data("kendoDropDownList").value("0");
        $("#accountAutoCompleteBondAdd").data("kendoDropDownList").dataSource.read();

        $("#CostCenterId").val(0);
        $("#CostCenterName").val("");
        $("#costCenterAutoCompleteBondAdd").data("kendoDropDownList").value(0);
        $("#costCenterAutoCompleteBondAdd").data("kendoDropDownList").dataSource.read();

        $("#FK_DefDocumentTypeId").data("kendoDropDownList").value("0");
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
    $('#datetimepickerBonds').val(today);

    $('#fromToday').change(function () {
        if (this.checked)
            $('#divDueDate').fadeOut('slow');
        else
            $('#divDueDate').fadeIn('slow');

    });

    $("#FK_CbCreditCardTypeId").kendoDropDownList({
        filter: "contains",
        height: 300,
        dataTextField: "codeAndName",
        dataValueField: "id",
        dataSource: {
            type: "json",
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

                            var finalCredit = parseFloat(credit - totalDisc - totalTaxOnDiscount);
                            $("#Credit").val(finalCredit.toFixed(2));
                            $('#debit').val(0);
                        }


                    } else {


                    }
                }
            });
        }



    }
    // Account 
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
        debugger
        if (e.dataItem.codeAndName == "اختر" || e.dataItem.id == 0) {
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

        }
     

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



    var tempSource = new kendo.data.DataSource({

    });

    var gridBound = $("#BondsDetailgrid").kendoGrid({
        dataSource: tempSource,
        navigatable: false,
        pageable: false,
        scrollable: true,
        columns: [
            { field: "NumberOfSettlement", hidden: true },
            { field: "Period", hidden: true },
            { field: "NumberPerPeriod", hidden: true },
            { field: "DueDate", hidden: true },
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
            { width: Resources.InputNumberWidth, template: "<span class='counter'> </span>", title: Resources.Serial },
            {
                field: "Account", title: Resources.Account, format: "{0:c}", width: 300,
                template: "#: Account# #: CostCenter # #: EmployeeName # - #: Description#"
            },
            //{ field: "AccountName", title: Resources.AccountNameResource, width: Resources.NameWidth },
            { field: "Serial", width: Resources.InputNumberWidth, title: Resources.VoucherCode },
            { field: "TaxName", hidden: true, width: Resources.NameWidth, title: Resources.TaxName },
            { field: "TaxPercentage", hidden: true, width: Resources.InputNumberWidth, title: Resources.TaxValueResource },
            //{ field: "TotalTaxAmount", width: Resources.InputNumberWidth, title: Resources.TotalTaxAmount },
            { field: "AmountIncluldeTax", hidden: true, width: Resources.NameWidth, title: Resources.AmountIncluldeTax },
            { field: "ReferenceNumber", width: Resources.InputNumberWidth, title: Resources.ReferenceNumber },
            { field: "ReferenceDate", format: "{0:yyyy/MM/dd}", width: Resources.DateWidth, title: Resources.ReferenceDate },
            { field: "Debit", title: Resources.Debit, width: Resources.InputNumberWidth, editor: numberEditor, format: '{0:n2}' },
            { field: "Credit", title: Resources.Credit, width: Resources.InputNumberWidth, editor: numberEditor, format: '{0:n2}' },
            { field: "FK_DefCurrencyId", format: "{0:c}", hidden: true },
            { field: "CurrencyName", hidden: true, width: Resources.TypeWidth, title: Resources.Currency },
            { field: "EmployeeName", hidden: true, width: Resources.TypeWidth, title: Resources.EmployeeName },
            { field: "CurrencyFactor", hidden: true, width: Resources.AmountWidth, title: Resources.CurrencyFactor },
            { field: "FK_CostCenterId", hidden: true, width: Resources.CodeWidth, title: Resources.CostCenterCode },
            //{ field: "CostCenterCode", width: Resources.CodeWidth, title: Resources.CostCenterCodeResource },
            { field: "CostCenter", width: Resources.NameWidth, title: Resources.CostCenter },
            { field: "TaxNumber", hidden: true, width: Resources.InputNumberWidth, title: Resources.TaxNumber },
            { field: "Description", width: Resources.DescriptionWidth, title: Resources.Description },
            { field: "Notes", hidden: true, width: Resources.NoteWidth, title: Resources.Notes },
            { width: Resources.DoubleActionWidth, template: "#if(Credit != '' && Credit !='0' && Credit != '0.00'){#<button type='button' class='btn btn-success btn-sm btnAddPayment' >" + Resources.Payment + "</button>#}#" },
            { width: Resources.DoubleActionWidth, template: "<a  class='btn btn-danger btn-sm btnDelete' ><i class='fas fa-trash-alt'></i></a> <a class='btn btn-success btn-sm btnEdit'><i class='fas fa-edit'></i></a>" }
        ],
        editable: false,
        selectable: "multiple, cell",
        dataBound: function (e) {

            e.sender.items().each(function () {
                var dataItem = e.sender.dataItem(this);
                kendo.bind(this, dataItem);
                if (dataItem.FK_TaxesId > 0 && dataItem.Credit == 0 && dataItem.Debit == 0) {
                    var $row = $('#BondsDetailgrid').find("[data-uid='" + dataItem.uid + "']");
                    $row.hide();
                }
            })

        }


    });
    function numberEditor(container, options) {
        $('<input name="' + options.field + '"/>')
            .appendTo(container)
            .kendoNumericTextBox({
                format: "{0:n2}",
                decimals: 3,
                step: 0.001
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
            serial = $("#Serial").val(),
            referenceDate = new Date($("#ReferenceDate").val()),
            uid = $("#uid").val(),
            FK_TaxesId = parseInt($("#FK_TaxesId").val()),
            TaxName = $("#TaxName").val(),
            FK_AppliedGlAccountId = parseInt($("#FK_AppliedGlAccountId").val()),
            FK_HrEmployeeId = parseInt($("#FK_HrEmployeeId").val()),
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

            notes = null;
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
            var totalRecords = $("#BondsDetailgrid").data("kendoGrid").dataSource.data().length;
            var Index = parseInt($("#Index").val());
            if (!isNaN(Index))
                totalRecords = Index - 1;

            var grid = $("#BondsDetailgrid").data("kendoGrid");
            var data = grid.dataSource.data();
            var res = $.grep(data, function (d) {
                return d.uid == uid;
            });

            if (uid != "" && res.length > 0) {


                var grid = $("#BondsDetailgrid").data("kendoGrid");
                var row = $("#BondsDetailgrid").data("kendoGrid")
                    .tbody
                    .find("tr[data-uid='" + uid + "']");

                var grid = $("#BondsDetailgrid").data("kendoGrid");
                var dataItem = grid.dataItem(row);
                var rowIndex = dataItem.order - 1;

                var data = grid.dataSource.data();
                var res = $.grep(data, function (d) {
                    return d.AssociatedRowKey == uid;
                });
                var hasCreditType = res.filter(function (r) { return r.FK_CbCreditCardTypeId > 0 });
                if (res.length == 0) {
                    
                    dataItem.set("FK_GlAccountId", glAccountId);
                    dataItem.set("FK_TaxesId", FK_TaxesId);
                    dataItem.set("TaxPercentage", TaxPercentage);
                    dataItem.set("Serial", serial);
                    dataItem.set("Account", account);
                    dataItem.set("AccountName", accountName);
                    dataItem.set("ReferenceNumber", referenceNumber);
                    dataItem.set("ReferenceDate", referenceDate);
                    dataItem.set("Debit", debit);
                    dataItem.set("Credit", credit);
                    dataItem.set("Description", description);
                    dataItem.set("FK_DefCurrencyId", currencyId);
                    dataItem.set("CurrencyName", currencyName);
                    dataItem.set("CurrencyFactor", currencyFactor);
                    dataItem.set("CostCenter", costCenter);
                    dataItem.set("FK_CostCenterId", costCenterId);
                    dataItem.set("FK_HrEmployeeId", FK_HrEmployeeId);
                    dataItem.set("EmployeeName", EmployeeName);
                    dataItem.set("AssociatedRowKey", uid);

                }

                if (FK_TaxesId != 0 && res.length == 0) {
                    if ($("#IsAmountIncluldeTax").prop("checked") == true && debit > 0) {
                        AmountIncluldeTax = parseFloat(debit).toFixed(2);
                        debit = parseFloat(parseFloat(debit) - parseFloat($("#TotalTaxAmount").val())).toFixed(2);
                    }

                    if ($("#IsAmountIncluldeTax").prop("checked") == true && credit > 0) {
                        AmountIncluldeTax = parseFloat(credit).toFixed(2);
                        credit = parseFloat(parseFloat(credit) - parseFloat($("#TotalTaxAmount").val())).toFixed(2);
                    }


                    if (debit > 0)
                        TaxDebitAmount = parseFloat($("#TotalTaxAmount").val()).toFixed(2).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
                    if (credit > 0)
                        TaxCreditAmount = parseFloat($("#TotalTaxAmount").val()).toFixed(2).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
                    
                    tempSource.insert(rowIndex, {
                        FK_GlAccountId: FK_AppliedGlAccountId,
                        FK_AppliedGlAccountId: glAccountId,
                        FK_TaxesId: FK_TaxesId,
                        FK_GlAccountForTaxId: FK_AppliedGlAccountId,
                        Serial: serial,
                        Account: TaxName,                      
                        TaxName: TaxName,
                        AssociatedRowKey: uid,
                        TaxPercentage: TaxPercentage,
                        TaxNumber: TaxNumber,
                        AmountIncluldeTax: AmountIncluldeTax,
                        ReferenceNumber: referenceNumber,
                        ReferenceDate: referenceDate,
                        Debit: TaxDebitAmount,
                        Credit: TaxCreditAmount,
                        Description: description,
                        FK_DefCurrencyId: currencyId,
                        CurrencyName: currencyName,
                        CurrencyFactor: currencyFactor,
                        CostCenter: costCenter,
                        FK_CostCenterId: costCenterId,
                        FK_HrEmployeeId: FK_HrEmployeeId,
                        EmployeeName: EmployeeName,                        
                        Notes: notes,

                    });
                }
                else if (FK_CbCreditCardTypeId != 0 && res.length == 0) {

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
                        FK_GlAccountId: FK_GlAccountForTaxId,
                        FK_GlAccountForTaxId: FK_GlAccountForTaxId,
                        FK_AppliedGlAccountId: glAccountId,
                        FK_TaxesId: FK_TaxesIdForCCAndAcc,
                        Serial: serial,
                        Account: TaxNameForCCAndAcc,
                        CreditCardTypeName: CreditCardTypeName,
                        TaxName: TaxNameForCCAndAcc,
                        AssociatedRowKey: uid,
                        TaxPercentage: parseFloat(TaxOnDiscountAmountForCCAndAcc),
                        TaxNumber: TaxNumber,
                        AmountIncluldeTax: 0,
                        DiscountPercentage: 0,
                        ReferenceNumber: referenceNumber,
                        ReferenceDate: referenceDate,
                        Debit: TaxDebitAmount,
                        Credit: TaxCreditAmount,
                        Description: description,
                        FK_DefCurrencyId: currencyId,
                        CurrencyName: currencyName,
                        CurrencyFactor: currencyFactor,
                        CostCenter: costCenter,
                        FK_CostCenterId: costCenterId,
                        FK_HrEmployeeId: FK_HrEmployeeId,
                        EmployeeName: EmployeeName,
                        Notes: notes,

                    });

                    //Discount Row
                    tempSource.insert(rowIndex, {
                        FK_GlAccountId: FK_GlAccountForDiscountId,
                        FK_GlAccountForDiscountId: FK_GlAccountForDiscountId,
                        FK_AppliedGlAccountId: glAccountId,
                        FK_CbDiscountTypeId: FK_CbDiscountTypeId,
                        FK_CbCreditCardTypeId: FK_CbCreditCardTypeId,
                        CreditCardTypeName: CreditCardTypeName,
                        Serial: serial,
                        Account: AppliedAccountForDiscountCCAndAcc,
                        DiscountPercentage: DiscountPercentage,
                        AssociatedRowKey: uid,
                        ReferenceNumber: referenceNumber,
                        ReferenceDate: referenceDate,
                        Debit: DiscountDebitAmount,
                        Credit: DiscountCreditAmount,
                        Description: description,
                        FK_DefCurrencyId: currencyId,
                        CurrencyName: currencyName,
                        CurrencyFactor: currencyFactor,
                        CostCenter: costCenter,
                        FK_CostCenterId: costCenterId,
                        FK_HrEmployeeId: FK_HrEmployeeId,
                        EmployeeName: EmployeeName,
                        Notes: notes,

                    });
                }
                else {
                    for (var i = 0; i < res.length; i++) {
                        debugger;
                        //(isNaN(res[i].FK_GlAccountForTaxId) ||
                        if (res[i].FK_TaxesId > 0 && res[i].FK_GlAccountForTaxId > 0 && res[i].FK_AppliedGlAccountId > 0  && hasCreditType.length == 0) {
                            if ($("#IsAmountIncluldeTax").prop("checked") == true && debit > 0) {
                                AmountIncluldeTax = parseFloat(debit).toFixed(2);
                                debit = parseFloat(parseFloat(debit) - parseFloat($("#TotalTaxAmount").val())).toFixed(2);
                            }
                            if ($("#IsAmountIncluldeTax").prop("checked") == true && credit > 0) {
                                AmountIncluldeTax = parseFloat(credit).toFixed(2);
                                credit = parseFloat(parseFloat(credit) - parseFloat($("#TotalTaxAmount").val())).toFixed(2);
                            }

                            var TaxRow = $("#BondsDetailgrid").data("kendoGrid")
                                .tbody
                                .find("tr[data-uid='" + res[i].uid + "']");
                            var TaxdataItem = grid.dataItem(TaxRow);
                            if (debit > 0)
                                TaxDebitAmount = $("#TotalTaxAmount").val().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
                            if (credit > 0)
                                TaxCreditAmount = $("#TotalTaxAmount").val().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
                            if (FK_TaxesId != 0) {
                                TaxdataItem.set("FK_TaxesId", FK_TaxesId);
                                TaxdataItem.set("TaxPercentage", TaxPercentage);
                                TaxdataItem.set("TaxNumber", TaxNumber);

                                TaxdataItem.set("AmountIncluldeTax", AmountIncluldeTax);
                                TaxdataItem.set("FK_AppliedGlAccountId", glAccountId);
                                TaxdataItem.set("TaxName", TaxName);
                                TaxdataItem.set("Account", AppliedAccount);
                                TaxdataItem.set("TotalTaxAmount", TotalTaxAmount);
                                TaxdataItem.set("Serial", serial);
                                TaxdataItem.set("FK_GlAccountId", FK_AppliedGlAccountId);
                                TaxdataItem.set("AssociatedRowKey", res[i].AssociatedRowKey);
                                TaxdataItem.set("ReferenceNumber", referenceNumber);
                                TaxdataItem.set("ReferenceDate", referenceDate);
                                TaxdataItem.set("Debit", TaxDebitAmount);
                                TaxdataItem.set("Credit", TaxCreditAmount);
                                TaxdataItem.set("Description", description);
                                TaxdataItem.set("FK_DefCurrencyId", currencyId);
                                TaxdataItem.set("CurrencyName", currencyName);
                                TaxdataItem.set("CurrencyFactor", currencyFactor);
                                TaxdataItem.set("CostCenter", costCenter);
                                TaxdataItem.set("FK_CostCenterId", costCenterId);
                                TaxdataItem.set("Notes", notes);
                                TaxdataItem.set("FK_HrEmployeeId", FK_HrEmployeeId);
                                TaxdataItem.set("EmployeeName", EmployeeName);
                            }
                            else {
                                var dataSource = $("#BondsDetailgrid").data("kendoGrid").dataSource;
                                dataSource.remove(TaxdataItem);
                            }

                        }
                        else if (res[i].FK_TaxesId > 0 && FK_TaxesIdForCCAndAcc != 0 && res[i].FK_GlAccountForTaxId > 0 && res[i].FK_AppliedGlAccountId != undefined) {

                            var TaxRowForCCAndAcc = $("#BondsDetailgrid").data("kendoGrid")
                                .tbody
                                .find("tr[data-uid='" + res[i].uid + "']");
                            var TaxdataItemForCCAndAcc = grid.dataItem(TaxRowForCCAndAcc);
                            if (debit > 0) {
                                TaxDebitAmount = parseFloat($("#TaxOnDiscount").val()).toFixed(2).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
                            }
                            if (credit > 0) {
                                TaxCreditAmount = parseFloat($("#TaxOnDiscount").val()).toFixed(2).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
                            }
                            if (FK_TaxesIdForCCAndAcc != 0 && hasCreditType.length > 0) {

                                TaxdataItemForCCAndAcc.set("FK_TaxesId", FK_TaxesIdForCCAndAcc);
                                TaxdataItemForCCAndAcc.set("FK_GlAccountForTaxId", FK_GlAccountForTaxId);
                                TaxdataItemForCCAndAcc.set("FK_AppliedGlAccountId", glAccountId);
                                TaxdataItemForCCAndAcc.set("TaxName", TaxNameForCCAndAcc);
                                TaxdataItemForCCAndAcc.set("TaxPercentage", TaxPercentage);
                                TaxdataItemForCCAndAcc.set("Account", TaxNameForCCAndAcc);
                                TaxdataItemForCCAndAcc.set("Serial", serial);
                                TaxdataItemForCCAndAcc.set("FK_GlAccountId", FK_GlAccountForTaxId);
                                TaxdataItemForCCAndAcc.set("AssociatedRowKey", res[i].AssociatedRowKey);
                                TaxdataItemForCCAndAcc.set("ReferenceNumber", referenceNumber);
                                TaxdataItemForCCAndAcc.set("ReferenceDate", referenceDate);
                                TaxdataItemForCCAndAcc.set("Debit", TaxDebitAmount);
                                TaxdataItemForCCAndAcc.set("Credit", TaxCreditAmount);
                                TaxdataItemForCCAndAcc.set("Description", description);
                                TaxdataItemForCCAndAcc.set("FK_DefCurrencyId", currencyId);
                                TaxdataItemForCCAndAcc.set("CurrencyName", currencyName);
                                TaxdataItemForCCAndAcc.set("CurrencyFactor", currencyFactor);
                                TaxdataItemForCCAndAcc.set("CostCenter", costCenter);
                                TaxdataItemForCCAndAcc.set("FK_CostCenterId", costCenterId);
                                TaxdataItemForCCAndAcc.set("Notes", notes);
                                TaxdataItemForCCAndAcc.set("TaxNumber", TaxNumber);

                                TaxdataItemForCCAndAcc.set("FK_HrEmployeeId", FK_HrEmployeeId);
                                TaxdataItemForCCAndAcc.set("EmployeeName", EmployeeName);
                            }
                            else {
                                var dataSource = $("#BondsDetailgrid").data("kendoGrid").dataSource;
                                dataSource.remove(TaxdataItemForCCAndAcc);
                            }

                        }
                        else if (res[i].FK_CbDiscountTypeId > 0 && res[i].FK_AppliedGlAccountId != undefined && hasCreditType.length > 0) {
                            var DiscountRow = $("#BondsDetailgrid").data("kendoGrid")
                                .tbody
                                .find("tr[data-uid='" + res[i].uid + "']");
                            var DiscountdataItem = grid.dataItem(DiscountRow);
                            if (debit > 0) {
                                DiscountDebitAmount = parseFloat($("#Discount").val()).toFixed(2).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
                            }
                            if (credit > 0) {
                                DiscountCreditAmount = parseFloat($("#Discount").val()).toFixed(2).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
                            }
                            DiscountdataItem.set("FK_GlAccountId", FK_GlAccountForDiscountId);
                            DiscountdataItem.set("FK_AppliedGlAccountId", glAccountId);
                            DiscountdataItem.set("FK_CbDiscountTypeId", FK_CbDiscountTypeId);
                            DiscountdataItem.set("Account", AppliedAccountForDiscountCCAndAcc);
                            DiscountdataItem.set("Serial", serial);
                            DiscountdataItem.set("AssociatedRowKey", res[i].AssociatedRowKey);
                            DiscountdataItem.set("ReferenceNumber", referenceNumber);
                            DiscountdataItem.set("ReferenceDate", referenceDate);
                            DiscountdataItem.set("Debit", DiscountDebitAmount);
                            DiscountdataItem.set("Credit", DiscountCreditAmount);
                            DiscountdataItem.set("Description", description);
                            DiscountdataItem.set("FK_DefCurrencyId", currencyId);
                            DiscountdataItem.set("CurrencyName", currencyName);
                            DiscountdataItem.set("CurrencyFactor", currencyFactor);
                            DiscountdataItem.set("CostCenter", costCenter);
                            DiscountdataItem.set("FK_CostCenterId", costCenterId);
                            DiscountdataItem.set("Notes", notes);
                            DiscountdataItem.set("TaxNumber", TaxNumber);
                            DiscountdataItem.set("FK_HrEmployeeId", FK_HrEmployeeId);
                            DiscountdataItem.set("EmployeeName", EmployeeName);
                        }
                        else {
                            dataItem.set("FK_GlAccountId", glAccountId);
                            dataItem.set("Serial", serial);
                            dataItem.set("Account", account);
                            dataItem.set("AccountName", accountName);
                            dataItem.set("ReferenceNumber", referenceNumber);
                            dataItem.set("ReferenceDate", referenceDate);
                            dataItem.set("Debit", debit);
                            dataItem.set("Credit", credit);
                            dataItem.set("Description", description);
                            dataItem.set("FK_DefCurrencyId", currencyId);
                            dataItem.set("CurrencyName", currencyName);
                            dataItem.set("CurrencyFactor", currencyFactor);
                            dataItem.set("CostCenter", costCenter);
                            dataItem.set("FK_CostCenterId", costCenterId);
                            dataItem.set("FK_HrEmployeeId", FK_HrEmployeeId);
                            dataItem.set("EmployeeName", EmployeeName);
                        }
                    }
                }


                if (credit == "" || credit == 0) {
                    dataItem.set("NumberOfSettlement", 0);
                    dataItem.set("NumberPerPeriod", 0);
                }


            }
            else if (FK_TaxesId != 0) {

                if ($("#IsAmountIncluldeTax").prop("checked") == true && debit > 0) {
                    AmountIncluldeTax = parseFloat(debit).toFixed(2);
                    debit = parseFloat(parseFloat(debit) - parseFloat($("#TotalTaxAmount").val())).toFixed(2);
                }

                if ($("#IsAmountIncluldeTax").prop("checked") == true && credit > 0) {
                    AmountIncluldeTax = parseFloat(credit).toFixed(2);
                    credit = parseFloat(parseFloat(credit) - parseFloat($("#TotalTaxAmount").val())).toFixed(2);
                }


                tempSource.insert(totalRecords, {
                    FK_GlAccountId: glAccountId,
                    FK_GlAccountForTaxId: FK_AppliedGlAccountId,
                    FK_TaxesId: FK_TaxesId,
                    Serial: serial,
                    Account: account,
                    ReferenceNumber: referenceNumber,
                    ReferenceDate: referenceDate,
                    Debit: debit,
                    Credit: credit,
                    Description: description,
                    FK_DefCurrencyId: currencyId,
                    CurrencyName: currencyName,
                    CurrencyFactor: currencyFactor,
                    CostCenter: costCenter,
                    FK_CostCenterId: costCenterId,
                    FK_HrEmployeeId: FK_HrEmployeeId,
                    EmployeeName: EmployeeName,
                    Notes: notes,
                    TaxName: TaxName,
                    TaxPercentage: TaxPercentage,
                    TaxNumber: TaxNumber,
                    AmountIncluldeTax: AmountIncluldeTax,

                });
                var Grid = $("#BondsDetailgrid").data("kendoGrid");
                var GridData = Grid.dataSource.view();
                GridData[totalRecords].AssociatedRowKey = GridData[totalRecords].uid;
                var Uid = GridData[totalRecords].uid;

                if (debit > 0)
                    TaxDebitAmount = parseFloat($("#TotalTaxAmount").val()).toFixed(2).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
                if (credit > 0)
                    TaxCreditAmount = parseFloat($("#TotalTaxAmount").val()).toFixed(2).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");

                tempSource.insert(totalRecords, {
                    FK_GlAccountId: FK_AppliedGlAccountId,
                    FK_GlAccountForTaxId: FK_AppliedGlAccountId,
                    FK_AppliedGlAccountId: glAccountId,
                    FK_TaxesId: FK_TaxesId,
                    Serial: serial,
                    Account: TaxName,
                    TaxName: TaxName,
                    AssociatedRowKey: Uid,
                    TaxPercentage: TaxPercentage,
                    TaxNumber: TaxNumber,                    
                    AmountIncluldeTax: AmountIncluldeTax,
                    ReferenceNumber: referenceNumber,
                    ReferenceDate: referenceDate,
                    Debit: TaxDebitAmount,
                    Credit: TaxCreditAmount,
                    Description: description,
                    FK_DefCurrencyId: currencyId,
                    CurrencyName: currencyName,
                    CurrencyFactor: currencyFactor,
                    CostCenter: costCenter,
                    FK_CostCenterId: costCenterId,
                    FK_HrEmployeeId: FK_HrEmployeeId,
                    EmployeeName: EmployeeName,
                    Notes: notes,

                });

            }
            else if (FK_CbCreditCardTypeId != 0) {

                tempSource.insert(totalRecords, {
                    FK_GlAccountId: glAccountId,
                    Serial: serial,
                    Account: account,
                    CreditCardTypeName: CreditCardTypeName,
                    ReferenceNumber: referenceNumber,
                    ReferenceDate: referenceDate,
                    Debit: debitFormated,
                    Credit: creditFormated,
                    Description: description,
                    FK_DefCurrencyId: currencyId,
                    CurrencyName: currencyName,
                    CurrencyFactor: currencyFactor,
                    CostCenter: costCenter,
                    FK_CostCenterId: costCenterId,
                    FK_HrEmployeeId: FK_HrEmployeeId,
                    EmployeeName: EmployeeName,
                    Notes: notes,
                    FK_GlAccountForTaxId: FK_GlAccountForTaxId,
                    FK_TaxesId: FK_TaxesIdForCCAndAcc,
                    TaxPercentage: parseFloat(TaxOnDiscountAmountForCCAndAcc),
                    TaxNumber: TaxNumber,
                    FK_GlAccountForDiscountId: FK_GlAccountForDiscountId,
                    DiscountPercentage: DiscountPercentage,
                });
                var Grid = $("#BondsDetailgrid").data("kendoGrid");
                var GridData = Grid.dataSource.view();
                GridData[totalRecords].AssociatedRowKey = GridData[totalRecords].uid;
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
                    FK_GlAccountId: FK_GlAccountForTaxId,
                    FK_GlAccountForTaxId: FK_GlAccountForTaxId,
                    FK_AppliedGlAccountId: glAccountId,
                    FK_TaxesId: FK_TaxesIdForCCAndAcc,
                    Serial: serial,
                    Account: TaxNameForCCAndAcc,
                    CreditCardTypeName: CreditCardTypeName,
                    TaxName: TaxNameForCCAndAcc,
                    AssociatedRowKey: Uid,
                    TaxPercentage: parseFloat(TaxOnDiscountAmountForCCAndAcc),
                    TaxNumber: TaxNumber,                   
                    AmountIncluldeTax: 0,
                    DiscountPercentage: 0,
                    ReferenceNumber: referenceNumber,
                    ReferenceDate: referenceDate,
                    Debit: TaxDebitAmount,
                    Credit: TaxCreditAmount,
                    Description: description,
                    FK_DefCurrencyId: currencyId,
                    CurrencyName: currencyName,
                    CurrencyFactor: currencyFactor,
                    CostCenter: costCenter,
                    FK_CostCenterId: costCenterId,
                    FK_HrEmployeeId: FK_HrEmployeeId,
                    EmployeeName: EmployeeName,
                    Notes: notes,

                });

                //Discount Row
                tempSource.insert(totalRecords, {
                    FK_GlAccountId: FK_GlAccountForDiscountId,
                    FK_GlAccountForDiscountId: FK_GlAccountForDiscountId,
                    FK_AppliedGlAccountId: glAccountId,
                    FK_CbDiscountTypeId: FK_CbDiscountTypeId,
                    FK_CbCreditCardTypeId: FK_CbCreditCardTypeId,
                    CreditCardTypeName: CreditCardTypeName,
                    Serial: serial,
                    Account: AppliedAccountForDiscountCCAndAcc,
                    DiscountPercentage: DiscountPercentage,
                    AssociatedRowKey: Uid,
                    ReferenceNumber: referenceNumber,
                    ReferenceDate: referenceDate,
                    Debit: DiscountDebitAmount,
                    Credit: DiscountCreditAmount,
                    Description: description,
                    FK_DefCurrencyId: currencyId,
                    CurrencyName: currencyName,
                    CurrencyFactor: currencyFactor,
                    CostCenter: costCenter,
                    FK_CostCenterId: costCenterId,
                    FK_HrEmployeeId: FK_HrEmployeeId,
                    EmployeeName: EmployeeName,
                    Notes: notes,
                });

            }
            else {
                tempSource.insert(totalRecords, {
                    PaymentId: 0,
                    NumberOfSettlement: 0,
                    FK_GlAccountId: glAccountId,
                    Account: account,
                    ReferenceNumber: referenceNumber,
                    ReferenceDate: new Date(referenceDate),
                    Debit: debitFormated,
                    Credit: creditFormated,
                    Description: description,
                    FK_DefCurrencyId: currencyId,
                    CurrencyName: currencyName,
                    CurrencyFactor: currencyFactor,
                    FK_CostCenterId: costCenterId,
                    FK_CostCenterId: costCenterId,
                    FK_HrEmployeeId: FK_HrEmployeeId,
                    EmployeeName: EmployeeName,
                    CostCenter: costCenter,
                    Notes: notes,
                });

            }
            var grid = $("#BondsDetailgrid").data("kendoGrid");

            tempSource.sync();
            grid.refresh();
            setGridSerial();

            grid.tbody.find("tr[role='row']").each(function () {

                var model = grid.dataItem(this);
                
                if (model != undefined && model.FK_TaxesId > 0 && model.FK_AppliedGlAccountId != undefined) {
                    $(this).find(".btnDelete").addClass("k-state-disabled");
                    $(this).find(".btnEdit").addClass("k-state-disabled");
                    $(this).find(".btnAddPayment").addClass("k-state-disabled");
                }

                if (model != undefined && model.FK_CbDiscountTypeId > 0 && model.FK_AppliedGlAccountId != undefined) {
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

    gridBound.data("kendoGrid").table.on("click", ".btnAddPayment", AddPayment);
    gridBound.data("kendoGrid").table.on("click", ".btnDelete", removeRow);
    gridBound.data("kendoGrid").table.on("click", ".btnEdit", editVoucherDetailRow);

    function editVoucherDetailRow() {
      
        ClearFormDetails();
        var row = $(this).closest("tr"),
            grid = $("#BondsDetailgrid").data("kendoGrid"),
            dataItem = grid.dataItem(row);
        var uid = dataItem.uid;
        $("#uid").val(dataItem.uid);
        $("#AccountId").val(dataItem.FK_GlAccountId);

        var empId = dataItem.FK_HrEmployeeId;
        if (empId == null || isNaN(empId))
            empId = 0
        if (empId > 0)
            $("#FK_TaxesId").data("kendoDropDownList").enable(false);
        $("#FK_HrEmployeeId").val(empId);

        $("#accountAutoCompleteBondAdd").data("kendoDropDownList").value(dataItem.FK_GlAccountId);
        $("#FK_HrEmployeeId").data("kendoDropDownList").value(empId);
        $("#FK_CbCreditCardTypeId").data("kendoDropDownList").value("0");
        $("#FK_CbCreditCardTypeId").data("kendoDropDownList").dataSource.read();
        $("#Serial").val(dataItem.Serial);
        //$("#accountAutoCompleteBondAdd").val(dataItem.AccountCode);
        $("#accountName").val(dataItem.AccountName);
        $("#referenceNumber").val(dataItem.ReferenceNumber);
        //$("#ReferenceDate").val(new Date(dataItem.ReferenceDate));

        $("#debit").val(parseFloat(dataItem.Debit.toString().replace(/\,/g, '')));
        $("#credit").val(parseFloat(dataItem.Credit.toString().replace(/\,/g, '')));
        $("#description").val(dataItem.Description);
        //CurrencyName = jQuery("#FK_DefCurrencyId option:selected").text();
        //$("#costCenterAutoCompleteBondAdd").val(dataItem.CostCenterCode);
        $("#costCenterAutoCompleteBondAdd").data("kendoDropDownList").value(parseInt(dataItem.FK_CostCenterId));
        $("#CostCenterId").val(parseInt(dataItem.FK_CostCenterId));
        $("#CostCenterName").val(dataItem.CostCenterName);
        var data = grid.dataSource.data();
        var res = $.grep(data, function (d) {
            return d.AssociatedRowKey == uid;
        });
        var hasCreditType = res.filter(function (r) { return r.FK_CbCreditCardTypeId > 0 });
        for (var i = 0; i < res.length; i++) {
            debugger
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

                if (res[i].AmountIncluldeTax > 0 && res[i].Debit.toString().replace(/\,/g, '')  > 0) {
                    $("#IsAmountIncluldeTax").prop('checked', true);
                    $("#debit").val(res[i].AmountIncluldeTax);
                }
                if (res[i].AmountIncluldeTax > 0 && res[i].Credit.toString().replace(/\,/g, '')  > 0) {
                    $("#IsAmountIncluldeTax").prop('checked', true);
                    $("#credit").val(res[i].AmountIncluldeTax);
                }
                $('#IsAmountIncluldeTax').prop("disabled", false);


            }
            if (res[i].FK_TaxesId > 0 && res[i].FK_GlAccountForTaxId > 0 && res[i].FK_AppliedGlAccountId != undefined && hasCreditType.length > 0) {
                $("#FK_TaxesIdForCCAndAcc").val(res[i].FK_TaxesId);
                $("#FK_GlAccountForTaxId").val(res[i].FK_GlAccountForTaxId);
                $("#TaxNumber").val(res[i].TaxNumber);
                $("#FK_AppliedGlAccountId").val(res[i].FK_AppliedGlAccountId);
                $("#TaxNameForCCAndAcc").val(res[i].TaxName);
                //   $("#TaxOnDiscountAmountForCCAndAcc").val(res[i].TaxPercentage);

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
                $("#FK_CbCreditCardTypeId").val(res[i].FK_CbCreditCardTypeId)
                $("#DiscountPercentage").val(res[i].DiscountPercentage)
                $("#FK_CbCreditCardTypeId").data("kendoDropDownList").value(res[i].FK_CbCreditCardTypeId);
                $("#FK_AppliedGlAccountId").val(res[i].FK_AppliedGlAccountId);
                if (res[i].Debit != 0)
                    $("#Discount").val(parseFloat(res[i].Debit.toString().replace(/\,/g, '')));

                if (res[i].Credit != 0)
                    $("#Discount").val(parseFloat(res[i].Credit.toString().replace(/\,/g, '')));

                if (res[i].FK_CbCreditCardTypeId > 0) {

                    var cbCreditCardTypeId = res[i].FK_CbCreditCardTypeId;
                    $("#FK_CbCreditCardTypeId").data("kendoDropDownList").dataSource.read().then(function () {

                        $("#FK_CbCreditCardTypeId").data("kendoDropDownList").value(cbCreditCardTypeId);
                        $.ajax({
                            type: "Get",
                            url: "/CbCreditCardTypeGlAccount/GetRelatedDataByGlAccIdAndCCTypeId?accId=" + $("#AccountId").val() + "&CCTypeId=" + cbCreditCardTypeId + "&fK_DefBranchId=" + $("#FK_DefBranchId").val(),
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
    }

    var thisRow = "";
    function AddPayment() {

        thisRow = this;
        var row = $(this).closest("tr"),
            grid = $("#BondsDetailgrid").data("kendoGrid"),
            dataItem = grid.dataItem(row);
        var amount = dataItem.Credit;
        var numberOfSettlement = dataItem.NumberOfSettlement;
        var numberPerPeriod = dataItem.NumberPerPeriod;
        var dueDate = new Date();

        if (dataItem.DueDate != undefined)
            dueDate = dataItem.DueDate;

        if (numberOfSettlement != "" && numberPerPeriod != "") {

            $("#numberPerPeriod").val(parseInt(numberPerPeriod));
            $("#numberOfSettlementTimes").val(parseInt(numberOfSettlement));
            $("#DueDatePayment").kendoDatePicker({
                value: dueDate,
                format: '{0: dd/MM/yyyy}',
                //dateInput: true
            });
        } else {
            $("#DueDatePayment").kendoDatePicker({
                value: dueDate,
                format: '{0: dd/MM/yyyy}',
                //dateInput: true
            });
        }

        $("#amount").val(amount);
        $("#amount").text(amount);
        $("#paymentModal").modal();
    }

    $("#submitPaymentModal").on('click', function () {
        var numberOfSettlement = $("#numberOfSettlementTimes").val().trim(),
            period = $("#period").val(),
            numberPerPeriod = $("#numberPerPeriod").val().trim(),
            dueDATE = new Date();

        if (!$("#fromToday").is(":checked")) {
            dueDATE = new Date($("#DueDatePayment").data("kendoDatePicker").value().toDateString());
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

            var row = $(thisRow).closest("tr"),
                grid = $("#BondsDetailgrid").data("kendoGrid"),
                dataItem = grid.dataItem(row);
            dataItem.set('NumberOfSettlement', numberOfSettlement);
            dataItem.set('Period', period);
            dataItem.set('NumberPerPeriod', numberPerPeriod);
            dataItem.set('DueDate', dueDATE);
            $(".btnClose").click();
        }

        grid.tbody.find("tr[role='row']").each(function () {

            var model = grid.dataItem(this);

            if (model != undefined && model.FK_TaxesId > 0 && model.FK_AppliedGlAccountId) {
                $(this).find(".btnDelete").addClass("k-state-disabled");
                $(this).find(".btnEdit").addClass("k-state-disabled");
                $(this).find(".btnAddPayment").addClass("k-state-disabled");
            }

            if (model != undefined && model.FK_CbDiscountTypeId > 0 && model.FK_AppliedGlAccountId) {
                $(this).find(".btnDelete").addClass("k-state-disabled");
                $(this).find(".btnEdit").addClass("k-state-disabled");
                $(this).find(".btnAddPayment").addClass("k-state-disabled");

            }
        });


    });
    $(".btnClose").on('click', function () {

        $("#numberPerPeriod").val(0);
        $("#numberOfSettlementTimes").val(0);
        $('#divDueDate').fadeIn('slow');
        $("#numberPerPeriodMsg").hide();
        $("#numberOfSettlementTimesMsg").hide();
        $("#fromToday").prop("checked", false);
    });

    function removeRow() {

        var row = $(this).closest("tr"),
            grid = $("#BondsDetailgrid").data("kendoGrid"),
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
                var dataSource = $("#BondsDetailgrid").data("kendoGrid").dataSource;

                if (dataSource.remove(dataItem)) {
                    swal({
                        title: Resources.DeleteSuccessResource,
                        confirmButtonText: Resources.DoneResource,
                        type: "success"
                    });

                    var data = grid.dataSource.data();
                    var res = $.grep(data, function (d) {
                        return d.AssociatedRowKey == dataItem.uid;
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
                            $(this).find(".btnAddPayment").addClass("k-state-disabled");
                        }
                        if (model != undefined && model.FK_CbDiscountTypeId > 0 && model.FK_AppliedGlAccountId) {
                            $(this).find(".btnDelete").addClass("k-state-disabled");
                            $(this).find(".btnEdit").addClass("k-state-disabled");
                            $(this).find(".btnAddPayment").addClass("k-state-disabled");
                        }
                    });
                    getTotalDebit();
                    getTotalCredit();
                    getTotalBalance();
                    setGridSerial();
                    //if (dataItem.Debit != "")
                    //    $("#TotalDebit").val(totalDebit - parseFloat(dataItem.Debit.toString().replace(/\,/g, '')));

                    //if (dataItem.Credit != "0")
                    //    $("#TotalCredit").val(totalCredit - parseFloat(dataItem.Credit.toString().replace(/\,/g, '')));


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
});

function checkPeriodAndSaveBond() {

    var openedPeriodCount = 0;
    $.ajax({
        url: "/GlFinancialPeriod/GetOpenPeriodsCount",
        type: "Get",
        contentType: false,
        processData: false,
        success: function (result) {

            openedPeriodCount = result;
            $.ajax({
                url: "/GlFinancialPeriod/IsDateInOpenPeriod?date=" + $("#datetimepickerBonds").val(),
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
                                SaveBonds();
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
                        SaveBonds();
                    }
                }
            });
        }
    });


}

function checkPeriodAndSaveBondPrint() {
    var openedPeriodCount = 0;
    $.ajax({
        url: "/GlFinancialPeriod/GetOpenPeriodsCount",
        type: "Get",
        contentType: false,
        processData: false,
        success: function (result) {

            openedPeriodCount = result;
            $.ajax({
                url: "/GlFinancialPeriod/IsDateInOpenPeriod?date=" + $("#datetimepickerBonds").val(),
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
                                SaveBondsAndPrint();
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
                        SaveBondsAndPrint();
                    }
                }
            });
        }
    });

}


function SaveBonds() {

    if ($("#formBond").valid()) {

        var List = [];
        var listPayments = [];
        var dueDatepicker = "";
        var dueDateConverted = "";
        var gridData = $('#BondsDetailgrid').data("kendoGrid").dataSource.data();
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

            var numberOfSettlement = gridData[i].NumberOfSettlement,
                numberPerPeriod = gridData[i].NumberPerPeriod,
                total = parseFloat(gridData[i].Credit.toString().replace(/\,/g, '')),
                amount = 0,
                period = 0,
                dueDate = new Date();
            if (numberOfSettlement != "" && numberPerPeriod != "" && gridData[i].Credit != "" && parseFloat(gridData[i].Credit.toString().replace(/\,/g, '')) > 0) {
                numberOfSettlement = parseInt(gridData[i].NumberOfSettlement);
                numberOfSettlement = parseInt(gridData[i].NumberOfSettlement);
                amount = total / numberOfSettlement;
                period = parseFloat(gridData[i].Period);
                numberPerPeriod = parseInt(gridData[i].NumberPerPeriod);
                dueDate = new Date(gridData[i].DueDate);

            }

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
                        PaymentId: 0,
                        NumberOfSettlement: numberOfSettlement,
                        Period: period,
                        NumberPerPeriod: numberPerPeriod,
                        Amount: amount,
                        Total: total,
                        DueDate: dueDateConverted
                    };
                    listPayments.push(paymentData);
                }
            }
            else {

                dueDatepicker = new Date(dueDate);
                dueDateConverted = dueDatepicker.getFullYear() + '-' + (dueDatepicker.getMonth() + 1) + '-' + dueDatepicker.getDate();

                var paymentData = {
                    PaymentId: 0,
                    NumberOfSettlement: 0,
                    Period: 0,
                    NumberPerPeriod: 0,
                    Amount: 0,
                    Total: 0,
                    DueDate: dueDateConverted
                };
                listPayments.push(paymentData);
            }
            //new Date($("#datetimepicker").data("kendoDatePicker").value().toDateString())
            //if (gridData[i].AmountIncluldeTax == undefined)
            //    gridData[i].AmountIncluldeTax = null;
            //
            //if (gridData[i].FK_TaxesId == undefined)
            //    gridData[i].FK_TaxesId = null;
            //
            //if (gridData[i].TaxPercentage == undefined)
            //    gridData[i].TaxPercentage = null;

            var data = {
                Id: 0,
                Order: parseInt(gridData[i].order),
                FK_GlAccountId: parseInt(gridData[i].FK_GlAccountId),
                FK_CbDiscountTypeId: parseInt(gridData[i].FK_CbDiscountTypeId),
                FK_GlAccountForDiscountId: parseInt(gridData[i].FK_GlAccountForDiscountId),
                FK_GlAccountForTaxId: parseInt(gridData[i].FK_GlAccountForTaxId),
                FK_CbCreditCardTypeId: parseInt(gridData[i].FK_CbCreditCardTypeId),
                CreditCardTypeName: gridData[i].CreditCardTypeName,
                FK_DefCurrencyId: FK_DefCurrencyId,
                FK_CostCenterId: parseInt(gridData[i].FK_CostCenterId),
                FK_TaxesId: gridData[i].FK_TaxesId,
                FK_AppliedGlAccountId: parseInt(gridData[i].FK_AppliedGlAccountId),
                TaxPercentage: gridData[i].TaxPercentage,
                DiscountPercentage: parseFloat(gridData[i].DiscountPercentage),
                TaxNumber: gridData[i].TaxNumber,
                TaxName: gridData[i].TaxName,
                AssociatedRowKey: gridData[i].AssociatedRowKey,
                AmountIncluldeTax: parseFloat(gridData[i].AmountIncluldeTax),
                ReferenceNumber: String(gridData[i].ReferenceNumber),
                ReferenceDate: new Date(gridData[i].ReferenceDate),
                CurrencyFactor: CurrencyFactor,
                Debit: parseFloat(gridData[i].Debit.toString().replace(/\,/g, '')),
                Credit: parseFloat(gridData[i].Credit.toString().replace(/\,/g, '')),
                FK_HrEmployeeId: parseInt(gridData[i].FK_HrEmployeeId),
                //EmployeeName: gridData[i].EmployeeName,
                // Debit: parseFloat(gridData[i].Debit),
                // Credit: parseFloat(gridData[i].Credit),
                Notes: null,
                NumberOfSettlement: parseInt(gridData[i].NumberOfSettlement),
                Period: parseInt(gridData[i].Period),
                NumberPerPeriod: parseInt(gridData[i].NumberPerPeriod),
                DueDate: gridData[i].DueDate,
                Description: gridData[i].Description,
                ListPayments: listPayments
            };
            // end payment



            List.push(data);
            listPayments = [];

        }
        debugger;
        var isPosted = $("input[name='IsPosted']:checked").val();
        if (isPosted == "true")
            isPosted = true;
        else
            isPosted = false;

        var vdatetimepicker = new Date($("#datetimepickerBonds").val());
        var voucherDate = String($("#datetimepickerBonds").val());

        var Obj = {
            Id: 0,
            VoucherDate: voucherDate,
            Serial: parseInt($("#Serial").val()),
            FK_DefDocumentTypeId: parseInt($("#FK_DefDocumentTypeId").val()),
            BranchId: parseInt($("#FK_DefBranchId").val()),
            IsPosted: isPosted,
            hdnAttachmentIds: $("#hdnAttachmentIds").val(),
            ListDetails: List
        };
        debugger;
        if (List.length == 0) {

            swal({
                title: Resources.GridLengthZeroResource,
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
        else if (String($("#FK_DefDocumentTypeId").val()) == "0") {
            swal({
                title: Resources.PayBondTypeRequiredResource,
                confirmButtonText: Resources.DoneResource,
                type: "error"
            }, function () {

            });
        }
        else {

            $.ajax({
                url: "/GlBond/SaveBonds",
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
                            //Object.assign(document.createElement('a'), { target: '_blank', href: 'GlBondDetailsReport/' + result }).click();
                            window.location.href = '/GlBond/Index';
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
            //    url: "/GlFinancialPeriod/CheckDateFinancialPeriod?date=" + $("#datetimepickerBonds").val(),
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
            //                    url: "/GlBond/SaveBonds",
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
            //                                //Object.assign(document.createElement('a'), { target: '_blank', href: 'GlBondDetailsReport/' + result }).click();
            //                                window.location.href = '/GlBond/Index';
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

            //}

        }


    }
}

function SaveBondsAndPrint() {

    if ($("#formBond").valid()) {

        var List = [];
        var listPayments = [];
        var dueDatepicker = "";
        var dueDateConverted = "";
        var gridData = $('#BondsDetailgrid').data("kendoGrid").dataSource.data();
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

            var numberOfSettlement = gridData[i].NumberOfSettlement,
                numberPerPeriod = gridData[i].NumberPerPeriod,
                total = parseFloat(gridData[i].Credit.toString().replace(/\,/g, '')),
                amount = 0,
                period = 0,
                dueDate = new Date();
            if (numberOfSettlement != "" && numberPerPeriod != "" && gridData[i].Credit != "" && parseFloat(gridData[i].Credit.toString().replace(/\,/g, '')) > 0) {
                numberOfSettlement = parseInt(gridData[i].NumberOfSettlement);
                numberOfSettlement = parseInt(gridData[i].NumberOfSettlement);
                amount = total / numberOfSettlement;
                period = parseFloat(gridData[i].Period);
                numberPerPeriod = parseInt(gridData[i].NumberPerPeriod);
                dueDate = new Date(gridData[i].DueDate);

            }

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
                        PaymentId: 0,
                        NumberOfSettlement: numberOfSettlement,
                        Period: period,
                        NumberPerPeriod: numberPerPeriod,
                        Amount: amount,
                        Total: total,
                        DueDate: dueDateConverted
                    };
                    listPayments.push(paymentData);
                }
            }
            else {

                dueDatepicker = new Date(dueDate);
                dueDateConverted = dueDatepicker.getFullYear() + '-' + (dueDatepicker.getMonth() + 1) + '-' + dueDatepicker.getDate();

                var paymentData = {
                    PaymentId: 0,
                    NumberOfSettlement: 0,
                    Period: 0,
                    NumberPerPeriod: 0,
                    Amount: 0,
                    Total: 0,
                    DueDate: dueDateConverted
                };
                listPayments.push(paymentData);
            }
            //new Date($("#datetimepicker").data("kendoDatePicker").value().toDateString())
            //if (gridData[i].AmountIncluldeTax == undefined)
            //    gridData[i].AmountIncluldeTax = null;
            //
            //if (gridData[i].FK_TaxesId == undefined)
            //    gridData[i].FK_TaxesId = null;
            //
            //if (gridData[i].TaxPercentage == undefined)
            //    gridData[i].TaxPercentage = null;

            var data = {
                Id: 0,
                Order: parseInt(gridData[i].order),
                FK_GlAccountId: parseInt(gridData[i].FK_GlAccountId),
                FK_CbDiscountTypeId: parseInt(gridData[i].FK_CbDiscountTypeId),
                FK_GlAccountForDiscountId: parseInt(gridData[i].FK_GlAccountForDiscountId),
                FK_GlAccountForTaxId: parseInt(gridData[i].FK_GlAccountForTaxId),
                FK_CbCreditCardTypeId: parseInt(gridData[i].FK_CbCreditCardTypeId),
                CreditCardTypeName: gridData[i].CreditCardTypeName,
                FK_DefCurrencyId: FK_DefCurrencyId,
                FK_CostCenterId: parseInt(gridData[i].FK_CostCenterId),
                FK_TaxesId: gridData[i].FK_TaxesId,
                FK_AppliedGlAccountId: parseInt(gridData[i].FK_AppliedGlAccountId),
                TaxPercentage: gridData[i].TaxPercentage,
                DiscountPercentage: parseFloat(gridData[i].DiscountPercentage),
                TaxNumber: gridData[i].TaxNumber,
                TaxName: gridData[i].TaxName,
                AssociatedRowKey: gridData[i].AssociatedRowKey,
                AmountIncluldeTax: parseFloat(gridData[i].AmountIncluldeTax),
                ReferenceNumber: String(gridData[i].ReferenceNumber),
                ReferenceDate: new Date(gridData[i].ReferenceDate),
                CurrencyFactor: CurrencyFactor,
                Debit: parseFloat(gridData[i].Debit.toString().replace(/\,/g, '')),
                Credit: parseFloat(gridData[i].Credit.toString().replace(/\,/g, '')),
                FK_HrEmployeeId: parseInt(gridData[i].FK_HrEmployeeId),
                //EmployeeName: gridData[i].EmployeeName,
                // Debit: parseFloat(gridData[i].Debit),
                // Credit: parseFloat(gridData[i].Credit),
                Notes: null,
                NumberOfSettlement: parseInt(gridData[i].NumberOfSettlement),
                Period: parseInt(gridData[i].Period),
                NumberPerPeriod: parseInt(gridData[i].NumberPerPeriod),
                DueDate: gridData[i].DueDate,
                Description: gridData[i].Description,
                ListPayments: listPayments
            };
            // end payment



            List.push(data);
            listPayments = [];

        }
     
        var isPosted = $("input[name='IsPosted']:checked").val();
        if (isPosted == "true")
            isPosted = true;
        else
            isPosted = false;

        var vdatetimepicker = new Date($("#datetimepickerBonds").val());
        var voucherDate = String($("#datetimepickerBonds").val());

        var Obj = {
            Id: 0,
            VoucherDate: voucherDate,
            Serial: parseInt($("#Serial").val()),
            FK_DefDocumentTypeId: parseInt($("#FK_DefDocumentTypeId").val()),
            BranchId: parseInt($("#FK_DefBranchId").val()),
            IsPosted: isPosted,
            hdnAttachmentIds: $("#hdnAttachmentIds").val(),
            ListDetails: List
        };
       
        if (List.length == 0) {

            swal({
                title: Resources.GridLengthZeroResource,
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
        else if (String($("#FK_DefDocumentTypeId").val()) == "0") {
            swal({
                title: Resources.PayBondTypeRequiredResource,
                confirmButtonText: Resources.DoneResource,
                type: "error"
            }, function () {

            });
        }
        else {

            $.ajax({
                url: "/GlBond/SaveBonds",
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
                            Object.assign(document.createElement('a'), { target: '_blank', href: 'GlBondDetailsReport/' + result }).click();
                            window.location.href = '/GlBond/Index';
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
            //    url: "/GlFinancialPeriod/CheckDateFinancialPeriod?date=" + $("#datetimepickerBonds").val(),
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
            //                    url: "/GlBond/SaveBonds",
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
            //                                Object.assign(document.createElement('a'), { target: '_blank', href: 'GlBondDetailsReport/' + result }).click();
            //                                window.location.href = '/GlBond/Index';
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

            //}

        }


    }
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
    // $("#accountAutoCompleteBondAdd").data("kendoDropDownList").value(0);
    // $("#costCenterAutoCompleteBondAdd").data("kendoDropDownList").value(0);
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
    //$("#description").val("");
}


function getTotalDebit() {

    var totalRecords = $("#BondsDetailgrid").data("kendoGrid").dataSource.data().length;
    $("#OperationsNumbers").val(totalRecords);
    var DebitTotal = 0;
    var grid = $("#BondsDetailgrid").data("kendoGrid");
    var gridData = grid.dataSource.view();
  
    for (var i = 0; i < grid.dataSource.data().length; i++) {
        DebitTotal += parseFloat(gridData[i].Debit.toString().replace(/\,/g, ''));
    }
    $("#TotalDebit").val(DebitTotal.toFixed(2));

}

function getTotalCredit() {

    var totalRecords = $("#BondsDetailgrid").data("kendoGrid").dataSource.data().length;
    $("#OperationsNumbers").val(totalRecords);
    var CreditTotal = 0
    var grid = $("#BondsDetailgrid").data("kendoGrid");
    var gridData = grid.dataSource.view();
    for (var i = 0; i < grid.dataSource.data().length; i++) {
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
        url: "/GlBond/GetNextSerial?branchId=" + parseInt($("#FK_DefBranchId").val()),
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

    var grid = $("#BondsDetailgrid").data("kendoGrid");
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