$(document).ready(function () {

    $('#DefBranches').change(function () {

        $("#FK_TaxesId").data("kendoDropDownTree").value("");
        $("#FK_TaxesId").data("kendoDropDownTree").dataSource.read();

    });
    $("#DefBranches").removeAttr('disabled');

    $("#FK_TaxesId").kendoDropDownTree({
        filter: "contains",
        height: 300,
        dataTextField: "codeAndName",
        dataValueField: "id",
        checkboxes: true,
        checkAll: true,
        dataSource: {
            type: "json",
            //serverFiltering: true,
            transport: {
                read: {
                    url: "/Taxes/GetAllTaxesForDDTree",
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
        }

    });
    //Active in Create
    $('input[type=radio][name=IsActive]').change(function () {
        if (this.value == "True") {
            $(".disabled-input").attr("disabled", "disabled");
            $("#FK_DefFreezingReasonId").val("");
            $("#FreezingReasons").val("");
        }
        else
            $(".disabled-input").removeAttr('disabled');
    });
    //Active In Edit
    var activeVal = $('input[name="IsActive"]:checked').val();
    if (activeVal == "False") {
        $(".disabled-input").removeAttr('disabled');
    }
    var FinancialPeriod = parseInt($('#FK_GlFinancialPeriodId').val());
    var url = "/TaxReturn/GetAllAccount";
    var id = "detailId";


    $("#FK_TaxesPeriodId").change(function (e) {
        var TaxesPeriodId = parseInt($("#FK_TaxesPeriodId").val());
        $.ajax({
            url: "/TaxReturn/GetTaxesPeriod?id=" + TaxesPeriodId,
            type: "Get",
            contentType: false,
            processData: false,
            success: function (data) {
                debugger;
                var from = new Date(data.dateFrom).toISOString().split('T')[0];
                var to = new Date(data.dateTo).toISOString().split('T')[0];
                $("#DateFrom").val(from);
                $("#DateTo").val(to);
            }
        });
    });
    var dataSource = new kendo.data.TreeListDataSource({
        transport: {
            read: {
                url: "/TaxReturn/GetAllAccount",
                dataType: "json",
                Type: "GET"
            },

            parameterMap: function (data, action) {

                if (action === "read") {
                    var datefrom = $("#DateFrom").val();
                    var dateto = $("#DateTo").val();
                    var fK_DefBranchId = parseInt($("#FK_DefBranchId").val());

                    var accountSupportTaxReturn = $("#accountSupportTaxReturn").prop("checked");
                    var accountSupportTaxReturnHaveMovement = $("#accountSupportTaxReturnHaveMovement").prop("checked");

                    var multiTax = $("#FK_TaxesId").data("kendoDropDownTree");
                    var taxIds = multiTax.value().join(", ");

                    return {
                        dateFrom: datefrom,
                        dateTo: dateto,
                        accountSupportTaxReturn: accountSupportTaxReturn,
                        accountSupportTaxReturnHaveMovement: accountSupportTaxReturnHaveMovement,
                        fK_DefBranchId: fK_DefBranchId,
                        taxIds: taxIds
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
                    balance: { type: "number", nullable: false },
                    taxReturnTaxes: { nullable: false },
                    /*  value15: { type: "number", nullable: false },*/
                },
                //expanded: true
            }
        }
    });

    var treeList = $("#gridTaxReturnAccounts").kendoTreeList({
        dataSource: dataSource,
        pageable: false,
        excel: {
            fileName: "Tax Return.xlsx",
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
        //pageable: {
        //    pageSizes: [20, 40, 60, Resources.All],
        //    numeric: Resources.GridNumeric,
        //    refresh: Resources.GridRefresh,

        //},
        columns: [
            {
                field: "accountCode",
                title: Resources.AccountCodeResource,
                width: Resources.CodeWidth
            },
            {
                field: "accountName",
                title: Resources.AccountNameResource,
                width: Resources.NameWidth,
                template: '#if(isMainAccount){#<span style="color:red">#: accountName# </span> #}else{#<span>#: accountName# </span>#}#',
            },
            {
                field: "balance",
                title: Resources.MovementBalanceResources,
                width: Resources.InputNumberWidth,
            },
            //{
            //    field: "value15",
            //    title: "Value 15",
            //    width: Resources.InputNumberWidth,
            //}, {
            //    field: "value0",
            //    title: "Value 0",
            //    width: Resources.InputNumberWidth,
            //},
            { width: Resources.ActionWidth, template: "#if(isMainAccount==true){# #}else{#<a  class='btn-sm btn btn-warning btnOpenReport'><i class='fas fa-eye'></i></a>#}# " },

        ],
        dataBound: function (e) {
            e.sender.items().each(function () {
                var dataItem = e.sender.dataItem(this);
                kendo.bind(this, dataItem);
            });

        },

    });
    treeList.data("kendoTreeList").table.on("click", ".btnOpenReport", OpenReport);

    function OpenReport() {

        var row = $(this).closest("tr"),
            grid = $("#gridTaxReturnAccounts").data("kendoTreeList"),
            dataItem = grid.dataItem(row);
        debugger
        if (dataItem.accountId > 0) {
            var url = "/GlReports/MovementBalanceAndAuditReportPrint?ids=" + dataItem.accountId + "&dateFrom=" + $("#DateFrom").val() + "&dateTo=" + $("#DateTo").val() + "&fK_DefBranchId=" + parseInt($("#FK_DefBranchId").val()) /*+ "&taxIds=" + taxIds + "&empIds=" + empIds*/;
            window.open(url, '_blank').print();

        } else {
            swal({
                title: Resources.ErrorMsgResource,
                confirmButtonText: Resources.DoneResource,
                type: "error"
            });
        }

    }
    $("#btnDataReview").click(function () {


        //var multiTax = $("#FK_TaxesId").data("kendoDropDownTree");
        //var taxIds = multiTax.value().join(", ");
        //if (taxIds != "")
        $('#gridTaxReturnAccounts').data('kendoTreeList').dataSource.read();
        //else {
        //    swal({
        //        title: Resources.ChooseResource + " " + Resources.TaxCategory,
        //        confirmButtonText: Resources.DoneResource,
        //        type: "error"
        //    });
        //}

    });

    $('#header-chb').change(function (ev) {
        var checked = ev.target.checked;
        var s = $('.row-checkbox');
        $('.row-checkbox').each(function (idx, item) {
            if (checked) {
                var c = $(item).closest('tr').is('.k-state-selected');
                if (!($(item).closest('tr').is('.k-state-selected'))) {
                    $(item).click();
                }

            } else {
                if ($(item).closest('tr').is('.k-state-selected')) {
                    $(item).click();
                }

            }
        });
    });


    $("#deleteBonds").bind("click", function () {
        var data = getCheckedData();
        if (data.length === 0) {
            swal("", Resources.NoRecordSelectedResource, "error");
            return false;
        }
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
                $.ajax({
                    url: "/GlJournalVoucher/DeleteVoucher",
                    type: 'POST',
                    data: { vouchers: data },
                    success: function (result) {

                        if (result) {

                            swal({
                                title: Resources.DeleteSuccessResource,
                                confirmButtonText: Resources.DoneResource,
                                type: "success"
                            });
                            loadAllVoucher();
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
    })

    $("#btnPrintAccounts").on('click', function () {
        var datefrom = $("#DateFrom").val();
        var dateto = $("#DateTo").val();
        var fK_DefBranchId = parseInt($("#FK_DefBranchId").val());

        var accountSupportTaxReturn = $("#accountSupportTaxReturn").prop("checked");
        var accountSupportTaxReturnHaveMovement = $("#accountSupportTaxReturnHaveMovement").prop("checked");

        var multiTax = $("#FK_TaxesId").data("kendoDropDownTree");
        var taxIds = multiTax.value().join(", ");

        var url = "/TaxReturn/AccountsReport?dateFrom=" + datefrom + "&dateTo=" + dateto + "&accountSupportTaxReturn=" + accountSupportTaxReturn + "&accountSupportTaxReturnHaveMovement=" + accountSupportTaxReturnHaveMovement + "&fK_DefBranchId=" + fK_DefBranchId + "&taxIds=" + "";
        window.open(url, '_blank').print();

    });

    $("#btnPrintDetailed").on('click', function () {
        var datefrom = $("#DateFrom").val();
        var dateto = $("#DateTo").val();
        var fK_DefBranchId = parseInt($("#FK_DefBranchId").val());

        var accountSupportTaxReturn = $("#accountSupportTaxReturn").prop("checked");
        var accountSupportTaxReturnHaveMovement = $("#accountSupportTaxReturnHaveMovement").prop("checked");
        debugger
        var multiTax = $("#FK_TaxesId").data("kendoDropDownTree");
        var taxIds = multiTax.value().join(", ");
        if (taxIds != "") {
            var url = "/TaxReturn/TaxReturnDetailedReport?dateFrom=" + datefrom + "&dateTo=" + dateto + "&accountSupportTaxReturn=" + accountSupportTaxReturn + "&accountSupportTaxReturnHaveMovement=" + accountSupportTaxReturnHaveMovement + "&fK_DefBranchId=" + fK_DefBranchId + "&taxIds=" + taxIds;
            window.open(url, '_blank').print();
        } else {
            swal({
                title: Resources.ChooseResource + " " + Resources.TaxCategory,
                confirmButtonText: Resources.DoneResource,
                type: "error"
            });
        }


    });

    $("#btnPrintTotal").on('click', function () {
        var datefrom = $("#DateFrom").val();
        var dateto = $("#DateTo").val();
        var fK_DefBranchId = parseInt($("#FK_DefBranchId").val());

        var accountSupportTaxReturn = $("#accountSupportTaxReturn").prop("checked");
        var accountSupportTaxReturnHaveMovement = $("#accountSupportTaxReturnHaveMovement").prop("checked");

        var multiTax = $("#FK_TaxesId").data("kendoDropDownTree");
        var taxIds = multiTax.value().join(", ");
        if (taxIds != "") {
            var url = "/TaxReturn/TaxReturnTotalReport?dateFrom=" + datefrom + "&dateTo=" + dateto + "&accountSupportTaxReturn=" + accountSupportTaxReturn + "&accountSupportTaxReturnHaveMovement=" + accountSupportTaxReturnHaveMovement + "&fK_DefBranchId=" + fK_DefBranchId + "&taxIds=" + taxIds;
            window.open(url, '_blank').print();
        } else {
            swal({
                title: Resources.ChooseResource + " " + Resources.TaxCategory,
                confirmButtonText: Resources.DoneResource,
                type: "error"
            });
        }
    });

});

var checkedIds = {};

//on click of the checkbox:
function selectRow() {
    var checked = this.checked,
        row = $(this).closest("tr"),
        grid = $("#gridJournalVouchers").data("kendoGrid"),
        dataItem = grid.dataItem(row);

    checkedIds[dataItem.detailId] = checked;

    if (checked) {
        //-select the row
        row.addClass("k-state-selected");

        var checkHeader = true;

        $.each(grid.items(), function (index, item) {
            if (!($(item).hasClass("k-state-selected"))) {
                checkHeader = false;
            }
        });

        $("#header-chb")[0].checked = checkHeader;
    } else {
        //-remove selection
        row.removeClass("k-state-selected");
        $("#header-chb")[0].checked = false;
    }
}

function getCheckedData() {
    var editedData = [];
    gridData = $("#gridJournalVouchers").data("kendoGrid").dataSource._data;
    for (var i = 0; i < gridData.length; i++) {
        if (checkedIds[gridData[i].detailId]) {
            var row = { FK_GlAccountId: gridData[i].id, GlAccountGross: parseFloat(gridData[i].glAccountGross), AdjustmentAmount: parseFloat(gridData[i].adjustmentAmount), GlAccountTax: parseFloat(gridData[i].glAccountTax) };
            if (isNaN(row.AdjustmentAmount))
                row.AdjustmentAmount = 0;
            if (isNaN(row.GlAccountTax))
                row.GlAccountTax = 0;
            editedData.push(row);
        }
    }
    return editedData;
}
//on dataBound event restore previous selected rows:
function onDataBound(e) {
    var view = this.dataSource.view();
    console.log(view);
    for (var i = 0; i < view.length; i++) {
        if (checkedIds[view[i].detailId]) {
            this.tbody.find("tr[data-uid='" + view[i].uid + "']")
                .addClass("k-state-selected")
                .find(".k-checkbox")
                .attr("checked", "checked");
        }
    }
}

function saveTaxReturn() {
 
    var multiTax = $("#FK_TaxesId").data("kendoDropDownTree");
    var taxIds = multiTax.value().join(", ");
   

    if ($("#TaxReturnNameAr").val() == "") {
        swal({
            title: Resources.EnterRequiredResource + " " + Resources.NameAr,
            confirmButtonText: Resources.DoneResource,
            type: "error"
        });
    }
    else if ($("#TaxReturnNameEn").val() == "") {
        swal({
            title: Resources.EnterRequiredResource + " " + Resources.NameEn,
            confirmButtonText: Resources.DoneResource,
            type: "error"
        });
    }
    else if (taxIds == "") {
        swal({
            title: Resources.ChooseResource + " " + Resources.TaxCategory,
            confirmButtonText: Resources.DoneResource,
            type: "error"
        });
    }
    else {
        $("#btnSave").prop('disabled', true);
        var isActive = $("input[name='IsActive']:checked").val();
        if (isActive == "true")
            isActive = true;
        else
            isActive = false;
   
        var multiTax = $("#FK_TaxesId").data("kendoDropDownTree").value();
        var Obj = {
            Id: parseInt($('#Id').val()),
            TaxReturnNameAr: $("#TaxReturnNameAr").val(),
            TaxReturnNameEn: $("#TaxReturnNameEn").val(),
            Taxes: multiTax,
            Gross: 0,
            Description: $("#Description").val(),
            DateFrom: $('#DateFrom').val(),
            DateTo: $('#DateTo').val(),
            IsActive: isActive,
            FreezingReasons: $("#FreezingReasons").val(),
            FK_DefFreezingReasonId: parseInt($("#FK_DefFreezingReasonId").val()),
            FK_DefBranchId: parseInt($("#FK_DefBranchId").val()),
            hdnAttachmentIds: $("#hdnAttachmentIds").val(),
       
        };

        $.ajax({
            url: "/TaxReturn/SaveTaxReturn",
            type: "Post",
            cache: false,
            processData: false,
            data: JSON.stringify(Obj),
            contentType: 'application/json',
            success: function (data) {

                if (data.id > 0) {
                    $("#btnSave").prop('disabled', false);
                    swal({
                        title: Resources.SavedSuccessfullyResource,
                        confirmButtonText: Resources.DoneResource,
                        type: "success"
                    }, function () {
                        window.location.href = '/TaxReturn/Index';
                    });
                }
                else {
                    $("#btnSave").prop('disabled', false);
                    swal({
                        title: Resources.DefaultErrorMessageResource,
                        confirmButtonText: Resources.DoneResource,
                        type: "error"
                    });
                }
            }
        });
        //}

    }


}
//function saveTaxReturn() {
//    var listDetails = [];
//    var gridData = $("#gridTaxReturnAccounts").data("kendoTreeList").dataSource._data;

//    if (gridData.length === 0) {
//        swal("", Resources.NoRecordSelectedResource, "error");
//        return false;
//    }

//    else if ($("#TaxReturnNameAr").val() == "") {
//        swal({
//            title: Resources.EnterRequiredResource + " " + Resources.NameAr,
//            confirmButtonText: Resources.DoneResource,
//            type: "error"
//        });
//    }
//    else if ($("#TaxReturnNameEn").val() == "") {
//        swal({
//            title: Resources.EnterRequiredResource + " " + Resources.NameEn,
//            confirmButtonText: Resources.DoneResource,
//            type: "error"
//        });
//    }

//    else {
//        $("#btnSave").prop('disabled', true);
//        var isActive = $("input[name='IsActive']:checked").val();
//        if (isActive == "true")
//            isActive = true;
//        else
//            isActive = false;
//        for (var i = 0; i < gridData.length; i++) {
//            debugger
//            var listTaxReturnTaxes = [];
//            for (var j = 0; j < gridData[i].taxReturnTaxes.length; j++) {
//                var tax = {
//                    Id: 0,
//                    FK_TaxesId: parseInt(gridData[i].taxReturnTaxes[j].fK_TaxesId),
//                    Value: parseFloat(gridData[i].taxReturnTaxes[j].value),
//                };
//                listTaxReturnTaxes.push(tax);
//            }

//            var detail = {
//                Id: 0,
//                FK_GlAccountId: parseInt(gridData[i].accountId),
//                GlAccountGross: parseFloat(gridData[i].balance),
//                TaxReturnTaxes: listTaxReturnTaxes,
//                //Value0: parseFloat(gridData[i].value0),
//                //Value15: parseFloat(gridData[i].value15),

//            };
//            listDetails.push(detail);
//        }
//        var multiTax = $("#FK_TaxesId").data("kendoDropDownTree").value();
//        var Obj = {
//            Id: parseInt($('#Id').val()),
//            TaxReturnNameAr: $("#TaxReturnNameAr").val(),
//            TaxReturnNameEn: $("#TaxReturnNameEn").val(),
//            Taxes: multiTax,
//            Gross: 0,
//            Description: $("#Description").val(),
//            DateFrom: $('#DateFrom').val(),
//            DateTo: $('#DateTo').val(),
//            IsActive: isActive,
//            FreezingReasons: $("#FreezingReasons").val(),
//            FK_DefFreezingReasonId: parseInt($("#FK_DefFreezingReasonId").val()),
//            FK_DefBranchId: parseInt($("#FK_DefBranchId").val()),
//            hdnAttachmentIds: $("#hdnAttachmentIds").val(),
//            ListDetails: listDetails,
//        };

//        $.ajax({
//            url: "/TaxReturn/SaveTaxReturn",
//            type: "Post",
//            cache: false,
//            processData: false,
//            data: JSON.stringify(Obj),
//            contentType: 'application/json',
//            success: function (data) {

//                if (data.id > 0) {
//                    $("#btnSave").prop('disabled', false);
//                    swal({
//                        title: Resources.SavedSuccessfullyResource,
//                        confirmButtonText: Resources.DoneResource,
//                        type: "success"
//                    }, function () {
//                        window.location.href = '/TaxReturn/Index';
//                    });
//                }
//                else {
//                    $("#btnSave").prop('disabled', false);
//                    swal({
//                        title: Resources.DefaultErrorMessageResource,
//                        confirmButtonText: Resources.DoneResource,
//                        type: "error"
//                    });
//                }
//            }
//        });
//        //}

//    }


//}
