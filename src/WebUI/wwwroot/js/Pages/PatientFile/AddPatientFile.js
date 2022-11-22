$(document).ready(function () {

    $("#FavoriteComplaintId").kendoDropDownList({
        filter: "contains",
        height: 300,
        dataTextField: "favoriteName",
        dataValueField: "id",
        optionLabel: Resources.AutocompleateChoose,
        dataSource: {
            type: "json",
            serverFiltering: true,
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
            serverFiltering: true,
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
            serverFiltering: true,
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
                    //var editor = $("#txtEditor-1").data("editor").text(response[0]);
                     $("#txtEditor-1").data("editor").text(response);
                    //$("#txtEditor-1").append(response[0]);
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

    $("#btnMainComplaint").on("click", function () {
        var complaint = $("#ComplaintId").data("kendoDropDownList").text();
        var subComplaint = $("#SubComplaintId").data("kendoDropDownList").text();
        $("#txtEditor-1").data("editor").text(complaint + " , " + subComplaint);

    });

    $("#btnAddSide").on("click", function () {
        var ComplaintSide = $("#ComplaintSide option:selected").text();
        var Onset = $("#Onset option:selected").text();
        var Course = $("#Course option:selected").text();
        var originalText = $("#txtEditor-1").data("editor").text();

        if (originalText.indexOf("Onset") <= 0)
            $("#txtEditor-1").data("editor").append("<br />" + " Side(" + ComplaintSide + ")" + " Onset (" + Onset + ")" + " Course (" + Course + ")" + "\n");

    });

    $("#btnAddDuration").on("click", function () {
        var Hour = $("#Hour").val();
        var Day = $("#Day").val();
        var Month = $("#Month").val();
        var Year = $("#Year").val();

        if (originalText.indexOf("Onset") <= 0)
            $("#txtEditor-1").data("editor").append("<br />" + " Hour(" + Hour + ")" + " Day (" + Day + ")" + " Month (" + Month + ")" + " Year (" + Year + ")");

    });

    //Diagnose

    $("#DiagnoseCode").kendoDropDownList({
        filter: "contains",
        height: 300,
        dataTextField: "codeAndName",
        dataValueField: "id",
        optionLabel: Resources.AutocompleateChoose,
        dataSource: {
            type: "json",
            serverFiltering: true,
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
});


