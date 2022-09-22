$(document).ready(function () {
    $("#FK_HrForeignMinistryVisaId").kendoDropDownList({
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
        select: onSelectMinistryVisa
    });

    function onSelectMinistryVisa(e) {

        var minId = e.dataItem.id;

        $("#FK_DefCountryId").data("kendoDropDownList").dataSource.read({ id: minId });
        $("#FK_DefCountryId").data("kendoDropDownList").value(0);

        $("#FK_HrJobId").data("kendoDropDownList").dataSource.read({ id: minId });
        $("#FK_HrJobId").data("kendoDropDownList").value(0);

        //get total visa 
        $.ajax({
            type: "POST",
            url: "/HrForeignMinistryVisa/GetTotalVisaCountById?id=" + minId,
            dataType: "json",
            success: function (response) {

                if (response != null) {

                    $("#TotalVisaCount").val(response);

                }

            }
        });

    }

    $("#FK_DefCountryId").kendoDropDownList({
        filter: "contains",
        height: 300,
        dataTextField: "countryNameAr",
        dataValueField: "id",
        dataSource: {
            type: "json",
            serverFiltering: true,
            transport: {
                read: {
                    url: "/HrForeignMinistryVisa/GetAllCountriesForDDListById",
                },
                parameterMap: function (data, action) {

                    if (action === "read") {
                        if (Object.keys(data).length > 0) {
                            return {
                                id: data.id,
                            };
                        } else {
                            return {
                                id: 0,
                            };
                        }

                    } else {
                        return data;
                    }
                }
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
            serverFiltering: true,
            transport: {
                read: {
                    url: "/HrForeignMinistryVisa/GetAllJobsForDDListById",
                },
                parameterMap: function (data, action) {

                    if (action === "read") {
                        if (Object.keys(data).length > 0) {
                            return {
                                id: data.id,
                            };
                        } else {
                            return {
                                id: 0,
                            };
                        }

                    } else {
                        return data;
                    }
                }
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

    $("#btnDataReview").click(function () {
        LoadVisaGrid();
    });

    $("#visaGrid").kendoGrid({

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
            { title: Resources.VisaNumber, width: Resources.CodeWidth },
            { title: Resources.PeopleCount, width: Resources.CodeWidth },
            { title: Resources.Job, width: Resources.NameWidth },
            { title: Resources.CommingFrom, width: Resources.NameWidth },
            { title: Resources.DateExpiry, width: Resources.DateWidth },
            { title: Resources.AgencyName, width: Resources.NameWidth },
        ]
    });

    function LoadVisaGrid() {
        var fK_DefBranchId = $("#FK_DefBranchId").val();
        var dateFrom = $("#dateFrom").val();
        var dateTo = $("#dateTo").val();
        var visaNumber = $("#FK_HrForeignMinistryVisaId").val() > 0 ? $("#FK_HrForeignMinistryVisaId").data("kendoDropDownList").text() : "";
        var fK_DefCountryId = $("#FK_DefCountryId").val();
        var fK_HrJobId = $("#FK_HrJobId").val();
        var fK_HrAgencyTypeId = $("#FK_HrAgencyTypeId").val();
        var expiryDate = $("#ExpiryDate").val();
        var fK_HrEmployeeId = $("#FK_HrEmployeeId").val();

        var grid = $("#visaGrid").kendoGrid({
            excel: {
                fileName: "Visa Status.xlsx",
                allPages: true,
                filterable: true
            },
            dataSource: {
                transport: {
                    read: {
                        url: "/HrForeignMinistryVisaReports/VisaStatusByCountryReportView?dateFrom=" + dateFrom + "&dateTo=" + dateTo + "&fk_HrEmployeeId=" + fK_HrEmployeeId + "&fk_DefBranchId=" + fK_DefBranchId + "&fK_HrAgencyTypeId=" + fK_HrAgencyTypeId + "&visaNumber=" + visaNumber + "&expiryDate=" + expiryDate + "&fK_HrJobId=" + fK_HrJobId + "&fK_DefCountryId=" + fK_DefCountryId
                    }
                },
                schema: {
                    model: {
                        //id: "id",
                        fields: {
                            visaNumber: { type: "string" },
                            visaCount: { type: "string" },
                            jobName: { type: "string" },
                            commingFrom: { type: "string" },
                            expiryDate: { type: "number" },
                            hrAgencyTypeName: { type: "number" }
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
            columns: [

                {
                    field: "visaNumber",
                    title: Resources.VisaNumber,
                    width: Resources.CodeWidth
                }, {
                    field: "visaCount",
                    title: Resources.PeopleCount,
                    width: Resources.CodeWidth
                },
                {
                    field: "jobName",
                    title: Resources.Job,
                    width: Resources.NameWidth
                },
                {
                    field: "commingFrom",
                    title: Resources.CommingFrom,
                    width: Resources.NameWidth
                },
                {
                    field: "expiryDate",
                    title: Resources.DateExpiry,
                    width: Resources.DateWidth
                },
                {
                    field: "hrAgencyTypeName",
                    title: Resources.AgencyName,
                    width: Resources.NameWidth
                }

            ],
            dataBound: function (e) {
                e.sender.items().each(function () {
                    var dataItem = e.sender.dataItem(this);
                    kendo.bind(this, dataItem);
                    //if (dataItem.isActive) {
                    //    $(this).addClass("k-state-selected");
                    //}
                });
            }
        });

    }
    $(".btnPrint").on('click', function () {
        var fK_DefBranchId = $("#FK_DefBranchId").val();
        var dateFrom = $("#dateFrom").val();
        var dateTo = $("#dateTo").val();
        var visaNumber = $("#FK_HrForeignMinistryVisaId").val()>0?$("#FK_HrForeignMinistryVisaId").data("kendoDropDownList").text():"";
        var fK_DefCountryId = $("#FK_DefCountryId").val();
        var fK_HrJobId = $("#FK_HrJobId").val();
        var fK_HrAgencyTypeId = $("#FK_HrAgencyTypeId").val();
        var expiryDate = $("#ExpiryDate").val();
        var fK_HrEmployeeId = $("#FK_HrEmployeeId").val();
        var url = "/HrForeignMinistryVisaReports/VisaStatusByCountryReportPrint?dateFrom=" + dateFrom + "&dateTo=" + dateTo + "&fk_HrEmployeeId=" + fK_HrEmployeeId + "&fk_DefBranchId=" + fK_DefBranchId + "&fK_HrAgencyTypeId=" + fK_HrAgencyTypeId + "&visaNumber=" + visaNumber + "&expiryDate=" + expiryDate + "&fK_HrJobId=" + fK_HrJobId + "&fK_DefCountryId=" + fK_DefCountryId
        window.open(url, '_blank').print();

    });
});

$(".exportExcel").on('click', function () {
    $("#visaGrid").getKendoGrid().saveAsExcel();
});