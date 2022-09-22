$().ready(function () {
    //var url = window.location.pathname;
    var id = parseInt($("#Id").val());
    debugger;
    // Grid

    LoadGridBranchesDetails();
    function LoadGridBranchesDetails() {
        tempSource = new kendo.data.DataSource({
            transport: {
                read: {
                    url: "/CbBank/GetBranchesByBankId?id=" + id,
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
                        branchNameAr: { type: "text", editable: false },
                        branchNameEn: { type: "text", editable: false },
                        description: { type: "text" }
                    }
                }
            }
        });
        var grid = $("#GridBankBranchs").kendoGrid({
            dataSource: tempSource,
            navigatable: true,
            pageable: false,
            columns: [

                { field: "id", hidden: true, format: "{0:c}" },
                { field: "branchNameAr", title: Resources.BranchNameAr, format: "{0:c}", width: Resources.CodeWidth },
                { field: "branchNameEn", title: Resources.BranchNameEn, width: Resources.NameWidth },
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
        grid.data("kendoGrid").table.on("click", ".btnDelete", removeBranchRow);
    }
    function removeBranchRow() {

        var row = $(this).closest("tr"),
            grid = $("#GridBankBranchs").data("kendoGrid"),
            dataItem = grid.dataItem(row),
            branchId = dataItem.id,
            dataSource = $("#GridBankBranchs").data("kendoGrid").dataSource;
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

            if (branchId != "" && branchId != null) {
                setTimeout(function () {
                    $.ajax({
                        url: "/CbBank/DeleteBranche?id=" + branchId,
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
    $("#btnAddNewBranch").on('click', function () {

        var branchNameAr = $("#BranchNameAr").val().trim(),
            branchNameEn = $("#BranchNameEn").val().trim(),
            description = $("#DescriptionDetail").val().trim();

        if (branchNameAr == "") {
            swal({
                title: Resources.EnterRequiredResource + " " + Resources.BranchNameAr,
                confirmButtonText: Resources.DoneResource,
                type: "error"
            });
        }
        else if (branchNameEn == "") {
            swal({
                title: Resources.EnterRequiredResource + " " + Resources.BranchNameEn,
                confirmButtonText: Resources.DoneResource,
                type: "error"
            });
        }
        else {
            tempSource.insert(0, {
                branchNameAr: branchNameAr,
                branchNameEn: branchNameEn,
                description: description,

            });

            $("#BranchNameAr").val("");
            $("#BranchNameEn").val("");
            $("#DescriptionDetail").val("");
        }


    });
});

function removeBankEdit(id) {

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
                url: "/CbBank/Delete?id=" + id,
                type: "Get",
                contentType: 'application/json; charset=utf-8',
                success: function (result) {

                    if (result) {
                        swal({
                            title: Resources.DeleteSuccessResource,
                            confirmButtonText: Resources.DoneResource,
                            type: "success"
                        }, function () {
                            window.location.href = '/CbBank/Index'
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

function SubmitBankEdit() {
    if ($("#CbBankEdit").valid()) {
        var listDetails = [];
        var gridData = $('#GridBankBranchs').data("kendoGrid").dataSource.data();

        if (gridData.length == 0) {
            swal({
                title: Resources.GridLengthZeroResource,
                confirmButtonText: Resources.DoneResource,
                type: "error"
            });
        }
        else {
            debugger
            for (var i = 0; i < gridData.length; i++) {

                for (var i = 0; i < gridData.length; i++) {
                    var branchId = parseInt(gridData[i].id);
                    if (branchId == 0 || isNaN(branchId)) {
                        var detail = {
                            Id: 0,
                            BranchNameAr: gridData[i].branchNameAr,
                            BranchNameEn: gridData[i].branchNameEn,
                            Description: gridData[i].description,
                        };
                        listDetails.push(detail);
                    }

                }

                var isActive = $("input[name='IsActive']:checked").val();

                if (isActive == "True")
                    isActive = true;
                else
                    isActive = false;

                var isGenerale = $('#IsGenerale').val();
                if (isGenerale == "true")
                    isGenerale = true;
                else
                    isGenerale = false;

                var Obj = {
                    Id: parseInt($("#Id").val()),
                    BankCode: $("#BankCode").val(),
                    BankNameAr: $("#BankNameAr").val(),
                    BankNameEn: $("#BankNameEn").val(),
                    SwiftCode: $("#SwiftCode").val(),
                    IBAN: $("#IBAN").val(),
                    Description: $("#Description").val(),
                    IsActive: isActive,
                    Branches: listDetails,
                    IsGenerale: isGenerale,
                    FK_DefBranchId: parseInt($("#FK_DefBranchId").val()),
                };
                debugger;
                $.ajax({
                    url: "/CbBank/Edit",
                    type: "Post",
                    cache: false,
                    processData: false,
                    data: JSON.stringify(Obj),
                    contentType: 'application/json',
                    success: function (result) {

                        if (result) {

                            swal({
                                title: Resources.SavedSuccessfullyResource,
                                confirmButtonText: Resources.DoneResource,
                                type: "success"
                            }, function () {
                                if (standalone == "1")
                                    window.location.href = '/CbBank/Index?standalone=' + standalone;
                                else
                                    window.location.href = '/CbBank/Index';
                            });
                        }
                        else {
                            swal({
                                title: Resources.DefaultErrorMessageResource,
                                confirmButtonText: Resources.DoneResource,
                                type: "error"
                            });
                        }
                    }
                });
            }


        }

    }
}