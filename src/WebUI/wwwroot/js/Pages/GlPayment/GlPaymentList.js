$(document).ready(function () {

    $('#DefBranches').change(function () {

        $("#FK_GlAccountId").data("kendoDropDownList").value("0");
        $("#FK_GlAccountId").data("kendoDropDownList").dataSource.read();

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
                    url: "/GlAccount/GetAllAccountsForDDList",
                },
                parameterMap: function (data, action) {
                    debugger
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
    });
    //  start payment grid
    var grid = $("#GridGlPayment").kendoGrid({
        excel: {
            fileName: "Payments.xlsx",
            allPages: true,
            filterable: true
        },
        dataSource: {
            //type: "jsonp",
            transport: {
                read: "/GlPayment/GetAll"
            },
            schema: {
                model: {
                    id: "id",
                    fields: {
                        creationDate: { type: "date" },
                        totalAmount: { type: "number" },
                        advanceAmount: { type: "number" },
                        accountName: { type: "string" },
                        isDone: { editable: false },
                    }
                }
            },
            pageSize: Resources.GridPageSize
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
            field: "accountName",
            title: Resources.Account,
            width: Resources.NameWidth
        }, {
            field: "totalAmount",
            title: Resources.TotalAmountResource,
            width: Resources.InputNumberWidth
        }, {
            field: "advanceAmount",
            title: Resources.DownPaymentResource,
            width: Resources.InputNumberWidth
        },
        { width: Resources.CheckboxWidth, template: "<input type='checkbox' data-bind='checked:isDone' class= 'control-label i-check' disabled = 'disabled' />", headerTemplate: Resources.Paid },

        {
            field: "creationDate",
            title: Resources.Date,
            format: "{0:yyyy/MM/dd}",
            width: Resources.DateWidth
        },
        { width: Resources.DoubleActionWidth, template: "<button class='btn btn-warning btn-sm btnOpenDetails' ><i class='fas fa-eye'></i></button> " },
            //  { width: Resources.CheckboxWidth, template: "<input type='checkbox' data-bind='checked:isDone' class= 'control-label i-check' disabled = 'disabled' />", headerTemplate: Resources.Posted },

        ],
        dataBound: function (e) {
            e.sender.items().each(function () {
                var dataItem = e.sender.dataItem(this);
                kendo.bind(this, dataItem);
                if (dataItem.isDone) {
                    /* $(this).addClass("k-state-selected");*/
                }
            })
            //if (!hasRoleEdit)
            //    $(".btnEdit").addClass('disabled');

            //if (!hasRoleDelete)
            //    $(".btnDelete").addClass('disabled');
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
            sheet.mergedCells = ["A1:B1", "A2:B2"];
            sheet.name = $("#Name").val();
            var now = new Date(),
                today = now.getFullYear() + "-" + ("0" + (now.getMonth() + 1)).slice(-2) + "-" + ("0" + now.getDate()).slice(-2);
            var branch = getCookie("branchName");

            var myHeaders = [{
                value: Resources.Branch + " : " + branch + "       " + Resources.Date + " : " + today.toString('dd-MMM-yyyy'),
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
    grid.data("kendoGrid").table.on("click", ".btnOpenDetails", OpenDetails);
    function OpenDetails() {

        var row = $(this).closest("tr"),
            grid = $("#GridGlPayment").data("kendoGrid"),
            dataItem = grid.dataItem(row);

        if (dataItem.id > 0) {
            $("#paymentDetails").modal();
            loadPaymentDetailsGrid(dataItem.id);
        }

        else {
            swal({
                title: Resources.ErrorMsgResource,
                confirmButtonText: Resources.DoneResource,
                type: "error"
            });
        }
    }

    //end payment grid

    //start payment details grid


    function loadPaymentDetailsGrid(paymentId) {
        var dataSource = new kendo.data.DataSource({
            transport: {
                read: {
                    url: "/GlPayment/GetPaymentDetailsByPaymentId?id=" + paymentId,
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
                        amount: { editable: false },
                        dueDate: { type: "date", editable: false },
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
        });


        var gridDetails = $("#gridGlPaymentDetails").kendoGrid({
            navigatable: false,
            pageable: false,
            scrollable: true,

            excel: {
                fileName: "Payment Details.xlsx",
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

                { field: "amount", title: Resources.TotalPayment, width: Resources.InputNumberWidth },
                { field: "dueDate", title: Resources.DueDate, width: Resources.DateWidth, format: "{0:yyyy/MM/dd}" },
                { field: "paidDate", title: Resources.PaidDate, width: Resources.DateWidth, format: "{0:yyyy/MM/dd}" },
                { width: Resources.CheckboxWidth, template: "<input type='checkbox' data-bind='checked:isPaid' class= 'control-label i-check' disabled = 'disabled' />", headerTemplate: Resources.Paid },
                { width: Resources.DoubleActionWidth, template: "<button class='btn btn-success btn-sm btnOpenPayment' >" + Resources.Pay + "</button> " },
            ],
            dataBound: function (e) {
                e.sender.items().each(function () {
                    var dataItem = e.sender.dataItem(this);
                    kendo.bind(this, dataItem);

                });

            },
            //resizable: true
        });

        gridDetails.data("kendoGrid").table.on("click", ".btnOpenPayment", OpenPayment);

        function OpenPayment() {

            var row = $(this).closest("tr"),
                grid = $("#gridGlPaymentDetails").data("kendoGrid"),
                dataItem = grid.dataItem(row);

            if (dataItem.id > 0 && dataItem.fK_GlPaymentId > 0 && dataItem.amount > 0) {
                var url = "/GlPaymentsCollection/Payment?payId=" + dataItem.fK_GlPaymentId + "&payDetailId=" + dataItem.id + "&detAmount=" + dataItem.amount
                window.open(url, '_blank');
            }

            else {
                swal({
                    title: Resources.ErrorMsgResource,
                    confirmButtonText: Resources.DoneResource,
                    type: "error"
                });
            }
        }
    }
});


$("#btnDataReview").on('click', function () {


    var accountId = parseInt($("#FK_GlAccountId").val()),
        fK_DefBranchId = parseInt($("#FK_DefBranchId").val()),
        dateFrom = $("#DateFrom").val(),
        dateTo = $("#DateTo").val();

    if (accountId == 0)
        accountId = null

    $('.exportExcel').fadeIn('slow');
    $('#GridGlPayment').data('kendoGrid').dataSource.read({ fK_GlAccountId: accountId, dateFrom: dateFrom, dateTo: dateTo, fK_DefBranchId: fK_DefBranchId });

});

$(".exportExcel").on('click', function () {
    $("#GridGlPayment").getKendoGrid().saveAsExcel();
});