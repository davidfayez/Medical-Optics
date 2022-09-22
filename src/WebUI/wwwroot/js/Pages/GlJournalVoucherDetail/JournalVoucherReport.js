$(document).ready(function () {

  
    LoadGridVoucher();
    function LoadGridVoucher() {
        var grid = $("#GridJournalVoucherReport").kendoGrid({
            excel: {
                fileName: "Journal Voucher Report.xlsx",
                allPages: true,
                filterable: true
            },
            dataSource: {
                transport: {
                    read: "/GlJournalVoucher/GetJournalVoucherReport"
                },
                schema: {
                    model: {
                        id: "id",
                        fields: {
                            voucherCode: { type: "string" },
                            serial: { type: "string" },
                            fK_GlJournalVoucherCategoryId: { type: "string" },
                            fK_SecModuleId: { type: "string" },
                            voucherDate: { type: "date" },
                            IsPosted: { type: "string" },
                            notes: { type: "string" },
                            totalCredit: { type: "number" },
                            totalDebit: { type: "number" },

                        }
                    }
                },
                pageSize: 30,
                aggregate: [
                    { field: "totalCredit", aggregate: "sum" },
                    { field: "totalDebit", aggregate: "sum" }
                ]
            },
            serverPaging: Resources.GridServerPaging,
            serverFiltering: Resources.GridServerFiltering,
            filterable: Resources.GridFilterable,
            height: Resources.GridHeight,
            groupable: Resources.GridGroupable,
            sortable: Resources.GridSortable,
            resizable: Resources.GridResizable,
            noRecords: Resources.GridServerPaging,
            messages: {
                noRecords: Resources.GridNoRecordsMessage
            },
            pageable: {
                pageSizes: [10, 20, 50, Resources.All],
                numeric: Resources.GridNumeric,
                refresh: Resources.GridRefresh,

            },
            columns: [
                {
                    field: "voucherCode",
                    title: Resources.VoucherCodeResource,
                    width: Resources.CodeWidth
                },
                {
                    field: "serial",
                    title: Resources.SerialResource,
                    width: Resources.CodeWidth
                },
                {
                    field: "fK_GlJournalVoucherCategoryId",
                    title: Resources.GlJournalVoucherCategoryResource,
                    width: Resources.NameWidth
                },
                {
                    field: "voucherDate",
                    title: Resources.VoucherDateResource,
                    format: "{0:yyyy/MM/dd}",
                    width: Resources.DateWidth
                },
                { width: Resources.CheckboxWidth, template: "<input type='checkbox' data-bind='checked:isPosted' class= 'control-label i-check' disabled = 'disabled' />", headerTemplate: Resources.PostedStatus },
                {
                    field: "notes",
                    title: Resources.Notes,
                    width: Resources.NoteWidth
                },
                {
                    field: "totalCredit",
                    title: Resources.TotalCredit,
                    width: Resources.AmountWidth,
                    footerTemplate: Resources.Total + ": #: sum #"
                },
                {
                    field: "totalDebit",
                    title: Resources.TotalDebit,
                    width: Resources.AmountWidth,
                    footerTemplate: Resources.Total + ": #: sum #"
                }],
            dataBound: function (e) {
                e.sender.items().each(function () {
                    var dataItem = e.sender.dataItem(this);
                    kendo.bind(this, dataItem);
                    if (dataItem.isActive) {
                        $(this).addClass("k-state-selected");
                    }
                })
            },
        });
    }

    $("#btnDataReview").on('click', function () {
        debugger;
        var dateFrom = $("#DateFrom").val(),
            dateTo = $("#DateTo").val();
        var fK_DefBranchId = parseInt($("#FK_DefBranchId").val());

        $('#GridJournalVoucherReport').data('kendoGrid').dataSource.read({ dateFrom: dateFrom, dateTo: dateTo, fK_DefBranchId: fK_DefBranchId});
    });
});

$(".exportExcel").on('click', function () {
    $("#GridJournalVoucherReport").getKendoGrid().saveAsExcel();
});


$(".btnPrint").on('click', function () {
    var dateFrom = $("#DateFrom").val(),
        dateTo = $("#DateTo").val();
    var fK_DefBranchId = parseInt($("#FK_DefBranchId").val());

    var url = "/GlJournalVoucher/JournalVoucherReportPrint?&dateFrom=" + dateFrom + "&dateTo=" + dateTo + "&fK_DefBranchId=" + fK_DefBranchId;
    window.open(url, '_blank');
});