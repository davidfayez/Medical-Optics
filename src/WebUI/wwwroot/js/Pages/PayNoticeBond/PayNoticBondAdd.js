$(document).ready(function () {

    $('#DefBranches').change(function () {
        $("#FK_DefCurrencyId").data("kendoDropDownList").value("0");
        $("#FK_DefCurrencyId").data("kendoDropDownList").dataSource.read();

        $("#FK_GlAccountId").data("kendoDropDownTree").value("0");
        $("#FK_GlAccountId").data("kendoDropDownTree").dataSource.read();

        $("#FK_PaySupplierId").val(0);
        $("#FK_PaySupplierId").data("kendoDropDownList").value("0");
        $("#FK_PaySupplierId").data("kendoDropDownList").dataSource.read();

    });

    $("#NoticeType").kendoDropDownList({
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

    //Supplier AutoComplete
    var supplierCodeDataSource = new kendo.data.DataSource({
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
    $("#FK_PaySupplierId").kendoDropDownList({

        dataSource: supplierCodeDataSource,
        select: onSelectSupplier,
        dataTextField: "codeAndName",
        dataValueField: "id",
        filter: "contains",
        minLength: 1
    });
    function onSelectSupplier(e) {
        loadPayNoticeBondDetailsGrid(e.dataItem.id);

        $("#TotalAmount").val(0);
        $("#TotalTaxAmount").val(0);
        $("#txtGross").val(0)
    }
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
        //select: onSelectDefCurrency
    });
    //Currency Factor
    $("#FK_DefCurrencyId").change(function (e) {
        var NoticeDate = $("#NoticeDate").val();
        var voucherDate = new Date($("#BondDate").val());
        var DefcurrencyId = parseInt($("#FK_DefCurrencyId").val());
        $.ajax({
            url: "/GlJournalVoucher/GetCurrencyFactorByIdInPeriod?id=" + DefcurrencyId + "&period=" + NoticeDate,
            type: "Get",
            contentType: false,
            processData: false,
            success: function (data) {
                debugger;
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
    });

    // DdlTree For Gl Account
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
    $("#FK_GlAccountId").kendoDropDownTree({
        placeholder: Resources.Choose,
        dataSource: dataSourceDdlTree,
        height: 300,
        dataTextField: "codeAndName",
        dataValueField: "id",
        filter: "contains",
        autoClose: false,
    });






    loadPayNoticeBondDetailsGrid(parseInt($("#FK_PaySupplierId").val()));

    function loadPayNoticeBondDetailsGrid(suppId) {

        var dataSource = new kendo.data.DataSource({
            serverPaging: false,
            serverSorting: false,
            transport: {
                read: {
                    url: "/PayNoticeBond/GetAllPayInvoices?supplierId=" + suppId + "&dateFrom=" + $("#DateFrom").val() + "&dateTo=" + $("#DateTo").val() + "&branchId=" + parseInt($("#FK_DefBranchId").val()),
                    Type: "GET"
                }
            },
            error: function (e) {
                alert("Status: " + e.status + "; Error message: " + e.errorThrown);
            },
            /*  pageSize: 10,*/

            schema: {
                model: {
                    id: "id",
                    fields: {
                        isActive: { editable: true },
                        id: { editable: false },
                        fK_PaymentTypeId: { editable: false },
                        paymentTypeName: { editable: false },
                        fK_GlAccountId: { editable: false },
                        glAccountName: { editable: false },
                        billNumber: { editable: false },
                        billDate: { type: "date", editable: false },
                        billDueDate: { type: "date", editable: false },
                        description: { editable: false },
                        gross: { editable: false },
                        taxPercentage: { editable: false },
                        taxValue: { editable: false },
                        fk_TaxGlAccountId: { editable: false },
                        discountPercentage: { editable: false },
                        discountValue: { editable: false },
                        fk_DiscountGlAccountId: { editable: false },
                        downPayment: { editable: false },
                        remaining: { editable: false },
                        invoicePaidAmount: { editable: false },
                        remainingAfterPayment: { editable: false },
                        fK_TaxesId: { editable: false },
                        fK_CbDiscountTypeId: { editable: false },
                        taxesName: { editable: false },

                        returnedTaxAmount: { editable: true },
                        returnedAmount: { editable: true },
                        isFullyReturned: { editable: true },
                        remaining: { editable: true },
                        isChecked: { editable: true },
                    }
                }
            }
        });
        var grid = $("#GridNoticeDetail").kendoGrid({
            //excel: {
            //    fileName: "Supplier Opening Balances.xlsx",
            //    allPages: Resources.GridAllPages,
            //    filterable: Resources.GridFilterable
            //},
            dataSource: dataSource,
            editable: "incell",
            height: 550,
            groupable: Resources.GridGroupable
            ,
            /* pageable: false,*/
            serverPaging: false,
            serverSorting: false,
            sortable: Resources.GridSortable,
            resizable: Resources.GridResizable,
            noRecords: Resources.GridNoRecords,
            messages: {
                noRecords: Resources.GridNoRecordsMessage
            },
            //pageable: {
            //    pageSizes: [10, 20, 50, Resources.All],
            //    numeric: Resources.GridNumeric,
            //    //refresh: Resources.GridRefresh,

            //},

            columns: [
                { field: "returnedTaxAmount", hidden: true },
                { field: "returnedAmount", hidden: true },
                { width: "90px", template: "<input type='checkbox' class= 'control-label i-check btnCheckInvoice' data-bind='checked:isChecked'/>" },
                { field: "billNumber", title: Resources.BillNumberResource, width: "150px" },
                { field: "gross", title: Resources.TotalAmountResource, width: "150px" },
              
                // { field: "downPayment", title: Resources.ReferenceDownPaymentResource, width: "150px" },
                { field: "taxValue", title: Resources.TaxValueResource, width: "150px" },
                { field: "discountValue", title: Resources.DiscountResource, width: "150px" },
                { field: "remaining", title: Resources.BondTotalAmountResource, width: "150px" },
                { field: "invoicePaidAmount", title: Resources.PaidAmount, width: "150px" },
                { field: "remainingAfterPayment", title: Resources.RemainingAfterPayment, width: "150px" },

                {
                    field: "billDate", title: Resources.CreationDateResource, format: "{0:yyyy/MM/dd}", width: "150px",
                    filterable: {
                        operators: {
                            date: {
                                gte: Resources.IsAfterOrEqualTo,
                                lte: Resources.IsBeforeOrEqualTo
                            }
                        },
                        extra: false,
                        ui: function (element) {
                            element.kendodatepicker({
                                format: '{0: dd/mm/yyyy}'
                            })
                        }
                    }
                },
            ],
            dataBound: function (e) {
                e.sender.items().each(function () {
                    var dataItem = e.sender.dataItem(this);
                    kendo.bind(this, dataItem);
                    if (dataItem.isActive) {
                    }
                });
            }
        });
        grid.data("kendoGrid").table.off('click').on("click", ".btnCheckInvoice", onCheckDetail);
    }
    var thisRow = null;
    var rowchecked = false;
    function onCheckDetail(e) {

        thisRow = this;
        var row = $(this).closest("tr"),
            grid = $("#GridNoticeDetail").data("kendoGrid"),
            dataItemRow = grid.dataItem(row);

        if ($(this).is(':checked'))
            rowchecked = true;
        else
            rowchecked = false;

        if (rowchecked) {

            $(".btnCheckInvoice").prop("checked", false);
            dataItemRow.set('isChecked', false);
            $('#confirmModal').modal('toggle');
        } else {
            var returnedTaxAmount = isNaN(parseFloat(dataItemRow.returnedTaxAmount)) ? 0 : parseFloat(dataItemRow.returnedTaxAmount),
                returnedAmount = isNaN(parseFloat(dataItemRow.returnedAmount)) ? 0 : parseFloat(dataItemRow.returnedAmount),
                totalTaxAmount = isNaN(parseFloat($("#TotalTaxAmount").val())) ? 0 : parseFloat($("#TotalTaxAmount").val()),
                totalAmount = isNaN(parseFloat($("#TotalAmount").val())) ? 0 : parseFloat($("#TotalAmount").val());

            totalAmount -= returnedAmount;
            totalTaxAmount -= returnedTaxAmount;

            $(".btnCheckInvoice").prop("checked", false);
            dataItemRow.set('isChecked', false);

            dataItemRow.set('isFullyReturned', false);
            dataItemRow.set('returnedTaxAmount', 0);
            dataItemRow.set('returnedAmount', 0);
            $("#TotalAmount").val(totalAmount.toFixed(2));
            $("#TotalTaxAmount").val(totalTaxAmount.toFixed(2));
            setTxtGross();
        }
    }


    $("#btnReturnSave").on('click', function () {
        var isFullyRepayment = $("input[name='isFullyRepayment']:checked").val();

        var row = $(thisRow).closest("tr"),
            grid = $("#GridNoticeDetail").data("kendoGrid"),
            dataItemRow = grid.dataItem(row),
            gross = isNaN(parseFloat(dataItemRow.gross)) ? 0 : parseFloat(dataItemRow.gross),
            remaining = isNaN(parseFloat(dataItemRow.remaining)) ? 0 : parseFloat(dataItemRow.remaining),
            //taxValue = isNaN(parseFloat(dataItemRow.taxValue)) ? 0 : parseFloat(dataItemRow.taxValue),
            taxPercentage = isNaN(parseFloat(dataItemRow.taxPercentage)) ? 0 : parseFloat(dataItemRow.taxPercentage),
            returnedTaxAmount = isNaN(parseFloat(dataItemRow.returnedTaxAmount)) ? 0 : parseFloat(dataItemRow.returnedTaxAmount),
            returnedAmount = isNaN(parseFloat(dataItemRow.returnedAmount)) ? 0 : parseFloat(dataItemRow.returnedAmount),
            partialValue = isNaN(parseFloat($("#partialValue").val())) ? 0 : parseFloat($("#partialValue").val()),
            //txtGross = parseFloat($("#txtGross").val()),
            totalTaxAmount = isNaN(parseFloat($("#TotalTaxAmount").val())) ? 0 : parseFloat($("#TotalTaxAmount").val()),
            totalAmount = isNaN(parseFloat($("#TotalAmount").val())) ? 0 : parseFloat($("#TotalAmount").val());


        if (isFullyRepayment == "true") {
            var taxValue = gross * taxPercentage,
                taxValue = taxValue / 100;

            totalAmount += gross;
            totalTaxAmount += taxValue;


            $("#TotalAmount").val(totalAmount.toFixed(2));
            $("#TotalTaxAmount").val(totalTaxAmount.toFixed(2));
            setTxtGross();

            $(".btnCheckInvoice").prop("checked", true);
            dataItemRow.set('isChecked', true);

            dataItemRow.set('isFullyReturned', true);
            dataItemRow.set('returnedTaxAmount', taxValue);
            dataItemRow.set('returnedAmount', gross);
            $('#confirmModal').modal('toggle');

        }
        else {

            if (partialValue <= 0) {
                swal({
                    title: Resources.EnterRequiredResource + " " + Resources.PartialValue,
                    confirmButtonText: Resources.DoneResource,
                    type: "error"
                });
            }
            else if (partialValue >= gross) {
                swal({
                    title: Resources.PartialValueMustLessThanInvoiceAmount,
                    confirmButtonText: Resources.DoneResource,
                    type: "error"
                });
            }
            else {

                var taxValue = partialValue * taxPercentage,
                    taxValue = taxValue / 100;

                totalAmount += partialValue;
                totalTaxAmount += taxValue;


                $("#TotalAmount").val(totalAmount.toFixed(2));
                $("#TotalTaxAmount").val(totalTaxAmount.toFixed(2));
                setTxtGross();

                $(".btnCheckInvoice").prop("checked", true);
                dataItemRow.set('isChecked', true);

                dataItemRow.set('isFullyReturned', false);
                dataItemRow.set('returnedTaxAmount', taxValue.toFixed(2));
                dataItemRow.set('returnedAmount', partialValue.toFixed(2));
                $('#confirmModal').modal('toggle');

            }

        }

        $("#partialValue").val(null);


    });

    $("input[name='isFullyRepayment']").on('click', function () {

        if ($("input[name='isFullyRepayment']:checked").val() == "true")
            $("#partialValue").attr("disabled", "disabled");
        else
            $("#partialValue").removeAttr('disabled');

        $("#partialValue").val(null);
    });

    $("#btnClose").on('click', function () {
        if ($("input[name='isFullyRepayment']:checked").val() == "true")
            $("#partialValue").attr("disabled", "disabled");
        else
            $("#partialValue").removeAttr('disabled');

        $("#partialValue").val(null);
    });

    function setTxtGross() {
        var txtGross = 0,
            totalTaxAmount = isNaN(parseFloat($("#TotalTaxAmount").val())) ? 0 : parseFloat($("#TotalTaxAmount").val()),
            totalAmount = isNaN(parseFloat($("#TotalAmount").val())) ? 0 : parseFloat($("#TotalAmount").val());

        txtGross = totalTaxAmount + totalAmount;
        $("#txtGross").val(txtGross.toFixed(2))
    }

});

function checkPeriodAndSaveNoticeBond() {

    var openedPeriodCount = 0;
    $.ajax({
        url: "/GlFinancialPeriod/GetOpenPeriodsCount",
        type: "Get",
        contentType: false,
        processData: false,
        success: function (result) {

            openedPeriodCount = result;
            $.ajax({
                url: "/GlFinancialPeriod/IsDateInOpenPeriod?date=" + $("#NoticeDate").val(),
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
                                SubmitPayNoticeBondCreate();
                            }, 1000);
                        });
                    }
                    else if (!result) {
                        swal({
                            title: Resources.NoticeDateOutsideOpenPeriods,
                            confirmButtonText: Resources.CancelResource,
                            type: "error"
                        }, function () {
                        });

                    } else {
                        SubmitPayNoticeBondCreate();
                    }
                }
            });
        }
    });


}

