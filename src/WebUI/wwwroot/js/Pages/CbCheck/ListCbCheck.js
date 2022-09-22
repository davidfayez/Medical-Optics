$(document).ready(function () {

    
    LoadGridVoucher();
    function LoadGridVoucher() {
        var grid = $("#CbCheckList").kendoGrid({
            excel: {
                fileName: "CbCheck.xlsx",
                allPages: true,
                filterable: true
            },
            dataSource: {
                transport: {
                    read: "/CbCheck/GetAllCbCheck"
                },
                schema: {
                    model: {
                        id: "id",
                        fields: {
                            checkNumber: { type: "string" },
                            fK_GlFinancialPeriodId: { type: "string" },
                            fK_DefCurrencyId: { type: "string" },
                            movementType: { type: "string" },
                            isActive: { editable: false },
                            //fK_CbAccountTypeId: { type: "string" },
                            //address: { type: "string" },
                            //website: { type: "string" },
                            //responsiblePerson: { type: "string" },
                            //fK_DefCurrencyId: { type: "string" },
                            //fK_GlAccountId: { type: "string" },
                            //fK_CbCreditMachineId: { type: "string" },
                            //fK_CbCheckFormEnglishId: { type: "string" },
                            //fK_CbCheckFormArabicId: { type: "string" },
                            
                        }
                    }
                },
                pageSize: Resources.GridPageSize
            },
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
            columns: [{
                field: "checkNumber",
                title: Resources.CheckNumber,
                width: Resources.CheckNumberWidth
            }, {
                    field: "fK_GlFinancialPeriodId",
                    title: Resources.FinancialPeriodName,
                    width: Resources.NameWidth
            }, {
                field: "fK_DefCurrencyId",
                    title: Resources.Currency,
                    width: Resources.NameWidth
            }, {
                    field: "movementType",
                    title: Resources.MovementType,
                    width: Resources.TypeWidth
            },
                { width: Resources.CheckboxWidth, template: "<input type='checkbox' data-bind='checked:isActive' class= 'control-label i-check' disabled = 'disabled' />", headerTemplate: Resources.Status },
                {
                    width: Resources.DoubleActionWidth, template: "<a  href='/CbCheck/Edit/#= id #'  class='btn btn-success btn-sm btnEdit'><i class='fas fa-edit'></i></a> <a  class='btn btn-danger btn-sm btnDelete' ><i class='fas fa-trash-alt'></i></a>" },

            ],
            dataBound: function (e) {
                e.sender.items().each(function () {
                    var dataItem = e.sender.dataItem(this);
                    kendo.bind(this, dataItem);
                    if (dataItem.isActive) {
                        // $(this).addClass("k-state-selected");
                    }
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
                sheet.mergedCells = ["A1:D1", "A2:D2"];
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
        grid.data("kendoGrid").table.on("click", ".btnDelete", removeAccount);
    }
    function removeAccount() {

        var row = $(this).closest("tr"),
            grid = $("#CbCheckList").data("kendoGrid"),
            dataItem = grid.dataItem(row);
        swal({
            title: Resources.DeleteResource,
            text:  Resources.DeleteConfirmResource,
            type: "info",
            showCancelButton: true,
            confirmButtonText: Resources.DeleteResource,
            cancelButtonText:  Resources.CancelResource,
            closeOnConfirm: false,
            showLoaderOnConfirm: true
        }, function () {
            setTimeout(function () {
                $.ajax({
                    url: "/CbCheck/Delete?id=" + dataItem.id,
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
        $('#CbCheckList').data('kendoGrid').dataSource.read({ fK_DefBranchId: fK_DefBranchId });
    });
});

$(".exportExcel").on('click', function () {
    $("#CbCheckList").getKendoGrid().saveAsExcel();
});
