$(document).ready(function () {

    // loadGlAccountOpeningBalanceGrid();
    var dataSource = new kendo.data.TreeListDataSource({
        transport: {
            read: {
                url: "/EstimatedBudget/GetAllAccounts",
                dataType: "json",
                Type: "GET"
            },

            parameterMap: function (data, action) {

                if (action === "read") {
                    var financialPeriod = parseInt($("#FK_GlFinancialPeriodId").val());
                    var fK_DefBranchId = parseInt($("#FK_DefBranchId").val());

                    var accountVisibleInEstimatedBudget = $("#accountVisibleInEstimatedBudget").prop("checked");
                    var accountVisibleInEstimatedBudgetHaveMovement = $("#accountVisibleInEstimatedBudgetHaveMovement").prop("checked");

                    return {
                        financialPeriod: financialPeriod,
                        accountVisibleInEstimatedBudget: accountVisibleInEstimatedBudget,
                        accountVisibleInEstimatedBudgetHaveMovement: accountVisibleInEstimatedBudgetHaveMovement,
                        fK_DefBranchId: fK_DefBranchId,
                    };
                } else {
                    return data;
                }
            }
        },
        //batch: true,
        schema: {
            model: {
                id: "accountId",
                parentId: "parentId",
                fields: {
                    accountId: { type: "number", nullable: false },
                    parentId: { field: "parentId", nullable: true },
                    accountCode: { type: "string", validation: { required: true } },
                    accountName: { type: "string", validation: { required: true } },
                    previousDebit: { type: "number", nullable: false },
                    previousCredit: { type: "number", nullable: false },
                    totalPrevious: { type: "number", nullable: false },

                    expectedDebit: { type: "number", nullable: false, editable: true },
                    expectedCredit: { type: "number", nullable: false, editable: true },
                    totalExpected: { type: "number", nullable: false, editable: true },

                    balance: { type: "number", nullable: false, editable: true },
                },
                //expanded: true
            }
        }
    });

    var treeList = $("#gridVisibleInEstimatedBudgeAccounts").kendoTreeList({
        dataSource: dataSource,
        pageable: false,
        excel: {
            fileName: "Estimated Budge Accounts.xlsx",
            allPages: Resources.GridAllPages,
            filterable: Resources.GridFilterable
        },
        height: 540,
        pageSize: 20,

        serverPaging: Resources.GridServerPaging,
        serverFiltering: Resources.GridServerFiltering,
        filterable: Resources.GridFilterable,
        height: Resources.GridHeight,
        groupable: Resources.GridGroupable,
        sortable: Resources.GridSortable,
        resizable: Resources.GridResizable,
        noRecords: Resources.GridNoRecords,
        messages: {
            noRecords: Resources.GridNoRecordsMessage
        },

        columns: [
            {
                field: "accountCode",
                title: Resources.AccountCodeResource,
                width: Resources.NameWidth
            },
            {
                field: "accountName",
                title: Resources.AccountNameResource,
                width: Resources.NameWidth,
                template: '#if(isMainAccount){#<span style="color:red">#: accountName# </span> #}else{#<span>#: accountName# </span>#}#',
            },
            {
                title: Resources.PreviousFinancialPeriod,
                headerAttributes: {
                    style: "text-align: center"
                },
                columns: [{
                    field: "previousDebit",
                    title: Resources.DebitResource,
                    width: Resources.AmountWidth,
                    format: '{0:n2}',
                    //template: "#: kendo.toString(previousTransactionDebit, '0.00')#",
                    footerTemplate: Resources.Total + ": #: kendo.toString(sum, '0.00') # "
                }, {
                    field: "previousCredit",
                    title: Resources.CreditResource,
                    width: Resources.AmountWidth,
                    format: '{0:n2}',
                    //template: "#: kendo.toString(previousTransactionCredit, '0.00')#",
                    footerTemplate: Resources.Total + ": #: kendo.toString(sum, '0.00') # "
                }, {
                    field: "totalPrevious",
                    title: Resources.Total,
                    width: Resources.AmountWidth,
                    format: '{0:n2}',
                    //template: "#: kendo.toString(previousTransactionCredit, '0.00')#",
                    footerTemplate: Resources.Total + ": #: kendo.toString(sum, '0.00') # "
                }]
            },
            {
                title: Resources.ExpectedForNextYear,
                headerAttributes: {
                    style: "text-align: center"
                },
                columns: [{
                    field: "expectedDebit",
                    title: Resources.DebitResource,
                    width: Resources.NameWidth,
                    template: "#if(isMainAccount==true){#<input name='expectedDebit' style='width:95%' disabled/> #}else{#<input   class='expectedDebit' value='#= expectedDebit #' name='expectedDebit' style='width:95%'/>#}#",
                }, {
                    field: "expectedCredit",
                    title: Resources.CreditResource,
                        width: Resources.NameWidth,
                    template: "#if(isMainAccount==true){#<input name='expectedCredit' style='width:95%' disabled/> #}else{#<input   class='expectedCredit' value='#= expectedCredit #' name='expectedCredit' style='width:95%'/>#}#",
                }, {
                    field: "totalExpected",
                    title: Resources.Total,
                        width: Resources.NameWidth,
                    template: "#if(isMainAccount==true){#<input name='totalExpected' style='width:95%' disabled/> #}else{#<input   class='totalExpected' value='#= totalExpected #' name='totalExpected' style='width:95%'/>#}#",

                }]
            },
            {
                field: "balance",
                title: Resources.Total,
                width: Resources.NameWidth,
                template: "#if(isMainAccount==true){#<input name='balance' style='width:95%' disabled/> #}else{#<input   class='balance' value='#= balance #' name='balance' style='width:95%' disabled/>#}#",

            }

        ],
        dataBound: function (e) {
            e.sender.items().each(function () {
                var dataItem = e.sender.dataItem(this);
                kendo.bind(this, dataItem);
                
                var row = $(this).closest("tr");
                row.closest("tr").find('input[name$="expectedDebit"]').val(dataItem.expectedDebit);
                row.closest("tr").find('input[name$="expectedCredit"]').val(dataItem.expectedCredit);
                row.closest("tr").find('input[name$="totalExpected"]').val(dataItem.totalExpected);
                row.closest("tr").find('input[name$="balance"]').val(dataItem.balance);
            });

        },

    });



    treeList.data("kendoTreeList").table.on("change", ".expectedDebit,.expectedCredit,.totalExpected", RowChange);
    function RowChange() {

        var row = $(this).closest("tr"),
            grid = $("#gridVisibleInEstimatedBudgeAccounts").data("kendoTreeList"),
            dataItem = grid.dataItem(row),

            totalPrevious = isNaN(parseFloat(dataItem.totalPrevious)) ? 0 : parseFloat(dataItem.totalPrevious),

            expectedDebit = isNaN(parseFloat(row.closest("tr").find('input[name$="expectedDebit"]').val())) ? 0 : parseFloat(row.closest("tr").find('input[name$="expectedDebit"]').val()),
            expectedCredit = isNaN(parseFloat(row.closest("tr").find('input[name$="expectedCredit"]').val())) ? 0 : parseFloat(row.closest("tr").find('input[name$="expectedCredit"]').val()),
            totalExpected = isNaN(parseFloat(row.closest("tr").find('input[name$="totalExpected"]').val())) ? 0 : parseFloat(row.closest("tr").find('input[name$="totalExpected"]').val()),
            balance = isNaN(parseFloat(row.closest("tr").find('input[name$="balance"]').val())) ? 0 : parseFloat(row.closest("tr").find('input[name$="balance"]').val());

        dataItem.set("expectedDebit", expectedDebit);
        dataItem.set("expectedCredit", expectedCredit);

        totalExpected = expectedDebit - expectedCredit;
        if (this.classList[0] === "totalExpected") {

            totalExpected = parseFloat(this.value);
            dataItem.set("totalExpected", totalExpected);

            dataItem.set("expectedDebit", 0);
            row.closest("tr").find('input[name$="expectedDebit"]').val(0);

            dataItem.set("expectedCredit", 0);
            row.closest("tr").find('input[name$="expectedCredit"]').val(0);

            grid.refresh();
        } else {
            dataItem.set("totalExpected", totalExpected);
            row.closest("tr").find('input[name$="totalExpected"]').val(totalExpected);
        }


        balance = totalPrevious - totalExpected;
        dataItem.set("balance", balance);
        row.closest("tr").find('input[name$="balance"]').val(balance);

        grid.refresh();
        calcAllParentAccount(dataItem.parentId);
    }

    $("#btnShowAccounts").click(function () {
        $('#gridVisibleInEstimatedBudgeAccounts').data('kendoTreeList').dataSource.read();

    });

    function calcAllParentAccount(accountId) {
        debugger
        var gridData = $('#gridVisibleInEstimatedBudgeAccounts').data("kendoTreeList").dataSource.data(),
            grid = $("#gridVisibleInEstimatedBudgeAccounts").data("kendoTreeList"),

            parentId = 0,
            balance = 0,
            expectedDebit = 0,
            expectedCredit = 0,
            totalExpected = 0;
        for (var i = 0; i < gridData.length; i++) {

            for (var j = 0; j < gridData.length; j++) {

                if (gridData[j].parentId == accountId) {
                    var currentUid = gridData[j].uid;
                    var currentRow = grid.table.find("tr[data-uid='" + currentUid + "']");

                    var rowcredit = $(currentRow).find('input[name$="expectedCredit"]').val();
                    var rowdebit = $(currentRow).find('input[name$="expectedDebit"]').val();
                    var rowtotal = $(currentRow).find('input[name$="totalExpected"]').val();
                    var rowbalance = $(currentRow).find('input[name$="balance"]').val();

                    expectedCredit += parseFloat(rowcredit);
                    expectedDebit += parseFloat(rowdebit);
                    totalExpected += parseFloat(rowtotal);
                    balance += parseFloat(rowbalance);

                }
                if (gridData[j].id == accountId && gridData[j].parentId > 0) {
                    parentId = gridData[j].parentId;
                }
            }

            for (var k = 0; k < gridData.length; k++) {

                if (gridData[k].id == accountId) {
                    var currentUid = gridData[k].uid;
                    var currentRow = grid.table.find("tr[data-uid='" + currentUid + "']");
                    var dataItem = grid.dataItem(currentRow);

                    $(currentRow).find('input[name$="expectedCredit"]').val(expectedCredit);
                    $(currentRow).find('input[name$="expectedDebit"]').val(expectedDebit);
                    $(currentRow).find('input[name$="totalExpected"]').val(totalExpected);
                    $(currentRow).find('input[name$="balance"]').val(balance);

                    dataItem.set("expectedDebit", expectedDebit);
                    dataItem.set("totalExpected", totalExpected);
                    dataItem.set("expectedCredit", expectedCredit);
                    dataItem.set("balance", balance);

                }
            }
            balance = 0;
            expectedDebit = 0;
            expectedCredit = 0;
            totalExpected = 0;
            accountId = parentId;

        }
        grid.refresh();
    }

    //Active in Create
    $('input[type=radio][name=IsActive]').change(function () {
        debugger
        if (this.value == "True") {
            $(".disabled-input").attr("disabled", "disabled");
            $("#FK_DefFreezingReasonId").val("");
            $("#FreezingReasons").val("");
        }
        else
            $(".disabled-input").removeAttr('disabled');
    });

});


