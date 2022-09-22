$(function () {
    var resources = {

        mainAccountName: $('#MainAccountNameResource').text(),
        accountCode: $('#AccountCodeResource').text(),
        accountName: $("#AccountNameResource").text(),
        creationDate: $('#CreationDateResource').text(),
        totalAmount: $('#TotalAmountResource').text(),
        status: Resources.Status,
        all: Resources.All,
        isAfterOrEqualTo: Resources.IsAfterOrEqualTo,
        isBeforeOrEqualTo: Resources.IsBeforeOrEqualTo
    };

    $('#DefBranches').change(function () {

        $("#FK_GlAccountId").data("kendoDropDownList").value(0);
        $("#FK_GlAccountId").data("kendoDropDownList").dataSource.read();


        var fK_DefBranchId = parseInt($("#FK_DefBranchId").val());
        $('#GridCbExchangeBond').data('kendoGrid').dataSource.read({ fK_DefBranchId: fK_DefBranchId });

    });

    //$("#FK_GlAccountId").kendoDropDownList({
    //    filter: "contains",
    //    height: 300,
    //    dataTextField: "codeAndName",
    //    dataValueField: "id",
    //    dataSource: {
    //        type: "json",
    //        //serverFiltering: true,
    //        transport: {
    //            read: {
    //                url: "/GlAccount/GetAllAccountsForDDList",
    //            },
    //            parameterMap: function (data, action) {
    //                debugger
    //                if (action === "read") {
    //                    if (Object.keys(data).length > 0 && data.filter != undefined && data.filter.filters["length"] > 0) {
    //                        return {
    //                            code: data.filter.filters[0].value,
    //                            defBranchId: parseInt($("#FK_DefBranchId").val()),
    //                        };
    //                    } else {
    //                        return {
    //                            code: "",
    //                            defBranchId: parseInt($("#FK_DefBranchId").val()),
    //                        };
    //                    }

    //                } else {
    //                    return data;
    //                }
    //            }
    //        }
    //    },
    //});
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
                    url: "/CbCashAndBankAccount/GetGlAccountsForCashAndBank",//GetAllAccountsForDDLTree",
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
        // select: onCashAndBankSelect
    });
    loadCbExchangeBondGrid();

    function loadCbExchangeBondGrid() {
        var dataSource = new kendo.data.DataSource({
            transport: {
                read: {
                    url: "/CbExchangeBond/GetAll?fK_DefBranchId=" + $("#FK_DefBranchId").val() + "&accountId=" + parseInt($("#FK_GlAccountId").data("kendoDropDownList").value()),
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
                        //mainAccountName: { editable: false },
                        serial: { editable: false },
                        accountCode: { editable: false },
                        accountName: { editable: false },
                        totalAmount: { editable: false },
                        fK_GlJournalVoucherId: { editable: false },
                        bondDate: { type: "date", editable: false },
                        IsPosted: { type: "string" }


                    }
                }
            }
        });


        var grid = $("#GridCbExchangeBond").kendoGrid({
            excel: {
                fileName: "Exchange Bonds.xlsx",
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

                //{ field: "mainAccountName", title: Resources.MainAccountNameResource, width: Resources.NameWidth },

                {
                    field: "serial",
                    title: Resources.BondCodeResource,
                    //locked: true,
                    //lockable: false,
                    width: Resources.CodeWidth
                }, 
                {
                    field: "bondDate", title: Resources.CreationDateResource, format: "{0:yyyy/MM/dd}", width: Resources.DateWidth,
                    filterable: {
                        operators: {
                            date: {
                                gte: resources.isAfterOrEqualTo,
                                lte: resources.isBeforeOrEqualTo
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
                    field: "accountCode", title: Resources.AccountCodeResource, width: Resources.CodeWidth
                },
                { field: "accountName", title: Resources.AccountNameResource, width: Resources.NameWidth },
                { field: "totalAmount", title: Resources.TotalAmountResource, width: Resources.AmountWidth },
                { width: Resources.CheckboxWidth, template: "<input type='checkbox' data-bind='checked:isPosted' class= 'control-label i-check' disabled = 'disabled' />", headerTemplate: Resources.Posted },

                {
                    width: Resources.DoubleActionWidth, template: "<a  href='/CbExchangeBond/Edit/#= id #'  class='btn btn-success btn-sm btnEdit'><i class='fas fa-edit'></i></a> <a  class='btn btn-danger btn-sm btnDelete' ><i class='fas fa-trash-alt'></i></a>  <a  class='btn btn-warning btn-sm btnOpenVoucherReport'><i class='fas fa-eye'></i></a>"
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
        grid.data("kendoGrid").table.on("click", ".btnDelete", removeBond);
        grid.data("kendoGrid").table.on("click", ".btnOpenVoucherReport", OpenVoucherReport);
    }

    function OpenVoucherReport() {

        var row = $(this).closest("tr"),
            grid = $("#GridCbExchangeBond").data("kendoGrid"),
            dataItem = grid.dataItem(row);
        if (dataItem.fK_GlJournalVoucherId > 0) {
            var url = "/GlJournalVoucher/GlJournalVoucherDetailsReport/" + dataItem.fK_GlJournalVoucherId
            window.open(url, '_blank').print();
        }
    }

    function removeBond() {

        var row = $(this).closest("tr"),
            grid = $("#GridCbExchangeBond").data("kendoGrid"),
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
                    url: "/CbExchangeBond/Delete?id=" + dataItem.id,
                    type: "Get",
                    contentType: 'application/json; charset=utf-8',
                    success: function (result) {
                        debugger;
                        if (result) {
                            loadCbExchangeBondGrid();
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

    $("#btnShowBonds").click(function () {
        loadCbExchangeBondGrid();
    })
});

$(".exportExcel").on('click', function () {
    $("#GridCbExchangeBond").getKendoGrid().saveAsExcel();
});