$().ready(function () {
    $('#DefBranches').change(function () {


        $("#FK_HrkinshipTypeId").data("kendoDropDownList").dataSource.read();
        $("#FK_HrkinshipTypeId").data("kendoDropDownList").value(0);

        $("#FK_KinshipNationalityId").data("kendoDropDownList").dataSource.read();
        $("#FK_KinshipNationalityId").data("kendoDropDownList").value(0);

        $("#FK_HrTicketTypeId").data("kendoDropDownList").dataSource.read();
        $("#FK_HrTicketTypeId").data("kendoDropDownList").value(0);



    });
    $("#FK_HrkinshipTypeId").kendoDropDownList({
        filter: "contains",
        height: 300,
        dataTextField: "nameAndCode",
        dataValueField: "id",
        dataSource: {
            type: "json",
            // serverFiltering: true,
            transport: {
                read: {
                    url: "/HrLookups/GetAllHrkinshipTypeForDDList",
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



    $("#FK_KinshipNationalityId").kendoDropDownList({
        filter: "contains",
        height: 300,
        dataTextField: "nameAndCode",
        dataValueField: "id",
        dataSource: {
            type: "json",
            // serverFiltering: true,
            transport: {
                read: {
                    url: "/DefNationality/GetAllForDDList",
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
    $("#FK_HrTicketTypeId").kendoDropDownList({
        filter: "contains",
        height: 300,
        dataTextField: "nameAndCode",
        dataValueField: "id",
        dataSource: {
            type: "json",
            // serverFiltering: true,
            transport: {
                read: {
                    url: "/HrLookups/GetAllHrTicketTypeForDDList",
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
    //$('#KinshipBirthDate').val(new Date(Date.now));

    var today = new Date().toISOString().split('T')[0];
    $("#KinshipBirthDate").val(today);
    $("#DateIssued").val(today);
    $("#DateExpiryKin").val(today);
    $("#KinshipMale").attr('checked', 'checked');
    var empId = $("#EmployeeId").val();
    //alert(empId);
    LoadGridBankData();
    function LoadGridBankData() {
        tempSource = new kendo.data.DataSource({
            transport: {
                read: {
                    url: "/HrEmployee/GetKinshipDataByEmpId?id=" + empId,
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
                        fullNameAr: { type: "text", editable: false },
                        kinshipTypeName: { type: "text", editable: false },
                        birthDate: { type: "date", editable: false },
                        nationalityName: { type: "text" },
                        passportNumber: { type: "text", editable: false },
                        dateExpiry: { type: "date", editable: false },
                        residenceNumber: { type: "text" },
                        hasMedicalInsurance: { type: "boolean", editable: false },
                        hasAirlineTickets: { type: "boolean", editable: false },
                    }
                }
            }
        });
        var grid = $("#GridKinshipData").kendoGrid({
            dataSource: tempSource,
            navigatable: true,
            pageable: false,
            columns: [

                { field: "id", hidden: true, format: "{0:c}" },
                { field: "fullNameAr", title: Resources.FullName, format: "{0:c}", width: Resources.NameWidth },
                { field: "kinshipTypeName", title: Resources.KinshipTypeName, width: Resources.NameWidth },
                { field: "birthDate", title: Resources.BirthDate, format: "{0:yyyy/MM/dd}", width: Resources.NameWidth },
                { field: "nationalityName", width: 150, title: Resources.NationalityName },
                { field: "passportNumber", title: Resources.PassportNumber, width: Resources.NameWidth },
                { field: "dateExpiry", title: Resources.DateExpiry, format: "{0:yyyy/MM/dd}", width: Resources.NameWidth },
                { field: "residenceNumber", width: 150, title: Resources.ResidenceNumber },
                //  { width: Resources.CheckboxWidth, template: "<input type='checkbox' data-bind='checked:hasMedicalInsurance' class= 'control-label i-check' disabled = 'disabled' />", headerTemplate: Resources.HasMedicalInsurance },
                // { width: Resources.CheckboxWidth, template: "<input type='checkbox' data-bind='checked:hasAirlineTickets' class= 'control-label i-check' disabled = 'disabled' />", headerTemplate: Resources.HasAirlineTickets },

                { width: "80px", template: "<a  class='btn btn-danger btn-sm btnDelete' ><i class='fas fa-trash-alt'></i></a>" }
            ],
            editable: true,
            selectable: "multiple, cell",
            noRecords: true,
            messages: {
                noRecords: "There is no data on current page"
            },

        });
        grid.data("kendoGrid").table.on("click", ".btnDelete", removeKinshipDataRow);
    }
    function removeKinshipDataRow() {

        var row = $(this).closest("tr"),
            grid = $("#GridKinshipData").data("kendoGrid"),
            dataItem = grid.dataItem(row),
            empKinshipId = dataItem.id,
            dataSource = $("#GridKinshipData").data("kendoGrid").dataSource;
        // alert(empKinshipId);
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

            if (empKinshipId != "" && empKinshipId != null) {
                setTimeout(function () {
                    $.ajax({
                        url: "/HrEmployee/DeleteKinshipData?id=" + empKinshipId,
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

    $("#addKinshipData").on('click', function () {

        var today = new Date().toISOString().split('T')[0];
        var FullNameAr = $("#FullNameAr").val();
        var FullNameEn = $("#kinshipFullNameEn").val();
        var FK_HrkinshipTypeId = parseInt($("#FK_HrkinshipTypeId").val());
        var employeeId = $("#EmployeeId").val();
        var FK_KinshipNationalityId = parseInt($("#FK_KinshipNationalityId").val());

        var hasMedicalInsurance = $("#HasMedicalInsurance").is(":checked"),
            medicalInsuranceNumber = $("#MedicalInsuranceNumber").val(),
            medicalInsuranceCompany = $("#MedicalInsuranceCompany").val(),
            classType = $("#ClassType").val(),

            hasAirlineTickets = $("#HasAirlineTickets").is(":checked"),
            travelDestination = $("#TravelDestination").val(),
            ticketType = parseInt($("#FK_HrTicketTypeId").val()),
            ticketCount = parseInt($("#TicketCount").val()),
            dateEntitlement = $('#DateEntitlement').val();
    
        if (employeeId == "" || employeeId == "0") {
            swal({
                title: Resources.EnterRequiredResource + " " + Resources.BasicInformation,
                confirmButtonText: Resources.DoneResource,
                type: "error"
            });
        }
        else if (FullNameAr == "") {
            swal({
                title: Resources.EnterRequiredResource + " " + Resources.FullName,
                confirmButtonText: Resources.DoneResource,
                type: "error"
            });
        }
        //else if (FullNameEn == "") {
        //    swal({
        //        title: Resources.EnterRequiredResource + " " + Resources.NameEn,
        //        confirmButtonText: Resources.DoneResource,
        //        type: "error"
        //    });
        //}
        else if (isNaN(FK_HrkinshipTypeId) || FK_HrkinshipTypeId == 0) {
            swal({
                title: Resources.Choose + " " + Resources.KinshipTypeName,
                confirmButtonText: Resources.DoneResource,
                type: "error"
            });
        }
        //else if (isNaN(FK_KinshipNationalityId) || FK_KinshipNationalityId == 0) {
        //    swal({
        //        title: Resources.Choose + " " + Resources.NationalityName,
        //        confirmButtonText: Resources.DoneResource,
        //        type: "error"
        //    });
        //}
        else if (hasMedicalInsurance && medicalInsuranceNumber == "") {
            swal({
                title: Resources.EnterRequiredResource + " " + Resources.MedicalInsuranceNumber,
                confirmButtonText: Resources.DoneResource,
                type: "error"
            });
        }
        else if (hasMedicalInsurance && medicalInsuranceCompany == "") {
            swal({
                title: Resources.EnterRequiredResource + " " + Resources.MedicalInsuranceCompany,
                confirmButtonText: Resources.DoneResource,
                type: "error"
            });
        }
        else if (hasMedicalInsurance && classType == "") {
            swal({
                title: Resources.EnterRequiredResource + " " + Resources.ClassType,
                confirmButtonText: Resources.DoneResource,
                type: "error"
            });
        }
        else if (hasAirlineTickets && travelDestination == "") {
            swal({
                title: Resources.EnterRequiredResource + " " + Resources.TravelDestination,
                confirmButtonText: Resources.DoneResource,
                type: "error"
            });
        }
        else if (hasAirlineTickets && (isNaN(ticketType) || ticketType == 0)) {
            swal({
                title: Resources.ChooseResource + " " + Resources.TicketType,
                confirmButtonText: Resources.DoneResource,
                type: "error"
            });
        }
        else if (hasAirlineTickets && ticketCount <= 0) {
            swal({
                title: Resources.EnterRequiredResource + " " + Resources.TicketCount,
                confirmButtonText: Resources.DoneResource,
                type: "error"
            });
        }
        else if (hasAirlineTickets && dateEntitlement == "") {
            swal({
                title: Resources.EnterRequiredResource + " " + Resources.BillDueDateResource,
                confirmButtonText: Resources.DoneResource,
                type: "error"
            });
        }
        else {
            var data = new FormData();
            var imageUpload = $("#MedicalInsuranceCardImage").get(0);
            var files = imageUpload.files;
            if (files.length > 0)
                data.append(files[0].name, files[0]);
            //var file_data = $('#MedicalInsuranceCardImage').prop('files')[0];

            //  var hasMedicalInsurance = $("#HasMedicalInsurance").is(":checked");
            //var hasAirlineTickets = $("#HasAirlineTickets").is(":checked");
            // var dateEntitlement = $('#DateEntitlement').val();
            // var ticketType = parseInt($("#FK_HrTicketTypeId").val());
            if (dateEntitlement != "")
                dateEntitlement = new Date(dateEntitlement);
            else
                dateEntitlement = null;

            if (isNaN(ticketType) || ticketType == 0)
                ticketType = null;



            var kinshipGender = $("input[name='KinshipGender']:checked").val();
            var Obj = {
                FK_HrEmployeeId: parseInt(employeeId),
                FullNameAr: FullNameAr,
                FullNameEn: FullNameEn,
                FK_HrkinshipTypeId: FK_HrkinshipTypeId,
                FK_KinshipNationalityId: FK_KinshipNationalityId,
                BirthDate: new Date($('#KinshipBirthDate').val()),
                Gender: parseInt(kinshipGender),
                PassportNumber: $("#PassportNumber").val(),
                IssuerName: $("#IssuerNameKin").val(),
                DateIssued: new Date($('#DateIssued').val()),
                DateExpiry: new Date($('#DateExpiryKin').val()),
                ResidenceNumber: $("#ResidenceNumber").val(),
                HasMedicalInsurance: hasMedicalInsurance,
                MedicalInsuranceNumber: $("#MedicalInsuranceNumber").val(),
                MedicalInsuranceCompany: $("#MedicalInsuranceCompany").val(),
                ClassType: $("#ClassType").val(),
                MedicalInsuranceCardPath: $("#MedicalInsuranceCardImage").val(),
                //MedicalInsuranceCardImage: data ,
                HasAirlineTickets: hasAirlineTickets,
                TravelDestination: $("#TravelDestination").val(),

                FK_HrTicketTypeId: ticketType,
                TicketCount: parseInt($("#TicketCount").val()),
                DateEntitlement: dateEntitlement,

                Description: $("#Description").val(),
            }

            $.ajax({
                type: "POST",
                url: "/HrEmployee/SaveImage",
                data: data,
                async: false,
                processData: false,
                contentType: false,
                success: function (response) {
                    //window.location.href = response;
                }
            });

            $.ajax({
                url: "/HrEmployee/CreateKinshipData",
                type: "Post",
                cache: false,
                async: false,
                processData: false,
                data: JSON.stringify(Obj),
                contentType: 'application/json',
                success: function (response) {
                    debugger
                    if (response) {

                        LoadGridBankData();
                        $("#FullNameAr").val("");
                        $("#kinshipFullNameEn").val("");
                        //$("#FK_HrkinshipTypeId").val("");
                        $("#FK_HrkinshipTypeId").data("kendoDropDownList").value(0);
                        // $("#FK_KinshipNationalityId").val("");
                        $("#FK_KinshipNationalityId").data("kendoDropDownList").value(0);
                        $("#KinshipBirthDate").val(today);
                        $("#Gender").val("");
                        $("#PassportNumber").val("");
                        $("#IssuerNameKin").val("");
                        $("#DateIssued").val(today);
                        $("#DateExpiryKin").val(today);
                        $("#ResidenceNumber").val("");
                        $("#HasMedicalInsurance").val("");
                        $("#MedicalInsuranceNumber").val("");
                        $("#MedicalInsuranceCompany").val("");
                        $("#ClassType").val("");
                        $("#MedicalInsuranceCardPath").val("");

                        $("#HasAirlineTickets").val("");
                        $("#TravelDestination").val("");
                        //  $("#FK_HrTicketTypeId").val("");
                        $("#FK_HrTicketTypeId").data("kendoDropDownList").value(0);
                        $("#TicketCount").val(0);
                        $("#DateEntitlement").val("");
                        $("#Description").val("");
                        $("#HasMedicalInsurance").prop("checked", false);
                        $("#HasAirlineTickets").prop("checked", false);
                        $("#MedicalInsurance").hide();
                        $("#AirlineTickets").hide();
                        $("#InsuranceCardImage").attr("src", "../../images/back-login.jpg");

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

$("#HasMedicalInsurance").change(function () {
    var today = new Date().toISOString().split('T')[0];

    if ($(this).prop("checked") == true) {
        $("#MedicalInsurance").show();
        $("#DateMedicalInsuranceExpiry").val(today);
    }
    else {
        $("#MedicalInsurance").hide();
        $("#MedicalInsuranceNumber").val("");
        $("#MedicalInsuranceCompany").val("");
        $("#ClassType").val("");
        $("#DateMedicalInsuranceExpiry").val("");
        $("#InsuranceCardImage").attr("src", "../../images/back-login.jpg");

    }

});

$("#HasAirlineTickets").change(function () {
    $("#FK_HrTicketTypeId").data("kendoDropDownList").value(0);
    if ($(this).prop("checked") == true)
        $("#AirlineTickets").show();
    else {
        $("#AirlineTickets").hide();
        ("#TravelDestination").val("");
        // $("#FK_HrTicketTypeId").val("");
        $("#TicketCount").val("");
        $("#DateEntitlement").val("");
        $("#Description").val("");

    }

});

