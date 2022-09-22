$(document).ready(function () {



    loadCurrencyFactorGrid();
    // Used to wait for the children to finish the async export.
    var detailExportPromises = [];
    function loadCurrencyFactorGrid() {
        var dataSource = new kendo.data.DataSource({
            transport: {
                read: {
                    url: "/GlCurrencyFactor/GetAllCurrency",
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
                        currencyNameAr: { editable: false },
                        currencyNameEn: { editable: false },
                        isActive: { editable: false },
                        creationDate: { type: "date", editable: false },
                        lastModifiedDate: { type: "date", editable: false }

                    }
                }
            }
        });

        var element = $("#gridGlCurrencyFactor").kendoGrid({
            excel: {
                fileName: "Currency Factors.xlsx",
                allPages: true,
                filterable: true
            },
            dataSource: dataSource,
            height: 600,
            sortable: true,
            pageable: true,
            detailInit: detailInit,
            dataBound: function () {
                detailExportPromises = [];
                this.expandRow(this.tbody.find("tr.k-master-row").first());
            },
            excelExport: function (e) {

                e.preventDefault();

                var workbook = e.workbook;

                detailExportPromises = [];

                var masterData = e.data;

                for (var rowIndex = 0; rowIndex < masterData.length; rowIndex++) {
                    exportChildData(masterData[rowIndex].id, rowIndex);
                }

                $.when.apply(null, detailExportPromises)
                    .then(function () {
                        // Get the export results.
                        var detailExports = $.makeArray(arguments);

                        // Sort by masterRowIndex.
                        detailExports.sort(function (a, b) {
                            return a.masterRowIndex - b.masterRowIndex;
                        });

                        // Add an empty column.
                        workbook.sheets[0].columns.unshift({
                            width: 30
                        });


                        // Prepend an empty cell to each row.
                        for (var i = 0; i < workbook.sheets[0].rows.length; i++) {
                            workbook.sheets[0].rows[i].cells.unshift({});
                        }

                        // Merge the detail export sheet rows with the master sheet rows.
                        // Loop backwards so the masterRowIndex does not need to be updated.
                        for (var j = detailExports.length - 1; j >= 0; j--) {
                            var masterRowIndex = detailExports[j].masterRowIndex + 1; // compensate for the header row

                            var sheet = detailExports[j].sheet;

                            // Prepend an empty cell to each row.
                            for (var ci = 0; ci < sheet.rows.length; ci++) {
                                if (sheet.rows[ci].cells[0].value) {
                                    sheet.rows[ci].cells.unshift({});
                                }
                            }

                            // Insert the detail sheet rows after the master row.
                            [].splice.apply(workbook.sheets[0].rows, [masterRowIndex + 1, 0].concat(sheet.rows));
                        }

                        // Save the workbook.
                        kendo.saveAs({
                            dataURI: new kendo.ooxml.Workbook(workbook).toDataURL(),
                            fileName: "Currency Factors.xlsx"
                        });
                    });
            },
            columns: [
                {
                    field: "currencyNameAr",
                    title: Resources.NameAr,
                    width: "110px"
                }

            ]
        });


    }


    function exportChildData(currencyId, rowIndex) {

        var deferred = $.Deferred();

        detailExportPromises.push(deferred);
        var dataSourceDetails = new kendo.data.DataSource({
            transport: {
                read: {
                    url: "/GlCurrencyFactor/GetAllCurrencyFactors/" + currencyId,
                    Type: "GET"
                }
            },
            error: function (e) {
                alert("Status: " + e.status + "; Error message: " + e.errorThrown);
            },
            serverPaging: true,
            serverSorting: true,
            serverFiltering: true,
            pageSize: 30,
            filter: { field: "fK_DefCurrencyId", operator: "eq", value: currencyId },
            schema: {
                model: {
                    id: "id",
                    fields: {
                        id: { editable: false },
                        currencyNameAr: { editable: false },
                        currencyNameEn: { editable: false },
                        dateFrom: { type: "date", editable: false },
                        dateTo: { type: "date", editable: false },
                        factor: { editable: false },
                        isActive: { editable: false },
                        creationDate: { type: "date", editable: false },
                        lastModifiedDate: { type: "date", editable: false }

                    }
                }
            }
        });
        dataSourceDetails.filter({ field: "fK_DefCurrencyId", operator: "eq", value: currencyId });

        var exporter = new kendo.ExcelExporter({
            columns: [{

                field: "dateFrom", title: Resources.DateFromResource, format: "{0:yyyy/MM/dd}"

            }, {
                field: "dateTo", title: Resources.DateToResource, format: "{0:yyyy/MM/dd}"

            },
            { field: "factor", title: Resources.FactorRateResource }],
            dataSource: dataSourceDetails
        });
        exporter.workbook().then(function (book, data) {
            deferred.resolve({
                masterRowIndex: rowIndex,
                sheet: book.sheets[0]
            });
        });
    }
    function detailInit(e) {
        var dataSource = new kendo.data.DataSource({
            transport: {
                read: {
                    url: "/GlCurrencyFactor/GetAllCurrencyFactors/" + e.data.id,
                    Type: "GET"
                }
            },
            error: function (e) {
                alert("Status: " + e.status + "; Error message: " + e.errorThrown);
            },
            serverPaging: true,
            serverSorting: true,
            serverFiltering: true,
            pageSize: 30,
            filter: { field: "fK_DefCurrencyId", operator: "eq", value: e.data.id },
            schema: {
                model: {
                    id: "id",
                    fields: {
                        id: { editable: false },
                        currencyNameAr: { editable: false },
                        currencyNameEn: { editable: false },
                        dateFrom: { type: "date", editable: false },
                        dateTo: { type: "date", editable: false },
                        factor: { editable: false },
                        isActive: { editable: false },
                        creationDate: { type: "date", editable: false },
                        lastModifiedDate: { type: "date", editable: false }

                    }
                }
            }
        });
        $("<div/>").appendTo(e.detailCell).kendoGrid({
            dataSource: dataSource,
            scrollable: false,
            sortable: true,
            pageable: false,
            columns: [

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
                            });
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
                            });
                        }
                    }
                },
                { width: Resources.CheckboxWidth, template: "<input type='checkbox' data-bind='checked:isActive' name='act#=isActive#'  class= 'control-label i-check' disabled = 'disabled' />", headerTemplate: Resources.Status },
                { field: "factor", title: Resources.FactorRateResource, width: Resources.AmountWidth },
                { width: Resources.DoubleActionWidth, template: "<a  href='/GlCurrencyFactor/Edit/#= id #'  class='btn btn-success btn-sm btnEdit'><i class='fas fa-edit'></i></a> <a  class='btn btn-danger btn-sm btnDelete' onclick='deleteCurrencyFactor(#= id #)'><i class='fas fa-trash-alt'></i></a>" },

            ],
            dataBound: function (e) {
                e.sender.items().each(function () {
                    var dataItem = e.sender.dataItem(this);
                    kendo.bind(this, dataItem);
                    if (dataItem.isActive) {
                        //$(this).addClass("k-state-selected");
                    }
                });
                debugger;
                if (!hasRoleEdit)
                    $(".btnEdit").addClass('disabled');

                if (!hasRoleDelete)
                    $(".btnDelete").addClass('disabled');
            },

        });

        setTimeout(checkActive, 500);
    }

    function checkActive() {
        var chekboxesIsActive = document.getElementsByName("acttrue");
        for (var i = 0; i < chekboxesIsActive.length; i++) {
            chekboxesIsActive[i].checked = "true";
        }
    }
    //loadCurrencyFactor();
    function loadCurrencyFactor() {

        var dataSource = new kendo.data.DataSource({
            transport: {
                read: {
                    url: "/GlCurrencyFactor/GetAllCurrencyFactors",
                    Type: "GET"
                }
            },
            error: function (e) {
                alert("Status: " + e.status + "; Error message: " + e.errorThrown);
            },
            pageSize: 30,
            schema: {
                model: {
                    id: "id",
                    fields: {
                        id: { editable: false },
                        currencyNameAr: { editable: false },
                        currencyNameEn: { editable: false },
                        dateFrom: { type: "date", editable: false },
                        dateTo: { type: "date", editable: false },
                        factor: { editable: false },
                        isActive: { editable: false },
                        creationDate: { type: "date", editable: false },
                        lastModifiedDate: { type: "date", editable: false }

                    }
                }
            }
        });


        var grid = $("#gridGlCurrencyFactor").kendoGrid({
            dataSource: dataSource,

            serverPaging: true,
            serverFiltering: true,
            filterable: true,
            height: 550,
            groupable: true
            ,
            sortable: true,
            resizable: true,
            noRecords: true,
            messages: {
                noRecords: "There is no data on current page"
            },
            pageable: {
                pageSizes: [20, 40, 60, Resources.All],
                numeric: true,
                refresh: true,

            },
            columns: [

                { field: "currencyNameAr", title: Resources.NameAr, width: Resources.NameWidth },

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
                            });
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
                            });
                        }
                    }
                },

                // { width: "90px", template: "<input type='checkbox' data-bind='checked:isActive' class= 'control-label i-check' disabled = 'disabled' />", headerTemplate: resources.status },
                { width: Resources.CheckboxWidth, template: "<input type='checkbox' data-bind='checked:isActive' class= 'control-label i-check' disabled = 'disabled' />", headerTemplate: Resources.Status },
                { field: "factor", title: Resources.FactorRateResource, width: Resources.AmountWidth },
                { width: Resources.DoubleActionWidth, template: "<a  href='/GlCurrencyFactor/Edit/#= id #'  class='btn btn-success btn-sm btnEdit'><i class='fas fa-edit'></i></a> <a  class='btn btn-danger btn-sm btnDelete' ><i class='fas fa-trash-alt'></i></a>" },

            ],
            dataBound: function (e) {
                e.sender.items().each(function () {
                    var dataItem = e.sender.dataItem(this);
                    kendo.bind(this, dataItem);
                    if (dataItem.isActive) {
                        //$(this).addClass("k-state-selected");
                    }
                });
                //debugger;
                //if (!hasRoleEdit)
                //    $(".btnEdit").addClass('disabled');

                //if (!hasRoleDelete)
                //    $(".btnDelete").addClass('disabled');
            },
            //resizable: true,
        });
        grid.data("kendoGrid").table.on("click", ".btnDelete", deleteCurrencyFactor);


    }

    function deleteCurrencyFactor() {

        var row = $(this).closest("tr"),
            grid = $("#gridGlCurrencyFactor").data("kendoGrid"),
            dataItem = grid.dataItem(row);
        //var filters = grid.dataSource.filter();
        debugger;
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
                    url: "/GlCurrencyFactor/Delete?id=" + dataItem.id,
                    type: "Get",
                    contentType: 'application/json; charset=utf-8',
                    success: function (result) {

                        if (result) {
                            loadCurrencyFactor();
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

    $("#DefBranches").change(function () {
        debugger;
        var fK_DefBranchId = parseInt($("#FK_DefBranchId").val());
        $('#gridGlCurrencyFactor').data('kendoGrid').dataSource.read({ fK_DefBranchId: fK_DefBranchId });
    });
});


function deleteCurrencyFactor(id) {

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
                url: "/GlCurrencyFactor/Delete?id=" + id,
                type: "Get",
                contentType: 'application/json; charset=utf-8',
                success: function (result) {

                    if (result) {

                        //grid.refresh();
                        //grid.dataSource.filter(filters);
                        swal({
                            title: Resources.DeleteSuccessResource,
                            confirmButtonText: Resources.DoneResource,
                            type: "success"
                        });
                        location.reload();
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

$(".exportExcel").on('click', function () {
    $("#gridGlCurrencyFactor").getKendoGrid().saveAsExcel();
});