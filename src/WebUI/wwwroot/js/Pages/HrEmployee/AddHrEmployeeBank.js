$().ready(function () {
    $('#DefBranches').change(function () {
        $("#FK_CbBankId").data("kendoDropDownList").dataSource.read();
        $("#FK_CbBankId").data("kendoDropDownList").value(0);

        $("#FK_CbBankBranchId").data("kendoDropDownList").dataSource.read();
        $("#FK_CbBankBranchId").data("kendoDropDownList").value(0);


    });
    $("#FK_CbBankId").change(function () {

        $("#FK_CbBankBranchId").data("kendoDropDownList").dataSource.read();
        $("#FK_CbBankBranchId").data("kendoDropDownList").value(0);


    });

    // ddls 
    $("#FK_CbBankId").kendoDropDownList({
        filter: "contains",
        height: 300,
        dataTextField: "nameAndCode",
        dataValueField: "id",
        dataSource: {
            type: "json",
            // serverFiltering: true,
            transport: {
                read: {
                    url: "/CbBank/GetAllForDDList",
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
    var bankDropDownList = $("#FK_CbBankId").data("kendoDropDownList");
    bankDropDownList.value("1");
   

    $("#FK_CbBankBranchId").kendoDropDownList({
        filter: "contains",
        height: 300,
        dataTextField: "nameAndCode",
        dataValueField: "id",
        dataSource: {
            type: "json",
            // serverFiltering: true,
            transport: {
                read: {
                    url: "/CbBank/GetAllBranchsByBankIdForDDList",
                },
                parameterMap: function (data, action) {

                  
                    var CbBankId = parseInt($("#FK_CbBankId").val());
                    if (data.id != undefined && data.id > 0)
                        CbBankId = data.id;

                    if (action === "read") {
                        return {
                            id: CbBankId,
                        };


                    } else {
                        return data;
                    }
                }
            }
        },

    });
    var bankBranchDropDownList = $("#FK_CbBankBranchId").data("kendoDropDownList");
    bankBranchDropDownList.value("1");
    $("#FK_CbBankBranchId").data("kendoDropDownList").value(1);
    // Grid
    var empId = $("#EmployeeId").val();
    LoadGridBankData();
    function LoadGridBankData() {
        tempSource = new kendo.data.DataSource({
            transport: {
                read: {
                    url: "/HrEmployee/GetBankDataByEmpId?id=" + empId,
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
                        bankName: { type: "text", editable: false },
                        branchName: { type: "text", editable: false },
                        accountNumber: { type: "text", editable: false },
                        iban: { type: "text", editable: false },
                        description: { type: "text" }
                    }
                }
            }
        });
      
        var grid = $("#GridBankData").kendoGrid({
            dataSource: tempSource,
            navigatable: true,
            pageable: false,
            columns: [

                { field: "id", hidden: true, format: "{0:c}" },
                { field: "bankName", title: Resources.Bank, format: "{0:c}", width: Resources.CodeWidth },
                { field: "branchName", title: Resources.Branch, width: Resources.NameWidth },
                { field: "accountNumber", title: Resources.AccountNumber, width: Resources.NameWidth },
                { field: "iban", title: Resources.IBAN, width: Resources.NameWidth },
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
        grid.data("kendoGrid").table.on("click", ".btnDelete", removeBankDataRow);
    }
    function removeBankDataRow() {

        var row = $(this).closest("tr"),
            grid = $("#GridBankData").data("kendoGrid"),
            dataItem = grid.dataItem(row),
            empBakId = dataItem.id,
            dataSource = $("#GridBankData").data("kendoGrid").dataSource;
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

            if (empBakId != "" && empBakId != null) {
                setTimeout(function () {
                    $.ajax({
                        url: "/HrEmployee/DeleteBankData?id=" + empBakId,
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

    $("#addBankData").on('click', function () {

        var fK_CbBankId = $("#FK_CbBankId").val(),
            employeeId = $("#EmployeeId").val(),
            fK_CbBankBranchId = $("#FK_CbBankBranchId").val(),
            accountNumber = $("#AccountNumber").val().trim(),
            iBAN = $("#IBAN").val().trim();


        if (employeeId == "" || employeeId == "0") {
            swal({
                title: Resources.EnterRequiredResource + " " + Resources.BasicInformation,
                confirmButtonText: Resources.DoneResource,
                type: "error"
            });
        }
        else if (fK_CbBankId == "0") {
            swal({
                title: Resources.ChooseResource + " " + Resources.Bank,
                confirmButtonText: Resources.DoneResource,
                type: "error"
            });
        }
        //else if (fK_CbBankBranchId == "0") {
        //    swal({
        //        title: Resources.ChooseResource + " " + Resources.Branch,
        //        confirmButtonText: Resources.DoneResource,
        //        type: "error"
        //    });
        //}
        //else if (accountNumber == "") {
        //    swal({
        //        title: Resources.EnterRequiredResource + " " + Resources.AccountNumber,
        //        confirmButtonText: Resources.DoneResource,
        //        type: "error"
        //    });
        //}
        else if (iBAN == "") {
            swal({
                title: Resources.EnterRequiredResource + " " + Resources.IBAN,
                confirmButtonText: Resources.DoneResource,
                type: "error"
            });
        }
        else {


            var Obj = {
                FK_HrEmployeeId: parseInt(employeeId),
                FK_CbBankId: parseInt(fK_CbBankId),
                FK_CbBankBranchId: parseInt(fK_CbBankBranchId),
                AccountNumber: accountNumber,
                IBAN: iBAN,
                Description: $("#DescriptionBank").val(),
            }
            $.ajax({
                url: "/HrEmployee/CreateBankData",
                type: "Post",
                cache: false,
                processData: false,
                data: JSON.stringify(Obj),
                contentType: 'application/json',
                success: function (response) {

                    if (response) {

                        LoadGridBankData();
                        $("#FK_CbBankId").val("");
                        $("#FK_CbBankBranchId").val("");
                        $("#AccountNumber").val("");
                        $("#DescriptionBank").val("");

                        $("#FK_CbBankId").data("kendoDropDownList").value(0);

                        $("#FK_CbBankBranchId").data("kendoDropDownList").dataSource.read();
                        $("#FK_CbBankBranchId").data("kendoDropDownList").value(0);
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

//$("#FK_CbBankId").change(function () {
//  
//    var bankId = $(this).val();
//    $.ajax({
//        type: "POST",
//        url: "/CbBank/GetAllBranchsByBankId?id=" + bankId,
//        dataType: "json",
//        success: function (response) {
//          
//            if (response != null) {
//                var option = "";
//                $.each(response, function (index, item) {
//                    option += "<option value='" + item.id + "'>" + item.branchNameAr + "</option>"
//                });
//                $("#FK_CbBankBranchId").html(option)

//            }

//        }
//    });

//});

