$(document).ready(function () {

    loadFilesArchivingTree();
    function loadFilesArchivingTree() {
        data = new kendo.data.HierarchicalDataSource({
            transport: {
                read: {
                    url: "/HrArchive/GetFilesArchivingTree?fK_DefBranchId=" + $("#FK_DefBranchId").val()
                }
            },
            schema: {
                model: {
                    id: "id",
                    hasChildren: "hasChildren"
                }
            }
        });
        $("#TreeFilesArchiving").kendoTreeView({
            dataSource: data,
            dataTextField: "nameAr",
            select: onSelect
        });
    }
    var idLevel = "";
    function onSelect(e) {

        var data = $('#TreeFilesArchiving').data('kendoTreeView').dataItem(e.node);
        idLevel = data.id;
        var url = '/HrArchive/GetFiles?idLevel=' + data.id;
        var divFilesList = $('#divFilesList');
        divFilesList.load(url);
    }
    $('#checkAll').click(function () {
        $('input:checkbox').prop('checked', true);
    });
    $('#unCheckAll').click(function () {
        $('input:checkbox').prop('checked', false);
    });

    $("#btnDelete").click(function () {
        debugger
        var ids = [];
        $.each($("input[name='archive']:checked"), function () {
            ids.push(parseInt($(this).closest("label.file-div").find("input[name='id']").val()));
        });

        if (ids.length == 0) {
            swal({
                title: Resources.NoFileSelectedMsgResource,
                confirmButtonText: Resources.DoneResource,
                type: "error"
            });
        }
        else {
            $.ajax({
                type: "POST",
                url: "/HrArchive/DeleteFiles",
                data: { 'ids': ids },
                dataType: 'json',
                success: function (response) {
                    debugger
                    if (response) {
                        var url = '/HrArchive/GetFiles?idLevel=' + idLevel;
                        var divFilesList = $('#divFilesList');
                        divFilesList.load(url);
                        swal({
                            title: Resources.DeleteSuccessResource,
                            confirmButtonText: Resources.DoneResource,
                            type: "success"
                        });
                    } else {
                        swal({
                            title: Resources.DeleteFailedResource,
                            confirmButtonText: Resources.DoneResource,
                            type: "error"
                        });
                    }

                }
            });
        }
    });
    var $idown;
    $("#zipDownload").click(function (e) {
        var filePaths = [];
        $.each($("input[name='archive']:checked"), function () {
            filePaths.push($(this).closest("label.file-div").find("input[name='filePath']").val());
        });

        if (filePaths.length == 0) {
            swal({
                title: Resources.NoFileSelectedMsgResource,
                confirmButtonText: Resources.DoneResource,
                type: "error"
            });
        }
        else {

            e.preventDefault();
            var paths = filePaths.join(",");
            window.location.href = "/HrArchive/DownloadZip?filePaths=" + paths;
        }
    });

    $("#DefBranches").change(function () {
        //var s = $("#DefBranches").val();
        //$('#TreeFilesArchiving').data('kendoTreeView').dataSource.read({ id: null, fK_DefBranchId: s });
        document.location = "/HrArchive/ShowArchivedTree?fK_DefBranchId=" + $("#DefBranches").val()
    })

})