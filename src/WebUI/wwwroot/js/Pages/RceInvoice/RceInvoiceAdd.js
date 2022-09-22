$(document).ready(function () {
    var now = new Date(),
        today = now.getFullYear() + "-" + ("0" + (now.getMonth() + 1)).slice(-2) + "-" + ("0" + now.getDate()).slice(-2);
    $('#BillDate').val(today);
    $('#BillDueDate').val(today);
    $('#InviceDate').val(today);
    $("#viewInvoiceDetail").hide();

    $('#DefBranches').change(function () {

        $("#FK_GlAccountId").val(0);
        $("#ClientName").val("");
        $("#clientAutoComplete").data("kendoDropDownList").value(0);
        $("#clientAutoComplete").data("kendoDropDownList").dataSource.read();

        $("#FK_GlAccountIdDetails").data("kendoDropDownList").value(0);
        $("#FK_GlAccountIdDetails").data("kendoDropDownList").dataSource.read();
        //$("#FK_RceSalesTypeId").data("kendoDropDownList").dataSource.read();


        $("#FK_CostCenterId").val(0);
        $("#CostCenterName").val("");
        $("#costCenterAutoComplete").data("kendoDropDownList").value(0);
        $("#costCenterAutoComplete").data("kendoDropDownList").dataSource.read();

        $("#TaxGlAccountName").val("");
        $("#Fk_TaxGlAccountId").data("kendoDropDownList").dataSource.read();

        $("#DiscountGlAccountName").val("");
        $("#DiscountAccountAutoComplete").data("kendoDropDownList").dataSource.read();

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
                    url: "/RceInvoice/GetAllInvoiceTypeForDDL",
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
    $("#clientAutoComplete").kendoDropDownList({
        filter: "contains",
        height: 300,
        dataTextField: "codeAndName",
        dataValueField: "id",
        dataSource: {
            type: "json",
            //serverFiltering: true,
            transport: {
                read: {
                    url: "/RceLookups/GetAllClientsForDDLList",
                },
                parameterMap: function (data, action) {

                    if (action === "read") {
                        if (Object.keys(data).length > 0 && data.filter != undefined && data.filter.filters["length"] > 0) {
                            return {
                                defBranchId: parseInt($("#FK_DefBranchId").val()),
                            };
                        } else {
                            return {
                                defBranchId: parseInt($("#FK_DefBranchId").val()),
                            };
                        }

                    } else {
                        return data;
                    }
                }
            }
        },
        select: onSelectRceClient
    });

    function onSelectRceClient(e) {
        var itmGrid = $("#RceInvoiceDetailsgrid").data("kendoGrid")
        var itmDataSource = $("#RceInvoiceDetailsgrid").data("kendoGrid").dataSource;
        for (var i = 0; itmGrid.dataItems("tr").length; i++) {
            itmDataSource.remove(itmGrid.dataItems("tr")[i])
        }
        ClearFormDetails();
        $("#TotalGross").val(0);
        $("#TotalDiscount").val(0);
        $("#TotalTaxAmount").val(0);
        $("#TotalRemaining").val(0);
        $("#TotalDownPayment").val(0);

        $("#FK_RceClientId").val(e.dataItem.id);
        $("#ClientName").val(e.dataItem.clientNameAr);
        $("#RepaymentPeriod").val(e.dataItem.repaymentPeriod);
        $("#FK_DefCurrencyId").val(e.dataItem.fK_DefCurrencyId);
        $("#FK_GlAccountId").val(e.dataItem.id);
        $("#Factor").val(e.dataItem.factor);
    }
    $("#FK_DefCurrencyId").kendoDropDownList({
        filter: "contains",
        height: 300,
        dataTextField: "codeAndName",
        dataValueField: "id",
        //valueTemplate: '<span class="selected-value"></span><span>' + Resources.Choose + '</span>',
        //template: '<span class="k-state-default" style="margin-left:150px">#: data.code #</span>' +
        //    '<span class="k-state-default">#: data.currencyNameAr #</span>',
        dataSource: {
            type: "json",
            //serverFiltering: true,
            transport: {
                read: {
                    url: "/DefCurrency/GetAllCurrenciesForDDList",
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
        }
    });
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

    $("#FK_RceSalesTypeId").kendoDropDownList({
        filter: "contains",
        height: 300,
        dataTextField: "codeAndName",
        dataValueField: "id",

        dataSource: {
            type: "json",
            //serverFiltering: true,
            transport: {
                read: {
                    url: "/RceLookups/GetAllSalesTypeForDDList",
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
        select: onSelectSalesType
    });
    function onSelectSalesType(e) {
        //$("#FK_RceSalesTypeId").val(e.dataItem.id);
        $("#salesTypeNameAr").val(e.dataItem.typeNameAr);
        $("#FK_GlAccountIdDetails").val(e.dataItem.fK_GlAccountId);
        $("#accountCode").val(e.dataItem.accountCode);
        $("#accountNameAr").val(e.dataItem.accountNameAr);
    }


    //Tax GLAccount autocompleate
    $("#Fk_TaxGlAccountId").kendoDropDownList({
        filter: "contains",
        height: 300,
        dataTextField: "codeAndName",
        dataValueField: "id",
        enable: false,
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
        select: onSelectTaxAccount
    });

    function onSelectTaxAccount(e) {

        $.ajax({
            type: "POST",
            url: "/GlAccount/IsMainAccount?id=" + e.dataItem.id,
            data: "name=John&location=Boston",
            dataType: "json",
            success: function (response) {

                if (response) {

                    $("#Fk_TaxGlAccountId").data("kendoDropDownList").value(0);
                    swal({
                        title: Resources.NoTansactionCanMadeOnMainAccounts,
                        confirmButtonText: Resources.DoneResource,
                        type: "error"
                    });
                } else {
                    $("#TaxGlAccountName").val(e.dataItem.accountNameAr);
                }
            }
        });
    }

    $("#FK_GlAccountIdDetails").kendoDropDownList({
        //minLength: 1,
        dataTextField: "codeAndName",
        dataValueField: "id",
        filter: "contains",
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
        }


    }
    //Discount Account
    $("#Fk_DiscountGlAccountId").kendoDropDownList({
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
        select: onSelectDiscountAccount,
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
                    $("#DiscountGlAccountName").val(e.dataItem.accountNameAr);
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
    var gridBound = $("#RceInvoiceDetailsgrid").kendoGrid({
        dataSource: tempSource,
        navigatable: false,
        pageable: false,
        columns: [
            { field: "referenceId", hidden: true },
            { field: "Fk_TaxGlAccountId", hidden: true, format: "{0:c}" },
            { field: "Fk_DiscountGlAccountId", hidden: true, format: "{0:c}" },
            { field: "hdnAttachmentIds", hidden: true, format: "{0:c}" },
            { field: "fK_RceSalesTypeId", hidden: true, format: "{0:c}" },
            { field: "salesTypeName", hidden: true, title: Resources.SalesTypePageTitleResource, format: "{0:c}", width: 150 },
            { field: "fK_GlAccountId", hidden: true, format: "{0:c}", width: 150 },
            { field: "glAccountCode", title: Resources.AccountCodeResource, width: 150 },
            { field: "glAccountName", title: Resources.AccountNameResource, width: 150 },
            { field: "billNumber", title: Resources.BillNumberResource, width: 150 },
            { field: "billDate", width: 150, title: Resources.BillDateResource },
            { field: "billDueDate", width: 150, title: Resources.BillDueDateResource },
            { field: "gross", width: 150, title: Resources.GrossResource, format: '{0:n2}' },
            { field: "taxesName", width: Resources.AmountWidth, title: Resources.GlAccountTax },
            { field: "fK_TaxesId", hidden: true },
            { field: "taxPercentage", width: 150, title: Resources.TaxPercentageResource, format: '{0:n2}' },
            { field: "taxValue", width: 150, title: Resources.TaxValueResource, format: '{0:n2}' },
            { field: "fK_CbDiscountTypeId", hidden: true },
            { field: "discountPercentage", width: 150, title: Resources.DiscountPercentageResource, format: '{0:n2}' },
            { field: "discountValue", width: 150, title: Resources.DiscountValueResource, format: '{0:n2}' },
            { field: "downPayment", width: 150, title: Resources.DownPaymentResource, format: '{0:n2}' },
            { field: "remaining", width: 150, title: Resources.RemainingResource, format: '{0:n2}' },
            { field: "description", width: 150, title: Resources.DescriptionResource },
            { width: "80px", template: "<a  class='btn btn-danger btn-sm btnDelete' ><i class='fas fa-trash-alt'></i></a>" },
            { width: "80px", template: "<button type='button' class='btn btn-success btn-sm btnFiles'><i class='fas fa-paperclip'></i></button>" }
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
            grid = $("#RceInvoiceDetailsgrid").data("kendoGrid"),
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
            grid = $("#RceInvoiceDetailsgrid").data("kendoGrid"),
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
                var dataSource = $("#RceInvoiceDetailsgrid").data("kendoGrid").dataSource;

                if (dataSource.remove(dataItem)) {
                    swal({
                        title: Resources.DeleteSuccessResource,
                        confirmButtonText: Resources.DoneResource,
                        type: "success"
                    });

                    var totalGross = parseFloat($("#TotalGross").val()),
                        totalDiscount = parseFloat($("#TotalDiscount").val()),
                        totalTaxAmount = parseFloat($("#TotalTaxAmount").val()),
                        totalDownPayment = parseFloat($("#TotalDownPayment").val()),
                        totalRemaining = parseFloat($("#TotalRemaining").val());

                    $("#TotalGross").val((totalGross - dataItem.gross).toFixed(2));
                    $("#TotalDiscount").val((totalDiscount - dataItem.discountValue).toFixed(2));
                    $("#TotalTaxAmount").val((totalTaxAmount - dataItem.taxValue).toFixed(2));
                    $("#TotalDownPayment").val((totalDownPayment - dataItem.downPayment).toFixed(2));
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

        var fK_RceSalesTypeId = $("#FK_RceSalesTypeId").val(),
            salesTypeName = $("#salesTypeNameAr").val(),
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


        //var isAdded = false;
        //var table = $("#RceInvoiceDetailsgrid").data("kendoGrid").dataSource.data();
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

        if (isNaN(downPayment) || downPayment == "")
            downPayment = 0;

        if (isNaN(fK_GlAccountId) || fK_GlAccountId == "" || fK_GlAccountId == "0") {

            swal({
                title: Resources.ChooseSalesTypeResource,
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

        //    swal({
        //        title: Resources.EnterRequiredResource + " " + Resources.DownPaymentResource,
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
                fK_RceSalesTypeId: fK_RceSalesTypeId,
                salesTypeName: salesTypeName,
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
                referenceId: referenceId == "" ? 0 : referenceId,
                fK_TaxesId: taxesId,
                fK_CbDiscountTypeId: discountTypeId,
                taxesName: taxName
            });

            var totalGross = parseFloat($("#TotalGross").val()),
                totalDiscount = parseFloat($("#TotalDiscount").val()),
                totalTaxAmount = parseFloat($("#TotalTaxAmount").val()),
                totalDownPayment = parseFloat($("#TotalDownPayment").val()),
                totalRemaining = parseFloat($("#TotalRemaining").val());
            $("#TotalGross").val((totalGross + gross).toFixed(2));
            $("#TotalDiscount").val((totalDiscount + discountValue).toFixed(2));
            $("#TotalTaxAmount").val((totalTaxAmount + taxValue).toFixed(2));
            $("#TotalDownPayment").val((totalDownPayment + downPayment).toFixed(2));
            $("#TotalRemaining").val((totalRemaining + remaining).toFixed(2));
            ClearFormDetails();
        }


    });

    //client invoices
    $("#btnViewClientInvoices").click(function () {

        if ($("#FK_RceClientId").val() != "") {
            loadClientInvoiceGrid();
            $('#clientRequiredMsg').attr("hidden", true);
        } else {
            $('#clientRequiredMsg').attr("hidden", false);

        }

    });

    //loadClientInvoiceGrid();
    function loadClientInvoiceGrid() {
        var dataSource = new kendo.data.DataSource({
            transport: {
                read: {
                    url: "/StSellInvoice/GetInvoicesByClientId?id=" + $("#FK_RceClientId").val(),
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
                        finalTotal: { editable: false },
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


        var grid = $("#clientInvoicesGrid").kendoGrid({
            excel: {
                fileName: "Client Invoices.xlsx",
                allPages: Resources.GridAllPages,
                filterable: Resources.GridFilterable
            },
            dataSource: dataSource,
            pageSize: 20,
            serverPaging: Resources.GridServerPaging,
            serverFiltering: Resources.GridServerFiltering,
            filterable: Resources.GridFilterable,
            height: 400,
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

                { field: "finalTotal", title: Resources.Total, width: Resources.NameWidth },

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
            grid = $("#clientInvoicesGrid").data("kendoGrid"),
            dataItem = grid.dataItem(row);
        $.ajax({
            url: '/StSellInvoice/GetInvoiceById?id=' + dataItem.id,
            success: function (invoice) {

                var billDate = new Date(invoice.transactionDate),
                    billDueDate = new Date(invoice.dueDate),
                    billDateFormat = billDate.getFullYear() + "-" + ("0" + (billDate.getMonth() + 1)).slice(-2) + "-" + ("0" + billDate.getDate()).slice(-2),
                    billDueDateFormat = billDueDate.getFullYear() + "-" + ("0" + (billDueDate.getMonth() + 1)).slice(-2) + "-" + ("0" + billDueDate.getDate()).slice(-2);

                $("#BillNumber").val(invoice.serialPrefix + invoice.serialNumber)
                $("#BillDate").val(billDateFormat);
                $("#BillDueDate").val(billDueDateFormat);
                $("#DownPayment").val(invoice.totalPaid);
                $("#Gross").val(invoice.totalSalesPrice + invoice.totalDiscount - invoice.totalTax);
                $("#DiscountValue").val(invoice.totalDiscount);
                $("#TaxValue").val(invoice.totalTax);
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
                $("#viewInvoiceDetail").attr("href", "../../StSellInvoice/PrintSellInvoice?id=" + invoice.id);
                $("#viewInvoiceDetail").show();
                SetRemaining();

                //var remaining = (invoice.totalSalesPrice - invoice.totalPaid);
                //$("#Remaining").val(remaining);
                SetTaxPercentage();
                SetDiscountPercentage();
                $('#client-invoices').modal('toggle');
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
        gross = parseFloat($("#Gross").val());
    var result = (DiscountValue / gross) * 100;
    $("#DiscountPercentage").val(result);
    SetRemaining();
    SetTaxValue();
});

$("#DiscountPercentage").keyup(function () {
    SetDiscountValue()
    SetRemaining();
    SetTaxValue();
});

$("#DownPayment,#Gross").keyup(function () { SetRemaining(); SetTaxValue(); SetDiscountValue() });

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
    if (!isNaN(gross) && !isNaN(taxPercentage) && !isNaN(discountValue)) {
        if ($("#IsAmountIncluldeTax").prop("checked") == true && gross > 0) {
            var grossWithoutTax = parseFloat((gross - discountValue) / (1 + (taxPercentage / 100))).toFixed(2);
            var result = parseFloat(gross - grossWithoutTax).toFixed(2);
            $("#TaxValue").val(result);
        }
        else {
            var result = (gross - discountValue) * (taxPercentage / 100);
            $("#TaxValue").val(result.toFixed(2));
        }

    } else {
        if ($("#IsAmountIncluldeTax").prop("checked") == true && gross > 0) {
            var grossWithoutTax = parseFloat(gross / (1 + (taxPercentage / 100))).toFixed(2);
            var result = parseFloat(gross - grossWithoutTax).toFixed(2);
            $("#TaxValue").val(result);
        }
        else {
            var result = (gross * taxPercentage) / 100;
            $("#TaxValue").val(result.toFixed(2));
        }
    }

    //else
    //    $("#TaxValue").val(0);

}
function SetTaxPercentage() {

    //  SetTaxValue();
    var taxValue = parseFloat($("#TaxValue").val()),
        gross = parseFloat($("#Gross").val());
    var result = (taxValue / gross) * 100;
    $("#TaxPercentage").val(result.toFixed(2));


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
    //var discountPercentage = parseFloat($("#DiscountPercentage").val()),
    //    gross = parseFloat($("#Gross").val());

    //if (!isNaN(discountPercentage) && !isNaN(gross)) {
    //    var result = gross / discountPercentage;
    //    $("#DiscountValue").val(result.toFixed(2));

    //}
    //else
    //    $("#DiscountValue").val(0);

    //SetTaxValue();
}
function SetDiscountPercentage() {

    var DiscountValue = parseFloat($("#DiscountValue").val()),
        gross = parseFloat($("#Gross").val());
    var result = (DiscountValue / gross) * 100;
    $("#DiscountPercentage").val(result.toFixed(2));
}

function ClearFormDetails() {
    $("#FK_RceSalesTypeId").val("");
    $("#salesTypeAutoComplete").val("");
    $("#salesTypeNameAr").val("");
    /*  $("#FK_GlAccountIdDetails").val("");*/
    $("#FK_GlAccountIdDetails").data("kendoDropDownList").value("0");
    $("#accountCode").val("");
    $("#accountNameAr").val("");
    $("#BillNumber").val("");
    $("#Gross").val("");
    $("#TaxPercentage").val("");
    $("#TaxName").val("");
    $("#TaxValue").val("");
    $("#TaxAmount").val("");
    $("#DiscountPercentage").val("");
    $("#DiscountValue").val("");
    $("#DownPayment").val("");
    $("#Remaining").val("");
    $("#descriptionDetail").val("");
    $("#paymentTypeAutoComplete").val("");
    $("#descriptionDetail").val("");
    // $("#Fk_TaxGlAccountId").val("");
    $("#TaxGlAccountName").val("");
    $("#Fk_DiscountGlAccountId").val("");
    $("#DiscountGlAccountName").val("");
    $("#DiscountAccountAutoComplete").val("");
    $("#hdnAttachmentIds").val("0");
    //$("#purchaseInvoice").val("");
    //$("#ReferenceSerial").val("");
    $("#ReferenceId").val("");
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
    $("#viewInvoiceDetail").hide();

    //$("#FK_RceSalesTypeId").data("kendoDropDownList").value(0);
    //$("#FK_RceSalesTypeId").data("kendoDropDownList").dataSource.read();
    $("#Fk_TaxGlAccountId").data("kendoDropDownList").value(0);
    $("#Fk_TaxGlAccountId").data("kendoDropDownList").dataSource.read();

    $("#FK_TaxesId").data("kendoDropDownList").value("0");
    $("#FK_TaxesId").data("kendoDropDownList").dataSource.read();

    $("#Fk_DiscountGlAccountId").data("kendoDropDownList").value(0);
    $("#Fk_DiscountGlAccountId").data("kendoDropDownList").dataSource.read();

    $("#FK_CbDiscountTypeId").data("kendoDropDownList").value("0");
    $("#FK_CbDiscountTypeId").data("kendoDropDownList").dataSource.read();
}

function checkPeriodAndSubmitRceInvoiceCreate() {

    var openedPeriodCount = 0;
    $.ajax({
        url: "/GlFinancialPeriod/GetOpenPeriodsCount",
        type: "Get",
        contentType: false,
        processData: false,
        success: function (result) {

            openedPeriodCount = result;
            $.ajax({
                url: "/GlFinancialPeriod/IsDateInOpenPeriod?date=" + $("#InviceDate").val(),
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
                                SubmitRceInvoiceCreate();
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
                        SubmitRceInvoiceCreate();
                    }
                }
            });
        }
    });


}

function SubmitRceInvoiceCreate() {

    var listDetails = [];
    var gridData = $('#RceInvoiceDetailsgrid').data("kendoGrid").dataSource.data(),
        rceSubClient = $("#FK_RceSubClientId").val();
    rceClient = $("#FK_RceClientId").val();
    if ((isNaN(rceClient) || rceClient == "0" || rceClient == "") && (isNaN(rceSubClient) || rceSubClient == "0" || rceSubClient == "")) {
        swal({
            title: Resources.ChooseClientResource,
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
                FK_RceSalesTypeId: parseInt(gridData[i].fK_RceSalesTypeId),
                SalesTypeName: gridData[i].salesTypeName,
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
                hdnAttachmentIds: gridData[i].hdnAttachmentIds,
                ReferenceId: parseInt(gridData[i].referenceId),
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
            InviceDate: $("#InviceDate").val(),
            RepaymentPeriod: parseInt($("#RepaymentPeriod").val()),
            FK_RceClientId: parseInt($("#FK_RceClientId").val()),
            FK_RceSubClientId: parseInt($("#FK_RceSubClientId").val()),
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
            FK_DefFreezingReasonId: parseInt($("#FK_DefFreezingReasonId").val()),
            FreezingNotes: $("#FreezingNotes").val(),
            ListDetails: listDetails
        };
        debugger
        $.ajax({
            url: "/RceInvoice/Create",
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
                        window.location.href = '/RceInvoice/Index';
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
        $("#Fk_DiscountGlAccountId").data("kendoDropDownList").enable(true);

        //$("#DiscountGlAccountName").removeAttr('disabled');
    }
    else {
        $("#discounttab").hide();
        $("#DiscountValue").attr("disabled", "disabled");
        $("#DiscountPercentage").attr("disabled", "disabled");
        //$("#DiscountAccountAutoComplete").attr("disabled", "disabled");
        $("#Fk_DiscountGlAccountId").data("kendoDropDownList").enable(false);
        $("#Fk_DiscountGlAccountId").data("kendoDropDownList").value("0");
        $("#FK_CbDiscountTypeId").data("kendoDropDownList").value("0");
        $("#FK_CbDiscountTypeId").data("kendoDropDownList").dataSource.read();

        $("#DiscountGlAccountName").val(null);

        $("#DiscountValue").val(null);
        $("#DiscountPercentage").val(null);
        //$("#DiscountGlAccountName").attr("disabled", "disabled");
    }
    SetDiscountValue()
    SetRemaining();
    SetTaxValue();

});

$("#IsTaxInclude").change(function () {

    if ($(this).prop("checked") == true) {
        $("#taxtab").show();
        $("#IsAmountIncluldeTax").prop('checked', false);
        $('#IsAmountIncluldeTax').prop("disabled", false);
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

        $("#IsAmountIncluldeTax").prop('checked', false);
        $('#IsAmountIncluldeTax').prop("disabled", true);
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