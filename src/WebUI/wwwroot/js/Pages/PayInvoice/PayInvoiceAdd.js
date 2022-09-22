$(document).ready(function () {

    $('#DefBranches').change(function () {

        $("#FK_PaySupplierId").val(0);
        $("#supplierAutoComplete").data("kendoDropDownList").value("0");
        $("#supplierAutoComplete").data("kendoDropDownList").dataSource.read();

        $("#SupplierName").val("");
        $("#RepaymentPeriod").val(0);
        $("#FK_DefCurrencyId").val(0);
        $("#FK_DefCurrencyId").data("kendoDropDownList").value("0");
        $("#FK_GlAccountId").val(0);
        $("#Factor").val(0);


        $("#FK_CostCenterId").val(0);
        $("#costCenterAutoComplete").data("kendoDropDownList").value("0");
        $("#costCenterAutoComplete").data("kendoDropDownList").dataSource.read();

        $("#FK_PaymentTypeId").val(0);
        $("#paymentTypeNameAr").val("");
       
        $("#accountCode").val("");
        $("#accountNameAr").val("");
        $("#FK_GlAccountIdDetails").data("kendoDropDownList").value("0");
        $("#FK_GlAccountIdDetails").data("kendoDropDownList").dataSource.read();
        $("#Fk_TaxGlAccountId").data("kendoDropDownList").value("0");
        $("#Fk_TaxGlAccountId").data("kendoDropDownList").dataSource.read();
        $("#DiscountAccountAutoComplete").data("kendoDropDownList").value("0");
        $("#DiscountAccountAutoComplete").data("kendoDropDownList").dataSource.read();
    });

    var now = new Date(),
        today = now.getFullYear() + "-" + ("0" + (now.getMonth() + 1)).slice(-2) + "-" + ("0" + now.getDate()).slice(-2);
    $('#BillDate').val(today);
    $('#BillDueDate').val(today);
    $('#InvoiceDate').val(today);
    $("#ViewBillDetail").hide();

    $("#InvoiceType").kendoDropDownList({
        filter: "contains",
        height: 300,
        dataTextField: "text",
        dataValueField: "value",
        dataSource: {
            type: "json",
            //serverFiltering: true,
            transport: {
                read: {
                    url: "/PayInvoice/GetAllInvoiceTypeForDDL",
                },
                parameterMap: function (data, action) {

                    if (action === "read") {
                        return {
                            //fK_DefBranchId: parseInt($("#FK_DefBranchId").val()),
                        };


                    } else {
                        return data;
                    }
                }
            }
        },
        //change: onSelectInvoiceType

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
        var BondDate = $("#InvoiceDate").val();
        var voucherDate = new Date($("#InvoiceDate").val());
        var DefcurrencyId = parseInt($("#FK_DefCurrencyId").val());
        $.ajax({
            url: "/GlJournalVoucher/GetCurrencyFactorByIdInPeriod?id=" + DefcurrencyId + "&period=" + BondDate /*voucherDate.toUTCString()*/,
            type: "Get",
            contentType: false,
            processData: false,
            success: function (data) {

                if (data.hasOwnProperty("factor")) {
                    $("#Factor").val(data.factor);
                    $('#Factor').attr('readonly', false);
                }
                else {
                    $("#Factor").val(data.defaultFactor);
                    if (data.isPimary == true)
                        $('#Factor').attr('readonly', true);
                    else
                        $('#Factor').attr('readonly', false);
                }
            }
        });
    }

    var supplierCodeDataSource = new kendo.data.DataSource({

        //serverFiltering: true,
        type: "json",
        transport: {
            read: {
                url: "/PayLookups/GetAllSuppliersForDDLList",
            },
            parameterMap: function (data, action) {

                if (action === "read") {
                    if (Object.keys(data).length > 0 && data.filter != undefined && data.filter.filters["length"] > 0) {
                        return {
                            fK_DefBranchId: parseInt($("#FK_DefBranchId").val()),
                        };
                    } else {
                        return {
                            fK_DefBranchId: parseInt($("#FK_DefBranchId").val()),
                        };
                    }

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

                    codeAndName: {
                        type: "string"
                    }
                }
            }
        }
    });
    $("#supplierAutoComplete").kendoDropDownList({

        dataSource: supplierCodeDataSource,
        //placeholder: Resources.AutocompleateChoose,
        select: onSelectSupplier,
        //change: onChangeSupplier,
        //placeholder: Resources.AutocompleateChoose,
        dataTextField: "codeAndName",
        dataValueField: "id",
        filter: "contains",
        minLength: 1
    });
    function onSelectSupplier(e) {

        $("#FK_PaySupplierId").val(e.dataItem.id);

        $("#SupplierName").val(e.dataItem.supplierNameAr);
        $("#RepaymentPeriod").val(e.dataItem.repaymentPeriod);
        $("#FK_DefCurrencyId").val(e.dataItem.fK_DefCurrencyId);
        $("#FK_DefCurrencyId").data("kendoDropDownList").value(e.dataItem.fK_DefCurrencyId);

        $("#FK_GlAccountId").val(e.dataItem.id);
        $("#Factor").val(e.dataItem.factor);
        var itmGrid = $("#PayInvoiceDetailsgrid").data("kendoGrid")
        var itmDataSource = $("#PayInvoiceDetailsgrid").data("kendoGrid").dataSource;
        for (var i = 0; itmGrid.dataItems("tr").length; i++) {
            itmDataSource.remove(itmGrid.dataItems("tr")[i])
        }
        ClearFormDetails();
        $("#TotalGross").val(0);
        $("#TotalDiscount").val(0);
        $("#TotalTaxAmount").val(0);
        $("#TotalRemaining").val(0);
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


    var paymentTypeDataSource = new kendo.data.DataSource({

        serverFiltering: true,
        type: "json",
        transport: {
            read: {
                url: "/PayLookups/GetAllPaymentTypeAutoCompleteSearchByCode"
            },
            parameterMap: function (data, action) {

                if (action === "read") {
                    if (Object.keys(data).length > 0 && data.filter != undefined && data.filter.filters["length"] > 0) {
                        return {
                            code: data.filter.filters[0].value,
                            fK_DefBranchId: parseInt($("#FK_DefBranchId").val()),
                        };
                    } else {
                        return {
                            code: "",
                            fK_DefBranchId: parseInt($("#FK_DefBranchId").val()),
                        };
                    }

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

                    typeCode: {
                        type: "string"
                    }
                }
            }
        }
    });
    $("#paymentTypeAutoComplete").kendoDropDownList({

        dataSource: paymentTypeDataSource,
        //placeholder: Resources.AutocompleateChoose,
        select: onSelectPaymentType,
        change: onChangePaymentType,
        dataTextField: "codeAndName",
        dataValueField: "id",
        filter: "contains",
        minLength: 1
    });

    function onSelectPaymentType(e) {

        $("#FK_PaymentTypeId").val(e.dataItem.id);
        $("#paymentTypeNameAr").val(e.dataItem.typeNameAr);
        $("#FK_GlAccountIdDetails").val(e.dataItem.fK_GlAccountId);
        $("#accountCode").val(e.dataItem.accountCode);
        $("#accountNameAr").val(e.dataItem.accountNameAr);
    }
    function onChangePaymentType(e) {
        var code = this.value();

        $.ajax({
            type: "POST",
            url: "/PayLookups/CheckPaymentTypeCodeExist?code=" + code,
            data: "name=John&location=Boston",
            dataType: "json",
            success: function (response) {

                if (response != null) {
                    $("#FK_PaymentTypeId").val(response.id);
                    $("#paymentTypeNameAr").val(response.typeNameAr);
                    $("#FK_GlAccountIdDetails").val(response.fK_GlAccountId);
                    $("#accountCode").val(response.accountCode);
                    $("#accountNameAr").val(response.accountNameAr);

                } else {
                    $("#FK_PaymentTypeId").val(null);
                    $("#paymentTypeNameAr").val("");
                    $("#FK_GlAccountIdDetails").val(null);
                    $("#accountCode").val("");
                    $("#accountNameAr").val("");
                    swal({
                        title: Resources.PaymentTypeCodeNotFoundResource,
                        confirmButtonText: Resources.DoneResource,
                        type: "error"
                    });
                }

            }
        });
    }

    //Tax GLAccount autocompleate
    var accountCodeDataSource = new kendo.data.DataSource({

        //serverFiltering: true,
        type: "json",
        transport: {
            read: {
                url: "/GlAccount/GetAllAccountsForDDList"
            },
            parameterMap: function (data, action) {

                if (action === "read") {
                    if (Object.keys(data).length > 0 && data.filter != undefined && data.filter.filters["length"] > 0) {
                        return {
                            code: data.filter.filters[0].value,
                            fK_DefBranchId: parseInt($("#FK_DefBranchId").val()),
                        };
                    } else {
                        return {
                            code: "",
                            fK_DefBranchId: parseInt($("#FK_DefBranchId").val()),
                        };
                    }

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
                    id: {
                        type: "int"
                    },
                    codeAndName: {
                        type: "string"
                    }
                }
            }
        }
    });

    $("#FK_GlAccountIdDetails").kendoDropDownList({
        //minLength: 1,
        dataTextField: "codeAndName",
        dataValueField: "id",
        filter: "contains",
        dataSource: accountCodeDataSource,
        select: onSelectGlAccountIdDetails,
        //change: onChangeTaxAccount,
        height: 400,
        template: '<span class=\" #= isMainAccount ? "text-danger" : "" #\">#: codeAndName #</span>'
    });
    function onSelectGlAccountIdDetails(e) {

        $.ajax({
            type: "POST",
            url: "/GlAccount/IsMainAccount?id=" + e.dataItem.id,
            data: "name=John&location=Boston",
            dataType: "json",
            success: function (response) {

                if (response) {
                    $("#accountCode").val("");
                    $("#accountNameAr").val("");
                    $("#FK_GlAccountIdDetails").data("kendoDropDownList").value(0);
                    swal({
                        title: Resources.NoTansactionCanMadeOnMainAccounts,
                        confirmButtonText: Resources.DoneResource,
                        type: "error"
                    });
                } else {

                    $("#accountCode").val(e.dataItem.accountCode);
                    $("#accountNameAr").val(e.dataItem.accountNameAr);
                }
            }
        });
    }

    $("#Fk_TaxGlAccountId").kendoDropDownList({
        //minLength: 1,
        dataTextField: "codeAndName",
        dataValueField: "id",
        filter: "contains",
        dataSource: accountCodeDataSource,
        //placeholder: Resources.AutocompleateChoose,
        select: onSelectTaxAccount,
        //change: onChangeTaxAccount,
        enable: false,
        height: 400,
    });
    function onSelectTaxAccount(e) {

        $("#Fk_TaxGlAccountId").val(e.dataItem.id);
        $("#TaxGlAccountName").val(e.dataItem.accountNameAr);

    }
    function onChangeTaxAccount(e) {

        var code = this.value();

        $.ajax({
            type: "POST",
            url: "/GlAccount/CheckAccountCodeExist?code=" + code,
            data: "name=John&location=Boston",
            dataType: "json",
            success: function (response) {

                if (response != null) {
                    $("#Fk_TaxGlAccountId").val(response.accountId);
                    $("#TaxGlAccountName").val(response.accountNameAr);
                } else {
                    $("#Fk_TaxGlAccountId").val(null);
                    $("#TaxGlAccountName").val(null);
                    swal({
                        title: Resources.AccountCodeNotFoundResource,
                        confirmButtonText: Resources.DoneResource,
                        type: "error"
                    });
                }

            }
        });

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
        select: onSelectTax

    });
    function onSelectTax(e) {

        var accId = e.dataItem.fK_GlAccountId;

        if (accId > 0) {
            $('#Fk_TaxGlAccountId').data("kendoDropDownList").value(accId);
            $("#TaxAmount").val((e.dataItem.amount).toString());
            $("#IsTaxPercentage").val(e.dataItem.isPercentage)
            $("#TaxName").val(e.dataItem.taxNameAr);
            $("#TaxPercentage").val(e.dataItem.amount);
            SetDiscountValue();
            SetTaxValue();
            SetRemaining();

        } else {
            $('#Fk_TaxGlAccountId').data("kendoDropDownList").value(0);
            $("#TaxAmount").val("");
            $("#IsTaxPercentage").val("");
            $("#TaxName").val("");
            $("#TaxPercentage").val("");
        }


    }
    //Discount Account
    $("#DiscountAccountAutoComplete").kendoDropDownList({
        //minLength: 1,
        dataTextField: "codeAndName",
        dataValueField: "id",
        filter: "contains",
        dataSource: accountCodeDataSource,
        //placeholder: Resources.AutocompleateChoose,
        select: onSelectDiscountAccount,
        //change: onChangeDiscountAccount,
        height: 400,
        template: '<span class=\" #= isMainAccount ? "text-danger" : "" #\">#: codeAndName #</span>'

    });
    function onSelectDiscountAccount(e) {


        $.ajax({
            type: "POST",
            url: "/GlAccount/IsMainAccount?id=" + e.dataItem.id,
            data: "name=John&location=Boston",
            dataType: "json",
            success: function (response) {

                if (response) {

                    $("#Fk_DiscountGlAccountId").data("kendoDropDownList").value(0);
                    swal({
                        title: Resources.NoTansactionCanMadeOnMainAccounts,
                        confirmButtonText: Resources.DoneResource,
                        type: "error"
                    });
                } else {
                    $("#Fk_DiscountGlAccountId").val(e.dataItem.id);
                }
            }
        });

    }
    function onChangeDiscountAccount(e) {

        var code = this.value();

        $.ajax({
            type: "POST",
            url: "/GlAccount/CheckAccountCodeExist?code=" + code,
            data: "name=John&location=Boston",
            dataType: "json",
            success: function (response) {

                if (response != null) {
                    $("#Fk_DiscountGlAccountId").val(response.accountId);
                    $("#DiscountGlAccountName").val(response.accountNameAr);
                } else {
                    $("#Fk_DiscountGlAccountId").val(null);
                    $("#DiscountGlAccountName").val(null);
                    swal({
                        title: Resources.AccountCodeNotFoundResource,
                        confirmButtonText: Resources.DoneResource,
                        type: "error"
                    });
                }

            }
        });

    }
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
    //
    //Grid
    var tempSource = new kendo.data.DataSource({

    });
    var gridBound = $("#PayInvoiceDetailsgrid").kendoGrid({
        dataSource: tempSource,
        navigatable: false,
        pageable: false,
        columns: [

            { field: "Fk_TaxGlAccountId", hidden: true, format: "{0:c}" },
            { field: "Fk_DiscountGlAccountId", hidden: true, format: "{0:c}" },
            { field: "hdnAttachmentIds", hidden: true, format: "{0:c}" },
            { field: "fK_PaymentTypeId", hidden: true, format: "{0:c}" },
            { field: "paymentTypeName", hidden: true, title: Resources.PaymentTypeResource, format: "{0:c}", width: Resources.TypeWidth },
            { field: "fK_GlAccountId", hidden: true, format: "{0:c}", width: 150 },
            { field: "glAccountCode", title: Resources.AccountCodeResource, width: Resources.CodeWidth },
            { field: "glAccountName", title: Resources.AccountNameResource, width: Resources.NameWidth },
            { field: "billNumber", title: Resources.BillNumberResource, width: Resources.CodeWidth },
            { field: "referenceId", hidden: true },
            { field: "billDate", width: Resources.DateWidth, title: Resources.BillDateResource },
            { field: "billDueDate", width: Resources.DateWidth, title: Resources.BillDueDateResource },
            { field: "gross", width: Resources.AmountWidth, title: Resources.GrossResource, format: '{0:n2}' },
            { field: "taxesName", width: Resources.AmountWidth, title: Resources.GlAccountTax },
            { field: "isTaxInclude", hidden: true },
            { field: "fK_TaxesId", hidden: true },
            { field: "taxPercentage", width: Resources.AmountWidth, title: Resources.TaxPercentageResource },
            { field: "taxValue", width: Resources.AmountWidth, title: Resources.TaxValueResource, format: '{0:n2}' },
            { field: "isDiscountInclude", hidden: true },
            { field: "fK_CbDiscountTypeId", hidden: true },
            { field: "discountPercentage", width: Resources.AmountWidth, title: Resources.DiscountPercentageResource },
            { field: "discountValue", width: Resources.AmountWidth, title: Resources.DiscountValueResource, format: '{0:n2}' },
            //{ field: "downPayment", width: Resources.AmountWidth, title: Resources.DownPaymentResource },
            { field: "remaining", width: Resources.AmountWidth, title: Resources.RemainingResource, format: '{0:n2}' },
            { field: "description", width: Resources.DescriptionWidth, title: Resources.DescriptionResource, format: '{0:n2}' },
            { width: Resources.ActionWidth, template: "<a  class='btn btn-danger btn-sm btnDelete' ><i class='fas fa-trash-alt'></i></a>" },
            { width: Resources.ActionWidth, template: "<button type='button' class='btn btn-success btn-sm btnFiles'><i class='fas fa-paperclip'></i></button>" }
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

    });
    gridBound.data("kendoGrid").table.on("click", ".btnDelete", removeBondDetailRow);
    gridBound.data("kendoGrid").table.on("click", ".btnFiles", ShowFiles);

    function ShowFiles() {

        var row = $(this).closest("tr"),
            grid = $("#PayInvoiceDetailsgrid").data("kendoGrid"),
            dataItem = grid.dataItem(row);

        var modulePage = $('#hdnModulePage').val();
        var refrenceId = $('#hdnRefrenceId').val();
        var ids = dataItem.hdnAttachmentIds;
        var url = '/Attachment/Get?modulePage=' + modulePage + '&refId=' + refrenceId + '&attachmentIds=' + ids + '&redirect=' + "ViewOnly";
        var divAttachmentInvoiceList = $('#divAttachmentInvoiceList');
        divAttachmentInvoiceList.load(url);
        $("#Attach-file-Details").modal('toggle');
    }
    function removeBondDetailRow() {

        var row = $(this).closest("tr"),
            grid = $("#PayInvoiceDetailsgrid").data("kendoGrid"),
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
                var dataSource = $("#PayInvoiceDetailsgrid").data("kendoGrid").dataSource;

                if (dataSource.remove(dataItem)) {
                    swal({
                        title: Resources.DeleteSuccessResource,
                        confirmButtonText: Resources.DoneResource,
                        type: "success"
                    });

                    var totalGross = parseFloat($("#TotalGross").val()),
                        totalDiscount = parseFloat($("#TotalDiscount").val()),
                        totalTaxAmount = parseFloat($("#TotalTaxAmount").val()),
                        totalRemaining = parseFloat($("#TotalRemaining").val());

                    $("#TotalGross").val((totalGross - dataItem.gross).toFixed(2));
                    $("#TotalDiscount").val((totalDiscount - dataItem.discountValue).toFixed(2));
                    $("#TotalTaxAmount").val((totalTaxAmount - dataItem.taxValue).toFixed(2));
                    //$("#TotalDownPayment").val(totalDownPayment - dataItem.downPayment);
                    $("#TotalRemaining").val((totalRemaining - dataItem.remaining).toFixed(2));

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
    $("#btnAddNewInvoiceDetail").on('click', function () {

        var fK_PaymentTypeId = $("#FK_PaymentTypeId").val(),
            paymentTypeName = $("#paymentTypeNameAr").val(),
            fK_GlAccountId = $("#FK_GlAccountIdDetails").val(),
            fk_TaxGlAccountId = $("#Fk_TaxGlAccountId").val(),
            fk_DiscountGlAccountId = $("#Fk_DiscountGlAccountId").val(),
            accountCode = $("#accountCode").val(),
            accountName = $("#accountNameAr").val(),
            billNumber = $("#BillNumber").val(),
            billDate = $("#BillDate").val(),
            billDueDate = $("#BillDueDate").val(),
            gross = parseFloat($("#Gross").val()),
            taxPercentage = parseFloat($("#TaxPercentage").val()),
            taxValue = parseFloat($("#TaxValue").val()),
            discountPercentage = parseFloat($("#DiscountPercentage").val()),
            discountValue = parseFloat($("#DiscountValue").val()),
            downPayment = null,
            remaining = parseFloat($("#Remaining").val()),
            description = $("#descriptionDetail").val(),
            referenceId = $("#ReferenceId").val(),
            hdnAttachmentIds = $("#hdnAttachmentIds").val(),
            taxesId = $("#FK_TaxesId").val(),
            discountTypeId = $("#FK_CbDiscountTypeId").val() > 0 ? $("#FK_CbDiscountTypeId").val() : null,
            isDiscountInclude = $('input[type="checkbox"][name=IsDiscountInclude]').prop("checked"),
            isTaxInclude = $('input[type="checkbox"][name=IsTaxInclude]').prop("checked"),
            taxName = $("#TaxName").val();

        //var isAdded = false;
        //var table = $("#PayInvoiceDetailsgrid").data("kendoGrid").dataSource.data();
        //if (table.length > 0) {
        //    for (var i = 0; i < table.length; i++) {
        //        if (table[i].billNumber == billNumber) {
        //            isAdded = true;
        //            break;
        //        }
        //    }
        //}
        if (isNaN(discountPercentage))
            discountPercentage = 0;
        if (isNaN(discountValue))
            discountValue = 0;

        if (isNaN(taxPercentage))
            taxPercentage = 0;
        if (isNaN(taxValue))
            taxValue = 0;

        if (isNaN(fK_GlAccountId) || fK_GlAccountId == "" || fK_GlAccountId == "0") {

            swal({
                title: Resources.ChoosePaymentTypeResource,
                confirmButtonText: Resources.DoneResource,
                type: "error"
            });
        }
        else if (isNaN((fk_TaxGlAccountId) && isTaxInclude) || (fk_TaxGlAccountId == "" && isTaxInclude) || (fk_TaxGlAccountId == "0" && isTaxInclude)) {

            swal({
                title: Resources.TaxGlAccountRequiredResource,
                confirmButtonText: Resources.DoneResource,
                type: "error"
            });
        }
        else if ((isNaN(fk_DiscountGlAccountId) && isDiscountInclude) || (fk_DiscountGlAccountId == "" && isDiscountInclude) || (fk_DiscountGlAccountId == "0" && isDiscountInclude)) {

            swal({
                title: Resources.DiscountGlAccountRequiredResource,
                confirmButtonText: Resources.DoneResource,
                type: "error"
            });
        }
        else if ((isNaN(discountPercentage) && isDiscountInclude) || (discountPercentage == 0 && isDiscountInclude) || (discountPercentage == "" && isDiscountInclude)) {

            swal({
                title: Resources.EnterRequiredResource + " " + Resources.DiscountValueResource,
                confirmButtonText: Resources.DoneResource,
                type: "error"
            });
        }
        else if (billNumber == null || billNumber == "") {

            swal({
                title: Resources.BillNumberRequiredResource,
                confirmButtonText: Resources.DoneResource,
                type: "error"
            });
        }
        //else if (isNaN(downPayment) || downPayment == "") {
        //
        //    swal({
        //        title: Resources.DownPaymentRequiredResource,
        //        confirmButtonText: Resources.DoneResource,
        //        type: "error"
        //    });
        //}
        else if (isNaN(gross) || gross == "") {

            swal({
                title: Resources.GrossRequiredResource,
                confirmButtonText: Resources.DoneResource,
                type: "error"
            });
        }
        //else if (isNaN(taxValue) || taxValue == "" && taxValue !=0) {

        //    swal({
        //        title: Resources.TaxRequiredResource,
        //        confirmButtonText: Resources.DoneResource,
        //        type: "error"
        //    });
        //}
        //else if (isNaN(taxPercentage) || taxPercentage == "" && taxPercentage != 0) {

        //    swal({
        //        title: Resources.TaxPercentageRequiredResource,
        //        confirmButtonText: Resources.DoneResource,
        //        type: "error"
        //    });
        //}

        //else if (isAdded) {

        //    swal({
        //        title: Resources.BillAlreadyAdded,
        //        confirmButtonText: Resources.DoneResource,
        //        type: "error"
        //    });
        //}
        else {
           
            tempSource.insert(0, {
                hdnAttachmentIds: hdnAttachmentIds,
                fK_PaymentTypeId: fK_PaymentTypeId,
                paymentTypeName: paymentTypeName,
                fK_GlAccountId: fK_GlAccountId,
                fk_TaxGlAccountId: fk_TaxGlAccountId,
                fk_DiscountGlAccountId: fk_DiscountGlAccountId,
                glAccountCode: accountCode,
                glAccountName: accountName,
                billNumber: billNumber,
                billDate: billDate,
                billDueDate: billDueDate,
                gross: gross,
                taxPercentage: taxPercentage,
                taxValue: taxValue,
                discountPercentage: discountPercentage,
                discountValue: discountValue,
                downPayment: downPayment,
                remaining: remaining,
                description: description,
                referenceId: referenceId,
                fK_TaxesId: taxesId,
                fK_CbDiscountTypeId: discountTypeId,
                taxesName: taxName,
                isDiscountInclude: isDiscountInclude,
                isTaxInclude: isTaxInclude,

            });

            var totalGross = parseFloat($("#TotalGross").val()),
                totalDiscount = parseFloat($("#TotalDiscount").val()),
                totalTaxAmount = parseFloat($("#TotalTaxAmount").val()),
                //totalDownPayment = parseFloat($("#TotalDownPayment").val()),
                totalRemaining = parseFloat($("#TotalRemaining").val());
            $("#TotalGross").val((totalGross + gross).toFixed(2));
            $("#TotalDiscount").val((totalDiscount + discountValue).toFixed(2));
            $("#TotalTaxAmount").val((totalTaxAmount + taxValue).toFixed(2));
            //$("#TotalDownPayment").val(totalDownPayment + downPayment);
            $("#TotalRemaining").val((totalRemaining + remaining).toFixed(2));
            ClearFormDetails();
        }


    });


    $("#btnViewInvoice").click(function () {

        loadPurchaseInvoiceGrid();
    })

    /*bill grid */
    loadPurchaseInvoiceGrid();
    function loadPurchaseInvoiceGrid() {
        var dataSource = new kendo.data.DataSource({
            transport: {
                read: {
                    url: "/StPurchaseInvoice/GetInvoiceBySupplierId?id=" + $("#FK_PaySupplierId").val(),
                    Type: "GET"
                }
            },
            error: function (e) {
                alert("Status: " + e.status + "; Error message: " + e.errorThrown);
            },
            pageSize: 10,
            schema: {
                model: {
                    id: "id",
                    fields: {
                        id: { editable: false },
                        serialNumber: { editable: false },
                        serialPrefix: { editable: false },
                        totalNet: { editable: false },
                        description: { editable: false },
                        transactionDate: { type: "date", editable: false },
                        FK_CreatorId: { editable: false },
                        creationDate: { type: "date", editable: false },
                        lastModifiedDate: { type: "date", editable: false },
                        isActive: { editable: false },
                        isDeleted: { editable: false },

                    }
                }
            }
        });


        var grid = $("#purchaseInvoiceGrid").kendoGrid({
            navigatable: false,
            pageable: false,
            scrollable: true,

            excel: {
                fileName: "Hr Job.xlsx",
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
                pageSizes: [10, 20, 50, Resources.All],
                numeric: Resources.GridNumeric,
                refresh: Resources.GridRefresh,

            },

            columns: [

                { field: "transactionDate", title: Resources.BillDateResource, width: Resources.DateWidth, format: "{0:yyyy/MM/dd}" },
                { field: "serialNumber", title: Resources.BillNumberResource, width: Resources.NameWidth },

                { field: "totalNet", title: Resources.Total, width: Resources.NameWidth },

                { width: Resources.DoubleActionWidth, template: " <a  class='btn btn-success btn-sm btnSelect ' >" + Resources.SelectOne + "</a>" },

            ],
            dataBound: function (e) {
                e.sender.items().each(function () {
                    var dataItem = e.sender.dataItem(this);
                    kendo.bind(this, dataItem);

                });

            },
            //resizable: true
        });
        grid.data("kendoGrid").table.on("click", ".btnSelect", addSelectedIvoice);
    }

    function addSelectedIvoice() {

        var row = $(this).closest("tr"),
            grid = $("#purchaseInvoiceGrid").data("kendoGrid"),
            dataItem = grid.dataItem(row);
        $.ajax({
            url: '/StPurchaseInvoice/GetInvoiceById?id=' + dataItem.id,
            success: function (invoice) {
                var billDate = new Date(invoice.transactionDate),
                    billDueDate = new Date(invoice.dueDate),
                    billDateFormat = billDate.getFullYear() + "-" + ("0" + (billDate.getMonth() + 1)).slice(-2) + "-" + ("0" + billDate.getDate()).slice(-2),
                    billDueDateFormat = billDueDate.getFullYear() + "-" + ("0" + (billDueDate.getMonth() + 1)).slice(-2) + "-" + ("0" + billDueDate.getDate()).slice(-2);
                $('#BillDate').val(today);
                $('#BillDueDate').val(today);
                $("#BillNumber").val(invoice.serialPrefix + invoice.serialNumber)
                $("#BillDate").val(billDateFormat);
                $("#BillDueDate").val(billDueDateFormat);
                $("#Gross").val(invoice.totalNet - invoice.totalTax + invoice.totalDiscount);
                $("#DiscountValue").val(invoice.totalDiscount);
                $("#TaxValue").val(invoice.totalTax);
                $("#ReferenceId").val(invoice.id);
                if (invoice.totalDiscount > 0) {
                    $("#isDiscountInclude").prop('checked', true);
                    //$("#DiscountAccountAutoComplete").prop("disabled", false);
                    $("#DiscountAccountAutoComplete").data("kendoDropDownList").enable(true);
                }
                if (invoice.totalTax == 0)
                    $("#TaxPercentage").val(0);
                else {
                    var taxValue = parseFloat($("#TaxValue").val()),
                        gross = parseFloat($("#Gross").val());
                    var result = (taxValue / gross) * 100;
                    $("#TaxPercentage").val(result);
                }
                $("#isDiscountInclude").prop("disabled", true);
                $("#BillNumber").prop("readonly", true);
                $("#BillDate").prop("readonly", true);
                $("#Gross").prop("readonly", true);
                $("#TaxValue").prop("readonly", true);
                $("#TaxPercentage").prop("readonly", true);
                $("#ViewBillDetail").attr("href", "../../StPurchaseInvoice/print?id=" + invoice.id);
                $("#ViewBillDetail").show();
                SetRemaining();
                $('#purchase-invoice').modal('toggle');
            },
            error: function (err, xqr, txt) { }
        });
    }


    $("#IsAmountIncluldeTax").change(function () {
        SetDiscountValue();
        SetTaxValue();
        SetRemaining();
    });

});

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
$('#BillDate').change(function () {

    var newDate = new Date($(this).val()),
        day = newDate.getDate() + parseInt($("#RepaymentPeriod").val()),
        month = newDate.getMonth(),
        year = newDate.getFullYear();
    newDate = new Date(year, month, day);
    newDate = newDate.getFullYear() + "-" + ("0" + (newDate.getMonth() + 1)).slice(-2) + "-" + ("0" + newDate.getDate()).slice(-2);
    $('#BillDueDate').val(newDate);
});

$("#FK_DefCurrencyId").change(function (e) {
    var BondDate = $("#InvoiceDate").val();
    var voucherDate = new Date($("#InvoiceDate").val());
    var DefcurrencyId = parseInt($("#FK_DefCurrencyId").val());
    $.ajax({
        url: "/GlJournalVoucher/GetCurrencyFactorByIdInPeriod?id=" + DefcurrencyId + "&period=" + BondDate /*voucherDate.toUTCString()*/,
        type: "Get",
        contentType: false,
        processData: false,
        success: function (data) {

            if (data.hasOwnProperty("factor")) {
                $("#Factor").val(data.factor);
                $('#Factor').attr('readonly', false);
            }
            else {
                $("#Factor").val(data.defaultFactor);
                if (data.isPimary == true)
                    $('#Factor').attr('readonly', true);
                else
                    $('#Factor').attr('readonly', false);
            }
        }
    });
})


$('#InvoiceType').change(function () {
    if (this.value == '2') {
        $("#RepaymentPeriod").removeAttr('disabled');
    }
    else {
        $("#RepaymentPeriod").attr("disabled", "disabled");
        $("#RepaymentPeriod").val(parseInt(0));
    }

});

var $taxValue = 0,
    $taxPercentage = 0;


$("#TaxValue").keyup(function () {
    //  SetTaxValue();
    var taxValue = parseFloat($(this).val()),
        gross = parseFloat($("#Gross").val());
    var result = (taxValue / gross) * 100;
    $("#TaxPercentage").val(result.toFixed(2));
    SetRemaining();
});

$("#TaxPercentage").keyup(function () {
    SetTaxValue();
    SetRemaining();
});

$("#DiscountValue").keyup(function () {

    var DiscountValue = parseFloat($(this).val()),
        gross = parseFloat($("#Gross").val()),
        taxPercentage = parseFloat($("#TaxPercentage").val()),
        taxValue = parseFloat($("#TaxValue").val());
    if (isNaN(taxPercentage) && isNaN(taxValue)) {
        var result = (DiscountValue / gross) * 100;
        $("#DiscountPercentage").val(result.toFixed(2));
        SetRemaining();
    }
    else {
        $("#TaxValue").val("");
        $("#TaxPercentage").val("");
    }

    //SetTaxValue();
});

$("#DiscountPercentage").keyup(function () {
    SetDiscountValue()
    SetRemaining();
    //SetTaxValue();
});

$("#DownPayment,#Gross").keyup(function () { SetRemaining(); /*SetTaxValue(); SetDiscountValue() */ });

function SetRemaining() {
    SetDiscountValue();
    var downPayment = parseFloat($("#DownPayment").val()), //المبلغ المدفوع
        gross = parseFloat($("#Gross").val()), //قيمه الفاتورة
        taxValue = parseFloat($("#TaxValue").val()), //قيمه الضريبة
        discountValue = parseFloat($("#DiscountValue").val());// قيمة الخصم 


    if (isNaN(downPayment))
        downPayment = 0;
    if (isNaN(taxValue))
        taxValue = 0;
    if (isNaN(discountValue))
        discountValue = 0;

    if (!isNaN(gross)) {
        SetTaxValue();
        taxValue = parseFloat($("#TaxValue").val());
        if (isNaN(taxValue))
            taxValue = 0;
        var remaining = (gross + taxValue - discountValue - downPayment);

        if ($("#IsAmountIncluldeTax").prop("checked") == true) {
            $("#Remaining").val(gross);
        }
        else {
            $("#Remaining").val(remaining.toFixed(2));
        }
    }

}

function SetTaxValue() {

    var taxPercentage = parseFloat($("#TaxPercentage").val()),
        gross = parseFloat($("#Gross").val()),
        discountValue = parseFloat($("#DiscountValue").val());

    if ($("#IsTaxPercentage").val() && gross > 0) {

        if (!isNaN(gross) && !isNaN(taxPercentage) && !isNaN(discountValue)) {

            if ($("#IsAmountIncluldeTax").prop("checked") == true && gross > 0) {
                var grossWithoutTax = parseFloat((gross - discountValue) / (1 + (taxPercentage / 100))).toFixed(2);
                var result = parseFloat(gross - grossWithoutTax).toFixed(2);
                $("#TaxValue").val(result);
            } else {
                var result = (gross - discountValue) * taxPercentage;
                result = result / 100;
                $("#TaxValue").val(result.toFixed(2));
            }

        }

        else {
            if ($("#IsAmountIncluldeTax").prop("checked") == true && gross > 0) {
                var grossWithoutTax = parseFloat(gross / (1 + (taxPercentage / 100))).toFixed(2);
                var result = parseFloat(gross - grossWithoutTax).toFixed(2);
            } else {
                var result = (gross * taxPercentage) / 100;
                $("#TaxValue").val(result.toFixed(2));
            }

        }
    } else if (!$("#IsTaxPercentage").val()) {
        $("#TaxValue").val($("#TaxAmount").val());
    }


}

function SetDiscountValue() {

    var discountPercentage = parseFloat($("#DiscountPercentage").val()),
        gross = parseFloat($("#Gross").val());
 
    if ($("#IsDiscountPercentage").prop("checked") == true) {

        if (!isNaN(discountPercentage) && !isNaN(gross)) {
            var result = (gross * discountPercentage) / 100;
            $("#DiscountValue").val(result.toFixed(2));

        }
        else
            $("#DiscountValue").val(0);
    }
    else {
        if (!isNaN(discountPercentage)) {
            $("#DiscountValue").val(discountPercentage.toFixed(2));
        }
        else
            $("#DiscountValue").val(0);
    }

    SetTaxValue();
}

function ClearFormDetails() {
    $("#FK_PaymentTypeId").val("");
    $("#paymentTypeNameAr").val("");
    /*    $("#FK_GlAccountIdDetails").val("");*/
    $("#FK_GlAccountIdDetails").data("kendoDropDownList").value("0");
    $("#accountCode").val("");
    $("#accountNameAr").val("");
    $("#BillNumber").val("");
    $("#Gross").val("");

    $("#DiscountPercentage").val("");
    $("#DiscountValue").val("");
    $("#DownPayment").val("");
    $("#Remaining").val("");
    $("#descriptionDetail").val("");
    $("#paymentTypeAutoComplete").val("");
    $("#descriptionDetail").val("");



    $("#Fk_DiscountGlAccountId").val("");
    $("#DiscountGlAccountName").val("");
    $("#DiscountAccountAutoComplete").val("");
    $("#hdnAttachmentIds").val("0");
    $("#purchaseInvoice").val("");
    $("#ReferenceId").val("");

    //$("#FK_PaymentTypeId").val(0);

    //$("#paymentTypeAutoComplete").data("kendoDropDownList").value("0");
    //$("#paymentTypeAutoComplete").data("kendoDropDownList").dataSource.read();

    //$("#Fk_TaxGlAccountId").val(0);
    //$("#Fk_TaxGlAccountId").val("");
    $("#TaxName").val("");
    $("#TaxGlAccountName").val("");
    $("#taxAccountAutoComplete").val("");
    $("#TaxPercentage").val("");
    $("#TaxValue").val("");
    $("#TaxAmount").val("");
    $("#Fk_TaxGlAccountId").data("kendoDropDownList").value("0");
    $("#Fk_TaxGlAccountId").data("kendoDropDownList").dataSource.read();
    $("#FK_TaxesId").data("kendoDropDownList").value("0");
    $("#FK_TaxesId").data("kendoDropDownList").dataSource.read();

    //$("#Fk_DiscountGlAccountId").val(0);
    $("#DiscountAccountAutoComplete").data("kendoDropDownList").value("0");
    $("#DiscountAccountAutoComplete").data("kendoDropDownList").dataSource.read();

    $("#FK_CbDiscountTypeId").data("kendoDropDownList").value("0");
    $("#FK_CbDiscountTypeId").data("kendoDropDownList").dataSource.read();

    var modulePage = $('#hdnModulePage').val();
    var refrenceId = $('#hdnRefrenceId').val();
    var url = '/Attachment/Get?modulePage=' + modulePage + '&refId=' + refrenceId + '&attachmentIds=' + "0";
    var divAttachmentList = $('#divAttachmentList');
    divAttachmentList.load(url);

    $("#isDiscountInclude").prop("disabled", false);
    $("#BillNumber").prop("readonly", false);
    $("#BillDate").prop("readonly", false);
    $("#Gross").prop("readonly", false);
    $("#TaxValue").prop("readonly", false);
    $("#TaxPercentage").prop("readonly", false);
    $("#ViewBillDetail").hide();

}
function checkPeriodAndSubmitPayInvoiceCreate() {

    var openedPeriodCount = 0;
    $.ajax({
        url: "/GlFinancialPeriod/GetOpenPeriodsCount",
        type: "Get",
        contentType: false,
        processData: false,
        success: function (result) {

            openedPeriodCount = result;
            $.ajax({
                url: "/GlFinancialPeriod/IsDateInOpenPeriod?date=" + $("#InvoiceDate").val(),
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
                                SubmitPayInvoiceCreate();
                            }, 1000);
                        });
                    }
                    else if (!result) {
                        swal({
                            title: Resources.InvoiceDateOutsideOpenPeriods,
                            confirmButtonText: Resources.CancelResource,
                            type: "error"
                        }, function () {
                        });

                    } else {
                        SubmitPayInvoiceCreate();
                    }
                }
            });
        }
    });


}

