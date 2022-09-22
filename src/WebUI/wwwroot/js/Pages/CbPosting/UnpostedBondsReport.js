$(document).ready(function () {

    $("#btnDataReview").click(function () {
        $("#UnpostedBondGrid").html("");
        LoadUnpostedBondGrid();
    });

    $("#UnpostedBondGrid").kendoGrid({

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
        pageable: true,
        columns: [{ title: Resources.BondCodeResource, width: Resources.CodeWidth },
        { title: Resources.BondDateResource, width: Resources.DateWidth },
        { title: Resources.TotalAmountResource, width: Resources.AmountWidth },
        { title: Resources.CurrencyResource, width: Resources.TypeWidth },
        { title: Resources.CbAccountTypeResource, width: Resources.TypeWidth },
        { title: Resources.AccountCodeResource, width: Resources.CodeWidth },
        { title: Resources.AccountNameResource, width: Resources.NameWidth },
        { title: Resources.DescriptionResource, width: Resources.DescriptionWidth },
        { title: Resources.PayTypeResource, width: Resources.TypeWidth },
        ]
    });

    function LoadUnpostedBondGrid() {
        var datefrom = $("#inputDateFrom").val();
        var dateto = $("#inputDateTo").val();
        var fK_DefBranchId = parseInt($("#FK_DefBranchId").val());

        var bondType = 0;

        var grid = $("#UnpostedBondGrid").kendoGrid({
            excel: {
                fileName: "Unposted Bonds.xlsx",
                allPages: true,
                filterable: true
            },
            dataSource: {
                transport: {
                    read: {
                        url: "/CbPosting/GetUnpostedBondsReport?dateFrom=" + datefrom + "&&dateTo=" + dateto + "&&bondType=" + $("input[name='bondType']:checked").val() + "&&fK_DefBranchId=" + fK_DefBranchId
                    }
                },
                schema: {
                    model: {
                        id: "id",
                        fields: {
                            cbCashAndBankAccountCode: { type: "string" },
                            cbCashAndBankAccountName: { type: "string" },
                            serial: { type: "string" },
                            bondDate: { type: "date" },
                            amount: { type: "string" },
                            currency: { type: "string" },
                            cbCashAndBankAccounttype: { type: "string" },
                            description: { type: "string" },
                            payType: { type: "string" },
                        }
                    }
                },
                pageSize: 30
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
            pageable: true,
            columns: [
                {
                    field: "serial",
                    title: Resources.BondCodeResource,
                    width: Resources.CodeWidth
                },
                {
                    field: "bondDate",
                    title: Resources.BondDateResource,
                    width: Resources.DateWidth,
                    format: "{0:yyyy/MM/dd}"
                },
                {
                    field: "amount",
                    title: Resources.TotalAmountResource,
                    width: Resources.AmountWidth
                },
                {
                    field: "currency",
                    title: Resources.CurrencyResource,
                    width: Resources.TypeWidth
                },
                {
                    field: "cbCashAndBankAccounttype",
                    title: Resources.CbAccountTypeResource,
                    width: Resources.TypeWidth
                },
                {
                    field: "cbCashAndBankAccountCode",
                    title: Resources.AccountCodeResource,
                    width: Resources.CodeWidth
                },
                {
                    field: "cbCashAndBankAccountName",
                    title: Resources.AccountNameResource,
                    width: Resources.NameWidth
                },
                {
                    field: "description",
                    title: Resources.DescriptionResource,
                    width: Resources.DescriptionWidth
                },
                {
                    field: "payType",
                    title: Resources.PayTypeResource,
                    width: Resources.TypeWidth
                }

            ],
            dataBound: function (e) {
                e.sender.items().each(function () {
                    var dataItem = e.sender.dataItem(this);
                    kendo.bind(this, dataItem);
                    if (dataItem.isActive) {
                        // $(this).addClass("k-state-selected");
                    }
                });
            }
        });
    }

});

$(".exportExcel").on('click', function () {
    $("#UnpostedBondGrid").getKendoGrid().saveAsExcel();
});


$(".btnPrint").on('click', function () {
    var dateFromPicker = new Date($("#inputDateFrom").val()),
        dateFrom = dateFromPicker.getFullYear() + '-' + (dateFromPicker.getMonth() + 1) + '-' + dateFromPicker.getDate(),
        dateToPicker = new Date($("#inputDateTo").val()),
        dateTo = dateToPicker.getFullYear() + '-' + (dateToPicker.getMonth() + 1) + '-' + dateToPicker.getDate();
    var fK_DefBranchId = parseInt($("#FK_DefBranchId").val());

    var url = "/CbPosting/UnpostedBondsReportPrint?&dateFrom=" + dateFrom + "&&dateTo=" + dateTo + "&&id=" + $("input[name='bondType']:checked").val() + "&&fK_DefBranchId=" + fK_DefBranchId;
    window.open(url, '_blank').print();

});