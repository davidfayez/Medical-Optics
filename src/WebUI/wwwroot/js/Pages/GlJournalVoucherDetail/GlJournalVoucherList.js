$(document).ready(function () {


    LoadGridVoucher();
    function LoadGridVoucher() {
        var grid = $("#GlJournalVoucherList").kendoGrid({
            excel: {
                fileName: "Journal Vouchers.xlsx",
                allPages: true,
                filterable: true
            },
            dataSource: {
                transport: {
                    read: "/GlJournalVoucher/GetGlJournalVoucherList"
                },
                schema: {
                    model: {
                        id: "id",
                        fields: {
                            serial: { type: "number" },
                            fK_SecModuleId: { type: "number" },
                            fK_SecModulePageId: { type: "number" },
                            fK_RefrenceId: { type: "number" },
                            fK_CustodyId: { type: "number" },
                            voucherDate: { type: "date" },
                            serial: { type: "string" },
                            fK_GlJournalVoucherCategoryId: { type: "string" },
                            IsPosted: { type: "string" },
                            creatorName: { type: "string" },
                        }
                    }
                },
                pageSize: 20,
            },
            height: Resources.GridHeight,
            sortable: Resources.GridSortable,
            reorderable: Resources.GridReorderable,
            groupable: Resources.GridGroupable,
            resizable: Resources.GridResizable,
            filterable: Resources.GridFilterable,
            columnMenu: Resources.GridColumnMenu,
            noRecords: Resources.GridNoRecords,
            messages: {
                noRecords: Resources.GridNoRecordsMessage
            },
            pageable: Resources.GridPageable,
            columns: [{
                field: "creatorName",
                title: Resources.EmployeeName,
                width: Resources.NameWidth
            }, {
                field: "serial",
                title: Resources.VoucherCodeResource,
                width: Resources.CodeWidth
            }, {
                field: "voucherDate",
                title: Resources.VoucherDateResource,
                format: "{0:yyyy/MM/dd}",
                width: Resources.DateWidth
            }, {
                field: "serial",
                title: Resources.SerialResource,
                width: Resources.CodeWidth,
                hidden: true
            }, {
                field: "fK_GlJournalVoucherCategoryId",
                title: Resources.GlJournalVoucherCategoryResource,
                width: Resources.NameWidth
            },
            { width: Resources.CheckboxWidth, template: "<input type='checkbox' data-bind='checked:isPosted' class= 'control-label i-check' disabled = 'disabled' />", headerTemplate: Resources.PostedStatus },
            { width: Resources.DoubleActionWidth, template: "<a  href='/GlJournalVoucher/EditVoucher/#= id #'  class='btn btn-success btn-sm btnEdit'><i class='fas fa-edit'></i></a> <a  class='btn btn-danger btn-sm btnDelete' ><i class='fas fa-trash-alt'></i></a> <a  class='btn-sm btnOpenReport'><i class='fas fa-eye'></i></a>" },

            ],
            dataBound: function (e) {
                e.sender.items().each(function () {
                    var dataItem = e.sender.dataItem(this);
                    kendo.bind(this, dataItem);

                    if (dataItem.fK_SecModuleId > 0 && dataItem.fK_RefrenceId > 0)
                        $(this).find(".btnOpenReport").addClass("btn btn-info");
                    else
                        $(this).find(".btnOpenReport").addClass("btn btn-warning");

                });
                if (!hasRoleEdit)
                    $(".btnEdit").addClass('disabled');

                if (!hasRoleDelete)
                    $(".btnDelete").addClass('disabled');
            },
            excelExport: function (e) {

                var sheet = e.workbook.sheets[0];
                for (var i = 0; i < sheet.rows.length; i++) {
                    sheet.rows[i].cells.reverse();
                    for (var ci = 0; ci < sheet.rows[i].cells.length; ci++) {
                        sheet.rows[i].cells[ci].hAlign = "right";
                    }
                }
                //sheet.frozenRows = 2;
                sheet.mergedCells = ["A1:C1", "A2:C2"];
                sheet.name = $("#Name").val();
                var now = new Date(),
                    today = now.getFullYear() + "-" + ("0" + (now.getMonth() + 1)).slice(-2) + "-" + ("0" + now.getDate()).slice(-2);
                var branch = getCookie("branchName");

                var myHeaders = [{
                    value: Resources.Branch + " : " + branch + "       " + Resources.Date + " : " + today,
                    textAlign: "right",
                    background: "#FFFFFF",
                    color: "#000000"
                }
                ];
                var title = [{
                    value: $("#Name").val(),
                    textAlign: "center",
                    background: "#FFFFFF",
                    color: "#000000"
                }];
                sheet.rows.splice(0, 0, { cells: myHeaders, type: "header", height: 40 });
                sheet.rows.splice(0, 0, { cells: title, type: "header", height: 40 });
            }
        });
        grid.data("kendoGrid").table.on("click", ".btnDelete", removeAccount);
        grid.data("kendoGrid").table.on("click", ".btnOpenReport", OpenReport);
    }

    function OpenReport() {

        var secModuleId = 0,
            refrenceId = 0,
            custodyId = 0,
            secModulePageId = 0;
        var row = $(this).closest("tr"),
            grid = $("#GlJournalVoucherList").data("kendoGrid"),
            dataItem = grid.dataItem(row);

        refrenceId = dataItem.fK_RefrenceId;
        secModuleId = dataItem.fK_SecModuleId;
        secModulePageId = dataItem.fK_SecModulePageId;
        custodyId = dataItem.fK_CustodyId;
        debugger

        if (refrenceId == null) { // سند قيد 
            var url = "/GlJournalVoucher/GlJournalVoucherDetailsReport/" + dataItem.id
            window.open(url, '_blank').print();
        }
        else if (refrenceId != null && refrenceId > 0 && secModuleId == 3) { // مدفوعات 

            if (secModulePageId == 30) { //فاتورة المشتريات
                var url = "/PayInvoice/ReportPrint?id=" + refrenceId;
                window.open(url, '_blank').print();
            }

            else if (secModulePageId == 29) { //إشعار مدين/دائن
                var url = "/PayNotice/ReportPrint?id=" + refrenceId;
                window.open(url, '_blank').print();
            }

            else if (secModulePageId == 27) { //سند صرف / قبض
                var url = "/PayBond/ReportPrint?id=" + refrenceId;
                window.open(url, '_blank').print();
            }
            else if (secModulePageId == 82) { //تسديد السندات
                var url = "/PayRepaymentBond/Report?id=" + refrenceId;
                window.open(url, '_blank').print();
            }
            else if (secModulePageId == 83) { //PayNoticeBond إشعار مدين/دائن
                var url = "/PayNoticeBond/Report?id=" + refrenceId;
                window.open(url, '_blank').print();
            }
            else {
                swal({
                    title: Resources.ErrorMsgResource,
                    confirmButtonText: Resources.DoneResource,
                    type: "error"
                });
            }

        }

        else if (refrenceId != null && refrenceId > 0 && secModuleId == 5) { // مقبوضات 

            if (secModulePageId == 42) { //فاتورة مبيعات
                var url = "/RceInvoice/ReportPrint?id=" + refrenceId;
                window.open(url, '_blank').print();
            }

            else if (secModulePageId == 45) { //إشعار مدين/دائن
                var url = "/RceNotice/ReportPrint?id=" + refrenceId;
                window.open(url, '_blank').print();
            }

            else if (secModulePageId == 40) { //سند صرف / قبض
                var url = "/RceBond/ReportPrint?id=" + refrenceId;
                window.open(url, '_blank').print();
            }
            else if (secModulePageId == 84) { //تسديد السندات
                var url = "/RceRepaymentBond/Report?id=" + refrenceId;
                window.open(url, '_blank').print();
            }
            else if (secModulePageId == 85) { //RceNoticeBond إشعار مدين/دائن
                var url = "/RceNoticeBond/Report?id=" + refrenceId;
                window.open(url, '_blank').print();
            }
            else {
                swal({
                    title: Resources.ErrorMsgResource,
                    confirmButtonText: Resources.DoneResource,
                    type: "error"
                });
            }
        }

        else if (refrenceId != null && refrenceId > 0 && secModuleId == 2) { // النقد و البنوك 

            if (secModulePageId == 16) { // سندات صرف
                var url = "/CbExchangeBond/CbExchangeBondDetailsReport?id=" + refrenceId;
                window.open(url, '_blank').print();
            }

            else if (secModulePageId == 17) { //سند قبض
                var url = "/CbReceiptBond/CbReceiptBondDetailsReport?id=" + refrenceId;
                window.open(url, '_blank').print();
            }
            else {
                swal({
                    title: Resources.ErrorMsgResource,
                    confirmButtonText: Resources.DoneResource,
                    type: "error"
                });
            }
        }

        else if (refrenceId != null && refrenceId > 0 && custodyId > 0 && secModuleId == 9) { // HR

            if (secModulePageId == 78) { //HrEmployeeCustodyDetail
                var url = "/HrEmployeeCustody/RevealExpensesCustodyPrint?id=" + custodyId + "&accStatementId=" + refrenceId;
                window.open(url, '_blank').print();
            }
            else {
                swal({
                    title: Resources.ErrorMsgResource,
                    confirmButtonText: Resources.DoneResource,
                    type: "error"
                });
            }
        }
        else {
            swal({
                title: Resources.ErrorMsgResource,
                confirmButtonText: Resources.DoneResource,
                type: "error"
            });
        }
    }
    function getCookie(cname) {
        var name = cname + "=";
        var decodedCookie = decodeURIComponent(document.cookie);
        var ca = decodedCookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length);
            }
        }
        return "";
    }
    function removeAccount() {

        var row = $(this).closest("tr"),
            grid = $("#GlJournalVoucherList").data("kendoGrid"),
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
                $.ajax({
                    url: "/GlJournalVoucher/DeleteVoucherWithDetails?id=" + dataItem.id,
                    type: "Get",
                    contentType: 'application/json; charset=utf-8',
                    success: function (result) {
                        debugger;
                        if (result) {
                            LoadGridVoucher();
                            swal({
                                title: Resources.DeleteSuccessResource,
                                confirmButtonText: Resources.DoneResource,
                                type: "success"
                            });
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

    $("#DefBranches").change(function () {

        var fK_DefBranchId = parseInt($("#FK_DefBranchId").val());
        $('#GlJournalVoucherList').data('kendoGrid').dataSource.read({ fK_DefBranchId: fK_DefBranchId });
    });
});


$("#btnDataReview").on('click', function () {

    var employeeName = $("#EmployeeName").val();
    var fK_DefBranchId = parseInt($("#FK_DefBranchId").val());

    $('#GlJournalVoucherList').data('kendoGrid').dataSource.read({ fK_DefBranchId: fK_DefBranchId, creatorName: employeeName });

});
$(".exportExcel").on('click', function () {
    $("#GlJournalVoucherList").getKendoGrid().saveAsExcel();
});
