$(document).ready(function () {

    $('#DefBranches').change(function () {
        $("#AccountId").val(0);
        $("#accountName").val("");
        $("#accountAutoCompleteBondAdd").data("kendoDropDownList").value("0");
        $("#accountAutoCompleteBondAdd").data("kendoDropDownList").dataSource.read();

    });
    //Account

    $("#accountAutoCompleteBondAdd").kendoDropDownList({
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
        select: onSelectAccount
    });

    function onSelectAccount(e) {

        $("#AccountId").val(e.dataItem.id);
        $("#accountName").val(e.dataItem.accountNameAr);
    }

    $("#FK_HrEmployeeId").kendoDropDownTree({
        placeholder: Resources.Choose,
        filter: "contains",
        dataTextField: "codeAndName",
        dataValueField: "id",
        height: 300,
        checkboxes: true,
        checkAll: true,
        autoClose: false,
        dataSource: {
            type: "json",
            //serverFiltering: true,
            transport: {
                read: {
                    url: "/HrEmployee/GetAllEmployeesForDDList",
                },
                parameterMap: function (data, action) {

                    if (action === "read") {
                        return {
                            code: $("#FK_HrEmployeeId").text(),
                            fK_DefBranchId: $("#FK_DefBranchId").val()
                        };


                    } else {
                        return data;
                    }
                }
            }
        }

    });

    var dataSource = new kendo.data.DataSource({
        transport: {
            read: {
                url: "/GlBond/GetAllSearch",
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
                    serial: { editable: false },
                    voucherDate: { type: "date", editable: false },
                    documentType: { editable: false },
                    accountCode: { editable: false },
                    accountName: { editable: false },
                    debit: { editable: false },
                    credit: { editable: false },
                    description: { editable: false },
                    referenceNumber: { editable: false },
                    referenceDate: { type: "date", editable: false },
                    costCenterCode: { editable: false },
                    costCenterName: { editable: false },
                    FK_GlJournalVoucherId: { editable: false },
                }
            }
        },
        aggregate: [
            { field: "debit", aggregate: "sum" },
            { field: "credit", aggregate: "sum" }
        ],
    });

    $("#GridGlBondSearch").kendoGrid({
        excel: {
            fileName: "Bonds.xlsx",
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
            pageSizes: [10, 20, 50, Resources.All],
            numeric: Resources.GridNumeric,
            refresh: Resources.GridRefresh,

        },
        columns: [

            { field: "serial", title: Resources.BondCode, width: Resources.DateWidth },
            { field: "voucherDate", title: Resources.BondDate, format: "{0:yyyy/MM/dd}", width: Resources.DateWidth },
            //{ field: "documentSerial", title: Resources.SerialResource, width: Resources.NameWidth },
            { field: "documentType", title: Resources.PayBondTypeResource, width: Resources.NameWidth },
            { field: "accountCode", title: Resources.AccountCodeResource, format: "{0:c}", width: Resources.DateWidth },
            { field: "accountName", title: Resources.AccountNameResource, width: Resources.NameWidth },
            { field: "debit", title: Resources.Debit, width: Resources.DateWidth, footerTemplate: "" + Resources.TotalDebit + ": #: sum # " },
            { field: "credit", title: Resources.Credit, width: Resources.DateWidth, footerTemplate: "" + Resources.TotalCredit + ": #: sum # " },
            { field: "referenceNumber", width: Resources.NameWidth, title: Resources.ReferenceNumber },
            { field: "referenceDate", title: Resources.ReferenceDate, format: "{0:yyyy/MM/dd}", width: Resources.DateWidth },
            { field: "costCenterCode", width: Resources.DateWidth, title: Resources.CostCenterCodeCCResource },
            { field: "costCenterName", width: Resources.NameWidth, title: Resources.CostCenterName },
            { field: "description", width: Resources.DescriptionWidth, title: Resources.Description },

            { width: Resources.DoubleActionWidth, template: "<a href='/GlBond/GlBondDetailsReport/#= fK_GlJournalVoucherId #'  target='_blank' class='btn btn-success btn-sm'><i class='fas fa-eye'></i></a> <a  href='/GlBond/Edit/#= fK_GlJournalVoucherId #' target='_blank'  class='btn btn-success btn-sm btnEdit'><i class='fas fa-edit'></i></a>" },
        ],
        dataBound: function (e) {
            e.sender.items().each(function () {
                var dataItem = e.sender.dataItem(this);
                kendo.bind(this, dataItem);
                if (dataItem.isActive) {
                    //$(this).addClass("k-state-selected");
                }
            });
        },
        excelExport: function (e) {
            var accountId = $("#accountName").val();
            var costCenterId = $("#costCenterName").val();
            if (accountId !== "")
                e.workbook.fileName = $("#accountName  option:selected").text();
            else if (costCenterId !== "")
                e.workbook.fileName = $("#costCenterName  option:selected").text();

            var sheet = e.workbook.sheets[0];
            for (var i = 0; i < sheet.rows.length; i++) {
                sheet.rows[i].cells.reverse();
                for (var ci = 0; ci < sheet.rows[i].cells.length; ci++) {
                    sheet.rows[i].cells[ci].hAlign = "right";
                }
            }
            //sheet.frozenRows = 2;
            sheet.mergedCells = ["A1:L1", "A2:L2", "A3:L3"];
            sheet.name = $("#Name").val();
            var from = $("#DateFrom").val();
            var to = $("#DateTo").val();
            var branch = getCookie("branchName");

            var account = [{
                value: Resources.AccountCode + " : " + $("#accountAutoComplete").val() + "       " + Resources.AccountName + " : " + $("#AccountName").val(),
                textAlign: "right",
                background: "#FFFFFF",
                color: "#000000"
            }
            ];
            var myHeaders = [{
                value: Resources.Branch + " : " + branch + "       " + Resources.DateFrom + " : " + from.toString('dd-MMM-yyyy') + "        " + Resources.DateTo + " : " + to.toString('dd-MMM-yyyy'),
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
            sheet.rows.splice(0, 0, { cells: title, type: "header", height: 40 });
            sheet.rows.splice(1, 0, { cells: account, type: "header", height: 40 });
            sheet.rows.splice(1, 0, { cells: myHeaders, type: "header", height: 40 });
            //sheet.rows.splice(sheet.rows.length, 0, { cells: myHeaders, type: "header", height: 70 });
        }
    });
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
    var accountCodeDataSource = new kendo.data.DataSource({

        serverFiltering: true,
        type: "json",
        transport: {
            read: {
                url: "/GlAccount/GetAllAutoCompleteBySearch"
            },
            parameterMap: function (data, action) {
                if (action === "read") {
                    debugger;
                    //var code = $("#accountAutoComplete").text();
                    var filter = data.filter.filters[0];
                    if (filter != undefined) {
                        return {

                            code: $("#accountAutoComplete").text(),
                            code: data.filter.filters[0].value
                        };
                    }


                } else {
                    return data;
                }
            }
        }
        ,
        schema: {
            model: {
                id: "Id",
                fields: {

                    accountCode: {
                        type: "string"
                    }
                }
            }
        }
    });

});


$("#btnDataReview").on('click', function () {


    var accountId = parseInt($("#AccountId").val()),
        voucherCode = $("#VoucherCode").val(),
        amount = parseFloat($("#Amount").val()),
        amountFrom = parseFloat($("#AmountFrom").val()),
        amountTo = parseFloat($("#AmountTo").val()),
        referenceNumber = $("#ReferenceNumber").val(),
        referenceDate = $("#ReferenceDate").val(),
        description = $("#Description").val(),
        dateFrom = $("#DateFrom").val(),
        dateTo = $("#DateTo").val();
    var fK_DefBranchId = parseInt($("#FK_DefBranchId").val());

    var multiemp = $("#FK_HrEmployeeId").data("kendoDropDownTree");
    var empIds = multiemp.value().join(", ");

    if (accountId == 0)
        accountId = null

    $('.exportExcel').fadeIn('slow');
    $('#GridGlBondSearch').data('kendoGrid').dataSource.read({ dateFrom: dateFrom, dateTo: dateTo, fK_GlAccountId: accountId, voucherCode: voucherCode, amount: amount, referenceNumber: referenceNumber, referenceDate: referenceDate, description: description, fK_DefBranchId: fK_DefBranchId, amountFrom: amountFrom, amountTo: amountTo, empIds: empIds });

});

$(".exportExcel").on('click', function () {
    $("#GridGlBondSearch").getKendoGrid().saveAsExcel();
});

