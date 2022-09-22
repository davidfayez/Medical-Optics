$(document).ready(function () {
    var now = new Date(),
        today = now.getFullYear() + "-" + ("0" + (now.getMonth() + 1)).slice(-2) + "-" + ("0" + now.getDate()).slice(-2);
    $('#BillDate').val(today);
    $('#BillDueDate').val(today);
    $('#NoticDate').val(today);

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
        //$("#paymentTypeAutoComplete").data("kendoDropDownList").value("0");
        //$("#paymentTypeAutoComplete").data("kendoDropDownList").dataSource.read();
        $("#paymentTypeNameAr").val("");
        // $("#FK_GlAccountIdDetails").val("");
        $("#accountCode").val("");
        $("#accountNameAr").val("");

        $("#FK_GlAccountIdDetails").data("kendoDropDownList").value("0");
        $("#FK_GlAccountIdDetails").data("kendoDropDownList").dataSource.read();
        //$("#Fk_TaxGlAccountId").val(0);
        $("#Fk_TaxGlAccountId").data("kendoDropDownList").value("0");
        $("#Fk_TaxGlAccountId").data("kendoDropDownList").dataSource.read();

        //$("#Fk_DiscountGlAccountId").val(0);
        $("#DiscountAccountAutoComplete").data("kendoDropDownList").value("0");
        $("#DiscountAccountAutoComplete").data("kendoDropDownList").dataSource.read();
    });

    $("#NoticType").kendoDropDownList({
        filter: "contains",
        height: 300,
        dataTextField: "text",
        dataValueField: "value",
        dataSource: {
            type: "json",
            //serverFiltering: true,
            transport: {
                read: {
                    url: "/PayNotice/GetAllNoticeTypeForDDL",
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

    var supplierCodeDataSource = new kendo.data.DataSource({

        //serverFiltering: true,
        type: "json",
        transport: {
            read: {
                url: "/PayLookups/GetAllSuppliersForDDLList",
            },
            parameterMap: function (data, action) {
                debugger
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
                debugger;
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
        var itmGrid = $("#PayNoticeDetailsgrid").data("kendoGrid")
        var itmDataSource = $("#PayNoticeDetailsgrid").data("kendoGrid").dataSource;
        for (var i = 0; itmGrid.dataItems("tr").length; i++) {
            itmDataSource.remove(itmGrid.dataItems("tr")[i])
        }
        ClearFormDetails();
        $("#TotalGross").val(0);
        $("#TotalDiscount").val(0);
        $("#TotalTaxAmount").val(0);
        $("#TotalRemaining").val(0);
        $("#TotalDownPayment").val(0);
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
                debugger
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
                debugger
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
                debugger
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
        height: 400
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

    $("#FK_GlAccountIdDetails").kendoDropDownList({
        //minLength: 1,
        dataTextField: "codeAndName",
        dataValueField: "id",
        filter: "contains",
        dataSource: accountCodeDataSource,
        select: onSelectGlAccountIdDetails,
        //change: onChangeTaxAccount,
        height: 400
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
            SetTaxValue();
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
        height: 400
    });
    function onSelectDiscountAccount(e) {

        $("#Fk_DiscountGlAccountId").val(e.dataItem.id);
        $("#DiscountGlAccountName").val(e.dataItem.accountNameAr);

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
    var gridBound = $("#PayNoticeDetailsgrid").kendoGrid({
        dataSource: tempSource,
        navigatable: false,
        pageable: false,
        columns: [

            { field: "Fk_TaxGlAccountId", hidden: true, format: "{0:c}" },
            { field: "Fk_DiscountGlAccountId", hidden: true, format: "{0:c}" },
            { field: "hdnAttachmentIds", hidden: true, format: "{0:c}" },
            { field: "fK_PaymentTypeId", hidden: true, format: "{0:c}" },
            { field: "paymentTypeName", hidden: true, title: Resources.PaymentTypeResource, format: "{0:c}", width: 150 },
            { field: "fK_GlAccountId", hidden: true, format: "{0:c}", width: 150 },
            { field: "glAccountCode", title: Resources.AccountCodeResource, width: 150 },
            { field: "glAccountName", title: Resources.AccountNameResource, width: 150 },
            { field: "billNumber", title: Resources.BillNumberResource, width: 150 },
            { field: "billDate", width: 150, format: "{0:yyyy/MM/dd}", title: Resources.BillDateResource },
            { field: "billDueDate", width: 150, format: "{0:yyyy/MM/dd}", title: Resources.BillDueDateResource },
            { field: "gross", width: 150, title: Resources.GrossResource },
            { field: "taxesName", width: Resources.AmountWidth, title: Resources.GlAccountTax },
            { field: "fK_TaxesId", hidden: true },
            { field: "taxPercentage", width: 150, title: Resources.TaxPercentageResource },
            { field: "taxValue", width: 150, title: Resources.TaxValueResource },
            { field: "fK_CbDiscountTypeId", hidden: true },
            { field: "isDiscountInclude", hidden: true },
            { field: "isTaxInclude", hidden: true },
            { field: "discountPercentage", width: 150, title: Resources.DiscountPercentageResource },
            { field: "discountValue", width: 150, title: Resources.DiscountValueResource },
            { field: "downPayment", width: 150, title: Resources.DownPaymentResource },
            { field: "remaining", width: 150, title: Resources.RemainingResource },
            { field: "description", width: 150, title: Resources.DescriptionResource },
            { width: "80px", template: "<a  class='btn btn-danger btn-sm btnDelete' ><i class='fas fa-trash-alt'></i></a>" },
            { width: "80px", template: "<button type='button' class='btn btn-success btn-sm btnFiles'><i class='fas fa-paperclip'></i></button>" }
        ],
        editable: false,
        selectable: "multiple, cell",
        reorderable: true,
        groupable: Resources.GridGroupable
        ,
        sortable: Resources.GridSortable,
        resizable: Resources.GridResizable,
        noRecords: Resources.GridNoRecords,
        messages: {
            noRecords: Resources.GridNoRecordsMessage
        },

    });
    gridBound.data("kendoGrid").table.on("click", ".btnDelete", removeBondDetailRow);
    gridBound.data("kendoGrid").table.on("click", ".btnFiles", ShowFiles);

    function ShowFiles() {
        debugger
        var row = $(this).closest("tr"),
            grid = $("#PayNoticeDetailsgrid").data("kendoGrid"),
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
            grid = $("#PayNoticeDetailsgrid").data("kendoGrid"),
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
                var dataSource = $("#PayNoticeDetailsgrid").data("kendoGrid").dataSource;

                if (dataSource.remove(dataItem)) {
                    swal({
                        title: Resources.DeleteSuccessResource,
                        confirmButtonText: Resources.DoneResource,
                        type: "success"
                    });
                    debugger;
                    var totalGross = parseFloat($("#TotalGross").val()),
                        totalDiscount = parseFloat($("#TotalDiscount").val()),
                        totalTaxAmount = parseFloat($("#TotalTaxAmount").val()),
                        totalDownPayment = parseFloat($("#TotalDownPayment").val()),
                        totalRemaining = parseFloat($("#TotalRemaining").val());

                    $("#TotalGross").val(totalGross - dataItem.gross);
                    $("#TotalDiscount").val(totalDiscount - dataItem.discountValue);
                    $("#TotalTaxAmount").val(totalTaxAmount - dataItem.taxValue);
                    $("#TotalDownPayment").val(totalDownPayment - dataItem.downPayment);
                    $("#TotalRemaining").val(totalRemaining - dataItem.remaining);

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
            downPayment = parseFloat($("#DownPayment").val()),
            remaining = parseFloat($("#Remaining").val()),
            description = $("#descriptionDetail").val(),
            referenceId = $("#ReferenceId").val(),
            hdnAttachmentIds = $("#hdnAttachmentIds").val(),
            taxesId = $("#FK_TaxesId").val(),
            discountTypeId = $("#FK_CbDiscountTypeId").val() > 0 ? $("#FK_CbDiscountTypeId").val() : null,
            isDiscountInclude = $('input[type="checkbox"][name=IsDiscountInclude]').prop("checked"),
            isTaxInclude = $('input[type="checkbox"][name=IsTaxInclude]').prop("checked"),
            taxName = $("#TaxName").val();

        if (isNaN(discountPercentage))
            discountPercentage = 0;
        if (isNaN(discountValue))
            discountValue = 0;
        if (isNaN(taxValue))
            taxValue = 0;
        if (isNaN(taxPercentage))
            taxPercentage = 0;
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
        else if (isNaN(downPayment) || downPayment == "") {

            swal({
                title: Resources.EnterRequiredResource + " " + Resources.DownPaymentResource,
                confirmButtonText: Resources.DoneResource,
                type: "error"
            });
        }
        else if (isNaN(gross) || gross == "") {

            swal({
                title: Resources.GrossRequiredResource,
                confirmButtonText: Resources.DoneResource,
                type: "error"
            });
        }
        //else if (isNaN(taxValue) || taxValue == "") {

        //    swal({
        //        title: Resources.TaxRequiredResource,
        //        confirmButtonText: Resources.DoneResource,
        //        type: "error"
        //    });
        //}
        //else if (isNaN(taxPercentage) || taxPercentage == "") {

        //    swal({
        //        title: Resources.TaxPercentageRequiredResource,
        //        confirmButtonText: Resources.DoneResource,
        //        type: "error"
        //    });
        //}

        else {
            tempSource.insert(0, {
                hdnAttachmentIds: hdnAttachmentIds,
                //fK_PaymentTypeId: fK_PaymentTypeId,
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
                totalDownPayment = parseFloat($("#TotalDownPayment").val()),
                totalRemaining = parseFloat($("#TotalRemaining").val());
            $("#TotalGross").val(totalGross + gross);
            $("#TotalDiscount").val(totalDiscount + discountValue);
            $("#TotalTaxAmount").val(totalTaxAmount + taxValue);
            $("#TotalDownPayment").val(totalDownPayment + downPayment);
            $("#TotalRemaining").val(totalRemaining + remaining);
            ClearFormDetails();
        }


    });

    $("#btnViewInvoice").click(function () {

        loadpurchaseReturnInvoiceGrid();
    })

    /*bill grid */
    loadpurchaseReturnInvoiceGrid();
    function loadpurchaseReturnInvoiceGrid() {
        var dataSource = new kendo.data.DataSource({
            transport: {
                read: {
                    url: "/StTransaction/GetInvoiceBySupplierId?id=" + $("#FK_PaySupplierId").val(),
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


        var grid = $("#purchaseReturnInvoiceGrid").kendoGrid({
            excel: {
                fileName: "purchase Return Invoice.xlsx",
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
            grid = $("#purchaseReturnInvoiceGrid").data("kendoGrid"),
            dataItem = grid.dataItem(row);
        $.ajax({
            url: '/StTransaction/GetInvoiceById?id=' + dataItem.id,
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
                $("#Gross").val(invoice.totalPurchasePrice + invoice.totalTax - invoice.totalDiscount);
                $("#DiscountValue").val(invoice.totalDiscount);
                $("#TaxValue").val(invoice.totalTax);

                var taxValue = parseFloat($("#TaxValue").val());
                var DiscountValue = parseFloat($("#DiscountValue").val());
                var gross = parseFloat($("#Gross").val());

                var taxPercentage = (taxValue / gross) * 100;
                $("#TaxPercentage").val(taxPercentage);

                var discountPercentage = (DiscountValue / gross) * 100;
                $("#DiscountPercentage").val(discountPercentage);

                $("#ReferenceId").val(invoice.id);
                if (invoice.totalDiscount > 0) {
                    $("#isDiscountInclude").prop('checked', true);
                    $("#DiscountAccountAutoComplete").prop("disabled", false);
                }
                if (invoice.totalTax == 0)
                    $("#TaxPercentage").val(0);

                $("#isDiscountInclude").prop("disabled", true);
                $("#BillNumber").prop("readonly", true);
                $("#BillDate").prop("readonly", true);
                $("#Gross").prop("readonly", true);
                $("#TaxValue").prop("readonly", true);
                $("#TaxPercentage").prop("readonly", true);
                $("#ViewBillDetail").attr("href", "../../StTransaction/PrintReturnedToClient?id=" + invoice.id);
                $("#ViewBillDetail").show();
                SetRemaining();
                $('#purchase-invoice').modal('toggle');
            },
            error: function (err, xqr, txt) { }
        });
    }
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
    debugger
    var newDate = new Date($(this).val()),
        day = newDate.getDate() + parseInt($("#RepaymentPeriod").val()),
        month = newDate.getMonth(),
        year = newDate.getFullYear();
    newDate = new Date(year, month, day);
    newDate = newDate.getFullYear() + "-" + ("0" + (newDate.getMonth() + 1)).slice(-2) + "-" + ("0" + newDate.getDate()).slice(-2);
    $('#BillDueDate').val(newDate);
});

$("#FK_DefCurrencyId").change(function (e) {
    var BondDate = $("#NoticDate").val();
    var voucherDate = new Date($("#NoticDate").val());
    var DefcurrencyId = parseInt($("#FK_DefCurrencyId").val());
    $.ajax({
        url: "/GlJournalVoucher/GetCurrencyFactorByIdInPeriod?id=" + DefcurrencyId + "&period=" + BondDate /*voucherDate.toUTCString()*/,
        type: "Get",
        contentType: false,
        processData: false,
        success: function (data) {
            debugger;
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

$('#NoticType').change(function () {
    if (this.value == '2') {
        $("#RepaymentPeriod").removeAttr('disabled');
    }
    else {
        $("#RepaymentPeriod").attr("disabled", "disabled");
        $("#RepaymentPeriod").val(parseInt(0));
    }

});



$("#TaxValue").keyup(function () {
    //  SetTaxValue();
    var taxValue = parseFloat($(this).val()),
        gross = parseFloat($("#Gross").val());
    var result = (taxValue / gross) * 100;
    $("#TaxPercentage").val(result);
    SetRemaining();
});

$("#TaxPercentage").keyup(function () {
    SetTaxValue();
    SetRemaining();
});

$("#DiscountValue").keyup(function () {
    var DiscountValue = parseFloat($(this).val()),
        gross = parseFloat($("#Gross").val());
    var result = (DiscountValue / gross) * 100;
    $("#DiscountPercentage").val(result);
    SetRemaining();
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

    if (isNaN(discountValue))
        discountValue = 0;

    if (!isNaN(gross)) {
        SetTaxValue();
        taxValue = parseFloat($("#TaxValue").val());
        if (isNaN(taxValue))
            taxValue = 0;
        var remaining = (gross + taxValue - discountValue - downPayment);
        $("#Remaining").val(remaining);
    }

}

function SetTaxValue() {

    var taxPercentage = parseFloat($("#TaxPercentage").val()),
        gross = parseFloat($("#Gross").val()),
        discountValue = parseFloat($("#DiscountValue").val());

    if (gross > 0) {
        if (!isNaN(gross) && !isNaN(taxPercentage) && !isNaN(discountValue)) {
            var result = (gross - discountValue) * taxPercentage;
            $("#TaxValue").val(result / 100);
        }
        else {
            var result = (gross * taxPercentage) / 100;
            $("#TaxValue").val(result);

        }
    }

}

function SetDiscountValue() {

    var discountPercentage = parseFloat($("#DiscountPercentage").val()),
        gross = parseFloat($("#Gross").val());

    if (!isNaN(discountPercentage) && !isNaN(gross)) {
        var result = (gross * discountPercentage) / 100;
        $("#DiscountValue").val(result);

    }
    else
        $("#DiscountValue").val(0);

    //SetTaxValue();
}

function ClearFormDetails() {
    $("#FK_PaymentTypeId").val("");
    $("#paymentTypeNameAr").val("");
    /*   $("#FK_GlAccountIdDetails").val("");*/
    $("#FK_GlAccountIdDetails").data("kendoDropDownList").value("0");
    $("#accountCode").val("");
    $("#accountNameAr").val("");
    $("#BillNumber").val("");
    $("#Gross").val("");
    $("#TaxPercentage").val("");
    $("#TaxValue").val("");
    $("#TaxName").val("");
    $("#TaxAmount").val("");
    $("#DiscountPercentage").val("");
    $("#DiscountValue").val("");
    $("#DownPayment").val("");
    $("#Remaining").val("");
    $("#descriptionDetail").val("");
    $("#paymentTypeAutoComplete").val("");
    $("#descriptionDetail").val("");

    $("#TaxGlAccountName").val("");

    $("#Fk_DiscountGlAccountId").val("");
    $("#DiscountGlAccountName").val("");
    $("#DiscountAccountAutoComplete").val("");
    $("#hdnAttachmentIds").val("0");
    //$("#FK_PaymentTypeId").val(0);
    //$("#paymentTypeAutoComplete").data("kendoDropDownList").value("0");
    //$("#paymentTypeAutoComplete").data("kendoDropDownList").dataSource.read();

    //$("#Fk_TaxGlAccountId").val(0);

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
                url: "/GlFinancialPeriod/IsDateInOpenPeriod?date=" + $("#NoticDate").val(),
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
    var gridData = $('#PayNoticeDetailsgrid').data("kendoGrid").dataSource.data(),
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
        debugger;
        for (var i = 0; i < gridData.length; i++) {

            var detail = {
                Id: 0,
                //FK_PaymentTypeId: parseInt(gridData[i].fK_PaymentTypeId),
                PaymentTypeName: gridData[i].paymentTypeName,
                FK_GlAccountId: parseInt(gridData[i].fK_GlAccountId),
                Fk_TaxGlAccountId: parseInt(gridData[i].fk_TaxGlAccountId),
                Fk_DiscountGlAccountId: parseInt(gridData[i].fk_DiscountGlAccountId),
                GlAccountName: gridData[i].glAccountName,
                BillNumber: gridData[i].billNumber,
                BillDate: gridData[i].billDate,
                BillDueDate: gridData[i].billDueDate,
                Gross: parseFloat(gridData[i].gross),
                TaxPercentage: parseFloat(gridData[i].taxPercentage),
                TaxValue: parseFloat(gridData[i].taxValue),
                DiscountPercentage: parseFloat(gridData[i].discountPercentage),
                DiscountValue: parseFloat(gridData[i].discountValue),
                DownPayment: parseFloat(gridData[i].downPayment),
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

        if (isNaN(parseInt($("#FK_PaySubSupplierId").val())))
            FK_PaySubSupplierId = null;
        else
            FK_PaySubSupplierId = parseInt($("#FK_PaySubSupplierId").val());

        if (isNaN(parseInt($("#FK_DefFreezingReasonId").val())))
            FK_DefFreezingReasonId = null;
        else
            FK_DefFreezingReasonId = parseInt($("#FK_DefFreezingReasonId").val());

        debugger
        var Obj = {
            Id: 0,
            Serial: $("#Serial").val(),
            NoticType: parseInt($("#NoticType").val()),
            NoticDate: $("#NoticDate").val(),
            RepaymentPeriod: parseInt($("#RepaymentPeriod").val()),
            FK_PaySupplierId: parseInt($("#FK_PaySupplierId").val()),
            FK_PaySubSupplierId: FK_PaySubSupplierId,
            FK_GlAccountId: parseInt($("#FK_GlAccountId").val()),
            FK_CostCenterId: parseInt($("#FK_CostCenterId").val()),
            FK_DefCurrencyId: parseInt($("#FK_DefCurrencyId").val()),
            FK_DefBranchId: parseInt($("#FK_DefBranchId").val()),
            Factor: parseFloat($("#Factor").val()),
            Gross: parseFloat($("#TotalGross").val()),
            Discount: parseFloat($("#TotalDiscount").val()),
            TaxAmount: parseFloat($("#TotalTaxAmount").val()),
            Remaining: parseFloat($("#TotalRemaining").val()),
            DownPayment: parseFloat($("#TotalDownPayment").val()),
            Description: $("#Description").val(),
            IsPosted: isPosted,
            IsActive: isActive,
            FK_DefFreezingReasonId: FK_DefFreezingReasonId,
            FreezingNotes: $("#FreezingNotes").val(),
            ListDetails: listDetails
        };
        debugger;
        $.ajax({
            url: "/PayNotice/Create",
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
                        window.location.href = '/PayNotice/Index';
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

$('#IsDiscountInclude').change(function () {
    if ($(this).prop("checked") == true) {
        $("#discounttab").show();
        $("#DiscountValue").removeAttr('disabled');
        $("#DiscountPercentage").removeAttr('disabled');
        //$("#DiscountAccountAutoComplete").removeAttr('disabled');
        $("#DiscountAccountAutoComplete").data("kendoDropDownList").enable(true);

        //$("#DiscountGlAccountName").removeAttr('disabled');
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
        $("#DiscountPercentage").val(null);
        //$("#DiscountGlAccountName").attr("disabled", "disabled");
    }

});

$("#IsTaxInclude").change(function () {

    if ($(this).prop("checked") == true) {
        $("#taxtab").show();
    }
    else {
        $("#taxtab").hide();

        $("#TaxGlAccountName").val("");
        $("#TaxPercentage").val("");
        $("#TaxValue").val("");
        $("#TaxAmount").val("");
        $("#Fk_TaxGlAccountId").data("kendoDropDownList").value("0");
        $("#Fk_TaxGlAccountId").data("kendoDropDownList").dataSource.read();

        $("#FK_TaxesId").data("kendoDropDownList").value("0");
        $("#FK_TaxesId").data("kendoDropDownList").dataSource.read();
    }

});