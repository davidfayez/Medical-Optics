$(document).ready(function () {

    $('#DefBranches').change(function () {


        $("#visaNumber").data("kendoDropDownList").dataSource.read();
        $("#visaNumber").data("kendoDropDownList").value(0);

        $("#FK_DefCountryId").data("kendoDropDownList").dataSource.read();
        $("#FK_DefCountryId").data("kendoDropDownList").value(0);

        $("#FK_HrJobId").data("kendoDropDownList").dataSource.read();
        $("#FK_HrJobId").data("kendoDropDownList").value(0);


        $("#FK_HrEmployeeId").data("kendoDropDownList").dataSource.read();
        $("#FK_HrEmployeeId").data("kendoDropDownList").value(0);

        $("#FK_HrAgencyTypeId").data("kendoDropDownList").dataSource.read();
        $("#FK_HrAgencyTypeId").data("kendoDropDownList").value(0);

        $("#employeeName").val("");
    });

    $("#btnDataReview").click(function () {
        LoadgridVisaPositionAvailable();
    });
    LoadgridVisaPositionAvailable();


    function LoadgridVisaPositionAvailable() {
        var dateFrom = $("#dateFrom").val();
        var dateTo = $("#dateTo").val();
        var expiryDate = $("#ExpiryDate").val();
        var fk_HrEmployeeId = $("#FK_HrEmployeeId").val();
        var fK_DefCountryId = $("#FK_DefCountryId").val();
        var fK_HrJobId = $("#FK_HrJobId").val();
        var fk_DefBranchId = parseInt($("#FK_DefBranchId").val());
        var fK_HrAgencyTypeId = $("#FK_HrAgencyTypeId").val();
        var visaNumber = $("#visaNumber").val();
        debugger
        if (fK_HrAgencyTypeId == 0)
            fK_HrAgencyTypeId = null;

        if (fk_HrEmployeeId == 0)
            fk_HrEmployeeId = null;

        if (fK_DefCountryId == 0)
            fK_DefCountryId = null;

        if (fK_HrJobId == 0)
            fK_HrJobId = null;

        if (visaNumber == 0)
            visaNumber = null;
        var grid = $("#gridVisaPositionAvailable").kendoGrid({
            excel: {
                fileName: "Employee Visa.xlsx",
                allPages: true,
                filterable: true
            },
            dataSource: {
                transport: {
                    read: {
                        url: "/HrForeignMinistryVisaReports/GetVisaPositionAvailable",
                        type: "POST",
                        data: { dateFrom: dateFrom, dateTo: dateTo, fk_HrEmployeeId: fk_HrEmployeeId, fk_DefBranchId: fk_DefBranchId, fK_HrAgencyTypeId: fK_HrAgencyTypeId, visaNumber: visaNumber, expiryDate: expiryDate, fK_HrJobId: fK_HrJobId, fK_DefCountryId: fK_DefCountryId }
                    }
                },
                pageSize: Resources.GridPageSize,
                schema: {
                    model: {
                        //id: "id",
                        fields: {
                            jobName: { type: "string" },
                            countryName: { type: "string" },
                            totalVisaCount: { type: "number" },
                        }
                    },
                   

                },
            },
            pageSize: 20,
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
                    field: "jobName",
                    title: Resources.Job,
                    width: Resources.CodeWidth
                },
                {
                    field: "countryName",
                    title: Resources.DefCountry,
                    width: Resources.CodeWidth
                },
                {
                    field: "totalVisaCount",
                    title: Resources.TotalVisaCount,
                    width: Resources.CodeWidth
                }

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

    $("#FK_DefCountryId").kendoDropDownList({
        filter: "contains",
        height: 300,
        dataTextField: "countryNameAr",
        dataValueField: "id",
        dataSource: {
            type: "json",
            //serverFiltering: true,
            transport: {
                read: {
                    url: "/DefCountry/GetAllForDDList",
                },

            }
        }
    });

    $("#FK_HrJobId").kendoDropDownList({
        filter: "contains",
        height: 300,
        dataTextField: "jobNameAr",
        dataValueField: "id",
        dataSource: {
            type: "json",
            //serverFiltering: true,
            transport: {
                read: {
                    url: "/HrLookups/GetAllHrJobForDDList",
                },

            }
        }
    });

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
});


$(".exportExcel").on('click', function () {
    $("#gridVisaPositionAvailable").getKendoGrid().saveAsExcel();
});


$(".btnPrint").on('click', function () {
    var dateFrom = $("#dateFrom").val();
    var dateTo = $("#dateTo").val();
    var expiryDate = $("#ExpiryDate").val();
    var fk_HrEmployeeId = $("#FK_HrEmployeeId").val();
    var fK_DefCountryId = $("#FK_DefCountryId").val();
    var fK_HrJobId = $("#FK_HrJobId").val();
    var fk_DefBranchId = parseInt($("#FK_DefBranchId").val());
    var fK_HrAgencyTypeId = $("#FK_HrAgencyTypeId").val();
    var visaNumber = $("#visaNumber").val();
    if (fK_HrAgencyTypeId == 0)
        fK_HrAgencyTypeId = null;
    if (fk_HrEmployeeId == 0)
        fk_HrEmployeeId = null;

    if (fK_DefCountryId == 0)
        fK_DefCountryId = null;

    if (fK_HrJobId == 0)
        fK_HrJobId = null;

    if (visaNumber == 0)
        visaNumber = "";
    var url = "/HrForeignMinistryVisaReports/VisaPositionAvailableReportPrint?dateFrom=" + dateFrom + "&dateTo=" + dateTo + "&fk_HrEmployeeId=" + fk_HrEmployeeId + "&fk_DefBranchId=" + fk_DefBranchId + "&fK_HrAgencyTypeId=" + fK_HrAgencyTypeId + "&visaNumber=" + visaNumber + "&expiryDate=" + expiryDate + "&fK_HrJobId=" + fK_HrJobId + "&fK_DefCountryId=" + fK_DefCountryId;
    window.open(url, '_blank').print();

});