﻿$(document).ready(function () {


    LoadGridSubBranch();
    function LoadGridSubBranch() {
        var grid = $("#HrSubBranchList").kendoGrid({
            excel: {
                fileName: "Sub Branch.xlsx",
                allPages: true,
                filterable: true
            },
            dataSource: {
                transport: {
                    read: "/HrLookups/GetAllHrSubBranch"
                },
                schema: {
                    model: {
                        id: "id",
                        fields: {
                            branchCode: { type: "string" },
                            branchNameAr: { type: "string" },
                            branchAddress: { type: "string" },
                            //fK_DefCompanyId: { type: "string" },
                            email: { type: "string" },
                            fax: { type: "string" },
                            postCode: { type: "string" },
                            phone1: { type: "string" }
                            //notes: { type: "string" }
                        }
                    }
                },
                pageSize: Resources.GridPageSize
            },
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
                field: "branchCode",
                title: Resources.BranchCode,
                width: Resources.CodeWidth
            },
            {
                field: "branchNameAr",
                title: Resources.NameAr,
                width: Resources.NameWidth
            },
            {
                field: "branchAddress",
                title: Resources.Address,
                width: Resources.AddressWidth
            },
            //{
            //field: "fK_DefCompanyId",
            //    title: Resources.CompanyName,
            //    width: Resources.NameWidth
            //},
            {
                field: "email",
                title: Resources.Email,
                width: Resources.EmailWidth
            },
            {
                field: "fax",
                title: Resources.Fax,
                width: Resources.PhoneWidth
            },
            {
                field: "postCode",
                title: Resources.PostCode,
                width: Resources.PostcodeWidth
            },
            {
                field: "phone1",
                title: Resources.Phone1,
                width: Resources.PhoneWidth
            },
            { width: Resources.CheckboxWidth, template: "<input type='checkbox' data-bind='checked:isActive' class= 'control-label i-check' disabled = 'disabled' />", headerTemplate: Resources.Status },
            //{
            //    field: "notes",
            //    title: Resources.Notes,
            //    width: Resources.NoteWidth
            //},
            { width: Resources.DoubleActionWidth, template: "<a  href='/HrLookups/EditHrSubBranch/#= id #'  class='btn btn-success btn-sm btnEdit'><i class='fas fa-edit'></i></a> <a  class='btn btn-danger btn-sm btnDelete' ><i class='fas fa-trash-alt'></i></a>" },

            ],
            dataBound: function (e) {
                e.sender.items().each(function () {
                    var dataItem = e.sender.dataItem(this);
                    kendo.bind(this, dataItem);
                    if (dataItem.isActive) {
                        //$(this).addClass("k-state-selected");
                    }
                });
                if (!hasRoleEdit)
                    $(".btnEdit").addClass('disabled');

                if (!hasRoleDelete)
                    $(".btnDelete").addClass('disabled');
            }
        });
        grid.data("kendoGrid").table.on("click", ".btnDelete", removeSubBranch);
    }
    function removeSubBranch() {

        var row = $(this).closest("tr"),
            grid = $("#HrSubBranchList").data("kendoGrid"),
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
                $.ajax({
                    url: "/HrLookups/DeleteHrSubBranch?id=" + dataItem.id,
                    type: "Get",
                    contentType: 'application/json; charset=utf-8',
                    success: function (result) {
                        debugger;
                        if (result) {
                            LoadGridSubBranch();
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

    $("#DefBranches").change(function () {
        debugger;
        var fK_DefBranchId = parseInt($("#FK_DefBranchId").val());
        $('#HrSubBranchList').data('kendoGrid').dataSource.read({ fK_DefBranchId: fK_DefBranchId });
    });
});

$(".exportExcel").on('click', function () {
    $("#HrSubBranchList").getKendoGrid().saveAsExcel();
});
