$(document).ready(function () {
    $('#DefBranches').change(function () {

        $("#FK_GlAccountId").data("kendoDropDownList").value("0");
        $("#FK_GlAccountId").data("kendoDropDownList").dataSource.read();

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
    LoadGridVoucher();
    function LoadGridVoucher() {
        var grid = $("#CbTransferBondList").kendoGrid({
            excel: {
                fileName: "Transfer Bond.xlsx",
                allPages: true,
                filterable: true
            },
            dataSource: {
                transport: {
                    read: "/CbTransferBond/GetAllTransferBond?fK_DefBranchId=" + $("#FK_DefBranchId").val() + "&accountId=" + parseInt($("#FK_GlAccountId").data("kendoDropDownList").value()),
                },
                schema: {
                    model: {
                        id: "id",
                        fields: {
                            serial: { type: "number" },
                            fK_CbPayTypeId: { type: "string" },
                            fK_DefCurrencyId: { type: "string" },
                            fK_CbCashAndBankAccountDebitId: { type: "string" },
                            fK_CbCashAndBankAccountCrediId: { type: "string" },
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
                field: "serial",
                title: Resources.Serial,
                width: Resources.CodeWidth
            }, {
                field: "fK_CbPayTypeId",
                title: Resources.PayType,
                width: Resources.TypeWidth
            }, {
                field: "fK_DefCurrencyId",
                title: Resources.Currency,
                width: Resources.TypeWidth
            }, {
                field: "fK_CbCashAndBankAccountDebitId",
                title: Resources.CashAndBankAccountDebit,
                width: Resources.NameWidth
            },
            {
                field: "fK_CbCashAndBankAccountCrediId",
                title: Resources.CashAndBankAccountCredit,
                width: Resources.NameWidth
            },
            {
                width: Resources.CheckboxWidth, template: "<input type='checkbox' data-bind='checked:isActive' class= 'control-label i-check' disabled = 'disabled' />", headerTemplate: Resources.Status
            },
            { width: Resources.DoubleActionWidth, template: "<a  href='/CbTransferBond/Edit/#= id #'  class='btn btn-success btn-sm btnEdit'><i class='fas fa-edit'></i></a> <a  class='btn btn-danger btn-sm btnDelete' ><i class='fas fa-trash-alt'></i></a>" },

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
            grid = $("#CbTransferBondList").data("kendoGrid"),
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
                    url: "/CbTransferBond/Delete?id=" + dataItem.id,
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
        $('#CbTransferBondList').data('kendoGrid').dataSource.read({ fK_DefBranchId: fK_DefBranchId });

        $("#FK_GlAccountId").data("kendoDropDownList").value(0);
        $("#FK_GlAccountId").data("kendoDropDownList").dataSource.read();
    });

    $("#btnShowBonds").click(function () {
        LoadGridVoucher();
    })
});

$(".exportExcel").on('click', function () {
    $("#CbTransferBondList").getKendoGrid().saveAsExcel();
});
