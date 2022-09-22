$(document).ready(function () {

    //$.ajax({
    //    url: '/DefCity/GetAll',
    //    type: 'GET',
    //    success: function (cities) {
    //        var html=""
    //        for (var i = 0; i < cities.length; i++) {
    //            html += "<option value='" + cities[i].id + "'>" + cities[i].cityNameAr+"</option>"
    //        }
    //        document.getElementById("FK_DefCityId").innerHTML = html;
    //    }
    //})
    $('#DefBranches').change(function () {
        $("#FK_HrDocumentTypeId").data("kendoDropDownList").dataSource.read();
        $("#FK_HrDocumentTypeId").data("kendoDropDownList").value(0);

    });

    $("#FK_HrDocumentTypeId").kendoDropDownList({
        filter: "contains",
        height: 300,
        dataTextField: "nameAndCode",
        dataValueField: "id",
        dataSource: {
            type: "json",
            // serverFiltering: true,
            transport: {
                read: {
                    url: "/HrLookups/GetAllHrDocumentTypeForDDList",
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
    $("#addEmployeeDocumentbtn").click(function () {

        /*var documentName = $("#DocumentTName").val(),*/
        var empId = $("#EmployeeId").val(),
            dateIssue = $("#DateIssue").val(),
            documentType = parseInt($("#FK_HrDocumentTypeId").val()),
            dateExpiry = $("#DateExpiry").val(),
            documentNumber = $("#DocumentNumber").val(),
            issuerName = $("#IssuerName").val(),
            description = $("#DescriptionDocument").val();

        if (empId > 0) {
            //if (documentName.length < 1 || documentName == "") {
            //    $("#DocumentTNameValid").text(Resources.Required);
            //    //return;
            //} else {
            //    $("#DocumentTNameValid").text("");
            //}
            //if (documentNumber.length < 1 || documentNumber == "") {
            //    $("#documentNumberValid").text(Resources.Required);
            //    //return;
            //} else {
            //    $("#documentNumberValid").text("");
            //}

            if (documentType > 0) {
                $("#FK_HrDocumentTypeIdValid").text("");

            } else {
                $("#FK_HrDocumentTypeIdValid").text(Resources.Required);
                //return;
            }
            if (documentType > 0) {
                var data1 = {
                    Id: $("#hrEmployeeDocumentId").val(),
                    FK_HrEmployeeId: empId,
                    FK_HrDocumentTypeId: documentType,

                    DateIssue: dateIssue,
                    DateExpiry: dateExpiry,
                    DocumentNumber: documentNumber,
                    IssuerName: issuerName,
                    Description: description
                }
                $.ajax({
                    url: '/HrEmployee/AddEditEmployeeDocument',
                    type: "POST",
                    data: { documentVM: data1 },
                    success: function (result) {
                        if (result) {
                            loadEmployeeDocumentGrid();
                            //$("#DocumentTName").val("");
                            $("#hrEmployeeDocumentId").val(0);
                            $("#DocumentNumber").val("");
                            $("#IssuerName").val("");
                            $("#DescriptionDocument").val("");
                            $("#FK_HrDocumentTypeId").data("kendoDropDownList").value(0);
                        } else {

                            swal({
                                title: Resources.ErrorMsgResource,
                                confirmButtonText: Resources.DoneResource,
                                type: "error"
                            });
                        }

                    }
                })
            }

        } else {
            swal({
                title: Resources.EnterRequiredResource + " " + Resources.BasicInformation,
                confirmButtonText: Resources.DoneResource,
                type: "error"
            });
        }

    });

    loadEmployeeDocumentGrid();

    function loadEmployeeDocumentGrid() {
        var id = $("#EmployeeId").val();
        var dataSource = new kendo.data.DataSource({
            transport: {
                read: {
                    url: "/HrEmployee/GetEmployeeDocument?id=" + id,
                    Type: "GET"
                }
            },
            error: function (e) {
                //alert("Status: " + e.status + "; Error message: " + e.errorThrown);
            },

            schema: {
                model: {
                    id: "id",
                    fields: {
                        id: { editable: false },
                        documentTName: { editable: false },
                        dateIssue: { type: "date", editable: false },
                        dateExpiry: { type: "date", editable: false },
                        documentNumber: { editable: false },
                        issuerName: { editable: false },
                        description: { editable: false },
                        fK_CreatorId: { editable: false },
                        documentType: { editable: false },
                        fK_HrDocumentTypeId: { editable: false },
                        creationDate: { type: "date", editable: false },
                        lastModifiedDate: { type: "date", editable: false },
                        isActive: { editable: false },
                        isDeleted: { editable: false },
                    }
                }
            }
        });


        var grid = $("#employeeDocumentGrid").kendoGrid({
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

                { field: "documentType", title: Resources.DocumentName, width: Resources.NameWidth },
                { field: "documentNumber", title: Resources.DocumentNumber, width: Resources.NameWidth },
                { field: "dateIssue", title: Resources.DateIssue, width: Resources.NameWidth, format: "{0:yyyy/MM/dd}" },
                { field: "dateExpiry", title: Resources.DateExpiry, width: Resources.NameWidth, format: "{0:yyyy/MM/dd}" },

                { field: "issuerName", title: Resources.IssuerName, width: Resources.NameWidth },
                { field: "description", title: Resources.Description, width: Resources.NameWidth },

                {
                    width: Resources.DoubleActionWidth, template: "<a class='btn btn-danger btn-sm btnDelete'><i class='fas fa-trash-alt'></i></a> <a class='btn btn-success btn-sm btnEditDocument'><i class='fas fa-edit'></i></a>"
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
            },
            resizable: true,
        });
        grid.data("kendoGrid").table.on("click", ".btnDelete", removeEmployeeDocument);
        grid.data("kendoGrid").table.on("click", ".btnEditDocument", editEmployeeDocumentRow);
    }

    function removeEmployeeDocument() {

        var row = $(this).closest("tr"),
            grid = $("#employeeDocumentGrid").data("kendoGrid"),
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
                    url: "/HrEmployee/DeleteEmployeeDocument?id=" + dataItem.id,
                    type: "Get",
                    contentType: 'application/json; charset=utf-8',
                    success: function (result) {
                        debugger;
                        if (result) {
                            loadEmployeeDocumentGrid();
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
    function editEmployeeDocumentRow() {
        debugger
        var row = $(this).closest("tr"),
            grid = $("#employeeDocumentGrid").data("kendoGrid"),
            dataItem = grid.dataItem(row);
        var uid = dataItem.uid;
        var id = dataItem.id;
        var DateIssue = dataItem.dateIssue;
        var DateIssueFormated = DateIssue.getFullYear() + "-" + ("0" + (DateIssue.getMonth() + 1)).slice(-2) + "-" + ("0" + DateIssue.getDate()).slice(-2);

        var DateExpiry = dataItem.dateExpiry;
        var DateExpiryFormated = DateExpiry.getFullYear() + "-" + ("0" + (DateExpiry.getMonth() + 1)).slice(-2) + "-" + ("0" + DateExpiry.getDate()).slice(-2);

        $("#hrEmployeeDocumentId").val(dataItem.id);
        $("#FK_HrDocumentTypeId").data("kendoDropDownList").value(dataItem.fK_HrDocumentTypeId);
        $("#DateIssue").val(DateIssueFormated);
        $("#DateExpiry").val(DateExpiryFormated);
        $("#IssuerName").val(dataItem.issuerName);
        $("#DocumentNumber").val(dataItem.documentNumber);
        $("#DescriptionDocument").val(dataItem.description);
    }
});