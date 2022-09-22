$(document).ready(function () {

    var now = new Date(),
        //DateFrom = now.getFullYear() + "-" + ("0" + (now.getMonth() + 1)).slice(-2) + "-" + ("0" + now.getDate()).slice(-2),
        dateFrom = now.getFullYear() + "-" + ("0" + 1) + "-" + ("0" + 1), //2022-01-01
        dateTo = now.getFullYear() + "-" + ("12") + "-" + ("31"); // 2022-12-31
    $('#DateFrom').val(dateFrom);
    $('#DateTo').val(dateTo);

    $("#isNumber").on("change", function () {
        debugger;
        if ($(this).is(':checked')) {
            $('#Days').prop("disabled", false);
            $('#DateFrom').prop("disabled", true);
            $('#DateTo').prop("disabled", true);
        }
        else {
            $('#Days').val(null);
            $('#Days').prop("disabled", true);
            $('#DateFrom').prop("disabled", false);
            $('#DateTo').prop("disabled", false);
        }
    });

    $("#IsHigri").on("change", function () {
        debugger;
        if ($(this).is(':checked')) {

            $('#DateTo').val(null);
            $('#DateFrom').val(null);
            $('#DateTo').prop("disabled", true);
            $('#DateFrom').prop("disabled", true);
            $('#HigriDateFrom').prop("disabled", false);
            $('#HigriDateTo').prop("disabled", false);
        }
        else {
            $('#HigriDateTo').val(null);
            $('#HigriDateFrom').val(null);
            $('#HigriDateFrom').prop("disabled", true);
            $('#HigriDateTo').prop("disabled", true);
            $('#DateFrom').prop("disabled", false);
            $('#DateTo').prop("disabled", false);
        }
    });

    $('#DefBranches').change(function () {

        $("#documentTypeIds").data("kendoDropDownTree").dataSource.read();
        $("#documentTypeIds").data("kendoDropDownTree").value(1);

        $("#employeeIds").data("kendoDropDownTree").dataSource.read();
        $("#employeeIds").data("kendoDropDownTree").value(0);

    });

    //Grid Employee Documents
    var dataSource = new kendo.data.DataSource({
        transport: {
            read: {
                url: "/HrReports/GetEmployeeDocuments",
                traditional: true,
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
                    employeeCode: { editable: false },
                    employeeName: { editable: false },
                    documentNumber: { type: "string" },
                    documentName: { type: "string" },
                    dateExpiry: { type: "date" },
                    hijriDateExpiry: { type: "string" },
                    dateIssue: { type: "string" },
                }
            }
        }
    });
    $("#GridEmployeeDocuments").kendoGrid({
        excel: {
            fileName: "Employee Documents.xlsx",
            allPages: Resources.GridAllPages,
            filterable: Resources.GridFilterable
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
            { field: "employeeCode", title: Resources.EmployeeCode, width: Resources.NameWidth },
            { field: "employeeName", title: Resources.EmployeeName, width: Resources.NameWidth },
            { field: "documentNumber", title: Resources.DocumentNumber, width: Resources.NameWidth },
            { field: "documentTName", title: Resources.DocumentName, width: Resources.NameWidth },
            {
                field: "dateExpiry", title: Resources.DateExpiry, format: "{0:yyyy/MM/dd}", width: Resources.DateWidth,
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
                field: "hijriDateExpiry", title: Resources.HijriDate, /*format: "{0:yyyy/MM/dd}",*/ width: Resources.DateWidth,
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
                },
                //template: "#= kendo.toString(hijriDateExpiry,'yyyy/MM/dd') #"
                template: function (dataItem) {
                    return "<strong>" + kendo.toString(dataItem.hijriDateExpiry.split('T')[0]) + "</strong>";
                }
            },
            {
                field: "dateIssue", title: Resources.DateIssue, /*format: "{0:yyyy/MM/dd}",*/ width: Resources.DateWidth,
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
                },
                template: function (dataItem) {
                    return "<strong>" + kendo.toString(dataItem.dateIssue.split('T')[0]) + "</strong>";
                    //return "<strong>" + kendo.toString(dataItem.dateIssue.replace('T00:00:00', '')) + "</strong>";
                }
            },

        ],
        excelExport: function (e) {
            var workbook = e.workbook;
            var sheet = workbook.sheets[0];

            workbook.rtl = true;
            for (var i = 0; i < sheet.rows.length; i++) {
                for (var ci = 0; ci < sheet.rows[i].cells.length; ci++) {
                    debugger;
                    var higriDate = sheet.rows[i].cells[5].value;
                    var dateIssue = sheet.rows[i].cells[6].value;
                    sheet.rows[i].cells[5].value = higriDate.split('T')[0];
                    sheet.rows[i].cells[6].value = dateIssue.split('T')[0];
                }
            }
        },
        dataBound: function (e) {
            e.sender.items().each(function () {
                var dataItem = e.sender.dataItem(this);
                kendo.bind(this, dataItem);
                if (dataItem.hijriDateExpiry) {
                    //$(this).addClass("k-state-selected");
                }
            });
        },
    });

    //Employees Multi select 
    $("#employeeIds").kendoDropDownTree({
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

    $("#documentTypeIds").kendoDropDownTree({
        placeholder: Resources.Choose,
        filter: "contains",
        dataTextField: "typeNameAr",
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
                    url: "/HrLookups/GetAllHrDocumentType"
                },
                parameterMap: function (data, action) {

                    if (action === "read") {
                        return {
                            fK_DefBranchId: $("#FK_DefBranchId").val()
                        };


                    } else {
                        return data;
                    }
                }
            }
        }

    });
    $("#documentTypeIds").data("kendoDropDownTree").value(1);

   

});

