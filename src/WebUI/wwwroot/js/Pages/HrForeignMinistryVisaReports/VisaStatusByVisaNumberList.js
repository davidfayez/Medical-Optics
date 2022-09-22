$(document).ready(function () {

    $('#DefBranches').change(function () {

        $("#visaNumber").data("kendoDropDownList").dataSource.read();
        $("#visaNumber").data("kendoDropDownList").value(0);

        $("#DefCountryAutoComplete").data("kendoDropDownList").dataSource.read();
        $("#FK_DefCountryId").data("kendoDropDownList").value(0);

        $("#HrJobAutoComplete").data("kendoDropDownList").dataSource.read();
        $("#FK_HrJobId").data("kendoDropDownList").value(0);


        $("#FK_HrEmployeeId").data("kendoDropDownList").dataSource.read();
        $("#FK_HrEmployeeId").data("kendoDropDownList").value(0);

        $("#FK_HrAgencyTypeId").data("kendoDropDownList").dataSource.read();
        $("#FK_HrAgencyTypeId").data("kendoDropDownList").value(0);

    });

    $("#btnDataReview").click(function () {
        LoadgridVisaStatusByVisaNumber();
    });

    $("#gridForeignMinistryVisa").kendoGrid({

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
        columns: [
            {
                field: "visaNumber",
                title: Resources.VisaNumber,
                width: Resources.CodeWidth
            },
            {
                field: "expiryDate", title: Resources.ExpiryDate, format: "{0:yyyy/MM/dd}", width: Resources.DateWidth,
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
                field: "totalVisaCount",
                title: Resources.TotalVisaCount,
                width: Resources.CodeWidth
            },
            {
                field: "visaCount",
                title: Resources.VisaCount,
                width: Resources.CodeWidth
            },
            {
                field: "countryName",
                title: Resources.DefCountry,
                width: Resources.CodeWidth
            },
            {
                field: "jobName",
                title: Resources.Job,
                width: Resources.CodeWidth
            },
            {
                field: "employeeCode",
                title: Resources.EmployeeCode,
                width: Resources.CodeWidth
            },
            {
                field: "employeeName",
                title: Resources.EmployeeName,
                width: Resources.NameWidth
            },
            {
                field: "arrivalDate", title: Resources.ExpiryDate, format: "{0:yyyy/MM/dd}", width: Resources.DateWidth,
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

        ],
    });

    function LoadgridVisaStatusByVisaNumber() {
        var dateFrom = $("#dateFrom").val();
        var dateTo = $("#dateTo").val();
        var expiryDate = $("#ExpiryDate").val();
        var fk_HrEmployeeId = $("#FK_HrEmployeeId").val();
        var fK_DefCountryId = $("#FK_DefCountryId").val();
        var fK_HrJobId = $("#FK_HrJobId").val();
        var fk_DefBranchId = parseInt($("#FK_DefBranchId").val());
        var fK_HrAgencyTypeId = $("#FK_HrAgencyTypeId").val();
        var visaNumber = $("#visaNumber").data("kendoDropDownList").text();

        if (fK_HrAgencyTypeId == 0)
            fK_HrAgencyTypeId = null;
        if (fk_HrEmployeeId == 0)
            fk_HrEmployeeId = null;
        if (visaNumber == "اختر")
            visaNumber = null;
        var grid = $("#gridForeignMinistryVisa").kendoGrid({
            excel: {
                fileName: "Employee Visa.xlsx",
                allPages: true,
                filterable: true
            },
            dataSource: {
                transport: {
                    read: {
                        url: "/HrForeignMinistryVisaReports/VisaStatusByVisaNumberReportView",
                        type: "POST",
                        data: { dateFrom: dateFrom, dateTo: dateTo, fk_HrEmployeeId: fk_HrEmployeeId, fk_DefBranchId: fk_DefBranchId, fK_HrAgencyTypeId: fK_HrAgencyTypeId, visaNumber: visaNumber, expiryDate: expiryDate, fK_HrJobId: fK_HrJobId, fK_DefCountryId: fK_DefCountryId }
                    }
                },
                schema: {
                    model: {
                        //id: "id",
                        fields: {
                            visaNumber: { type: "string" },
                            expiryDate: { type: "date" },
                            totalVisaCount: { type: "number" },
                            visaCount: { type: "number" },
                            countryName: { type: "string" },
                            jobName: { type: "string" },
                            employeeCode: { type: "string" },
                            employeeName: { type: "string" },
                            arrivalDate: { type: "date" },
                        }
                    }
                },
                pageSize: 30,
                aggregate: [
                    { field: "totalDebit", aggregate: "sum" },
                    { field: "totalCridet", aggregate: "sum" },
                    { field: "balance", aggregate: "sum" },
                    { field: "credit", aggregate: "sum" },
                    { field: "debit", aggregate: "sum" }
                ]
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
            columns: [
                {
                    field: "visaNumber",
                    title: Resources.VisaNumber,
                    width: Resources.CodeWidth
                },
                {
                    field: "expiryDate", title: Resources.ExpiryDate, format: "{0:yyyy/MM/dd}", width: Resources.DateWidth,
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
                    field: "totalVisaCount",
                    title: Resources.TotalVisaCount,
                    width: Resources.CodeWidth
                },
                {
                    field: "visaCount",
                    title: Resources.VisaCount,
                    width: Resources.CodeWidth
                },
                {
                    field: "countryName",
                    title: Resources.DefCountry,
                    width: Resources.CodeWidth
                },
                {
                    field: "jobName",
                    title: Resources.Job,
                    width: Resources.CodeWidth
                },
                {
                    field: "employeeCode",
                    title: Resources.EmployeeCode,
                    width: Resources.CodeWidth
                },
                {
                    field: "employeeName",
                    title: Resources.EmployeeName,
                    width: Resources.NameWidth
                },
                {
                    field: "arrivalDate", title: Resources.ExpiryDate, format: "{0:yyyy/MM/dd}", width: Resources.DateWidth,
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

            ],
            dataBound: function (e) {
                e.sender.items().each(function () {
                    var dataItem = e.sender.dataItem(this);
                    kendo.bind(this, dataItem);
                    if (dataItem.isActive) {
                        $(this).addClass("k-state-selected");
                    }
                });
            }
        });
    }

    $("#DefCountryAutoComplete").kendoDropDownList({
        filter: "contains",
        height: 300,
        dataTextField: "countryNameAr",
        dataValueField: "id",
        headerTemplate: '<div class="dropdown-header k-widget k-header">' +
            '<span style="margin-left:100px">' + Resources.Code + '</span>' +
            '<span>' + Resources.Country + '</span>' +
            '</div>',
        //valueTemplate: '<span class="selected-value"></span><span>' + Resources.Choose + '</span>',
        template: '<span class="k-state-default" style="margin-left:150px">#: data.countryCode #</span>' +
            '<span class="k-state-default">#: data.countryNameAr #</span>',
        dataSource: {
            type: "json",
            //serverFiltering: true,
            transport: {
                read: {
                    url: "/DefCountry/GetAllForDDList",
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
        select: onSelectDefCountry
    });
    function onSelectDefCountry(e) {
        debugger;
        $("#FK_DefCountryId").val(e.dataItem.id);
    }

    $("#HrJobAutoComplete").kendoDropDownList({
        filter: "contains",
        height: 300,
        dataTextField: "jobNameAr",
        dataValueField: "id",
        headerTemplate: '<div class="dropdown-header k-widget k-header">' +
            '<span style="margin-left:100px">' + Resources.Code + '</span>' +
            '<span>' + Resources.Job + '</span>' +
            '</div>',
        //valueTemplate: '<span class="selected-value"></span><span>' + Resources.Choose + '</span>',
        template: '<span class="k-state-default" style="margin-left:150px">#: data.jobCode #</span>' +
            '<span class="k-state-default">#: data.jobNameAr #</span>',
        dataSource: {
            type: "json",
            //serverFiltering: true,
            transport: {
                read: {
                    url: "/HrLookups/GetAllHrJobForDDList",
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
        select: onSelectHrJob
    });
    function onSelectHrJob(e) {
        debugger;
        $("#FK_HrJobId").val(e.dataItem.id);
    }

    $("#FK_HrEmployeeId").kendoDropDownList({
        filter: "contains",
        height: 300,
        dataTextField: "code",
        dataValueField: "id",
        headerTemplate: '<div class="dropdown-header k-widget k-header">' +
            '<span style="margin-left:100px">' + Resources.Code + '</span>' +
            '<span>' + Resources.EmployeeName + '</span>' +
            '</div>',
        //valueTemplate: '<span class="selected-value"></span><span>' + Resources.Choose + '</span>',
        template: '<span class="k-state-default" style="margin-left:150px">#: data.code #</span>' +
            '<span class="k-state-default">#: data.fullName #</span>',
        dataSource: {
            type: "json",
            serverFiltering: true,
            transport: {
                read: {
                    url: "/HrEmployee/GetAllEmployeesForDDList",
                },
                parameterMap: function (data, action) {

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
        select: onSelectEmployee
    });

    function onSelectEmployee(e) {

        $("#employeeName").val(e.dataItem.fullName);
    }

    $("#FK_HrAgencyTypeId").kendoDropDownList({
        filter: "contains",
        height: 300,
        dataTextField: "typeNameAr",
        dataValueField: "id",
        dataSource: {
            type: "json",
            serverFiltering: true,
            transport: {
                read: {
                    url: "/HrLookups/GetAllAgencyTypForDDList",
                },
                parameterMap: function (data, action) {

                    if (action === "read") {
                        return {
                            fK_DefBranchId: parseInt($("#FK_DefBranchId").val()),
                        };


                    } else {
                        return data;
                    }
                }
            }
        },

    });

    $("#visaNumber").kendoDropDownList({
        filter: "contains",
        height: 300,
        dataTextField: "visaNumber",
        dataValueField: "id",
        dataSource: {
            type: "json",
            serverFiltering: true,
            transport: {
                read: {
                    url: "/HrForeignMinistryVisa/GetAllForDDList",
                },
                parameterMap: function (data, action) {

                    if (action === "read") {
                        return {
                            fK_DefBranchId: parseInt($("#FK_DefBranchId").val()),
                        };

                    } else {
                        return data;
                    }
                }
            }
        },

    });
});


$(".exportExcel").on('click', function () {
    $("#gridForeignMinistryVisa").getKendoGrid().saveAsExcel();
});

//function printContent(el) {
//    var restorepage = document.body.innerHTML;
//    var printcontent = document.getElementById(el).innerHTML;
//    document.body.innerHTML = printcontent;
//    window.print();
//    document.body.innerHTML = restorepage;
//}

$(".btnPrint").on('click', function () {
    var dateFrom = $("#dateFrom").val();
    var dateTo = $("#dateTo").val();
    var expiryDate = $("#ExpiryDate").val();
    var fk_HrEmployeeId = $("#FK_HrEmployeeId").val();
    var fK_DefCountryId = $("#FK_DefCountryId").val();
    var fK_HrJobId = $("#FK_HrJobId").val();
    var fk_DefBranchId = parseInt($("#FK_DefBranchId").val());
    var fK_HrAgencyTypeId = $("#FK_HrAgencyTypeId").val();
    var visaNumber = $("#visaNumber").data("kendoDropDownList").text();
    if (fK_HrAgencyTypeId == 0)
        fK_HrAgencyTypeId = null;
    if (fk_HrEmployeeId == 0)
        fk_HrEmployeeId = null;
    if (visaNumber == "اختر")
        visaNumber = null;
    var url = "/HrForeignMinistryVisaReports/VisaStatusByVisaNumberReportPrint?dateFrom=" + dateFrom + "&dateTo=" + dateTo + "&fk_HrEmployeeId=" + fk_HrEmployeeId + "&fk_DefBranchId=" + fk_DefBranchId + "&fK_HrAgencyTypeId=" + fK_HrAgencyTypeId + "&visaNumber=" + visaNumber + "&expiryDate=" + expiryDate + "&fK_HrJobId=" + fK_HrJobId + "&fK_DefCountryId=" + fK_DefCountryId;
    window.open(url, '_blank').print();

});