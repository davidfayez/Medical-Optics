$(document).ready(function () {

    $("#DefCountryAutoComplete").kendoDropDownList({
        filter: "contains",
        height: 300,
        dataTextField: "countryNameAr",
        dataValueField: "id",
        //valueTemplate: '<span class="selected-value"></span><span>' + Resources.Choose + '</span>',
        template: '<span class="k-state-default" style="margin-left:20px">#: data.countryCode #</span>' +
            '<span class="k-state-default">#: data.countryNameAr #</span>',
        dataSource: {
            type: "json",
            //serverFiltering: true,
            transport: {
                read: {
                    url: "/DefCountry/GetAllForDDList",
                },
                parameterMap: function (data, action) {
                    debugger
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
        select: onSelectDefCountry
    });
    function onSelectDefCountry(e) {
        debugger;
        $("#FK_DefCountryId").val(e.dataItem.id);
    }

    $("#HrJobAutoComplete").kendoDropDownList({
        filter: "contains",
        height: 300,
        dataTextField: "jobNameAr",
        dataValueField: "id",
        //valueTemplate: '<span class="selected-value"></span><span>' + Resources.Choose + '</span>',
        template: '<span class="k-state-default" style="margin-left:20px">#: data.jobCode #</span>' +
            '<span class="k-state-default">#: data.jobNameAr #</span>',
        dataSource: {
            type: "json",
            //serverFiltering: true,
            transport: {
                read: {
                    url: "/HrLookups/GetAllHrJobForDDList",
                },
                parameterMap: function (data, action) {
                    debugger
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
        select: onSelectHrJob
    });
    function onSelectHrJob(e) {
        debugger;
        $("#FK_HrJobId").val(e.dataItem.id);
    }

    var tempSource = new kendo.data.DataSource({
        
    });

    var ForeignMinistryVisaDetailsGrid = $("#ForeignMinistryVisaDetailsGrid").kendoGrid({
        dataSource: tempSource,
        navigatable: true,
        pageable: false,
        scrollable: false,
        columns: [
            { field: "FK_DefCountryId", hidden: true },
            { field: "FK_HrJobId", hidden: true },
            { field: "VisaCount", title: Resources.VisaCount, width: Resources.CodeWidth },
            { field: "CountryName", title: Resources.DefCountry, width: Resources.NameWidth },
            { field: "JobName", title: Resources.Job, width: Resources.NameWidth },

            { width: Resources.ActionWidth, template: "<a  class='btn btn-danger btn-sm btnDelete' ><i class='fas fa-trash-alt'></i></a>" }
        ],
        editable: false,
        selectable: "multiple, cell",


    });
    $("#btnAddNewDetail").on('click', function () {
        //debugger;
        var FK_DefCountryId = $("#FK_DefCountryId").val(),
            FK_HrJobId = $("#FK_HrJobId").val(),
            VisaCount = $("#VisaCount").val(),
            CountryName = $("#DefCountryAutoComplete").data("kendoDropDownList").text(),
            JobName = $("#HrJobAutoComplete").data("kendoDropDownList").text();
        debugger
        if (FK_DefCountryId > 0 && FK_HrJobId > 0 && VisaCount > 0) {

            var totalRecords = $("#ForeignMinistryVisaDetailsGrid").data("kendoGrid").dataSource.data().length;
            tempSource.insert(totalRecords, {
                FK_DefCountryId: FK_DefCountryId,
                FK_HrJobId: FK_HrJobId,
                VisaCount: VisaCount,
                CountryName: CountryName,
                JobName: JobName,
            });

            ClearFormDetails();
        } else {
            debugger
            if (isNaN(FK_DefCountryId) || FK_DefCountryId <= 0) {

                swal({
                    title: Resources.EnterRequiredResource + " " + Resources.DefCountry,
                    confirmButtonText: Resources.DoneResource,
                    type: "error"
                });
            }
            else if (isNaN(VisaCount) || VisaCount <= 0) {
                swal({
                    title: Resources.EnterRequiredResource + " " + Resources.VisaCount,
                    confirmButtonText: Resources.DoneResource,
                    type: "error"
                });
            }
            else if (isNaN(FK_HrJobId) || FK_HrJobId <= 0) {

                swal({
                    title: Resources.EnterRequiredResource + " " + Resources.Job,
                    confirmButtonText: Resources.DoneResource,
                    type: "error"
                });
            }

        }


    });

    ForeignMinistryVisaDetailsGrid.data("kendoGrid").table.on("click", ".btnDelete", removeRow);
    var thisRow = "";

    function ClearFormDetails() {
        $("#FK_DefCountryId").val("");
        $("#FK_HrJobId").val("");
        $("#VisaCount").val("");
        $("#DefCountryAutoComplete").data("kendoDropDownList").select(0)
        $("#HrJobAutoComplete").data("kendoDropDownList").value(0);
        //$("#DefCountryAutoComplete").data("kendoDropDownList").text("")
        //$("#HrJobAutoComplete").data("kendoDropDownList").text("");
    }

    function removeRow() {
        debugger;
        var row = $(this).closest("tr"),
            grid = $("#ForeignMinistryVisaDetailsGrid").data("kendoGrid"),
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
                var dataSource = $("#ForeignMinistryVisaDetailsGrid").data("kendoGrid").dataSource;

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
    

    $("#btnSave").click(function () {
        debugger;
        if ($("#VisaNumber").val() != "")
            $("#VisaNumberValid").text("")
        else
            $("#VisaNumberValid").text(Resources.Required)

        if ($("#TotalVisaCount").val() > 0)
            $("#TotalVisaCountValid").text("")
        else
            $("#TotalVisaCountValid").text(Resources.Required)
        var isActive = $('input[name="Active"]:checked').val();
        if (isActive == "True")
            isActive = true;
        else
            isActive = false;
        debugger;
        var table = $("#ForeignMinistryVisaDetailsGrid").data("kendoGrid").dataSource.data();
        if (table.length == 0 ) {
            swal({
                title: Resources.GridLengthZeroResource,
                confirmButtonText: Resources.DoneResource,
                type: "error"
            });

        }
        if (table.length > 0 && $("#VisaNumber").val() != "" && $("#TotalVisaCount").val() > 0) {
            var foreignMinistryVisaDetails = [];
            for (var i = 0; i < table.length; i++) {
                var detail = {
                    FK_DefCountryId: table[i].FK_DefCountryId,
                    FK_HrJobId: table[i].FK_HrJobId,
                    VisaCount: table[i].VisaCount,
                }
                debugger
                foreignMinistryVisaDetails.push(detail);
            }       
            var foreignMinistryVisa = {
                VisaNumber: $("#VisaNumber").val(),
                VisaDate: $("#VisaDate").val(),
                ExpiryDate: $("#ExpiryDate").val(),
                TotalVisaCount: $("#TotalVisaCount").val(),
                Description: $("#Description").val(),
                IsActive: isActive,
                FK_DefBranchId: parseInt($("#FK_DefBranchId").val()),
                details: foreignMinistryVisaDetails
            }
            debugger
            $.ajax({
                url: '/HrForeignMinistryVisa/Create',
                type: 'POST',
                data: { foreignMinistryVisaVM: foreignMinistryVisa },
                success: function (result) {
                    if (result > 0) {
                        swal({
                            title: Resources.SavedSuccessfullyResource,
                            confirmButtonText: Resources.DoneResource,
                            type: "success"
                        }, function () {
                            setTimeout(function () {
                                debugger
                                //window.location.href = '/GlJournalVoucher/Index';

                                document.location = '/HrForeignMinistryVisa/Index'
                            }, 3000);
                        });
                    } else {
                        swal({
                            title: Resources.ErrorMsgResource,
                            confirmButtonText: Resources.DoneResource,
                            type: "success"
                        });
                    }
                }
            })
        }
    })
})


