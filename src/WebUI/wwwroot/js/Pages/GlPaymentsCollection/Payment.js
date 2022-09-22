$(document).ready(function () {
    loadPaidDetailsGrid($("#FK_GlPaymentId").val());
    function loadPaidDetailsGrid(paymentId) {
        var dataSource = new kendo.data.DataSource({
            transport: {
                read: {
                    url: "/GlPaymentsCollection/GetPaidPaymentDetailsByPaymentId?id=" + paymentId,
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
                        fK_GlPaymentId: { editable: false },
                        bondId: { editable: false },
                        bondType: { editable: false },
                        glVoucherId: { editable: false },
                        amount: { editable: false },
                        paymentDetailAmount: { editable: false },
                        remaining: { editable: false },
                        paymentDate: { type: "date", editable: false },
                        paidDate: { type: "date", editable: false },
                        FK_CreatorId: { editable: false },
                        creationDate: { type: "date", editable: false },
                        lastModifiedDate: { type: "date", editable: false },
                        isActive: { editable: false },
                        isDeleted: { editable: false },
                        isPaid: { editable: false },

                    }
                }
            }
            ,
            change: function (e) {

            },
            aggregate: [
                { field: "amount", aggregate: "sum" },
                { field: "paymentDetailAmount", aggregate: "sum" },
                { field: "remaining", aggregate: "sum" }
            ],
        });


        var gridDetails = $("#gridPaidDetail").kendoGrid({
            navigatable: false,
            pageable: false,
            scrollable: true,

            excel: {
                fileName: "Paid.xlsx",
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
                { width: Resources.InputNumberWidth, template: "<span class='counter'> </span>", title: Resources.Serial, footerTemplate: "" + Resources.Total + "" },

                { field: "paymentDetailAmount", title: Resources.Amount, format: '{0:n2}', width: Resources.InputNumberWidth, footerTemplate: "#: sum # " },
                { field: "paymentDate", title: Resources.PaidDate, width: Resources.DateWidth, format: "{0:yyyy/MM/dd}" },
                { field: "amount", title: Resources.PaidAmount, format: '{0:n2}', width: Resources.InputNumberWidth, footerTemplate: " #: sum # " },
                { field: "", title: Resources.RemainingAmount, width: Resources.AmountWidth, format: '{0:n2}', footerTemplate: " <span id='totalRemaining'> 555</span>" },
                // { field: "remaining", title: Resources.RemainingAmount, format: '{0:n2}', width: Resources.InputNumberWidth, footerTemplate: " #: sum # " },
                {
                    width: Resources.DoubleActionWidth, template: "<button type='button' class='btn btn-success btn-sm btnCreateExBond' title='" + Resources.Add + " " + Resources.ExchangeBond + "' ><i class='fas fa-plus'></i></button>#if(bondId>0){# <button type='button' class='btn btn-warning btn-sm btnPrintExBond' title='" + Resources.Print + " " + Resources.ExchangeBond + "' ><i class='fas fa-eye'></i></button>#}else{# <button type='button' class='btn btn-warning btn-sm ' disabled ><i class='fas fa-eye'></i></button> #}# #if(glVoucherId>0){# <button type='button' class='btn btn-warning btn-sm btnPrintVoucher' title='" + Resources.Print + " " + Resources.GlJournalVoucherResource + "' ><i class='fas fa-eye'></i></button>#}else{# <button type='button' class='btn btn-warning btn-sm ' disabled ><i class='fas fa-eye'></i></button> #}# "
                },

            ],
            dataBound: function (e) {
                e.sender.items().each(function () {
                    var dataItem = e.sender.dataItem(this);
                    kendo.bind(this, dataItem);

                });
                setGridSerial();
                getTotalRemaining();
            },
            //resizable: true
        });

        gridDetails.data("kendoGrid").table.on("click", ".btnCreateExBond", CreateExBond);
        gridDetails.data("kendoGrid").table.on("click", ".btnPrintExBond", PrintExBond);
        gridDetails.data("kendoGrid").table.on("click", ".btnPrintVoucher", PrintVoucher);


    }

    function CreateExBond() {

        var row = $(this).closest("tr"),
            grid = $("#gridPaidDetail").data("kendoGrid"),
            dataItem = grid.dataItem(row);

        if (dataItem.id > 0) {
            var url = "/CbExchangeBond/Create?refId=" + dataItem.id + "&refType=" + 1 + "&pageId=" + 80 + "&amount=" + parseFloat(dataItem.amount)
            window.open(url, '_self');
        }

        else {
            swal({
                title: Resources.ErrorMsgResource,
                confirmButtonText: Resources.DoneResource,
                type: "error"
            });
        }
    }
    function PrintExBond() {

        var row = $(this).closest("tr"),
            grid = $("#gridPaidDetail").data("kendoGrid"),
            dataItem = grid.dataItem(row);

        if (dataItem.bondId > 0 && dataItem.bondType == 1) { // سندات صرف
            var url = "/CbExchangeBond/CbExchangeBondDetailsReport?id=" + dataItem.bondId;
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
    function PrintVoucher() {
        var row = $(this).closest("tr"),
            grid = $("#gridPaidDetail").data("kendoGrid"),
            dataItem = grid.dataItem(row);

        if (dataItem.glVoucherId > 0) {
            var url = "/GlJournalVoucher/GlJournalVoucherDetailsReport/" + dataItem.glVoucherId
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

    function setGridSerial() {

        var grid = $("#gridPaidDetail").data("kendoGrid");
        var counter = 1;
        grid.tbody.find("tr[role='row']").each(function () {
            $(this).find(".counter").text(counter);
            counter += 1;

        });
    }

    function getTotalRemaining() {

        var grid = $("#gridPaidDetail").data("kendoGrid");
        var totalPaid = 0;
        var gridData = grid.dataSource.view();
        for (var i = 0; i < grid.dataSource.data().length; i++) {
            totalPaid += parseFloat(gridData[i].amount);
        }
        debugger

        var totalAmount = parseFloat($("#TotalAmount").val());
        var remaining = (totalAmount - totalPaid).toFixed(2);
        var span = $("#totalRemaining");

        span.html(remaining.toString());
        return parseFloat(5000).toFixed(2);
    }
});