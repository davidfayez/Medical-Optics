$(document).ready(function () {


    var now = new Date(),
        today = now.getFullYear() + "-" + ("01") + "-" + ("01")
        later = now.getFullYear() + "-" + ("12") + "-" + ("31");
    $('#DateFrom').val(today);
    $('#DateTo').val(later);

    $("#FK_EmployeeId").kendoDropDownList({
        filter: "contains",
        height: 300,
        dataTextField: "codeAndName",
        dataValueField: "id",
        dataSource: {
            type: "json",
            //serverFiltering: true,
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
        }
    });
    getSubBranches();
    $("#DefBranches").change(function () {
        getSubBranches();
        $("#FK_HrEmployeeId").data("kendoDropDownList").dataSource.read();
        $("#FK_HrEmployeeId").data("kendoDropDownList").value(0);

        $("#HrArchiveLevel1Id").data("kendoDropDownList").dataSource.read();
        $("#HrArchiveLevel1Id").data("kendoDropDownList").value(0);

        $("#HrArchiveLevel2Id").data("kendoDropDownList").dataSource.read();
        $("#HrArchiveLevel2Id").data("kendoDropDownList").value(0);

        $("#HrArchiveLevel3Id").data("kendoDropDownList").dataSource.read();
        $("#HrArchiveLevel3Id").data("kendoDropDownList").value(0);
    })
    function getSubBranches() {
        $.ajax({
            url: "/HrLookups/GetHrSubBranchByBranch?id=" + $("#FK_DefBranchId").val(),
            Type: "GET",
            success: function (subBranch) {
                var html = "";
                for (var i = 0; i < subBranch.length; i++) {

                    html += "<option value='" + subBranch[i].id + "'>" + subBranch[i].branchNameAr + "</option>";
                }
                $("#subBranchSelect").html(html);
            }
        })
    }

    $("#HrArchiveLevel1Id").kendoDropDownList({
        filter: "contains",
        height: 300,
        dataTextField: "codeAndName",
        dataValueField: "id",
        dataSource: {
            type: "json",
            //serverFiltering: true,
            transport: {
                read: {
                    url: "/HrArchive/GetAllArchiveLevel1ForDDList",
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
        select: onSelectLevel1
    });
    function onSelectLevel1(e) {

        $("#FK_HrArchiveLevel1Id").val(e.dataItem.id);
        $("#HrArchiveLevel2Id").data("kendoDropDownList").dataSource.read();
    }

    $("#HrArchiveLevel2Id").kendoDropDownList({
        filter: "contains",
        height: 300,
        dataTextField: "codeAndName",
        dataValueField: "id",
        dataSource: {
            type: "json",
            //serverFiltering: true,
            transport: {
                read: {
                    url: "/HrArchive/GetAllArchiveLevel2ForDDList",
                },
                parameterMap: function (data, action) {

                    if (action === "read") {
                        if (Object.keys(data).length > 0 && data.filter != undefined && data.filter.filters["length"] > 0) {
                            return {
                                code: data.filter.filters[0].value,
                                defBranchId: parseInt($("#FK_DefBranchId").val()),
                                mainArchive: parseInt($("#FK_HrArchiveLevel1Id").val()),
                            };
                        } else {
                            return {
                                code: "",
                                defBranchId: parseInt($("#FK_DefBranchId").val()),
                                mainArchive: parseInt($("#FK_HrArchiveLevel1Id").val()),
                            };
                        }

                    } else {
                        return data;
                    }
                }
            }
        },
        select: onSelectLevel2
    });
    function onSelectLevel2(e) {

        $("#FK_HrArchiveLevel2Id").val(e.dataItem.id);
        $("#HrArchiveLevel3Id").data("kendoDropDownList").dataSource.read();
    }

    $("#HrArchiveLevel3Id").kendoDropDownList({
        filter: "contains",
        height: 300,
        dataTextField: "codeAndName",
        dataValueField: "id",
        dataSource: {
            type: "json",
            //serverFiltering: true,
            transport: {
                read: {
                    url: "/HrArchive/GetAllArchiveLevel3ForDDList",
                },
                parameterMap: function (data, action) {

                    if (action === "read") {
                        if (Object.keys(data).length > 0 && data.filter != undefined && data.filter.filters["length"] > 0) {
                            return {
                                code: data.filter.filters[0].value,
                                defBranchId: parseInt($("#FK_DefBranchId").val()),
                                subArchive: parseInt($("#FK_HrArchiveLevel2Id").val()),
                            };
                        } else {
                            return {
                                code: "",
                                defBranchId: parseInt($("#FK_DefBranchId").val()),
                                subArchive: parseInt($("#FK_HrArchiveLevel2Id").val()),
                            };
                        }

                    } else {
                        return data;
                    }
                }
            }
        },
        select: onSelectLevel3
    });
    function onSelectLevel3(e) {

        $("#FK_HrArchiveLevel3Id").val(e.dataItem.id);
    }


   

    $("#archiveSearchbtn").click(function () {
        LoadGridArchive()
    });
    LoadGridArchive();
    function LoadGridArchive() {
        var fK_EmployeeId = $("#hrEmployeeId").val(),
            dateFrom = $("#DateFrom").val(),
            dateTo = $("#DateTo").val(),
            fK_HrArchiveLevel1Id = $("#FK_HrArchiveLevel1Id").val(),
            fK_HrArchiveLevel2Id = $("#FK_HrArchiveLevel2Id").val(),
            fK_HrArchiveLevel3Id = $("#FK_HrArchiveLevel3Id").val(),
            fK_DefBranchId = $("#FK_DefBranchId").val(),
            fK_HrSubBranchId = $("#subBranchSelect").val();
            

        var grid = $("#HrArchiveList").kendoGrid({
            excel: {
                fileName: "Archive.xlsx",
                allPages: true,
                filterable: true
            },
            dataSource: {
                transport: {
                    read: "/HrArchive/SearchInHrArchive?fK_EmployeeId=" + fK_EmployeeId + "&&dateFrom=" + dateFrom + "&&dateTo=" + dateTo + "&&fK_HrArchiveLevel1Id=" + fK_HrArchiveLevel1Id + "&&fK_HrArchiveLevel2Id=" + fK_HrArchiveLevel2Id + "&&fK_HrArchiveLevel3Id=" + fK_HrArchiveLevel3Id + "&&fK_DefBranchId=" + fK_DefBranchId + "&&fK_HrSubBranchId=" + fK_HrSubBranchId
                },
                schema: {
                    model: {
                        id: "id",
                        fields: {
                            employeeCode: { type: "string" },
                            employeeNameAr: { type: "string" },
                            archiveLevel1Name: { type: "string" },
                            archiveLevel2Name: { type: "string" },
                            isActive: { editable: false },
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
                field: "employeeCode",
                title: Resources.Code,
                width: Resources.CodeWidth
            }, {
                    field: "employeeNameAr",
                title: Resources.FullName,
                width: Resources.NameWidth
            }, {
                    field: "archiveLevel1Name",
                    title: Resources.ArchiveLevel1,
                width: Resources.NameWidth
            }, {
                    field: "archiveLevel2Name",
                    title: Resources.ArchiveLevel2,
                width: Resources.AmountWidth
                },
                //{
                //    field: "fileName",
                //    title: Resources.FileName,
                //    width: Resources.AmountWidth,
                //    template: '<a href="#=filePath#" class="path-link">#=fileName#</a>'
                //},
                
            {
                width: Resources.DoubleActionWidth,
                template: '<a  href="/HrArchive/EditArchiveAddFile/#= id # "  class="btn btn-success btn-sm btnEdit"><i class="fas fa-edit"></i></a> <a  class="btn btn-danger btn-sm btnDelete" ><i class="fas fa-trash-alt"></i></a> '
            },

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
        }).on("click", "a.path-link", function (e) {
            //debugger;

            var tr = $(this).closest("tr");
            var dataItem = $("#HrArchiveList").data("kendoGrid").dataItem(tr);
            e.preventDefault();
            window.location.href = "/HrArchive/Download?filePath=" + dataItem.filePath + "&&fileName=" + dataItem.fileName;

            //window.location.reload();
            //$.ajax({
            //    url: "/HrArchive/Download?filePath=" + dataItem.filePath + "&&fileName=" + dataItem.fileName ,
            //    Type: "GET",
            //    success: function (data) {
            //        alert("gagagaagagag");
            //        debugger;
            //        //window.location.reload(true);
            //
            //        //location.reload();
            //        e.preventDefault();
            //        //window.location.href = data;
            //        //window.location.href = "/HrArchive/Download?filePath=" + dataItem.filePath + "&&fileName=" + dataItem.fileName;
            //        //top.location.href = "/HrArchive/Download?filePath=" + dataItem.filePath + "&&fileName=" + dataItem.fileName;
            //
            //    }
            //})
        });
        grid.data("kendoGrid").table.on("click", ".btnDelete", removeArchive);
    }
    function removeArchive() {

        var row = $(this).closest("tr"),
            grid = $("#HrArchiveList").data("kendoGrid"),
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
                    url: "/HrArchive/DeleteArchiveAddFile?id=" + dataItem.id,
                    type: "Get",
                    contentType: 'application/json; charset=utf-8',
                    success: function (result) {
                        debugger;
                        if (result) {
                            LoadGridArchive();
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

$(".exportExcel").on('click', function () {
    $("#HrArchiveList").getKendoGrid().saveAsExcel();
});