function saveEstimatedBudge() {
    var listDetails = [];
    var gridData = $("#gridVisibleInEstimatedBudgeAccounts").data("kendoTreeList").dataSource._data;

    if (gridData.length === 0) {
        swal("", Resources.NoRecordSelectedResource, "error");
        return false;
    }

    else if ($("#BudgetNameAr").val() == "") {
        swal({
            title: Resources.EnterRequiredResource + " " + Resources.NameAr,
            confirmButtonText: Resources.DoneResource,
            type: "error"
        });
    }
    else if ($("#BudgetNameEn").val() == "") {
        swal({
            title: Resources.EnterRequiredResource + " " + Resources.NameEn,
            confirmButtonText: Resources.DoneResource,
            type: "error"
        });
    }

    else {

        var isActive = $("input[name='IsActive']:checked").val();
        if (isActive == "true")
            isActive = true;
        else
            isActive = false;
        for (var i = 0; i < gridData.length; i++) {
            if (parseFloat(gridData[i].expectedDebit) > 0 || parseFloat(gridData[i].expectedCredit) > 0 || parseFloat(gridData[i].totalExpected) > 0) {

                var detail = {
                    Id: 0,
                    FK_GlAccountId: parseInt(gridData[i].accountId),
                    CurrentGross: parseFloat(gridData[i].balance),

                    PreviousGross: parseFloat(gridData[i].totalPrevious),
                    PreviousCredit: parseFloat(gridData[i].previousCredit),
                    PreviousDebit: parseFloat(gridData[i].previousDebit),

                    NextGross: parseFloat(gridData[i].totalExpected),
                    NextCredit: parseFloat(gridData[i].expectedCredit),
                    NextDebit: parseFloat(gridData[i].expectedDebit),

                };
                listDetails.push(detail);
            }

        }

        if (listDetails.length == 0) {
            swal({
                title: Resources.GridLengthZeroChooseResource,
                confirmButtonText: Resources.DoneResource,
                type: "error"
            });
        }
        else {
            var Obj = {
                Id: parseInt($('#Id').val()),

                BudgetNameAr: $("#BudgetNameAr").val(),
                BudgetNameEn: $("#BudgetNameEn").val(),

                PreviousGross: 0,
                CurrentGross: 0,
                NextGross: 0,
                FK_GlFinancialPeriodId: parseInt($('#FK_GlFinancialPeriodId').val()),
                Description: $("#Description").val(),
                //DateFrom: $('#DateFrom').val(),
                //DateTo: $('#DateTo').val(),
                IsActive: isActive,
                FreezingReasons: $("#FreezingReasons").val(),
                FK_DefFreezingReasonId: parseInt($("#FK_DefFreezingReasonId").val()),
                FK_DefBranchId: parseInt($("#FK_DefBranchId").val()),
                hdnAttachmentIds: $("#hdnAttachmentIds").val(),
                ListDetails: listDetails,
            };


            $.ajax({
                url: '/EstimatedBudget/Create',
                type: 'POST',
                data: { listEstimatedBudgetVM: Obj },
                success: function (data) {
                    debugger
                    if (data > 0) {
                        swal({
                            title: Resources.SavedSuccessfullyResource,
                            confirmButtonText: Resources.DoneResource,
                            type: "success"
                        }, function () {
                            window.location.href = '/EstimatedBudget/Index';
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
function saveEstimatedBudgeAndPrint() {
    var listDetails = [];
    var gridData = $("#gridVisibleInEstimatedBudgeAccounts").data("kendoTreeList").dataSource._data;

    if (gridData.length === 0) {
        swal("", Resources.NoRecordSelectedResource, "error");
        return false;
    }

    else if ($("#BudgetNameAr").val() == "") {
        swal({
            title: Resources.EnterRequiredResource + " " + Resources.NameAr,
            confirmButtonText: Resources.DoneResource,
            type: "error"
        });
    }
    else if ($("#BudgetNameEn").val() == "") {
        swal({
            title: Resources.EnterRequiredResource + " " + Resources.NameEn,
            confirmButtonText: Resources.DoneResource,
            type: "error"
        });
    }

    else {

        var isActive = $("input[name='IsActive']:checked").val();
        if (isActive == "true")
            isActive = true;
        else
            isActive = false;
        for (var i = 0; i < gridData.length; i++) {
            if (parseFloat(gridData[i].expectedDebit) > 0 || parseFloat(gridData[i].expectedCredit) > 0 || parseFloat(gridData[i].totalExpected) > 0) {

                var detail = {
                    Id: 0,
                    FK_GlAccountId: parseInt(gridData[i].accountId),
                    CurrentGross: parseFloat(gridData[i].balance),

                    PreviousGross: parseFloat(gridData[i].totalPrevious),
                    PreviousCredit: parseFloat(gridData[i].previousCredit),
                    PreviousDebit: parseFloat(gridData[i].previousDebit),

                    NextGross: parseFloat(gridData[i].totalExpected),
                    NextCredit: parseFloat(gridData[i].expectedCredit),
                    NextDebit: parseFloat(gridData[i].expectedDebit),

                };
                listDetails.push(detail);
            }

        }

        if (listDetails.length == 0) {
            swal({
                title: Resources.GridLengthZeroChooseResource,
                confirmButtonText: Resources.DoneResource,
                type: "error"
            });
        }
        else {
            var Obj = {
                Id: parseInt($('#Id').val()),

                BudgetNameAr: $("#BudgetNameAr").val(),
                BudgetNameEn: $("#BudgetNameEn").val(),

                PreviousGross: 0,
                CurrentGross: 0,
                NextGross: 0,
                FK_GlFinancialPeriodId: parseInt($('#FK_GlFinancialPeriodId').val()),
                Description: $("#Description").val(),
                //DateFrom: $('#DateFrom').val(),
                //DateTo: $('#DateTo').val(),
                IsActive: isActive,
                FreezingReasons: $("#FreezingReasons").val(),
                FK_DefFreezingReasonId: parseInt($("#FK_DefFreezingReasonId").val()),
                FK_DefBranchId: parseInt($("#FK_DefBranchId").val()),
                hdnAttachmentIds: $("#hdnAttachmentIds").val(),
                ListDetails: listDetails,
            };


            $.ajax({
                url: '/EstimatedBudget/Create',
                type: 'POST',
                data: { listEstimatedBudgetVM: Obj },
                success: function (data) {
                    debugger
                    if (data > 0) {
                        swal({
                            title: Resources.SavedSuccessfullyResource,
                            confirmButtonText: Resources.DoneResource,
                            type: "success"
                        }, function () {
                            Object.assign(document.createElement('a'), { target: '_blank', href: '/EstimatedBudget/EstimatedBudgetPrint?id=' + data }).click();
                                /*var url = "/EstimatedBudget/EstimatedBudgetPrint?id=" + data;
                                window.open(url, '_blank').print();*/
                                window.location.href = '/EstimatedBudget/Index';
                        });
                        debugger

                        //var url = "/EstimatedBudget/EstimatedBudgetPrint?id=" + data;
                        //window.open(url, '_blank').print();
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
