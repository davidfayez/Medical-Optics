$().ready(function () {
    // Grid
    var empId = $("#EmployeeId").val();
    LoadGridExperiences();
    function LoadGridExperiences() {
        tempSource = new kendo.data.DataSource({
            transport: {
                read: {
                    url: "/HrEmployee/GetEmployeeExperiences?id=" + empId,
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
                        jobDiscription: { type: "text", editable: false },
                        companyName: { type: "text", editable: false },
                        jobTitle: { type: "text", editable: false },
                        phone: { type: "text" },
                        dateFrom: { type: "date", editable: false },
                        dateTo: { type: "date", editable: false },
                    }
                }
            }
        });
        var grid = $("#GridExperiences").kendoGrid({
            dataSource: tempSource,
            navigatable: true,
            pageable: false,
            columns: [

                { field: "id", hidden: true, format: "{0:c}" },
                { field: "jobDiscription", title: Resources.ScientificExperience, format: "{0:c}", width: Resources.NameWidth },
                { field: "companyName", title: Resources.OrganisationName, width: Resources.NameWidth },
                { field: "jobTitle", title: Resources.JobTitle, width: Resources.NameWidth },
                { field: "phone", title: Resources.Mobile, width: Resources.NameWidth },
                {
                    field: "dateFrom", title: Resources.TimePeriodFrom, format: "{0:yyyy/MM/dd}", width: Resources.DateWidth,
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
                    field: "dateTo", title: Resources.TimePeriodTo, format: "{0:yyyy/MM/dd}", width: Resources.DateWidth,
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
        grid.data("kendoGrid").table.on("click", ".btnDelete", removeExperience);
    }
    function removeExperience() {

        var row = $(this).closest("tr"),
            grid = $("#GridExperiences").data("kendoGrid"),
            dataItem = grid.dataItem(row),
            experienceId = dataItem.id,
            dataSource = $("#GridExperiences").data("kendoGrid").dataSource;
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

            if (experienceId != "" && experienceId != null) {
                setTimeout(function () {
                    $.ajax({
                        url: "/HrEmployee/DeleteExperiences?id=" + experienceId,
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

    $("#addExperience").on('click', function () {

        var jobDiscription = $("#JobDiscription").val().trim(),
            employeeId = $("#EmployeeId").val(),
            companyName = $("#CompanyName").val().trim(),
            jobTitle = $("#JobTitle").val().trim(),
            phone = $("#Phone").val().trim();



        if (employeeId == "" || employeeId == "0") {
            swal({
                title: Resources.EnterRequiredResource + " " + Resources.BasicInformation,
                confirmButtonText: Resources.DoneResource,
                type: "error"
            });
        }
        //else if (jobDiscription == "") {
        //    swal({
        //        title: Resources.EnterRequiredResource + " " + Resources.ScientificExperience,
        //        confirmButtonText: Resources.DoneResource,
        //        type: "error"
        //    });
        //}
        //else if (companyName == "") {
        //    swal({
        //        title: Resources.EnterRequiredResource + " " + Resources.OrganisationName,
        //        confirmButtonText: Resources.DoneResource,
        //        type: "error"
        //    });
        //}
        //else if (jobTitle == "") {
        //    swal({
        //        title: Resources.EnterRequiredResource + " " + Resources.JobTitle,
        //        confirmButtonText: Resources.DoneResource,
        //        type: "error"
        //    });
        //}
        //else if (phone == "") {
        //    swal({
        //        title: Resources.EnterRequiredResource + " " + Resources.Mobile,
        //        confirmButtonText: Resources.DoneResource,
        //        type: "error"
        //    });
        //}
        else {

           
            var Obj = {
                FK_HrEmployeeId: parseInt(employeeId),
                JobDiscription: jobDiscription,
                CompanyName: companyName,
                JobTitle: jobTitle,
                Phone: phone,
                DateFrom: $("#DateFrom").val(),
                DateTo: $("#DateTo").val(),
                Description: $("#DescriptionExperience").val(),
            }
            $.ajax({
                url: "/HrEmployee/CreateExperience",
                type: "Post",
                cache: false,
                processData: false,
                data: JSON.stringify(Obj),
                contentType: 'application/json',
                success: function (response) {

                    if (response) {
                        LoadGridExperiences();
                        $("#JobDiscription").val("");
                        $("#CompanyName").val("");
                        $("#JobTitle").val("");
                        $("#Phone").val("");
                        $("#DescriptionExperience").val("");
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