function SubmitPayInvoiceCreate() {

    var listDetails = [];
    var gridData = $('#PayInvoiceDetailsgrid').data("kendoGrid").dataSource.data(),
        paySupplier = $("#FK_PaySupplierId").val(),
        paySubSupplier = $("#FK_PaySubSupplierId").val();
    if ((isNaN(paySupplier) || paySupplier == "0" || paySupplier == "") && (isNaN(paySubSupplier) || paySubSupplier == "0" || paySubSupplier == "")) {
        swal({
            title: Resources.ChooseSupplierResource,
            confirmButtonText: Resources.DoneResource,
            type: "error"
        });
    }
    else if (gridData.length == 0) {
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
                FK_PaymentTypeId: parseInt(gridData[i].fK_PaymentTypeId),
                PaymentTypeName: gridData[i].paymentTypeName,
                FK_GlAccountId: parseInt(gridData[i].fK_GlAccountId),
                Fk_TaxGlAccountId: parseInt(gridData[i].fk_TaxGlAccountId),
                Fk_DiscountGlAccountId: parseInt(gridData[i].fk_DiscountGlAccountId),
                GlAccountName: gridData[i].glAccountName,
                BillNumber: gridData[i].billNumber,
                BillDate: gridData[i].billDate,
                BillDueDate: gridData[i].billDueDate,
                Gross: parseFloat(gridData[i].gross),
                IsTaxInclude: gridData[i].isTaxInclude,
                TaxPercentage: parseFloat(gridData[i].taxPercentage),
                TaxValue: parseFloat(gridData[i].taxValue),
                IsDiscountInclude: gridData[i].isDiscountInclude,
                DiscountPercentage: parseFloat(gridData[i].discountPercentage),
                DiscountValue: parseFloat(gridData[i].discountValue),
                //DownPayment: parseFloat(gridData[i].downPayment),
                Remaining: parseFloat(gridData[i].remaining),
                Description: gridData[i].description,
                ReferenceId: gridData[i].referenceId > 0 ? parseInt(gridData[i].referenceId) : 0,
                hdnAttachmentIds: gridData[i].hdnAttachmentIds,
                FK_TaxesId: parseInt(gridData[i].fK_TaxesId),
                FK_CbDiscountTypeId: parseInt(gridData[i].fK_CbDiscountTypeId),
                TaxesName: gridData[i].taxesName
            };
            listDetails.push(detail);
        }

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


        var Obj = {
            Id: 0,
            Serial: $("#Serial").val(),
            InvoiceType: parseInt($("#InvoiceType").val()),

            InvoiceDate: $("#InvoiceDate").val(),
            RepaymentPeriod: parseInt($("#RepaymentPeriod").val()),
            FK_PaySupplierId: parseInt($("#FK_PaySupplierId").val()),
            //FK_PaySubSupplierId: parseInt($("#FK_PaySubSupplierId").val()),
            FK_GlAccountId: parseInt($("#FK_GlAccountId").val()),
            FK_CostCenterId: parseInt($("#FK_CostCenterId").val()),
            FK_DefCurrencyId: parseInt($("#FK_DefCurrencyId").val()),
            FK_DefBranchId: parseFloat($("#FK_DefBranchId").val()),
            Factor: parseFloat($("#Factor").val()),
            Gross: parseFloat($("#TotalGross").val()),
            Discount: parseFloat($("#TotalDiscount").val()),
            TaxAmount: parseFloat($("#TotalTaxAmount").val()),
            Remaining: parseFloat($("#TotalRemaining").val()),
            //DownPayment: parseFloat($("#TotalDownPayment").val()),
            Description: $("#Description").val(),
            IsPosted: isPosted,
            IsActive: isActive,
            FK_DefFreezingReasonId: parseInt($("#FK_DefFreezingReasonId").val()),
            FreezingNotes: $("#FreezingNotes").val(),
            ListDetails: listDetails
        };

        $.ajax({
            url: "/PayInvoice/Create",
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
                        window.location.href = '/PayInvoice/Index';
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

$("#IsTaxInclude").change(function () {

    if ($(this).prop("checked") == true) {
        $("#taxtab").show();
        $("#IsAmountIncluldeTax").prop('checked', false);
        $('#IsAmountIncluldeTax').prop("disabled", false);
    }
    else {
        $("#taxtab").hide();
        $("#TaxGlAccountName").val("");
        $("#taxAccountAutoComplete").val("");
        $("#TaxPercentage").val("");
        $("#TaxValue").val("");
        $("#TaxAmount").val("");
        $("#Fk_TaxGlAccountId").data("kendoDropDownList").value("0");
        $("#Fk_TaxGlAccountId").data("kendoDropDownList").dataSource.read();

        $("#FK_TaxesId").data("kendoDropDownList").value("0");
        $("#FK_TaxesId").data("kendoDropDownList").dataSource.read();

        $("#IsAmountIncluldeTax").prop('checked', false);
        $('#IsAmountIncluldeTax').prop("disabled", true);
    }
    SetDiscountValue()
    SetRemaining();
    SetTaxValue();
});

$("#IsDiscountInclude").change(function () {
    if ($(this).prop("checked") == true) {
        $("#discounttab").show();
        $("#DiscountValue").removeAttr('disabled');
        $("#DiscountPercentage").removeAttr('disabled');
        //$("#DiscountAccountAutoComplete").removeAttr('disabled');
        $("#DiscountAccountAutoComplete").data("kendoDropDownList").enable(true);
    }
    else {
        $("#discounttab").hide();
        $("#DiscountValue").attr("disabled", "disabled");
        $("#DiscountPercentage").attr("disabled", "disabled");
        //$("#DiscountAccountAutoComplete").attr("disabled", "disabled");
        $("#DiscountAccountAutoComplete").data("kendoDropDownList").enable(false);
        $("#DiscountAccountAutoComplete").data("kendoDropDownList").value("0");

        $("#FK_CbDiscountTypeId").data("kendoDropDownList").value("0");
        $("#FK_CbDiscountTypeId").data("kendoDropDownList").dataSource.read();

        $("#Fk_DiscountGlAccountId").val(null);
        $("#DiscountGlAccountName").val(null);
        $("#DiscountAccountAutoComplete").val(null);
        $("#DiscountValue").val(null);
        $("#DiscountPercentage").val(null)

    }
    SetDiscountValue()
    SetRemaining();
    SetTaxValue();
});


$("#IsDiscountPercentage").change(function () {
    SetDiscountValue();
    SetTaxValue();
    SetRemaining();

});