$(document).ready(function () {
    var branchId = parseInt($("#FK_DefBranchId").val());
    $.ajax({
        url: '/HrEmployee/GetDefaultAddress',
        data: { branchId: branchId },
        type: 'GET',
        success: function (data) {
            debugger
            $("#WorkAddress").val(data.workAddress);
            $("#District").val(data.district);
            $("#PostalCode").val(data.postalCode);;
            $("#Email").val(data.email);
        }
    });

    $("#FK_DefCityId").kendoDropDownList({
        filter: "contains",
        height: 300,
        dataTextField: "nameAndCode",
        dataValueField: "id",
        dataSource: {
            type: "json",
            // serverFiltering: true,
            transport: {
                read: {
                    url: "/DefCity/GetAllForDDList",
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
    var cityDropDownList = $("#FK_DefCityId").data("kendoDropDownList");
    cityDropDownList.value("126");

    $("#addAddressbtn").click(function () {

        var workAddress = $("#WorkAddress").val(),
            empId = $("#EmployeeId").val(),
            homeAddress = $("#HomeAddress").val(),
            buildNumber = $("#BuildNumber").val(),
            city = $("#FK_DefCityId").val(),
            district = $("#District").val(),
            postCode = $("#PostalCode").val(),
            phone1 = $("#Phon1").val(),
            phone2 = $("#Phon2").val(),
            mobile = $("#Mobile").val(),
            email = $("#Email").val(),

            description = $("#Description").val();
        if (empId > 0) {
            if (workAddress.length < 1 || workAddress == "") {
                $("#WorkAddressValid").text(Resources.Required);
                return;
            } else {
                $("#WorkAddressValid").text("");
            }
            if (homeAddress.length < 1 || homeAddress == "") {
                //$("#HomeAddressValid").text(Resources.Required);
                //return;
            } else {
                $("#HomeAddressValid").text("");
            }
            if (district.length < 1 || district == "") {
                //$("#DistrictValid").text(Resources.Required);
                //return;

            } else {
                $("#DistrictValid").text("");
            }

            var data1 = {
                FK_HrEmployeeId: empId,
                WorkAddress: workAddress,
                HomeAddress: homeAddress,
                BuildNumber: buildNumber,
                FK_DefCityId: city,
                District: district,
                PostalCode: postCode,
                Phon1: phone1,
                Phon2: phone2,
                Mobile: mobile,
                Email: email,
                Description: description,
              
            }
            $.ajax({
                url: '/HrEmployee/AddEmployeeAddress',
                type: "POST",
                data: { addressVM: data1 },
                success: function (result) {
                    if (result) {
                        loadEmployeeAddressGrid();
                        swal({
                            title: Resources.SavedSuccessfullyResource,
                            confirmButtonText: Resources.DoneResource,
                            type: "success"
                        });
                        // $("#EmployeeId").val("");
                        $("#WorkAddress").val("");
                        $("#HomeAddress").val("");
                        $("#BuildNumber").val("");
                        $("#District").val("");
                        $("#PostalCode").val("");
                        $("#Phon1").val("");
                        $("#Phon2").val("");
                        $("#Mobile").val("");
                        $("#Email").val("");
                        $("#Description").val("");
                        $("#FK_DefCityId").data("kendoDropDownList").value(0);
                    } else {

                        swal({
                            title: Resources.ErrorMsgResource,
                            confirmButtonText: Resources.DoneResource,
                            type: "error"
                        });
                    }

                }
            })
        } else {
            swal({
                title: Resources.EnterRequiredResource + " " + Resources.BasicInformation,
                confirmButtonText: Resources.DoneResource,
                type: "error"
            });
        }

    });

    loadEmployeeAddressGrid();

    function loadEmployeeAddressGrid() {
        var id = $("#EmployeeId").val();
        var dataSource = new kendo.data.DataSource({
            transport: {
                read: {
                    url: "/HrEmployee/GetEmployeeAddress?id=" + id,
                    Type: "GET"
                }
            },
            error: function (e) {
                // alert("Status: " + e.status + "; Error message: " + e.errorThrown);
            },

            schema: {
                model: {
                    id: "id",
                    fields: {
                        id: { editable: false },
                        workAddress: { editable: false },
                        homeAddress: { editable: false },
                        city: { editable: false },
                        district: { editable: false },
                        buildNumber: { editable: false },
                        postalCode: { editable: false },
                        phon1: { editable: false },
                        phon2: { editable: false },
                        mobile: { editable: false },
                        email: { editable: false },
                        description: { editable: false },
                        FK_CreatorId: { editable: false },
                        creationDate: { type: "date", editable: false },
                        lastModifiedDate: { type: "date", editable: false },
                        isActive: { editable: false },
                        isDeleted: { editable: false },

                    }
                }
            }
        });


        var grid = $("#employeeAddressGrid").kendoGrid({
            excel: {
                fileName: "Banks.xlsx",
                allPages: true,
                filterable: true
            },
            dataSource: dataSource,
            pageable: false,

            noRecords: Resources.GridNoRecords,
            messages: {
                noRecords: Resources.GridNoRecordsMessage
            },

            columns: [

                { field: "workAddress", title: Resources.WorkAddress, width: Resources.AddressWidth },
                { field: "homeAddress", title: Resources.HomeAdderss, width: Resources.NameWidth },
                { field: "city", title: Resources.City, width: Resources.NameWidth },
                { field: "district", title: Resources.District, width: Resources.NameWidth },
                { field: "buildNumber", title: Resources.BuildNumber, width: Resources.NameWidth },
                { field: "postalCode", title: Resources.PostCode, width: Resources.NameWidth },
                { field: "phon1", title: Resources.Phone1, width: Resources.NameWidth },
                { field: "phon2", title: Resources.Phone2, width: Resources.NameWidth },
                { field: "mobile", title: Resources.Mobile, width: Resources.NameWidth },
                { field: "email", title: Resources.Email, width: Resources.NameWidth },
                //{ width: Resources.CheckboxWidth, template: "<input type='checkbox' data-bind='checked:isActive' class= 'control-label i-check' disabled = 'disabled' />", headerTemplate: Resources.Status },

                //{
                //    field: "creationDate", title: Resources.CreationDateResource, format: "{0:yyyy/MM/dd}", width: Resources.DateWidth,
                //    filterable: {
                //        operators: {
                //            date: {
                //                gte: Resources.IsAfterOrEqualTo,
                //                lte: Resources.IsBeforeOrEqualTo
                //            }
                //        },
                //        extra: false,
                //        ui: function (element) {
                //            element.kendoDatePicker({
                //                format: '{0: dd/MM/yyyy}'
                //            })
                //        }
                //    }
                //},
                //{
                //    width: Resources.CheckboxWidth, template: '#if(standalone==="True") {#<a  href="/CbBank/Edit/#= id #?standalone=1"  class="btn btn-success btn-sm btnEdit"><i class="fas fa-edit"></i></a>#} else {# <a  href="/CbBank/Edit/#= id # "  class="btn btn-success btn-sm btnEdit"><i class="fas fa-edit"></i></a> #}#'
                //},
                {
                    width: Resources.ActionWidth, template: "<a class='btn btn-danger btn-sm btnDelete'><i class='fas fa-trash-alt'></i></a>"
                },

            ],
            dataBound: function (e) {
                e.sender.items().each(function () {
                    var dataItem = e.sender.dataItem(this);
                    kendo.bind(this, dataItem);
                    if (dataItem.isActive) {
                        //$(this).addClass("k-state-selected");
                    }
                })
                //if (!hasRoleEdit)
                //    $(".btnEdit").addClass('disabled');

                //if (!hasRoleDelete)
                //    $(".btnDelete").addClass('disabled');
            },
            resizable: true,
        });
        grid.data("kendoGrid").table.on("click", ".btnDelete", removeEmployeeAddress);
    }

    function removeEmployeeAddress() {

        var row = $(this).closest("tr"),
            grid = $("#employeeAddressGrid").data("kendoGrid"),
            dataItem = grid.dataItem(row);
        //var filters = grid.dataSource.filter();
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
                $.ajax({
                    url: "/HrEmployee/DeleteEmployeeAddress?id=" + dataItem.id,
                    type: "Get",
                    contentType: 'application/json; charset=utf-8',
                    success: function (result) {
                        debugger;
                        if (result) {
                            loadEmployeeAddressGrid();
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
        });
    }

});