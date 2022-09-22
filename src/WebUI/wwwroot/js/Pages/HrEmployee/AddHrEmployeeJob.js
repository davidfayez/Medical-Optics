$().ready(function () {
    $('#DefBranches').change(function () {
        $("#FK_HrJobAccordingToId").data("kendoDropDownList").dataSource.read();
        $("#FK_HrJobAccordingToId").data("kendoDropDownList").value(0);

        $("#FK_HrJobId").data("kendoDropDownList").dataSource.read();
        $("#FK_HrJobId").data("kendoDropDownList").value(0);

    });


    // ddls 
    $("#FK_HrJobAccordingToId").kendoDropDownList({
        filter: "contains",
        height: 300,
        dataTextField: "nameAndCode",
        dataValueField: "id",
        dataSource: {
            type: "json",
            // serverFiltering: true,
            transport: {
                read: {
                    url: "/HrLookups/GetAllJobAccordingToForDDList",
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

    $("#FK_HrJobId").kendoDropDownList({
        filter: "contains",
        height: 300,
        dataTextField: "nameAndCode",
        dataValueField: "id",
        dataSource: {
            type: "json",
            // serverFiltering: true,
            transport: {
                read: {
                    url: "/HrLookups/GetAllHrJobForDDList",
                },
                //parameterMap: function (data, action) {

                //    if (action === "read") {
                //        return {
                //            fK_DefBranchId: parseInt($("#FK_DefBranchId").val()),
                //        };


                //    } else {
                //        return data;
                //    }
                //}
            }
        },

    });

    // Grid
    var empId = $("#EmployeeId").val();
    LoadGridEmployeeJob();
    function LoadGridEmployeeJob() {
        tempSource = new kendo.data.DataSource({
            transport: {
                read: {
                    url: "/HrEmployee/GetEmployeeJobByEmpId?id=" + empId,
                    Type: "GET"
                },
                parameterMap: function (options, operation) {
                    if (operation !== "read" && options.models) {
                        return { models: kendo.stringify(options.models) };
                    }
                }

            },
            //autoSync: true,
            batch: true,
            //pageSize: 20,
            schema: {
                model: {
                    id: "id",
                    fields: {
                        id: { editable: true },
                        FK_HrJobAccordingToId: { editable: true },
                        jobAccordingTo: { type: "text", editable: false },
                        jobName: { type: "text", editable: false },
                        description: { type: "text" }
                    }
                }
            }
        });
        var grid = $("#GridEmployeeJob").kendoGrid({
            dataSource: tempSource,
            navigatable: true,
            pageable: false,
            columns: [

                { field: "id", hidden: true, format: "{0:c}" },
                { field: "jobAccordingTo", title: Resources.JobAccordingTo, format: "{0:c}", width: Resources.CodeWidth },
                { field: "jobName", title: Resources.Work, width: Resources.NameWidth },
                { field: "description", width: 150, title: Resources.Description },
                { width: "80px", template: "<a  class='btn btn-danger btn-sm btnDelete' ><i class='fas fa-trash-alt'></i></a>" }
            ],
            editable: true,
            selectable: "multiple, cell",
            noRecords: true,
            messages: {
                noRecords: "There is no data on current page"
            },

        });
        grid.data("kendoGrid").table.on("click", ".btnDelete", removeRow);
    }
    function removeRow() {

        var row = $(this).closest("tr"),
            grid = $("#GridEmployeeJob").data("kendoGrid"),
            dataItem = grid.dataItem(row),
            empJobId = dataItem.id,
            dataSource = $("#GridEmployeeJob").data("kendoGrid").dataSource;
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

            if (empJobId != "" && empJobId != null) {
                setTimeout(function () {
                    $.ajax({
                        url: "/HrEmployee/DeleteEmployeeJob?id=" + empJobId,
                        type: "Get",
                        contentType: 'application/json; charset=utf-8',
                        success: function (result) {

                            if (result) {

                                dataSource.remove(dataItem)
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
            } else {
                setTimeout(function () {

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
            }
        });


    }

    $("#addEmpJob").on('click', function () {

        var fK_HrJobAccordingToId = $("#FK_HrJobAccordingToId").val(),
            fK_HrJobId = $("#FK_HrJobId").val(),
            employeeId = $("#EmployeeId").val();
        debugger

        if (employeeId == "" || employeeId == "0") {
            swal({
                title: Resources.EnterRequiredResource + " " + Resources.BasicInformation,
                confirmButtonText: Resources.DoneResource,
                type: "error"
            });
        }
        else if (fK_HrJobAccordingToId == "0") {
            swal({
                title: Resources.ChooseResource + " " + Resources.JobAccordingTo,
                confirmButtonText: Resources.DoneResource,
                type: "error"
            });
        }
        else if (fK_HrJobId == "0") {
            swal({
                title: Resources.ChooseResource + " " + Resources.Work,
                confirmButtonText: Resources.DoneResource,
                type: "error"
            });
        }

        else {


            var Obj = {
                FK_HrEmployeeId: parseInt(employeeId),
                FK_HrJobAccordingToId: parseInt(fK_HrJobAccordingToId),
                FK_HrJobId: parseInt(fK_HrJobId),
                Description: $("#DescriptionEmployeeJob").val(),
            }
            $.ajax({
                url: "/HrEmployee/CreateEmployeeJob",
                type: "Post",
                cache: false,
                processData: false,
                data: JSON.stringify(Obj),
                contentType: 'application/json',
                success: function (response) {

                    if (response) {

                        LoadGridEmployeeJob();
                        $("#DescriptionEmployeeJob").val("");
                        $("#FK_HrJobAccordingToId").data("kendoDropDownList").value(0);
                        $("#FK_HrJobId").data("kendoDropDownList").value(0);

                        swal({
                            title: Resources.SavedSuccessfullyResource,
                            confirmButtonText: Resources.DoneResource,
                            type: "success"
                        });
                    }

                }
            });


        }


    });
});