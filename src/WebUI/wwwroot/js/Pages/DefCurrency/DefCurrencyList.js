$(document).ready(function () {


    loadCurrenciesGrid();

    function loadCurrenciesGrid() {
        var dataSource = new kendo.data.DataSource({
            transport: {
                read: {
                    url: "/DefCurrency/GetAllCurrencies",
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
                        code: { editable: false },
                        currencyNameAr: { editable: false },
                        currencyNameEn: { editable: false },
                        abbreviationAr: { editable: false },
                        abbreviationEn: { editable: false },
                        defaultFactor: { editable: false },
                        notes: { editable: false },
                        FK_CreatorId: { editable: false },
                        creationDate: { type: "date", editable: false },
                        lastModifiedDate: { type: "date", editable: false },
                        isActive: { editable: false },
                        isPimary: { editable: false },
                        isDeleted: { editable: false },

                    }
                }
            }
        });


        var grid = $("#GridDefCurrency").kendoGrid({
            excel: {
                fileName: "Currencies.xlsx",
                allPages: Resources.GridAllPages,
                filterable: Resources.GridFilterable
            },
            dataSource: dataSource,
            //pageSize: Resources.GridPageSize,
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
                pageSizes: [20, 40, 60, Resources.All],
                numeric: Resources.GridNumeric,
                refresh: Resources.GridRefresh,

            },
            columns: [

                { field: "code", title: Resources.CodeResource, width: Resources.CodeWidth },
                { field: "currencyNameAr", title: Resources.NameArResource, width: Resources.NameWidth },
                //  { field: "currencyNameEn", title: Resources.NameEnResource, width: Resources.NameWidth },
                { field: "abbreviationAr", title: Resources.AbbreviationArResource, width: Resources.NameWidth },
                { field: "abbreviationEn", title: Resources.AbbreviationEnResource, width: Resources.NameWidth },
                { field: "defaultFactor", title: Resources.DefaultFactorResource, width: Resources.AmountWidth },


                {
                    width: Resources.CheckboxWidth, template: "<input type='checkbox' data-bind='checked:isPimary' class= 'control-label i-check' disabled = 'disabled' />", headerTemplate: Resources.Main
                },
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
                {
                    width: Resources.DoubleActionWidth, template: '#if(standalone==="True") {#<a  href="/DefCurrency/Edit/#= id #?standalone=1"  class="btn btn-success btn-sm btnEdit"><i class="fas fa-edit"></i></a> <a class="btn btn-danger btn-sm btnDelete"><i class="fas fa-trash-alt"></i></a>#} else {# <a  href="/DefCurrency/Edit/#= id # "  class="btn btn-success btn-sm btnEdit"><i class="fas fa-edit"></i></a> <a class="btn btn-danger btn-sm btnDelete"><i class="fas fa-trash-alt"></i></a>#}#'
                },
               
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
                sheet.mergedCells = ["A1:G1", "A2:G2"];
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
        grid.data("kendoGrid").table.on("click", ".btnDelete", removeCurrency);
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

    function removeCurrency() {
        var row = $(this).closest("tr"),
            grid = $("#GridDefCurrency").data("kendoGrid"),
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
                    url: "/DefCurrency/Delete?id=" + dataItem.id,
                    type: "Get",
                    contentType: 'application/json; charset=utf-8',
                    success: function (result) {
                        debugger;
                        if (result) {
                            loadCurrenciesGrid();
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
        $('#GridDefCurrency').data('kendoGrid').dataSource.read({ fK_DefBranchId: fK_DefBranchId });
    });
});


$(".exportExcel").on('click', function () {
    $("#GridDefCurrency").getKendoGrid().saveAsExcel();
});