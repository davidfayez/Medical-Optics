$(document).ready(function () {

    $('#DefBranches').change(function () {

        $("#FK_HrEmployeeId").data("kendoDropDownList").dataSource.read();
        $("#FK_HrEmployeeId").data("kendoDropDownList").value(0);

        $("#FK_HrManagementId").data("kendoDropDownList").dataSource.read();
        $("#FK_HrManagementId").data("kendoDropDownList").value(0);

        $("#FK_HrDepartmentId").data("kendoDropDownList").dataSource.read();
        $("#FK_HrDepartmentId").data("kendoDropDownList").value(0);

        $("#extraKinshiptype").data("kendoDropDownList").dataSource.read();
        $("#extraKinshiptype").data("kendoDropDownList").value(0);

    });
    $("#FK_HrManagementId").kendoDropDownList({
        filter: "contains",
        height: 300,
        dataTextField: "nameAndCode",
        dataValueField: "id",
        dataSource: {
            type: "json",
            // serverFiltering: true,
            transport: {
                read: {
                    url: "/HrLookups/GetAllHrManagementForDDList",
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
        select: onSelectManagement
    });
    function onSelectManagement(e) {
        $("#FK_HrEmployeeId").data("kendoDropDownList").dataSource.read({ managementId: e.dataItem.id });
        $("#FK_HrEmployeeId").data("kendoDropDownList").value(0);

    }
    $("#FK_HrDepartmentId").kendoDropDownList({
        filter: "contains",
        height: 300,
        dataTextField: "nameAndCode",
        dataValueField: "id",
        dataSource: {
            type: "json",
            // serverFiltering: true,
            transport: {
                read: {
                    url: "/HrDepartment/GetAllForDDList",
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
        select: onSelectDepartment
    });
    function onSelectDepartment(e) {

        $("#FK_HrEmployeeId").data("kendoDropDownList").dataSource.read({ departmentId: e.dataItem.id });
        $("#FK_HrEmployeeId").data("kendoDropDownList").value(0);

    }
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

                    var managementId = parseInt($("#FK_HrManagementId").val()),
                        departmentId = parseInt($("#FK_HrDepartmentId").val());
                    if (managementId == 0 || isNaN(managementId))
                        managementId = null;
                    if (departmentId == 0 || isNaN(departmentId))
                        departmentId = null;


                    if (data.hasOwnProperty.length > 0 && data.managementId > 0 && data.managementId != undefined)
                        managementId = data.managementId;
                    else if (data.managementId == 0)
                        managementId = null;


                    if (data.hasOwnProperty.length > 0 && data.departmentId > 0 && data.departmentId != undefined)
                        departmentId = data.departmentId;
                    else if (data.departmentId == 0)
                        departmentId = null;

                    if (action === "read") {
                        if (Object.keys(data).length > 0 && data.filter != undefined && data.filter.filters["length"] > 0) {
                            return {
                                code: data.filter.filters[0].value,
                                defBranchId: parseInt($("#FK_DefBranchId").val()),
                                managementId: managementId,
                                departmentId: departmentId,
                            };
                        } else {
                            return {
                                code: "",
                                defBranchId: parseInt($("#FK_DefBranchId").val()),
                                managementId: managementId,
                                departmentId: departmentId,
                            };
                        }

                    } else {
                        return data;
                    }
                }
            }
        },
        select: onEmpSelect
    });
    function onEmpSelect(e) {

        $("#FK_HrEmployeeId").val(e.dataItem.id);
        // $("#employeeName").val(e.dataItem.fullName);
        if (e.dataItem.id > 0) {
            $.ajax({
                url: "/HrEmployeeVacation/GetCardData?id=" + e.dataItem.id,
                type: "Get",
                contentType: false,
                processData: false,
                success: function (data) {

                    var TodayDate = new Date();
                    var month = TodayDate.getMonth();
                    var year = TodayDate.getFullYear();
                    var daysCount = new Date(year, month + 1, 0).getDate();
                    var payPerDay = Number((data.basicSalary + data.totalAllowance) / daysCount).toFixed(2);
                    var payPerHour = data.hoursCount == 0 ? 0 : Number(payPerDay / data.hoursCount).toFixed(2);
                    $("#BasicSalary").val(data.basicSalary);
                    $("#TotalAllowance").val(data.totalAllowance);
                    $("#HoursCount").val(data.hoursCount);
                    $("#PayPerDay").val(payPerDay);
                    $("#PayPerHour").val(payPerHour);
                    $("#userImage").attr("src", data.imagePath);

                }
            });
        }



    }

    $("#extraKinshiptype").kendoDropDownList({
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

    //In Edit Get Card Data
    var now = new Date(),
        today = now.getFullYear() + "-" + ("0" + (now.getMonth() + 1)).slice(-2) + "-" + ("0" + now.getDate()).slice(-2);
    $('#extraBirthDate').val(today);
    var EmployeeId = parseInt($("#FK_HrEmployeeId").val());
    if (EmployeeId > 0) {
        $.ajax({
            url: "/HrEmployee/GetCardData?id=" + EmployeeId,
            type: "Get",
            contentType: false,
            processData: false,
            success: function (data) {
                debugger;
                var TodayDate = new Date();
                var month = TodayDate.getMonth();
                var year = TodayDate.getFullYear();
                var daysCount = new Date(year, month + 1, 0).getDate();
                var payPerDay = (data.basicSalary + data.totalAllowance) / daysCount;
                var payPerHour = payPerDay / data.hoursCount;
                $("#BasicSalary").val(data.basicSalary);
                $("#TotalAllowance").val(data.totalAllowance);
                $("#HoursCount").val(data.hoursCount);
                $("#PayPerDay").val(payPerDay);
                $("#PayPerHour").val(payPerHour);
                $("#userImage").attr("src", "../../images/Employee/" + data.imagePath);

            }
        });
    }

    var EmployeeDataSource = new kendo.data.DataSource({

        serverFiltering: true,
        type: "json",
        transport: {
            read: {
                url: "/HrEmployee/GetAllHrEmployeeAutoComplete"
            },
            parameterMap: function (data, action) {
                if (action === "read") {
                    return {
                        code: $("#employeeAutoComplete").val(),
                        branchId: $("#FK_DefBranchId").val(),
                        managementId: $("#FK_HrManagementId").val(),
                        departmentId: $("#FK_HrDepartmentId").val()
                    };
                } else {
                    return data;
                }
            }
        }
        ,
        schema: {
            model: {
                id: "id",
                fields: {

                    fullName: {
                        type: "string"
                    }
                }
            }
        }
    });
    $("#employeeAutoComplete").kendoAutoComplete({

        dataSource: EmployeeDataSource,
        select: onEmpSelect,
        change: onEmpChange,
        headerTemplate: '<div class="dropdown-header k-widget k-header">' +
            '<span style="margin-left:100px">' + Resources.Code + ' </span>' +
            '<span>' + Resources.EmployeeName + '</span>' +

            '</div>',
        template: '<span style="margin-left:100px">#: data.code #</span>' +
            '<span>#: data.fullName #</span>',
        dataTextField: "code",
        dataValueField: "id",
        filter: "contains",
        minLength: 1,
        placeholder: Resources.AutocompleateChoose
    });
    function onEmpSelect(e) {

        $("#FK_HrEmployeeId").val(e.dataItem.id);
        $("#employeeName").val(e.dataItem.fullName);
        $.ajax({
            url: "/HrEmployee/GetCardData?id=" + e.dataItem.id,
            type: "Get",
            contentType: false,
            processData: false,
            success: function (data) {
                debugger;
                var TodayDate = new Date();
                var month = TodayDate.getMonth();
                var year = TodayDate.getFullYear();
                var daysCount = new Date(year, month + 1, 0).getDate();
                var payPerDay = (data.basicSalary + data.totalAllowance) / daysCount;
                var payPerHour = payPerDay / data.hoursCount;
                $("#BasicSalary").val(data.basicSalary);
                $("#TotalAllowance").val(data.totalAllowance);
                $("#HoursCount").val(data.hoursCount);
                $("#PayPerDay").val(payPerDay);
                $("#PayPerHour").val(payPerHour);
                $("#userImage").attr("src", "../../images/Employee/" + data.imagePath);
                loadAllkinship();
            }
        });

    }
    function onEmpChange(e) {
        debugger;
        var code = this.value();

        $.ajax({
            type: "GET",
            url: "/HrEmployee/CheckEmployeeCodeExist?code=" + code,

            success: function (response) {

                if (response != null) {
                    $("#FK_HrEmployeeId").val(response.id);
                    $("#employeeName").val(response.fullName);

                    $.ajax({
                        url: "/HrEmployee/GetCardData?id=" + response.id,
                        type: "Get",
                        contentType: false,
                        processData: false,
                        success: function (data) {
                            debugger;
                            var TodayDate = new Date();
                            var month = TodayDate.getMonth();
                            var year = TodayDate.getFullYear();
                            var daysCount = new Date(year, month + 1, 0).getDate();
                            var payPerDay = Number((data.basicSalary + data.totalAllowance) / daysCount).toFixed(2);
                            var payPerHour = data.hoursCount == 0 ? 0 : Number(payPerDay / data.hoursCount).toFixed(2);
                            $("#BasicSalary").val(data.basicSalary);
                            $("#TotalAllowance").val(data.totalAllowance);
                            $("#HoursCount").val(data.hoursCount);
                            $("#PayPerDay").val(payPerDay);
                            $("#PayPerHour").val(payPerHour);
                            $("#userImage").attr("src", "../../images/Employee/" + data.imagePath);
                            loadAllkinship();

                        }
                    });
                } else {
                    $("#FK_HrEmployeeId").val(null);
                    $("#employeeName").val("");
                    $("#BasicSalary").val("");
                    $("#TotalAllowance").val("");
                    $("#PayPerDay").val("");
                    $("#PayPerHour").val("");
                    $("#HoursCount").val("");
                    $("#userImage").attr("src", "../../images/Users/profile-icon.jpg");
                    swal({
                        title: Resources.AccountCodeNotFoundResource,
                        confirmButtonText: Resources.DoneResource,
                        type: "error"
                    });
                }

            }
        });
    }

    $("#Count").change(function () {
        calculateAmount();
    });

    loadAllkinship();
    var gridDataSource = new kendo.data.DataSource({
        transport: {
            read: "/HrEmployeeTicket/GetEmployeeKinshipEdit?id=" + $("#FK_HrEmployeeId").val() + "&&ticketId=" + $("#Id")
        }, schema: {
            model: {
                id: "id",
                fields: {
                    kinshipTypeName: { type: "string" },
                    name: { type: "string" },
                    dateOfBirth: { type: "date" },
                }
            }
        }
    })
    function loadAllkinship() {
        $("#HrEmployeeTicketsGrid").kendoGrid({
            dataSource: {
                transport: {
                    read: "/HrEmployeeTicket/GetEmployeeKinshipEdit?id=" + $("#FK_HrEmployeeId").val() + "&&ticketId=" + $("#Id").val()
                }, schema: {
                    model: {
                        id: "id",
                        fields: {
                            kinshipTypeName: { type: "string" },
                            name: { type: "string" },
                            dateOfBirth: { type: "date" },
                            fK_HrkinshipTypeId: { type: "string" },
                            paymentType: { type: "string" },
                            isActive: { editable: false },
                            amount: { type: "string" },
                            fK_HrEmployeekinshipId: { type: "string" }
                        }
                    }
                }
            },
            height: 400,
            scrollable: true,
            //sortable: true,
            //reorderable: true,
            //groupable: true,
            resizable: true,
            //filterable: true,
            //columnMenu: true,
            noRecords: true,
            messages: {
                noRecords: "There is no data on current page"
            },
            //pageable: true,
            columns: [
                {
                    title: 'Select All',
                    headerTemplate: "<input type='checkbox' id='header-chb' class='k-checkbox header-checkbox'><label class='k-checkbox-label' for='header-chb'></label>",
                    template: function (dataItem) {
                        return "<input type='checkbox' id='" + dataItem.id + "' class='k-checkbox row-checkbox'><label class='k-checkbox-label' for='" + dataItem.id + "'></label>";
                    },
                    width: Resources.CheckboxWidth
                }, {
                    field: "kinshipTypeName",
                    title: Resources.KinshipTypeName,
                    width: Resources.CodeWidth
                },
                {
                    field: "name",
                    title: Resources.FullName,
                    width: Resources.NameWidth
                },
                {
                    field: "dateOfBirth",
                    title: Resources.BirthDate,
                    format: "{0:yyyy/MM/dd}",
                    width: Resources.DateWidth
                },


            ],
            dataBound: function (e) {
                e.sender.items().each(function () {
                    var dataItem = e.sender.dataItem(this);
                    kendo.bind(this, dataItem);
                    //if (dataItem.isActive) {
                    //    $(this).addClass("k-state-selected");
                    //}
                    //if (dataItem.isPosted) {
                    //    $(this).addClass("k-state-selected");

                    //}
                });

                var view = this.dataSource.view();
                for (var i = 0; i < view.length; i++) {
                    if (view[i].isActive)
                        checkedIds[view[i].id] = true

                    if (checkedIds[view[i].id]) {
                        this.tbody.find("tr[data-uid='" + view[i].uid + "']")
                            .addClass("k-state-selected")
                            .find(".k-checkbox")
                            .attr("checked", "checked");
                    }
                }
            }
        });
    }


    //bind click event to the checkbox
    $("#HrEmployeeTicketsGrid").data("kendoGrid").table.on("click", ".row-checkbox", selectRow);

    $('#header-chb').change(function (ev) {
        var checked = ev.target.checked;
        var s = $('.row-checkbox');
        $('.row-checkbox').each(function (idx, item) {
            if (checked) {
                var c = $(item).closest('tr').is('.k-state-selected');
                if (!($(item).closest('tr').is('.k-state-selected'))) {
                    $(item).click();
                }

            } else {
                if ($(item).closest('tr').is('.k-state-selected')) {
                    $(item).click();
                }

            }
        });
    });

    $("#saveTicketbtn").bind("click", function () {


        var data = getCheckedData();
        if (data.length === 0) {
            swal("", Resources.NoRecordSelectedResource, "error");
            return false;
        }
        var fk_employeeId = $("#FK_HrEmployeeId").val(),
            dueDate = $("#DateDue").val(),
            total = $("#TotalDeservedAmount").val()
        if (fk_employeeId > 0) {

        } else {
            swal("", Resources.NoRecordSelectedResource, "error");
            return;
        }
        if (total >= 0) {

        } else {
            swal("", Resources.ErrorMsgResource, "error");
            return;
        }

        var imgFile = $("#ticketImg")[0].files[0];
        var imgName = "";
        if (imgFile) {
            imgName = imgFile.name;
            var frm = new FormData();
            frm.append("formFile", imgFile)
            $.ajax({
                url: "/HrEmployeeTicket/UpdateImage?id=" + $("#Id").val(),
                type: "POST",
                processData: false,
                contentType: false,
                data: frm,
                success: function (result) {
                    imgName = result;
                    var tickets = {
                        Id: $("#Id").val(),
                        FK_HrEmployeeId: fk_employeeId,
                        DateDue: dueDate,
                        TotalDeservedAmount: total,
                        TicketPath: imgName,
                        FK_DefBranchId: parseInt($("#FK_DefBranchId").val()),
                        details: data
                    }

                    $.ajax({
                        url: '/HrEmployeeTicket/Edit',
                        type: 'POST',
                        data: { addEditHrEmployeeTicketVM: tickets },
                        success: function (result) {

                            if (result) {

                                swal({
                                    title: Resources.SavedSuccessfullyResource,
                                    confirmButtonText: Resources.DoneResource,
                                    type: "success"
                                }, function () {
                                    window.location.href = '/HrEmployeeTicket/Index';
                                });
                            }
                            else {
                                swal({
                                    title: Resources.DefaultErrorMessageResource,
                                    confirmButtonText: Resources.DoneResource,
                                    type: "error"
                                });
                            }
                        },
                        error: function (err, xqr, txt) { }
                    });
                }
            })
        } else {
            var tickets = {
                Id: $("#Id").val(),
                FK_HrEmployeeId: fk_employeeId,
                DateDue: dueDate,
                TotalDeservedAmount: total,
                TicketPath: imgName,
                FK_DefBranchId: parseInt($("#FK_DefBranchId").val()),
                details: data
            }

            $.ajax({
                url: '/HrEmployeeTicket/Edit',
                type: 'POST',
                data: { addEditHrEmployeeTicketVM: tickets },
                success: function (result) {

                    if (result) {

                        swal({
                            title: Resources.SavedSuccessfullyResource,
                            confirmButtonText: Resources.DoneResource,
                            type: "success"
                        }, function () {
                            window.location.href = '/HrEmployeeTicket/Index';
                        });
                    }
                    else {
                        swal({
                            title: Resources.DefaultErrorMessageResource,
                            confirmButtonText: Resources.DoneResource,
                            type: "error"
                        });
                    }
                },
                error: function (err, xqr, txt) { }
            });
        }


    });

    function getCheckedData() {
        var editedData = [];
        gridData = $("#HrEmployeeTicketsGrid").data("kendoGrid").dataSource._data;
        for (var i = 0; i < gridData.length; i++) {
            if (checkedIds[gridData[i].id]) {
                var row = {
                    Id: gridData[i].id,
                    Name: gridData[i].name,
                    DateOfBirth: gridData[i].dateOfBirth,
                    FK_HrkinshipTypeId: gridData[i].fK_HrkinshipTypeId,
                    kinshipTypeName: gridData[i].kinshipTypeName,
                    PaymentType: gridData[i].paymentType,
                    Amount: gridData[i].amount,
                    FK_HrEmployeekinshipId: gridData[i].fK_HrEmployeekinshipId
                };
                editedData.push(row);
            }
            //for (var j in checkedIds) {
            //    if (gridData[i].id == j) {
            //        var row = { id: gridData[i].id, notes: gridData[i].notes, voucherCode: gridData[i].voucherCode };
            //        editedData.push(row);
            //    }
            //}
        }
        return editedData;
    }


    $("#addExtrabtn").click(function () {
        var extraName = $("#extraName").val(),
            extraKinshiptype = $("#extraKinshiptype").val(),
            extraKinshipTypeName = $("#extraKinshiptype").data("kendoDropDownList").text(),
            extraBirthDate = $("#extraBirthDate").val(),
            extraPaymentType = $("#extraPaymentType").val(),
            extraAmount = $("#extraAmount").val();

        if (extraName.length > 1) {
            $("#extraNamevalid").text("")
        } else {
            $("#extraNamevalid").text(Resources.Required)
        }
        if (extraKinshiptype == "0") {
            extraKinshipTypeName = "";
            extraKinshiptype = null;
        }

        var grid = $("#HrEmployeeTicketsGrid").data("kendoGrid");
        var dataSource = grid.dataSource;
        if (extraBirthDate.length > 3)
            extraBirthDate.replace('-', '/');
        if (extraName.length > 1) {
            dataSource.insert(0, {
                kinshipTypeName: extraKinshipTypeName,
                name: extraName,
                dateOfBirth: extraBirthDate,
                fK_HrkinshipTypeId: extraKinshiptype,
                paymentType: extraPaymentType,
                amount: extraAmount,
                id: "a" + Math.random()
            })

            $("#extraName").val("");
            $("#extraAmount").val("");
            $("#extraKinshiptype").data("kendoDropDownList").value(0);
        }


    })

})


//documen ready end



function calculateAmount() {
    var calcMetod = $('input[name="CalculationMethod"]:checked').val();
    var count = $("#Count").val(),
        perday = $("#PayPerDay").val(),
        perHour = $("#PayPerHour").val(),
        basic = $("#BasicSalary").val();
    if (count > 0 && perday > 0 && perHour > 0 && basic > 0) {
        if (calcMetod == 1) {

            $("#Amount").val(perday * count);
        } else if (calcMetod == 2) {
            $("#Amount").val(perHour * count);
        } else if (calcMetod == 3) {

            $("#Amount").val((count / 100) * basic);
        } else {
            $("#Amount").val(count);
        }
    } else {
        $("#Amount").val("");
    }



}

function removeEmployeeBonus(id) {

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
                url: "/HrEmployeePunishment/Delete?Id=" + id,
                type: "Get",
                contentType: 'application/json; charset=utf-8',
                success: function (result) {
                    debugger;
                    if (result) {
                        swal({
                            title: Resources.DeleteSuccessResource,
                            confirmButtonText: Resources.DoneResource,
                            type: "success"
                        });

                        document.location = "../../HrEmployeePunishment/Index";
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


var checkedIds = {};

//on click of the checkbox:
function selectRow() {
    var checked = this.checked,
        row = $(this).closest("tr"),
        grid = $("#HrEmployeeTicketsGrid").data("kendoGrid"),
        dataItem = grid.dataItem(row);

    checkedIds[dataItem.id] = checked;

    if (checked) {
        //-select the row
        row.addClass("k-state-selected");

        var checkHeader = true;

        $.each(grid.items(), function (index, item) {
            if (!($(item).hasClass("k-state-selected"))) {
                checkHeader = false;
            }
        });

        $("#header-chb")[0].checked = checkHeader;
    } else {
        //-remove selection
        row.removeClass("k-state-selected");
        $("#header-chb")[0].checked = false;
    }
}

function setImage(e) {
    var selectedFile = e.files[0];
    var reader = new FileReader();

    var imgtag = document.getElementById("imgCompany");
    imgtag.title = selectedFile.name;

    reader.onload = function (event) {
        imgtag.src = event.target.result;
    };

    reader.readAsDataURL(selectedFile);
}