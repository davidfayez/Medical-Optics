$(document).ready(function () {
    

    loadCitiesGrid();

    function loadCitiesGrid() {
        var dataSource = new kendo.data.DataSource({
            transport: {
                read: {
                    url: "/GlFinancialPeriod/GetAllGlFinancialPeriods",
                    Type: "GET"
                }
            },
            error: function (e) {
                alert("Status: " + e.status + "; Error message: " + e.errorThrown);
            },
            pageSize: Resources.GridPageSize,
            schema: {
                model: {
                    id: "id",
                    fields: {
                        id: { editable: false },
                        financialPeriodCode: { editable: false },
                        financialPeriodName: { editable: false },
                        dateFrom: { type: "date", editable: false },
                        dateTo: { type: "date", editable: false },
                        description: { editable: false },
                        FK_CreatorId: { editable: false },
                        creationDate: { type: "date", editable: false },
                        lastModifiedDate: { type: "date", editable: false },
                        isActive: { editable: false },
                        isOpen: { editable: false },
                        isDeleted: { editable: false },

                    }
                }
            }
        });


        var grid = $("#GlFinancialPeriodGrid").kendoGrid({
            excel: {
                fileName: "Financial Periods.xlsx",
                allPages: true,
                filterable: true
            },
            dataSource: dataSource,
            pageSize: 20,
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
                pageSizes: [20, 40, 60, Resources.All],
                numeric: Resources.GridNumeric,
                refresh: Resources.GridRefresh,

            },
            columns: [

                { field: "financialPeriodCode", title: Resources.Code, width: Resources.CodeWidth },
                { field: "financialPeriodName", title: Resources.FinancialPeriodNameResource, width: Resources.NameWidth },
               
                {
                    field: "dateFrom", title: Resources.DateFromResource, format: "{0:yyyy/MM/dd}", width: Resources.DateWidth,
                    filterable: {
                        operators: {
                            date: {
                                gte: Resources.IsAfterOrEqualTo,
                                lte: Resources.IsBeforeOrEqualTo
                            }
                        },
                        extra: false,
                        ui: function (element) {
                            element.kendoDatePicker({
                                format: '{0: dd/MM/yyyy}'
                            })
                        }
                    }
                }, {
                    field: "dateTo", title: Resources.DateToResource, format: "{0:yyyy/MM/dd}", width: Resources.DateWidth,
                    filterable: {
                        operators: {
                            date: {
                                gte: Resources.IsAfterOrEqualTo,
                                lte: Resources.IsBeforeOrEqualTo
                            }
                        },
                        extra: false,
                        ui: function (element) {
                            element.kendoDatePicker({
                                format: '{0: dd/MM/yyyy}'
                            })
                        }
                    }
                },
               // { width: "90px", template: "<input type='checkbox' data-bind='checked:isActive' class= 'control-label i-check' disabled = 'disabled' />", headerTemplate: resources.status },
                { width: Resources.CheckboxWidth, template: "<input type='checkbox' data-bind='checked:isOpen' class= 'control-label i-check' disabled = 'disabled' />", headerTemplate: Resources.Open },
                {
                    field: "creationDate", title: Resources.CreationDateResource, format: "{0:yyyy/MM/dd}", width: Resources.DateWidth,
                    filterable: {
                        operators: {
                            date: {
                                gte: Resources.IsAfterOrEqualTo,
                                lte: Resources.IsBeforeOrEqualTo
                            }
                        },
                        extra: false,
                        ui: function (element) {
                            element.kendoDatePicker({
                                format: '{0: dd/MM/yyyy}'
                            })
                        }
                    }
                },
                { width: Resources.DoubleActionWidth, template: "<a  href='/GlFinancialPeriod/Edit/#= id #'  class='btn btn-success btn-sm btnEdit'><i class='fas fa-edit'></i></a> <a  class='btn btn-danger btn-sm btnDelete' ><i class='fas fa-trash-alt'></i></a>" },

            ],
            dataBound: function (e) {
                e.sender.items().each(function () {
                    var dataItem = e.sender.dataItem(this);
                    kendo.bind(this, dataItem);
                    if (dataItem.isActive) {
                        //$(this).addClass("k-state-selected");
                    }
                });
                if (!hasRoleEdit)
                    $(".btnEdit").addClass('disabled');

                if (!hasRoleDelete)
                    $(".btnDelete").addClass('disabled');
            },
            resizable: true,
            excelExport: function (e) {

                var sheet = e.workbook.sheets[0];
                for (var i = 0; i < sheet.rows.length; i++) {
                    sheet.rows[i].cells.reverse();
                    for (var ci = 0; ci < sheet.rows[i].cells.length; ci++) {
                        sheet.rows[i].cells[ci].hAlign = "right";
                    }
                }
                //sheet.frozenRows = 2;
                sheet.mergedCells = ["A1:E1", "A2:E2"];
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
            },
        });
        grid.data("kendoGrid").table.on("click", ".btnDelete", removeFinancialPeriod);
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

    function removeFinancialPeriod() {

        //var deletee = stringify(resources.delete).serialize();

        var row = $(this).closest("tr"),
            grid = $("#GlFinancialPeriodGrid").data("kendoGrid"),
            dataItem = grid.dataItem(row);
        //var filters = grid.dataSource.filter();
        $.ajax({
            type: "Get",
            url: "/GlFinancialPeriod/CheckIsUsed?id=" + dataItem.id,
            contentType: 'application/json; charset=utf-8',
            success: function (response) {
                if (response) {
                    swal({
                        title: Resources.UesdFinancialPeriodResource,
                        confirmButtonText: Resources.CancelResource,
                        type: "error"
                    });
                } else {
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
                                url: "/GlFinancialPeriod/RemoveGlFinancialPeriod?Id=" + dataItem.id,
                                type: "Get",
                                contentType: 'application/json; charset=utf-8',
                                success: function (result) {
                                    debugger;
                                    if (result) {
                                        loadCitiesGrid();
                                        //grid.refresh();
                                        //grid.dataSource.filter(filters);
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

            }
        });
      
        
    }

    $("#DefBranches").change(function () {
        debugger;
        var fK_DefBranchId = parseInt($("#FK_DefBranchId").val());
        $('#GlFinancialPeriodGrid').data('kendoGrid').dataSource.read({ fK_DefBranchId: fK_DefBranchId });
    });


});

$(".exportExcel").on('click', function () {
    $("#GlFinancialPeriodGrid").getKendoGrid().saveAsExcel();
});