$().ready(function () {
    $('#DefBranches').change(function () {
        $("#FK_HrQualificationTypeId").data("kendoDropDownList").dataSource.read();
        $("#FK_HrQualificationTypeId").data("kendoDropDownList").value(0);

    });

    $("#FK_HrQualificationTypeId").kendoDropDownList({
        filter: "contains",
        height: 300,
        dataTextField: "nameAndCode",
        dataValueField: "id",
        dataSource: {
            type: "json",
            // serverFiltering: true,
            transport: {
                read: {
                    url: "/HrLookups/GetAllHrQualificationTypeForDDList",
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
    // Grid
    var empId = $("#EmployeeId").val();
    LoadGridQualifications();
    function LoadGridQualifications() {
        tempSource = new kendo.data.DataSource({
            transport: {
                read: {
                    url: "/HrEmployee/GetEmployeeQualifications?id=" + empId,
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
                        qualificationTypeName: { type: "text", editable: false },
                        universityName: { type: "text", editable: false },
                        facultyName: { type: "text", editable: false },
                        specializationName: { type: "text" },
                        qualificationDate: { type: "date", editable: false },
                    }
                }
            }
        });
        var grid = $("#GridQualifications").kendoGrid({
            dataSource: tempSource,
            navigatable: true,
            pageable: false,
            columns: [

                { field: "id", hidden: true, format: "{0:c}" },
                { field: "qualificationTypeName", title: Resources.Qualification, format: "{0:c}", width: Resources.NameWidth },
                { field: "universityName", title: Resources.UniversityName, width: Resources.NameWidth },
                { field: "facultyName", title: Resources.CollegeName, width: Resources.NameWidth },
                { field: "specializationName", width: Resources.NameWidth, title: Resources.Specialization },
                {
                    field: "qualificationDate", title: Resources.DateOfAcquiringIt, format: "{0:yyyy/MM/dd}", width: Resources.DateWidth,
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
                { width: "80px", template: "<a  class='btn btn-danger btn-sm btnDelete' ><i class='fas fa-trash-alt'></i></a>" }
            ],
            editable: true,
            selectable: "multiple, cell",
            noRecords: true,
            messages: {
                noRecords: "There is no data on current page"
            },

        });
        grid.data("kendoGrid").table.on("click", ".btnDelete", removeQualification);
    }
    function removeQualification() {

        var row = $(this).closest("tr"),
            grid = $("#GridQualifications").data("kendoGrid"),
            dataItem = grid.dataItem(row),
            qualificationId = dataItem.id,
            dataSource = $("#GridQualifications").data("kendoGrid").dataSource;
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

            if (qualificationId != "" && qualificationId != null) {
                setTimeout(function () {
                    $.ajax({
                        url: "/HrEmployee/DeleteQualification?id=" + qualificationId,
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

    $("#addQualification").on('click', function () {

        var fK_HrQualificationTypeId = $("#FK_HrQualificationTypeId").val(),
            employeeId = $("#EmployeeId").val(),
            universityName = $("#UniversityName").val().trim(),
            facultyName = $("#FacultyName").val().trim(),
            specializationName = $("#SpecializationName").val().trim();



        if (employeeId == "" || employeeId == "0") {
            swal({
                title: Resources.EnterRequiredResource + " " + Resources.BasicInformation,
                confirmButtonText: Resources.DoneResource,
                type: "error"
            });
        }
        else if (fK_HrQualificationTypeId == "0") {
            swal({
                title: Resources.ChooseResource + " " + Resources.Qualification,
                confirmButtonText: Resources.DoneResource,
                type: "error"
            });
        }
        //else if (universityName == "") {
        //    swal({
        //        title: Resources.EnterRequiredResource + " " + Resources.UniversityName,
        //        confirmButtonText: Resources.DoneResource,
        //        type: "error"
        //    });
        //}
        //else if (facultyName == "") {
        //    swal({
        //        title: Resources.EnterRequiredResource + " " + Resources.CollegeName,
        //        confirmButtonText: Resources.DoneResource,
        //        type: "error"
        //    });
        //}
        //else if (specializationName == "") {
        //    swal({
        //        title: Resources.EnterRequiredResource + " " + Resources.Specialization,
        //        confirmButtonText: Resources.DoneResource,
        //        type: "error"
        //    });
        //}
        else {

            var Obj = {
                FK_HrEmployeeId: parseInt(employeeId),
                FK_HrQualificationTypeId: parseInt(fK_HrQualificationTypeId),
                UniversityName: universityName,
                FacultyName: facultyName,
                SpecializationName: specializationName,
                QualificationDate: $("#QualificationDate").val(),
                Description: $("#DescriptionQualification").val(),
            }
            $.ajax({
                url: "/HrEmployee/CreateQualification",
                type: "Post",
                cache: false,
                processData: false,
                data: JSON.stringify(Obj),
                contentType: 'application/json',
                success: function (response) {

                    if (response) {
                        LoadGridQualifications();
                        $("#FK_HrQualificationTypeId").val("");
                        $("#UniversityName").val("");
                        $("#FacultyName").val("");
                        $("#SpecializationName").val("");
                        $("#DescriptionQualification").val("");
                        $("#FK_HrQualificationTypeId").data("kendoDropDownList").value(0);
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