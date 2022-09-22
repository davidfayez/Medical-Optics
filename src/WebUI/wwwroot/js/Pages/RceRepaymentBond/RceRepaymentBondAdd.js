$().ready(function () {

    $('#TotalAmount').change(function () {
        $("#BalnceAfterRepayment").val(this.value);
        var currencyId = $("#FK_DefCurrencyId").val();
        NumberToText(this.value, currencyId);
        loadRceRepaymentDetailsGrid(parseInt($("#FK_RceClientId").val()));
    });
    $('#DefBranches').change(function () {
        $("#FK_DefCurrencyId").data("kendoDropDownList").value("0");
        $("#FK_DefCurrencyId").data("kendoDropDownList").dataSource.read();

        $("#FK_GlAccountId").data("kendoDropDownList").value("0");
        $("#FK_GlAccountId").data("kendoDropDownList").dataSource.read();

        $("#FK_RceClientId").val(0);
        $("#FK_RceClientId").data("kendoDropDownList").value("0");
        $("#FK_RceClientId").data("kendoDropDownList").dataSource.read();

    });

    //Client AutoComplete
    $("#FK_RceClientId").kendoDropDownList({
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
        var totalAmout = parseFloat($('#TotalAmount').val());
        var currencyId = $("#FK_DefCurrencyId").val();

        if (totalAmout > 0) {
            $("#BalnceAfterRepayment").val(totalAmout);
            NumberToText(totalAmout, currencyId);
        }

        loadRceRepaymentDetailsGrid(e.dataItem.id);
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

    $('input[type=radio][name=FK_CbPayTypeId]').change(function () {
        if (this.value == 2) {
            $("#CheckNumber").removeAttr("disabled");
            $("#CheckDate").removeAttr("disabled");
            $("#FK_BankId").removeAttr("disabled");
        }
        else {
            $("#CheckNumber").attr("disabled", "disabled");
            $("#CheckDate").attr("disabled", "disabled");
            $("#CheckNumber").val(null);
            $("#CheckDate").val(null);
            $("#FK_BankId").attr("disabled", "disabled");
        }
    });

    loadRceRepaymentDetailsGrid(parseInt($("#FK_RceClientId").val()));

    function loadRceRepaymentDetailsGrid(clientId) {

        var dataSource = new kendo.data.DataSource({
            serverPaging: false,
            serverSorting: false,
            transport: {
                read: {
                    url: "/RceRepaymentBond/GetAllRceReference?clientId=" + clientId + "&branchId=" + parseInt($("#FK_DefBranchId").val()),
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
                        fK_RceRepaymentId: { editable: false },
                        fK_RefMasterId: { editable: false },
                        fK_ReferenceId: { editable: false },
                        referenceSerial: { editable: false },
                        referenceDate: { type: "date", editable: false },
                        rceReferenceType: { editable: false },
                        rceReferenceName: { editable: false },
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
        var grid = $("#GridRceRepayment").kendoGrid({
            excel: {
                fileName: "client Repayment.xlsx",
                allPages: Resources.GridAllPages,
                filterable: Resources.GridFilterable
            },
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
                { field: "remaining", hidden: true },
                { width: "90px", template: "<input type='checkbox' class= 'control-label i-check btnCheck' data-bind='checked:isChecked'/>" },
                { field: "referenceSerial", title: Resources.BillNumberResource, width: "150px" },
                { field: "rceReferenceName", title: Resources.PayBondTypeResource, width: "150px" },
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
        grid.data("kendoGrid").table.off('click').on("click", ".btnCheck", onCheckDetail);
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
                    $("#AmountText").val(result);
                else
                    $("#AmountText").val(null);
            }
        });
    }

    function onCheckDetail(e) {


        var row = $(this).closest("tr"),
            grid = $("#GridRceRepayment").data("kendoGrid"),
            dataItemRow = grid.dataItem(row),
            rowchecked = false,
            totalAmount = parseFloat($("#TotalAmount").val()),
            balnceAfterRepayment = parseFloat($("#BalnceAfterRepayment").val()),
            serial = parseInt($("#Serial").val());

        if ($(this).is(':checked'))
            rowchecked = true;
        dataItemRow.set('isChecked', true);

        if (totalAmount == 0) {
            swal({
                title: Resources.EnterRequiredResource + " " + Resources.PayTotalAmountResource,
                confirmButtonText: Resources.DoneResource,
                type: "error"
            });
            $(".btnCheck").prop("checked", false);
            dataItemRow.set('isChecked', false);
        }
        else if (balnceAfterRepayment == 0 && rowchecked) {
            swal({
                title: Resources.CantAddMoreRepaymentResource,
                confirmButtonText: Resources.DoneResource,
                type: "error"
            });
            //   $(".btnCheck").prop("checked", false);
            dataItemRow.set('isChecked', false);
        }
        else if (balnceAfterRepayment == 0 && !rowchecked) {
            var remaining = dataItemRow.remaining == null ? 0 : dataItemRow.remaining;
            var referenceRemaining = dataItemRow.referenceRemaining == null ? 0 : dataItemRow.referenceRemaining;
            var repaymentAmount = parseFloat(referenceRemaining) - parseFloat(remaining); //repaymentAmount 
            $("#BalnceAfterRepayment").val(repaymentAmount.toFixed(3));
            //   $(".btnCheck").prop("checked", false);
            dataItemRow.set('remaining', null);
            dataItemRow.set('isFullyRepayment', false);
            dataItemRow.set('isChecked', false);
            setGridRemaining();
        }
        else {

            /*  $("#BalnceAfterRepayment").val(totalAmount - response.referenceRemaining);*/

            balnceAfterRepayment = parseFloat($("#BalnceAfterRepayment").val());

            if (isNaN(balnceAfterRepayment))
                balnceAfterRepayment = 0;

            if (rowchecked == true) {
                balnceAfterRepayment = balnceAfterRepayment - parseFloat(dataItemRow.referenceRemaining);
                $("#BalnceAfterRepayment").val(balnceAfterRepayment.toFixed(3));
                if (balnceAfterRepayment <= 0) {
                    dataItemRow.set('remaining', Math.abs(balnceAfterRepayment.toFixed(3)));

                    $("#BalnceAfterRepayment").val(0);
                    // $(".btnCheck").prop("disabled", true);
                    swal({
                        title: Resources.CantAddMoreRepaymentResource,
                        confirmButtonText: Resources.DoneResource,
                        type: "error"
                    });
                }

            }
            else {
                dataItemRow.set('isChecked', false);
                balnceAfterRepayment = balnceAfterRepayment + parseFloat(dataItemRow.referenceRemaining);
                $("#BalnceAfterRepayment").val(balnceAfterRepayment.toFixed(3));
            }


        }

    }
});


function checkPeriodAndSaveRceRepaymentBond() {

    var openedPeriodCount = 0;
    $.ajax({
        url: "/GlFinancialPeriod/GetOpenPeriodsCount",
        type: "Get",
        contentType: false,
        processData: false,
        success: function (result) {

            openedPeriodCount = result;
            $.ajax({
                url: "/GlFinancialPeriod/IsDateInOpenPeriod?date=" + $("#BondDate").val(),
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
                                SubmitRceRepaymentBondCreate();
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
                        SubmitRceRepaymentBondCreate();
                    }
                }
            });
        }
    });


}

function SubmitRceRepaymentBondCreate() {

    var listDetails = [];
    var grid = $("#GridRceRepayment").data("kendoGrid");
    var gridData = $('#GridRceRepayment').data("kendoGrid").dataSource.data(),
        rceClientAccountId = $("#FK_RceClientId").val(),// Client accountId
        fK_DefCurrencyId = $("#FK_DefCurrencyId").val(),
        fK_GlAccountId = $("#accountsDDLTree").val(),
        checkNumber = $("#CheckNumber").val(),
        checkDate = $("#CheckDate").val(),
        totalAmount = parseFloat($("#TotalAmount").val()),
        fK_BankId = parseInt($("#FK_BankId").val()),
        fK_CbPayTypeId = $('input[name="FK_CbPayTypeId"]:checked').val();

    if (isNaN(fK_DefCurrencyId) || fK_DefCurrencyId == "0" || fK_DefCurrencyId == "") {
        swal({
            title: Resources.Choose + " " + Resources.Currency,
            confirmButtonText: Resources.DoneResource,
            type: "error"
        });
    }
    else if (isNaN(rceClientAccountId) || rceClientAccountId == "0" || rceClientAccountId == "") {
        swal({
            title: Resources.ChooseClientResource,
            confirmButtonText: Resources.DoneResource,
            type: "error"
        });
    }
    else if (isNaN(totalAmount) || totalAmount <= 0 || totalAmount == 0) {
        swal({
            title: Resources.EnterRequiredResource + " " + Resources.PayTotalAmountResource,
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

    else if (fK_CbPayTypeId == 2 && checkNumber == "") {
        swal({
            title: Resources.EnterRequiredResource + " " + Resources.CheckNumber,
            confirmButtonText: Resources.DoneResource,
            type: "error"
        });
    }

    else if (fK_CbPayTypeId == 2 && checkDate == "") {
        swal({
            title: Resources.EnterRequiredResource + " " + Resources.CheckDate,
            confirmButtonText: Resources.DoneResource,
            type: "error"
        });
    }
    //else
    //if (gridData.length == 0) {
    //    swal({
    //        title: Resources.GridLengthZeroChooseResource,
    //        confirmButtonText: Resources.DoneResource,
    //        type: "error"
    //    });
    //}
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
                    RceReferenceType: parseInt(gridData[i].rceReferenceType),
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

        var isPosted = $("input[name='IsPosted']:checked").val();

        if (isPosted == "true")
            isPosted = true;
        else
            isPosted = false;
        debugger
        var Obj = {
            Id: 0,
            FK_RceClientId: 0,//get from server from FK_RceClientGlAccountId
            Serial: parseInt($("#Serial").val()),
            BondDate: $("#BondDate").val(),
            FK_CbPayTypeId: parseInt(fK_CbPayTypeId),
            FK_DefCurrencyId: parseInt(fK_DefCurrencyId),
            FK_GlAccountId: parseInt(fK_GlAccountId),
            FK_RceClientGlAccountId: parseInt(rceClientAccountId),
            IsPosted: isPosted,
            CurrencyFactor: parseFloat($("#CurrencyFactor").val()),
            TotalAmount: totalAmount,
            CheckNumber: checkNumber,
            CheckDate: checkDate == "" ? null : checkDate,
            AmountText: $("#AmountText").val(),
            Description: $("#Description").val(),
            BalnceAfterRepayment: parseFloat($("#BalnceAfterRepayment").val()),

            FK_DefBranchId: parseInt($("#FK_DefBranchId").val()),
            FK_BankId: fK_BankId == 0 ? null : fK_BankId,
            ListDetails: listDetails
        };

        $.ajax({
            url: "/RceRepaymentBond/Create",
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
                        window.location.href = '/RceRepaymentBond/Index';
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

function setGridRemaining() {

    var grid = $("#GridRceRepayment").data("kendoGrid");
    var gridData = $('#GridRceRepayment').data("kendoGrid").dataSource.data();


    for (var i = 0; i < gridData.length; i++) {
        var balnceAfterRepayment = parseFloat($("#BalnceAfterRepayment").val());
        if (balnceAfterRepayment > 0) {

            var currentUid = gridData[i].uid;
            var currentRow = grid.table.find("tr[data-uid='" + currentUid + "']");
            var dataitem = grid.dataItem(currentRow);
            var remaining = dataitem.remaining;
            // var repaymentAmount = dataitem.repaymentAmount;
            if (remaining != null && remaining > 0) {
                var newRemaining = 0;
                //var newRepaymentAmount = 0;
                var newbalnceAfterRepayment = 0;

                if (balnceAfterRepayment >= remaining) {
                    // newRepaymentAmount = repaymentAmount + remaining;
                    dataitem.set('remaining', null);
                    dataitem.set('isFullyRepayment', true);
                    newbalnceAfterRepayment = balnceAfterRepayment - parseFloat(remaining);
                    $("#BalnceAfterRepayment").val(newbalnceAfterRepayment.toFixed(3));
                } else if (balnceAfterRepayment < remaining) {
                    newRemaining = parseFloat(remaining) - balnceAfterRepayment;
                    dataitem.set('remaining', newRemaining);
                    dataitem.set('isFullyRepayment', false);
                    $("#BalnceAfterRepayment").val(0);
                    break;
                }

            }

        }
    }




}