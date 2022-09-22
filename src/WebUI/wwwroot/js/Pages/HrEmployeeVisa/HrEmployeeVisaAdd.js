$(document).ready(function () {


    $('#DefBranches').change(function () {


        $("#FK_HrForeignMinistryVisaId").data("kendoDropDownList").dataSource.read();
        $("#FK_HrForeignMinistryVisaId").data("kendoDropDownList").value(0);

        $("#FK_DefCountryId").data("kendoDropDownList").dataSource.read();
        $("#FK_DefCountryId").data("kendoDropDownList").value(0);

        $("#FK_HrJobId").data("kendoDropDownList").dataSource.read();
        $("#FK_HrJobId").data("kendoDropDownList").value(0);


        $("#FK_HrEmployeeId").data("kendoDropDownList").dataSource.read();
        $("#FK_HrEmployeeId").data("kendoDropDownList").value(0);

        $("#FK_HrAgencyTypeId").data("kendoDropDownList").dataSource.read();
        $("#FK_HrAgencyTypeId").data("kendoDropDownList").value(0);

        $("#TotalVisaCount").val(0);
    });

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
        dataTextField: "codeAndName",
        dataValueField: "id",
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



    //grid
    var tempSource = new kendo.data.DataSource({

    });

    var empVisaDetailGrid = $("#HrEmpVisaDetailGrid").kendoGrid({
        dataSource: tempSource,
        navigatable: true,
        pageable: false,
        scrollable: false,
        columns: [
            { field: "fK_HrEmployeeId", hidden: true },
            { field: "fK_HrAgencyTypeId", hidden: true },
            { field: "employeeCode", title: Resources.EmployeeCode, width: Resources.NameWidth },
            { field: "employeeName", title: Resources.EmployeeName, width: Resources.NameWidth },
            { field: "arrivalDate", format: "{0:yyyy/MM/dd}", width: Resources.DateWidth, title: Resources.ArrivalDate },
            { field: "agencyTypeName", title: Resources.AgencyType, width: Resources.NameWidth },
            { field: "description", title: Resources.Description, width: Resources.NameWidth },

            { width: Resources.ActionWidth, template: "<a  class='btn btn-danger btn-sm btnDelete' ><i class='fas fa-trash-alt'></i></a>" }
        ],
        editable: false,
        selectable: "multiple, cell",
    });

    empVisaDetailGrid.data("kendoGrid").table.on("click", ".btnDelete", removeRow);
    function removeRow() {

        var row = $(this).closest("tr"),
            grid = $("#HrEmpVisaDetailGrid").data("kendoGrid"),
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
                var dataSource = $("#HrEmpVisaDetailGrid").data("kendoGrid").dataSource;

                if (dataSource.remove(dataItem)) {
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

            }, 1000);
        });
    }

    $("#btnAddNewDetail").on('click', function () {

        var FK_HrAgencyTypeId = $("#FK_HrAgencyTypeId").val(),
            AgencyTypeName = $("#FK_HrAgencyTypeId").data("kendoDropDownList").text(),
            FK_HrEmployeeId = $("#FK_HrEmployeeId").val(),
            EmployeeName = $("#employeeName").val(),
            Description = $("#DescriptionDetail").val(),
            EmployeeCode = $("#FK_HrEmployeeId").data("kendoDropDownList").text(),
            ArrivalDate = new Date($("#ArrivalDate").val());
        debugger

        if (FK_HrEmployeeId == "0") {

            swal({
                title: Resources.ChooseResource + " " + Resources.EmployeeCode,
                confirmButtonText: Resources.DoneResource,
                type: "error"
            });
        }
        else if (FK_HrAgencyTypeId == "0") {

            swal({
                title: Resources.ChooseResource + " " + Resources.AgencyType,
                confirmButtonText: Resources.DoneResource,
                type: "error"
            });
        }
        else if (FK_HrEmployeeId > 0 && FK_HrAgencyTypeId > 0) {

            var totalRecords = $("#HrEmpVisaDetailGrid").data("kendoGrid").dataSource.data().length;
            var Index = parseInt($("#Index").val());
            if (!isNaN(Index))
                totalRecords = Index - 1;
            tempSource.insert(totalRecords, {
                fK_HrEmployeeId: FK_HrEmployeeId,
                fK_HrAgencyTypeId: FK_HrAgencyTypeId,
                employeeCode: EmployeeCode,
                employeeName: EmployeeName,
                arrivalDate: ArrivalDate,
                agencyTypeName: AgencyTypeName,
                description: Description,

            });






            ClearFormDetails();
        }
    });
    function ClearFormDetails() {
        $("#FK_HrEmployeeId").data("kendoDropDownList").value(0);
        $("#FK_HrAgencyTypeId").data("kendoDropDownList").value(0);
        $("#employeeName").val("");
        $("#DescriptionDetail").val("");
    }

    $("#btnSave").on('click', function () {
        if ($("#FK_HrForeignMinistryVisaId").val() == 0)
            $("#ministryVisaIdvalidation").show();
        else
            $("#ministryVisaIdvalidation").hide();

        if ($("#FK_DefCountryId").val() == 0)
            $("#countryIdvalidation").show();
        else
            $("#countryIdvalidation").hide();

        if ($("#FK_HrJobId").val() == 0)
            $("#jobIdvalidation").show();
        else
            $("#jobIdvalidation").hide();
        var table = $("#HrEmpVisaDetailGrid").data("kendoGrid").dataSource.data();
        if (table.length == 0) {
            swal({
                title: Resources.GridLengthZeroResource,
                confirmButtonText: Resources.DoneResource,
                type: "error"
            });

        }
        else if ($("#formEmpVisa").valid() && $("#FK_DefCountryId").val() > 0 && $("#FK_HrJobId").val() > 0 && $("#FK_HrForeignMinistryVisaId").val() > 0) {
            var visaDetails = [];

            for (var i = 0; i < table.length; i++) {
                var arrivalDate = new Date(table[i].arrivalDate);
                var arrivalDateFormated = arrivalDate.getFullYear() + "-" + ("0" + (arrivalDate.getMonth() + 1)).slice(-2) + "-" + ("0" + arrivalDate.getDate()).slice(-2);
                var detail = {
                    FK_HrEmployeeId: table[i].fK_HrEmployeeId,
                    ArrivalDate: arrivalDateFormated,
                    FK_HrAgencyTypeId: table[i].fK_HrAgencyTypeId,
                    Description: table[i].description,
                }

                visaDetails.push(detail);
            }

            var visa = {
                FK_DefCountryId: $("#FK_DefCountryId").val(),
                FK_HrForeignMinistryVisaId: $("#FK_HrForeignMinistryVisaId").val(),
                FK_HrJobId: $("#FK_HrJobId").val(),
                TotalVisaCount: $("#TotalVisaCount").val(),
                FK_DefBranchId: $("#FK_DefBranchId").val(),
                hdnAttachmentIds: $("#hdnAttachmentIds").val(),
                employeeVisaDetailVM: visaDetails
            }
            debugger
            $.ajax({
                url: '/HrEmployeeVisa/Create',
                type: 'POST',
                data: { employeeVisaVM: visa },
                success: function (result) {
                    debugger
                    if (result > 0) {
                        swal({
                            title: Resources.SavedSuccessfullyResource,
                            confirmButtonText: Resources.DoneResource,
                            type: "success"
                        }, function () {
                            setTimeout(function () {

                                document.location = "../../HrEmployeeVisa/Index"
                            }, 1000);
                        });

                    } else {
                        swal({
                            title: Resources.ErrorMsgResource,
                            confirmButtonText: Resources.DoneResource,
                            type: "success"
                        });
                    }
                }
            })
        }
    });
});