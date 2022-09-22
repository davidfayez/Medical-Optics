$(document).ready(function () {
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
    });



    $("#FK_HrDepartment").kendoDropDownList({
        filter: "contains",
        height: 300,
        dataTextField: "nameAndCode",
        dataValueField: "id",
        dataSource: {
            type: "json",
            serverFiltering: false,
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

    });

  
    var dataSourceEmployees = new kendo.data.DataSource({

        transport: {
            read: {
                url: "/HrEmployeeVactionStatus/SearchInHrEmployeeVacations",
                dataType: "json",
                Type: "GET"
            },
        },
        parameterMap: function (data, type) {
            if (type == "read") {
                
                return {

                    id: $("#FK_HrEmployeeId").val(),
                   
                    departId: $("#FK_HrDepartment").val(),
                   
                    
                    
                    
                };
            }
        },
        pageSize: Resources.GridPageSize,
        schema: {
            model: {
                id: "id",
                fields: {
                    code: { type: "string" },
                    fullName: { type: "string" },
                    departmentName: { type: "string" },
                    salary: { type: "string" },
                    creator: { editable: false },
                    IsDeleted: { type: "string" },
                    isInWork: { type: "string" },
                }
            }
        }
    });
    var grid = $("#HrEmployeeVacationList").kendoGrid({

      
        dataSource: dataSourceEmployees,
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
        pageable: {
            pageSizes: [20, 40, 60, Resources.All],
            numeric: Resources.GridNumeric,
            refresh: Resources.GridRefresh,

        },
        columns: [{
            field: "code",
            title: Resources.Code,
            width: Resources.CodeWidth
        }, {
            field: "fullName",
            title: Resources.FullName,
            width: Resources.NameWidth
        }, {
            field: "departmentName",
            title: Resources.DepartmentName,
            width: Resources.NameWidth
            }  
            , {
                field: "employeeVacationTakenDays",
                title: Resources.EmployeeVacationTakenDays,
                width: Resources.NameWidth
            }  
            , {
                field: "totalVacationDays",
                title: Resources.TotalVacationDays,
                width: Resources.NameWidth
            }  
            , { field: "status", title: Resources.Status, width: Resources.NameWidth, template: "<span id='badge_#=id#' class='badgeTemplate'></span>" }
            , {
                field: "controlBoard",
                title: Resources.ControlBoard,
                width: Resources.NameWidth,
                template: "<span id='board_#=id#'  class='boardTemplate'></span>"
            }  
            , {
                field: "stopVacations",
                title: Resources.StopVacation,
                width: Resources.DoubleActionWidth,
                template: "<span id='stop#=id#'  class='stopTemplate'></span>"
            }  
           

        ],
        dataBound: onDataBound
    });
   
   
    function onDataBound(e) {
        var grid2 = this;
        grid2.table.find("tr").each(function () {
            var dataItem = grid2.dataItem(this);
           
            var themeColor = dataItem.isInVacation ? 'warning' : 'success';
            var text = dataItem.isInVacation ? Resources.InVacation : Resources.InWork;
            var board = Resources.ActivateControlBoard;
            var retVacation = Resources.ReturnVacation;
            var stopvacation = Resources.RtopemployeeVacation;
            
            $(this).find(".badgeTemplate").append(`<button style="direction: rtl; " type='button' class='btn btn-${themeColor}'>${text}</button>`);
            if (themeColor == 'warning') {
            $(this).find(".boardTemplate").append(`<button style="direction: rtl; " onclick='activeControlBoard(${dataItem.code})' type='button' class='btn btn-success actions'>${board}</button>`);
            }
            if (!dataItem.vacationEnabled ) {
                $(this).find(".stopTemplate").append(`<button style="direction: rtl; " onclick='enableVacation(${dataItem.id})' type='button' class='btn btn-success actions'>${retVacation}</button>`);
            }
            if (dataItem.employeeVacationTakenDays >= dataItem.totalVacationDays && dataItem.totalVacationDays!=null) {
                $(this).find(".stopTemplate").append(`<button style="direction: rtl; " onclick='disableVacation(${dataItem.id})' type='button' class='btn btn-danger actions'>${stopvacation}</button>`);
            }
        

            kendo.bind($(this), dataItem);
        });
    }
    $("#btnDataReview").click(function () {
        var radioValue = $("input[name='IsActive']:checked").val();
      

        dataSourceEmployees.read({ FK_HrDepartment: $('#FK_HrDepartment').val(), FK_HrEmployeeId: $('#FK_HrEmployeeId').val(), DateFrom: $('#DateFrom').val(), DateTo: $('#DateTo').val(), IsActive: radioValue });



    });


    

    


   
})


function enableVacation(id) {
   

    $.ajax({
        url: `/HrEmployeeVactionStatus/changeVacationStatus?id=${id}&status=true`,
        type: "GET",
        dataType: "json",
        success: function (result) {


            if (result) {
                $("#HrEmployeeVacationList").data("kendoGrid").dataSource.read({ IsActive: 'All' });


                swal({
                    title: Resources.EnableVacationStatus,
                    confirmButtonText: Resources.DoneResource,
                    type: "success"
                });

            }
            else {
                swal({
                    title: Resources.EnableVacationStatus,
                    confirmButtonText: Resources.DoneResource,
                    type: "error"
                });
            }

        },
        error: function (err) { }
    });

}

function activeControlBoard(code) {
    
    $.ajax({
        url: `/HrEmployeeVactionStatus/activateControlBoard?code=${code}`,
        type: "GET",
        dataType: "json",
        success: function (result) {
          
            if (result) {
                var radioValue = $("input[name='IsActive']:checked").val();
                $("#HrEmployeeVacationList").data("kendoGrid").dataSource.read({ IsActive: radioValue });

                swal({
                    title: Resources.ActivateControlBoard,
                    confirmButtonText: Resources.DoneResource,
                    type: "success"
                });

            }
            else {
                swal({
                    title: Resources.ActivateControlBoard,
                    confirmButtonText: Resources.DoneResource,
                    type: "error"
                });
            }

        },
        error: function (err) { }
    });
}


function disableVacation(id) {
    $.ajax({
        url: `/HrEmployeeVactionStatus/changeVacationStatus?id=${id}&status=false`,
        type: "GET",
        dataType: "json",
        success: function (result) {


            if (result) {
                $("#HrEmployeeVacationList").data("kendoGrid").dataSource.read({ IsActive: 'All' });

                swal({
                    title: Resources.DisableVacationResource,
                    confirmButtonText: Resources.DoneResource,
                    type: "success"
                });
            }
            else {
                swal({
                    title: Resources.DisableVacationResource,
                    confirmButtonText: Resources.DoneResource,
                    type: "error"
                });
            }

        },
        error: function (err) { }
    });
}
