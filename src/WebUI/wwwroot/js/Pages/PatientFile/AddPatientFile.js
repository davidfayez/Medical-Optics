$(document).ready(function () {
    var ComplaintText = $("#txtEditor-1").val();
    $("#txtEditor-1").data("editor").text(ComplaintText);

    $("#FavoriteComplaintId").kendoDropDownList({
        filter: "contains",
        height: 300,
        dataTextField: "favoriteName",
        dataValueField: "id",
        optionLabel: Resources.AutocompleateChoose,
        dataSource: {
            type: "json",
            //serverFiltering: true,
            transport: {
                read: {
                    url: "/FavoriteComplaint/GetAll",
                },
                parameterMap: function (data, action) {
                    debugger
                    if (action === "read") {
                        return {

                        };

                    } else {
                        return data;
                    }
                }
            }
        },
        select: onSelectFavoriteComplaint

    });

    $("#ComplaintId").kendoDropDownList({
        filter: "contains",
        height: 300,
        dataTextField: "complaintNameEn",
        dataValueField: "id",
        optionLabel: Resources.AutocompleateChoose,
        dataSource: {
            type: "json",
            //serverFiltering: true,
            transport: {
                read: {
                    url: "/Complaint/GetAll",
                },
                parameterMap: function (data, action) {
                    debugger
                    if (action === "read") {
                        return {

                        };

                    } else {
                        return data;
                    }
                }
            }
        },
        change : onSelectComplaint
    });

    $("#SubComplaintId").kendoDropDownList({
        //autoBind: false,
        //cascadeFrom: "ComplaintId",
        filter: "contains",
        height: 300,
        dataTextField: "subComplaintNameEn",
        dataValueField: "id",
        optionLabel: Resources.AutocompleateChoose,
        dataSource: {
            type: "json",
            //serverFiltering: true,
            transport: {
                read: {
                    url: "/SubComplaint/GetAllSubCompalintByComplaintId",
                },
                parameterMap: function (data, action) {
                    debugger
                    if (action === "read") {
                        return {
                            complaintId: $("#ComplaintId").val(),
                        };

                    } else {
                        return data;
                    }
                }
            }
        }
    });

    function onSelectFavoriteComplaint(e) {
        var id = e.dataItem.id;

        $.ajax({
            type: "POST",
            url: "/FavoriteComplaint/GetComplaintsByFavoriteId?id=" + id,
            dataType: "json",
            success: function (response) {

                if (response != null) {
                    debugger;
                    $("#txtEditor-1").data("editor").text(response);
                    $("#txtEditor-1").val(response);
                } else {
                    swal({
                        title: Resources.CostCenterCodeNotFoundResource,
                        confirmButtonText: Resources.DoneResource,
                        type: "error"
                    });
                }

            }
        });

    }

    function onSelectComplaint(e) {
        //var complaintId = e.dataItem.id;
        var complaintId = $("#ComplaintId").val()
        debugger;
        var SubComplaint = $("#SubComplaintId").data("kendoDropDownList");
        SubComplaint.dataSource.read({ complaintId: complaintId });

    }

    $("#btnAddPreviousComplaint").on("click", function (e) {
        e.preventDefault();
        if ($('.Des-div').is(':visible')) {
            var complaints = $('.Des-div:visible').text();
            $("#txtEditor-1").data("editor").text(complaints);
            $("#txtEditor-1").val(complaints);
        }
            

    });

    $("#btnShowPreviousComplaint").on("click", function (e) {
        e.preventDefault();
    });

    $("#btnMainComplaint").on("click", function (e) {
        e.preventDefault();

        var complaint = $("#ComplaintId").data("kendoDropDownList").text();
        var subComplaint = $("#SubComplaintId").data("kendoDropDownList").text();
        $("#txtEditor-1").data("editor").text(complaint + " , " + subComplaint);
        $("#txtEditor-1").val(complaint + " , " + subComplaint);

    });

    $("#btnAddSide").on("click", function (e) {
        e.preventDefault();

        var ComplaintSide = $("#ComplaintSide option:selected").text();
        var Onset = $("#Onset option:selected").text();
        var Course = $("#Course option:selected").text();
        var originalText = $("#txtEditor-1").data("editor").text();

        if (originalText.indexOf("Onset") <= 0) {
            $("#txtEditor-1").data("editor").append("<br />" + " Side(" + ComplaintSide + ")" + " Onset (" + Onset + ")" + " Course (" + Course + ")" + "\n");
            $("#txtEditor-1").val($("#txtEditor-1").data("editor").text());

        }

    });

    $("#btnAddDuration").on("click", function (e) {
        e.preventDefault();

        var originalText = $("#txtEditor-1").data("editor").text();

        var Hour = $("#Hour").val();
        var Day = $("#Day").val();
        var Month = $("#Month").val();
        var Year = $("#Year").val();

        if (originalText.indexOf("Day") <= 0) {
            $("#txtEditor-1").data("editor").append("<br />" + " Hour(" + Hour + ")" + " Day (" + Day + ")" + " Month (" + Month + ")" + " Year (" + Year + ")");
            $("#txtEditor-1").val($("#txtEditor-1").data("editor").text());
        }

    });

    //Diagnose

    $("#FavoriteDiagnoseId").kendoDropDownList({
        filter: "contains",
        height: 300,
        dataTextField: "favoriteName",
        dataValueField: "id",
        optionLabel: Resources.AutocompleateChoose,
        dataSource: {
            type: "json",
            //serverFiltering: true,
            transport: {
                read: {
                    url: "/FavoriteDiagnose/GetAll",
                },
                parameterMap: function (data, action) {
                    debugger
                    if (action === "read") {
                        return {

                        };

                    } else {
                        return data;
                    }
                }
            }
        },
        select: onSelectFavoriteDiagnose

    });
    function onSelectFavoriteDiagnose(e) {
        var id = e.dataItem.id;

        $.ajax({
            type: "POST",
            url: "/FavoriteDiagnose/GetDiagnosesByFavoriteId?id=" + id,
            dataType: "json",
            success: function (response) {

                if (response != null) {
                    debugger;

                    //$("#txtEditor-1").data("editor").text(response);
                } else {
                    swal({
                        title: Resources.CostCenterCodeNotFoundResource,
                        confirmButtonText: Resources.DoneResource,
                        type: "error"
                    });
                }

            }
        });

    }

    $("#DiagnoseCode").kendoDropDownList({
        filter: "contains",
        height: 300,
        dataTextField: "codeAndName",
        dataValueField: "id",
        optionLabel: Resources.AutocompleateChoose,
        dataSource: {
            type: "json",
            //serverFiltering: true,
            transport: {
                read: {
                    url: "/Diagnose/GetAll",
                },
                parameterMap: function (data, action) {
                    debugger
                    if (action === "read") {
                        return {

                        };

                    } else {
                        return data;
                    }
                }
            }
        },
        select: onSelectFavoriteComplaint

    });

    var tempSource = new kendo.data.DataSource({

    });
    var gridBound = $("#DiagnoseItemsGrid").kendoGrid({
        dataSource: tempSource,
        //navigatable: true,
        scrollable: true,
        pageable: false,
        columns: [

            { field: "DiagnoseId", hidden: true, format: "{0:c}", width: 120 },
            { field: "DiagnoseTypeId", hidden: true, format: "{0:c}", width: 120 },
            { field: "Code", width: Resources.NameWidth, title: Resources.Code },
            { field: "Name", width: Resources.NameWidth, title: Resources.Name },
            { field: "Type", width: Resources.NameWidth, title: Resources.Type },
            { width: Resources.DoubleActionWidth, template: "<a  class='btn btn-danger btn-sm btnDelete' ><i class='fas fa-trash-alt'></i></a>" },
        ],
        editable: false,
        selectable: "multiple, cell",
        noRecords: true,
        sortable: true,
        reorderable: true,
        //groupable: true,
        resizable: true,
        messages: {
            noRecords: "There is no data on current page"
        },

    });
    gridBound.data("kendoGrid").table.on("click", ".btnDelete", removeBondDetailRow);
    
    function removeBondDetailRow() {

        var row = $(this).closest("tr"),
            grid = $("#DiagnoseItemsGrid").data("kendoGrid"),
            dataItem = grid.dataItem(row);
        debugger;

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
                var dataSource = $("#DiagnoseItemsGrid").data("kendoGrid").dataSource;
                debugger;
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

    $("#btnAddDiagnose").on('click', function (e) {
        e.preventDefault();

        var DiagnoseId = $("#DiagnoseCode").val(),
            Diagnose = $("#DiagnoseCode").data("kendoDropDownList").text(),
            DiagnoseTypeId = $("#DiagnoseType option:selected").val(),
            Type = $("#DiagnoseType option:selected").text();

        var Code = Diagnose.split('-')[0];
        var Name = Diagnose.split('-')[1];


        var IsPrincipalExist = $("#DiagnoseItemsGrid").data("kendoGrid").dataSource.data().some(
            function (dataItem) {
                return dataItem.Type == "Principal";
            });

        var IsCodeExist = $("#DiagnoseItemsGrid").data("kendoGrid").dataSource.data().some(
            function (dataItem) {
                return dataItem.Code == Code;
            });
        if (DiagnoseId == "") {
            swal({
                title: "Please Choose Diagnose",
                confirmButtonText: Resources.DoneResource,
                type: "info"
            });
        }
        else {
            if (!IsPrincipalExist || Type == "Secondary") {
                if (!IsCodeExist) {
                    $("#IcdCode").append("<br />" + Code + "\n");

                    var totalRecords = $("#DiagnoseItemsGrid").data("kendoGrid").dataSource.data().length;
                    var data = $("#DiagnoseItemsGrid").data("kendoGrid").dataSource;
                    var Index = parseInt($("#Index").val());
                    if (!isNaN(Index))
                        totalRecords = Index - 1;

                    tempSource.insert(totalRecords, {
                        DiagnoseId: DiagnoseId,
                        DiagnoseTypeId: DiagnoseTypeId,
                        Code: Code,
                        Name: Name,
                        Type: Type,
                    });

                    var grid = $("#DiagnoseItemsGrid").data("kendoGrid");
                    tempSource.sync();
                    //tempSource.read();
                    grid.refresh();
                }
                else {
                    swal({
                        title: "This Diagnose is exist in Grid, Please choose another Diagnose",
                        confirmButtonText: Resources.DoneResource,
                        type: "info"
                    });
                }
                
            }
            else {
                swal({
                    title: "Grid must have one Principal",
                    confirmButtonText: Resources.DoneResource,
                    type: "info"
                });
            }
            

        }


    });

    $("#btnSaveDiagnosis").on('click', function (e) {
        e.preventDefault();

        var List = [];
        
        var gridData = $('#DiagnoseItemsGrid').data("kendoGrid").dataSource.data();
        if (gridData.length > 0) {

            for (var i = 0; i < gridData.length; i++) {
                
                var data = {
                    DiagnoseId: parseInt(gridData[i].DiagnoseId),
                    DiagnoseTypeId: parseInt(gridData[i].DiagnoseTypeId)
                }
                List.push(data);
            }

            var patientDiagnoseVM = {
                ClientId: parseInt($("#ClientId").val()),
                VisitNo: parseInt($("#PatientComplaintVM_VisitNo").val()),
                PatientMedicalFileId: parseInt($("#PatientComplaintVM_PatientMedicalFileId").val()),
                PatientDiagnoseItemsVM: List
            }

            $.ajax({
                url: "/PatientFile/SaveDiagnosis",
                type: "Post",
                cache: false,
                processData: false,
                data: JSON.stringify(patientDiagnoseVM),
                contentType: 'application/json',
                success: function (result) {

                    if (result) {
                        swal({
                            title: Resources.SavedSuccessfullyResource,
                            confirmButtonText: Resources.DoneResource,
                            type: "success"
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
        else {
            swal({
                title: "Grid must have at least one Diagnose Principal",
                confirmButtonText: Resources.DoneResource,
                type: "info"
            });
        }


    });

});


