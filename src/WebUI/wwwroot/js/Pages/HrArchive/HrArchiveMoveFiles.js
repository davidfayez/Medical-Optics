$(document).ready(function () {
    LoadMainArchiveForMove();
    function LoadMainArchiveForMove() {
        $.ajax({
            url: "/HrArchive/GetAllArchiveLevel1",
            success: function (archive) {
                var html = "<option >" + Resources.SelectOne + "</option>";
                for (var i = 0; i < archive.length; i++) {
                    html += "<option value='" + archive[i].id + "'>" + archive[i].nameAr + "</option>";
                }

                $("#FK_HrArchiveLevel1Id").html(html);
            }
        })
    }


    $("#FK_HrArchiveLevel1Id").change(function () {
        $.ajax({
            url: "/HrArchive/GetArchiveLevel2ByMainArchive?id=" + $("#FK_HrArchiveLevel1Id").val(),
            success: function (archive) {
                var html = "<option >" + Resources.SelectOne + "</option>";
                for (var i = 0; i < archive.length; i++) {
                    html += "<option value='" + archive[i].id + "'>" + archive[i].nameAr + "</option>";
                }

                $("#FK_HrArchiveLevel2Id").html(html);
            }
        })
    });

    $("#FK_HrArchiveLevel2Id").change(function () {
        $.ajax({
            url: "/HrArchive/GetArchiveLevel3BySubArchive?id=" + $("#FK_HrArchiveLevel2Id").val(),
            success: function (archive) {
                var html = "";
                for (var i = 0; i < archive.length; i++) {
                    html += "<option value='" + archive[i].id + "'>" + archive[i].nameAr + "</option>";
                }

                $("#FK_HrArchiveLevel3Id").html(html);
            }
        })
    });
        
    $("#saveMoveFilesbtn").click(function () {
        var level1 = $("#FK_HrArchiveLevel1Id").val(),
            level2 = $("#FK_HrArchiveLevel2Id").val(),
            level3 = $("#FK_HrArchiveLevel3Id").val(),
            files = $(".check-input");
        if (files.length == 0) {
            swal({
                title: Resources.ErrorMsgResource,
                confirmButtonText: Resources.DoneResource,
                type: "error"
            });
            return;
        }
        var ids = [];
        $.each($("input[name='archive']:checked"), function () {
            ids.push($(this).closest("label.file-div").find("input[name='id']").val());
        });
        if (level1 > 0) {
            $("#FK_HrArchiveLevel1IdValid").text("");
        } else {
            $("#FK_HrArchiveLevel1IdValid").text(Resources.Required);
            return;
        }
        if (level2 > 0) {
            $("#FK_HrArchiveLevel2IdValid").text("");
        } else {
            $("#FK_HrArchiveLevel2IdValid").text(Resources.Required);
            return;
        }
        if (level3 > 0) {
            $("#FK_HrArchiveLevel3IdValid").text("");
        } else {
            $("#FK_HrArchiveLevel3IdValid").text(Resources.Required);
            return;
        }
        var data = { ids: ids, level1: level1, level2: level2, level3: level3 };
        swal({
            title: Resources.Save,
            text: Resources.MoveFileConfirmMsg,
            type: "info",
            showCancelButton: true,
            confirmButtonText: Resources.Save,
            cancelButtonText: Resources.CancelResource,
            closeOnConfirm: false,
            showLoaderOnConfirm: true
        }, function () {
            setTimeout(function () {
                $.ajax({
                    url: "/HrArchive/HrArchiveMoveFiles",
                    type: "Post",
                    data: { moveFiles: data},
                    //contentType: 'application/json; charset=utf-8',
                    success: function (result) {
                        debugger;
                        if (result) {
                            swal({
                                title: Resources.SavedSuccessfullyResource,
                                confirmButtonText: Resources.DoneResource,
                                type: "success"
                            });
                            document.location = "../../HrArchive/ShowArchivedTree";
                        }
                        else {
                            swal({
                                title: Resources.ErrorMsgResource,
                                confirmButtonText: Resources.DoneResource,
                                type: "error"
                            });
                        }
                    },
                    error: function (err, xqr, txt) { }
                });

            }, 3000);
        });
    })
})