function SubmitPayNoticeBondCreate() {

    var listDetails = [];
    var grid = $("#GridNoticeDetail").data("kendoGrid");
    var gridData = $('#GridNoticeDetail').data("kendoGrid").dataSource.data(),
        paySupplierAccountId = $("#FK_PaySupplierId").val(),//supplier accountId
        fK_DefCurrencyId = $("#FK_DefCurrencyId").val(),
        fK_GlAccountId = $("#FK_GlAccountId").val();


    if (isNaN(fK_DefCurrencyId) || fK_DefCurrencyId == "0" || fK_DefCurrencyId == "") {
        swal({
            title: Resources.Choose + " " + Resources.Currency,
            confirmButtonText: Resources.DoneResource,
            type: "error"
        });
    }
    else if (isNaN(paySupplierAccountId) || paySupplierAccountId == "0" || paySupplierAccountId == "") {
        swal({
            title: Resources.Choose + " " + Resources.Supplier,
            confirmButtonText: Resources.DoneResource,
            type: "error"
        });
    }
    else if (isNaN(fK_GlAccountId) || fK_GlAccountId == "0" || fK_GlAccountId == "") {
        swal({
            title: Resources.Choose + " " + Resources.Account,
            confirmButtonText: Resources.DoneResource,
            type: "error"
        });
    }

    else {
        debugger
        for (var i = 0; i < gridData.length; i++) {
            var currentUid = gridData[i].uid;
            var currentRow = grid.table.find("tr[data-uid='" + currentUid + "']");
            var dataitem = grid.dataItem(currentRow);

            if (dataitem.isChecked) {

                var detail = {
                    Id: 0,
                    FK_PaymentTypeId: parseInt(gridData[i].fK_PaymentTypeId),
                    paymentTypeName: gridData[i].paymentTypeName,
                    IsFullyReturned: gridData[i].isFullyReturned,
                    ReturnedAmount: parseFloat(gridData[i].returnedAmount),
                    ReturnedTaxAmount: parseFloat(gridData[i].returnedTaxAmount),
                    FK_GlAccountId: parseInt(gridData[i].fK_GlAccountId),
                    GlAccountName: gridData[i].glAccountName,
                    BillNumber: gridData[i].billNumber,
                    BillDate: gridData[i].billDate,
                    BillDueDate: gridData[i].billDueDate,
                    Description: gridData[i].description,
                    Gross: parseFloat(gridData[i].gross),
                    TaxPercentage: isNaN(parseFloat(gridData[i].taxPercentage)) ? null : parseFloat(gridData[i].taxPercentage),
                    TaxValue: isNaN(parseFloat(gridData[i].taxValue)) ? null : parseFloat(gridData[i].taxValue),
                    Fk_TaxGlAccountId: isNaN(parseInt(gridData[i].fk_TaxGlAccountId)) ? null : parseInt(gridData[i].fk_TaxGlAccountId),
                    DiscountPercentage: isNaN(parseFloat(gridData[i].discountPercentage)) ? null : parseFloat(gridData[i].discountPercentage),
                    DiscountValue: isNaN(parseFloat(gridData[i].discountValue)) ? null : parseFloat(gridData[i].discountValue),
                    Fk_DiscountGlAccountId: isNaN(parseInt(gridData[i].fk_DiscountGlAccountId)) ? null : parseInt(gridData[i].fk_DiscountGlAccountId),
                    Remaining: parseInt(gridData[i].remaining),
                    FK_TaxesId: isNaN(parseInt(gridData[i].fK_TaxesId)) ? null : parseInt(gridData[i].fK_TaxesId),
                    FK_CbDiscountTypeId: isNaN(parseInt(gridData[i].fK_CbDiscountTypeId)) ? null : parseInt(gridData[i].fK_CbDiscountTypeId),
                    TaxesName: gridData[i].taxesName,
                    FK_InvoiceDetailId: parseInt(gridData[i].fK_InvoiceDetailId),

                };
                listDetails.push(detail);
            }

        }

        var isPosted = $("input[name='IsPosted']:checked").val();

        if (isPosted == "true")
            isPosted = true;
        else
            isPosted = false;

        debugger
        if (listDetails.length == 0) {
            swal({
                title: Resources.GridLengthZeroChooseResource,
                confirmButtonText: Resources.DoneResource,
                type: "error"
            });
        }
        else {
            var Obj = {
                Id: 0,
                FK_PaySupplierId: 0,//get from server from FK_PaySupplierGlAccountId
                Serial: parseInt($("#Serial").val()),
                NoticeDate: $("#NoticeDate").val(),
                NoticeType: parseInt($("#NoticeType").val()),
                FK_DefCurrencyId: parseInt(fK_DefCurrencyId),
                FK_GlAccountId: parseInt(fK_GlAccountId),
                FK_PaySupplierGlAccountId: parseInt(paySupplierAccountId),
                IsPosted: isPosted,
                CurrencyFactor: parseFloat($("#CurrencyFactor").val()),
                TotalAmount: parseFloat($("#TotalAmount").val()),
                TotalTaxAmount: parseFloat($("#TotalTaxAmount").val()),
                Description: $("#Description").val(),
                FK_DefBranchId: parseInt($("#FK_DefBranchId").val()),
                ListDetails: listDetails
            };

            $.ajax({
                url: "/PayNoticeBond/Create",
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
                            window.location.href = '/PayNoticeBond/Index';
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

}