$().ready(function () {

    $('#DefBranches').change(function () {
        $("#FK_DefCurrencyId").data("kendoDropDownList").value("0");
        $("#FK_DefCurrencyId").data("kendoDropDownList").dataSource.read();

        $("#FK_GlAccountId").data("kendoDropDownList").value("0");
        $("#FK_GlAccountId").data("kendoDropDownList").dataSource.read();

        $("#FK_PaySupplierId").val(0);
        $("#FK_PaySupplierId").data("kendoDropDownList").value("0");
        $("#FK_PaySupplierId").data("kendoDropDownList").dataSource.read();

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
        debugger
        $("#FK_PaySupplierId").val(e.dataItem.id);
        $("#SupplierName").val(e.dataItem.supplierNameAr);

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
        var BondDate = $("#BondDate").val();
        var voucherDate = new Date($("#BondDate").val());
        var DefcurrencyId = parseInt($("#FK_DefCurrencyId").val());
        $.ajax({
            url: "/GlJournalVoucher/GetCurrencyFactorByIdInPeriod?id=" + DefcurrencyId + "&period=" + BondDate,
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
                    url: function () {
                        if ($('#showAllAccounts').is(':checked')) {
                            return "/GlAccount/GetAllAccountsForDDList"
                        } else {
                            return "/CbCashAndBankAccount/GetGlAccountsForCashAndBank"
                        }
                    },
                    //  url: "/CbCashAndBankAccount/GetGlAccountsForCashAndBank",//GetAllAccountsForDDLTree",
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
        // select: onCashAndBankSelect
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
    $("#accountsDDLTree").kendoDropDownTree({
        placeholder: Resources.Choose,
        dataSource: dataSourceDdlTree,
        height: 300,
        dataTextField: "codeAndName",
        dataValueField: "id",
        filter: "contains",
        autoClose: false,
    });

    $("#FK_BankId").kendoDropDownList({
        filter: "contains",
        height: 300,
        dataTextField: "codeAndName",
        dataValueField: "id",
        dataSource: {
            type: "json",
            //serverFiltering: true,
            transport: {
                read: {
                    url: "/CbBank/GetAllBanksForDDList",
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

    $('input[type=radio][name=FK_CbPaymentTypeId]').change(function () {
        if (this.value == 2) {
            $("#CheckNumber").removeAttr("disabled");
            $("#CheckDate").removeAttr("disabled");
            $("#FK_BankId").removeAttr("disabled");
        }
        else {
            $("#CheckNumber").attr("disabled", "disabled");
            $("#CheckDate").attr("disabled", "disabled");
            $("#FK_BankId").attr("disabled", "disabled");
        }
    });

    loadPayRepaymentDetailsGrid();

    function loadPayRepaymentDetailsGrid() {
        var dataSource = new kendo.data.DataSource({
            transport: {
                read: {
                    url: "/PayRepayment/GetAllPayReference",
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
                        isActive: { editable: true },
                        id: { editable: false },
                        fK_PayRepaymentId: { editable: false },
                        fK_RefMasterId: { editable: false },
                        fK_ReferenceId: { editable: false },
                        referenceSerial: { editable: false },
                        referenceDate: { type: "date", editable: false },
                        payReferenceType: { editable: false },
                        payReferenceName: { editable: false },
                        referenceGross: { editable: false },
                        referenceRemaining: { editable: false },
                        referenceDownPayment: { editable: false },
                        referenceDiscount: { editable: false },
                        referenceTax: { editable: false },
                        repaymentAmount: { editable: false },
                        isFullyRepayment: { editable: false },
                        remaining: { editable: true },
                        isChecked: { editable: true },
                    }
                }
            }
        });
        var grid = $("#GridPayRepayment").kendoGrid({
            excel: {
                fileName: "Supplier Opening Balances.xlsx",
                allPages: Resources.GridAllPages,
                filterable: Resources.GridFilterable
            },
            dataSource: dataSource,
            editable: "incell",
            height: 550,
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
                { field: "remaining", hidden: true },
                { width: "90px", template: "<input type='checkbox' class= 'control-label i-check btnCheck' data-bind='checked:isChecked'/>" },
                { field: "payReferenceName", title: Resources.PayBondTypeResource, width: "150px" },
                { field: "referenceGross", title: Resources.TotalAmountResource, width: "150px" },
                { field: "referenceRemaining", title: Resources.BondTotalAmountResource, width: "150px" },
                { field: "referenceDownPayment", title: Resources.ReferenceDownPaymentResource, width: "150px" },
                { field: "referenceDiscount", title: Resources.DiscountResource, width: "150px" },
                {
                    field: "referenceDate", title: Resources.CreationDateResource, format: "{0:yyyy/MM/dd}", width: "150px",
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
        grid.data("kendoGrid").table.on("click", ".btnCheck", onCheckDetail);
    }
    function NumberToText(number, currencyId) {

        $.ajax({
            url: "/CbExchangeBond/NumberToText?number=" + number + "&currencyId=" + currencyId,
            type: "Post",
            cache: false,
            processData: false,
            contentType: 'application/json',
            success: function (result) {

                if (result != null)
                    $("#TotalAmountText").val(result);
                else
                    $("#TotalAmountText").val(null);
            }
        });
    }
});


var payBondFound = false;
$("#btnSearch").on('click', function () {
    debugger
    var supplierId = parseInt($("#FK_PaySupplierId").val()),
        refrencyType = parseInt($("#PayReferenceTypeId").val()),
        payBondSerial = parseInt($("#PayBondSerial").val()),
        dateFrom = $("#DateFrom").val(),
        dateTo = $("#DateTo").val();
    if (isNaN(refrencyType) || refrencyType == "")
        refrencyType = null;

    if (isNaN(supplierId) || supplierId == "") {
        swal({
            title: Resources.ChooseSupplierResource,
            confirmButtonText: Resources.DoneResource,
            type: "error"
        });
    }
    else if (!isNaN(payBondSerial)) {
        $.ajax({
            type: "POST",
            url: "/PayBond/CheckPayBondExchangeExist?serial=" + payBondSerial,
            data: "name=John&location=Boston",
            dataType: "json",
            success: function (response) {
                debugger
                if (response != null) {
                    payBondFound = true;
                    $("#BondTotalAmount").val(response.totalAmount);
                    $("#FK_PayBondId").val(response.id);
                    $("#PayBondDate").val(response.bondDate);
                    $("#BalnceAfterRepayment").val(response.totalAmount);
                    $('#GridPayRepayment').data('kendoGrid').dataSource.read({ supplierId: supplierId, refrencyType: refrencyType, dateFrom: dateFrom, dateTo: dateTo });

                } else {
                    $("#BondTotalAmount").val(null);
                    $("#FK_PayBondId").val(null);
                    $("#PayBondDate").val(null);


                    swal({
                        title: Resources.PayBondNotFoundResource,
                        confirmButtonText: Resources.DoneResource,
                        type: "error"
                    });
                }

            }
        });
    }
    else
        $('#GridPayRepayment').data('kendoGrid').dataSource.read({ supplierId: supplierId, refrencyType: refrencyType, dateFrom: dateFrom, dateTo: dateTo });

});

function onCheckDetail() {
    debugger;

    var row = $(this).closest("tr"),
        grid = $("#GridPayRepayment").data("kendoGrid"),
        dataItem = grid.dataItem(row),
        rowchecked = false,
        payBondSerial = parseInt($("#PayBondSerial").val());
    if ($(this).is(':checked'))
        rowchecked = true;
    dataItem.set('isChecked', true);

    if (isNaN(payBondSerial)) {
        swal({
            title: Resources.PayBondNotFoundResource,
            confirmButtonText: Resources.DoneResource,
            type: "error"
        });
        $(".btnCheck").prop("checked", false);
        dataItem.set('isChecked', false);
        //   $(".btnCheck").removeAttr('checked');
    }
    else {
        $.ajax({
            type: "POST",
            url: "/PayBond/CheckPayBondExchangeExist?serial=" + payBondSerial,
            data: "name=John&location=Boston",
            dataType: "json",
            success: function (response) {
                debugger
                if (response != null) {
                    $("#FK_PayBondId").val(response.id);
                    $("#PayBondDate").val(response.bondDate);
                    $("#BondTotalAmount").val(response.totalAmount);
                    if (!payBondFound) {
                        $("#BalnceAfterRepayment").val(response.totalAmount);
                        payBondFound = true;
                    }

                    var balnceAfterRepayment = parseFloat($("#BalnceAfterRepayment").val());
                    if (isNaN(balnceAfterRepayment))
                        balnceAfterRepayment = 0;

                    if (rowchecked == true) {
                        balnceAfterRepayment = balnceAfterRepayment - parseFloat(dataItem.referenceRemaining);
                        $("#BalnceAfterRepayment").val(balnceAfterRepayment);
                        if (balnceAfterRepayment <= 0) {
                            // $(".btnCheck").attr("disabled", "disabled");
                            dataItem.set('remaining', Math.abs(balnceAfterRepayment));

                            $("#BalnceAfterRepayment").val(0);
                            $(".btnCheck").prop("disabled", true);
                            swal({
                                title: Resources.CantAddMoreRepaymentResource,
                                confirmButtonText: Resources.DoneResource,
                                type: "error"
                            });
                        }

                    }
                    else {
                        balnceAfterRepayment = balnceAfterRepayment + parseFloat(dataItem.referenceRemaining);
                        $("#BalnceAfterRepayment").val(balnceAfterRepayment);
                    }

                    // $("#PaySupplierName").val(response.supplierNameAr);

                } else {
                    $("#BondTotalAmount").val(null);
                    $("#FK_PayBondId").val(null);
                    $("#PayBondDate").val(null);

                    payBondFound = false;
                    //$("#PaySupplierName").val(null);

                    swal({
                        title: Resources.PayBondNotFoundResource,
                        confirmButtonText: Resources.DoneResource,
                        type: "error"
                    });
                }

            }
        });
    }

}

function SubmitPayRepaymentCreate() {
    var listDetails = [];
    var grid = $("#GridPayRepayment").data("kendoGrid");
    var gridData = $('#GridPayRepayment').data("kendoGrid").dataSource.data(),
        paySupplier = $("#FK_PaySupplierId").val();
    //if (isNaN(paySupplier) || paySupplier == "0" || paySupplier == "") {
    //    swal({
    //        title: $("#ChooseSupplierResource").text(),
    //        confirmButtonText: $("#DoneResource").text(),
    //        type: "error"
    //    });
    //}
    //else
    if (gridData.length == 0) {
        swal({
            title: Resources.GridLengthZeroChooseResource,
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
            // currentRow.context.checked;
            if (dataitem.isChecked) {
                debugger
                var remaining = gridData[i].remaining,
                    isFullyRepayment = false,
                    repaymentAmount = 0;
                if (isNaN(remaining) || remaining == null || remaining == 0) {
                    remaining = 0;
                    isFullyRepayment = true;
                }



                repaymentAmount = parseFloat(gridData[i].referenceRemaining) - remaining;
                var detail = {
                    Id: 0,
                    FK_RefMasterId: parseInt(gridData[i].fK_RefMasterId),
                    FK_ReferenceId: parseInt(gridData[i].fK_ReferenceId),
                    ReferenceSerial: gridData[i].referenceSerial,
                    ReferenceDate: gridData[i].referenceDate,
                    PayReferenceType: parseInt(gridData[i].payReferenceType),
                    ReferenceGross: parseFloat(gridData[i].referenceGross),
                    ReferenceRemaining: parseFloat(gridData[i].referenceRemaining),
                    ReferenceDownPayment: parseFloat(gridData[i].referenceDownPayment),
                    ReferenceDiscount: parseFloat(gridData[i].referenceDiscount),
                    ReferenceTax: parseFloat(gridData[i].referenceTax),
                    RepaymentAmount: parseFloat(repaymentAmount),
                    IsFullyRepayment: isFullyRepayment,
                    Remaining: parseFloat(remaining),
                };
                listDetails.push(detail);
            }

        }


        debugger
        var Obj = {
            Id: 0,
            Serial: parseInt($("#Serial").val()),
            FK_PayBondId: parseInt($("#FK_PayBondId").val()),
            FK_PaySupplierId: parseInt($("#FK_PaySupplierId").val()),
            PaySupplierName: $("#PaySupplierName").val(),
            PayBondSerial: parseInt($("#PayBondSerial").val()),
            BondTotalAmount: parseFloat($("#BondTotalAmount").val()),
            BalnceAfterRepayment: parseFloat($("#BalnceAfterRepayment").val()),
            PayBondDate: $("#PayBondDate").val(),
            FK_DefBranchId: parseInt($("#FK_DefBranchId").val()),
            ListDetails: listDetails
        };
        debugger;
        if (listDetails.length > 0) {
            $.ajax({
                url: "/PayRepayment/Create",
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
                            window.location.href = '/PayRepayment/Index';
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
        else {
            swal({
                title: Resources.GridLengthZeroChooseResource,
                confirmButtonText: Resources.DoneResource,
                type: "error"
            });
        }

    }

}