$("#btnDataReview").on('click', function () {
    debugger;
    var dateFrom = $("#DateFrom").val(),
        dateTo = $("#DateTo").val(),
        days = $('#Days').val();
    var fK_DefBranchId = parseInt($("#FK_DefBranchId").val());

    var isHigri = $("#IsHigri").is(':checked')
    if (isHigri) {
        dateFrom = $("#HigriDateFrom").val();
        dateTo = $("#HigriDateTo").val();
    }
    var employeesMultiselect = $("#employeeIds").data("kendoDropDownTree").value(); // ["1","2"]
    var employeeIds = [];
    $.each(employeesMultiselect, function (i, v) {
        employeeIds.push(parseInt(v));
    });

    var documentTypesMultiselect = $("#documentTypeIds").data("kendoDropDownTree").value();
    var documentTypeIds = [];
    $.each(documentTypesMultiselect, function (i, v) {
        documentTypeIds.push(parseInt(v));
    });
    debugger
    $('.exportExcel').fadeIn('slow');
    $('#GridEmployeeDocuments').data('kendoGrid').dataSource.read({ isHigri: isHigri, dateFrom: dateFrom, dateTo: dateTo, days: days, fK_DefBranchId: fK_DefBranchId, employeeIds: employeeIds, documentTypeIds: documentTypeIds});
});

$(".exportExcel").on('click', function () {
    var grid = $("#GridEmployeeDocuments").data("kendoGrid");
    grid.saveAsExcel();
    //$("#GridEmployeeDocuments").getKendoGrid().saveAsExcel();
});

$(".btnPrint").on('click', function () {
    debugger;
    var dateFrom = $("#DateFrom").val(),
        dateTo = $("#DateTo").val(),
        days = $('#Days').val();
    var fK_DefBranchId = parseInt($("#FK_DefBranchId").val());

    var isHigri = $("#IsHigri").is(':checked')
    if (isHigri) {
        dateFrom = $("#HigriDateFrom").val();
        dateTo = $("#HigriDateTo").val();
    }

    var employeesMultiselect = $("#employeeIds").data("kendoDropDownTree").value();
    var employeeIds = [];
    $.each(employeesMultiselect, function (i, v) {
        employeeIds.push(parseInt(v));
    });

    var documentTypesMultiselect = $("#documentTypeIds").data("kendoDropDownTree").value();
    var documentTypeIds = [];
    $.each(documentTypesMultiselect, function (i, v) {
        documentTypeIds.push(parseInt(v));
    });

    var url = "/HrReports/EmployeeDocumentsPrint?isHigri=" +isHigri +"&dateFrom=" + dateFrom + "&dateTo=" + dateTo + "&days=" + days + "&fK_DefBranchId=" + fK_DefBranchId + "&employeeIds=" + employeeIds + "&documentTypeIds=" + documentTypeIds;
    window.open(url, '_blank');
});







