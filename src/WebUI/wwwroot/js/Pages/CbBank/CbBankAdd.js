$().ready(function () {

    // Grid
    var tempSource = new kendo.data.DataSource({

    });
    var grid = $("#GridBankBranchs").kendoGrid({
        dataSource: tempSource,
        navigatable: true,
        pageable: {
            numeric: false,
            //refresh: true,
            previousNext: false,
            messages: {
                display: "Total: {2}"
            }
        },
        dataBound: function () {
            this.pager
                .element
                .append(
                    '<span class="k-pager-info k-label">' +
                    this.dataSource.total() +
                    ' items</span>'
                );
        },
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
    function removeBranchRow() {

        var row = $(this).closest("tr"),
            grid = $("#GridBankBranchs").data("kendoGrid"),
            dataItem = grid.dataItem(row);
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
                var dataSource = $("#GridBankBranchs").data("kendoGrid").dataSource;

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
        });
    }
    $("#btnAddNewBranch").on('click', function () {

        var branchNameAr = $("#BranchNameAr").val().trim(),
            branchNameEn = $("#BranchNameEn").val().trim(),
            description = $("#DescriptionDetail").val().trim();
        
        var recordsOnCurrentView = tempSource.view().length;
        //total records
        var totalRecords = tempSource.total();
        debugger;
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

            tempSource.insert(recordsOnCurrentView, {
                branchNameAr: branchNameAr,
                branchNameEn: branchNameEn,
                description: description,

            });
            //grid.find('span.k-pager-info').text(recordsOnCurrentView);
            tempSource.sync();
            var grid = $("#GridBankBranchs").data("kendoGrid");
            //grid.refresh();
            grid.setDataSource(tempSource);
            tempSource.sync();

            grid.refresh();
            tempSource.sync();

            $("#BranchNameAr").val("");
            $("#BranchNameEn").val("");
            $("#DescriptionDetail").val("");
        }


    });
});

function SubmitBankCreate() {
    if ($("#CbBankCreate").valid()) {
        var listDetails = [];
        var gridData = $('#GridBankBranchs').data("kendoGrid").dataSource.data();
        debugger
        if (gridData.length == 0) {
            swal({
                title: Resources.GridLengthZeroResource,
                confirmButtonText: Resources.DoneResource,
                type: "error"
            });
        }
        else {
            for (var i = 0; i < gridData.length; i++) {

                var detail = {
                    Id: 0,
                    BranchNameAr: gridData[i].branchNameAr,
                    BranchNameEn: gridData[i].branchNameEn,
                    Description: gridData[i].description,
                };
                listDetails.push(detail);
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
                Id: 0,
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
                url: "/CbBank/Create",
                type: "Post",
                cache: false,
                processData: false,
                data: JSON.stringify(Obj),
                contentType: 'application/json',
                success: function (result) {

                    if (result) {
                        debugger
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