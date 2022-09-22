
function uploadFiles(e)
{
    var fileUpload = $('#files').get(0);
    var files = fileUpload.files;
    var archiveId1 = $('#FK_HrArchiveLevel1Id').val();
    var archiveId2 = $('#FK_HrArchiveLevel2Id').val();
    var archiveId3 = $('#FK_HrArchiveLevel3Id').val();
    var employeeId = $('#FK_EmployeeId').val();

    var fileName = $('#fileName').val();
    var refrenceId = $('#hdnRefrenceId').val() == "" ? 0 : $('#hdnRefrenceId').val();
    if (archiveId1 > 0 && archiveId2 > 0 && archiveId3 > 0 && fileName.length > 0) {

        $("#validFileName").text("");

        var data = new FormData();
        for (var i = 0; i < files.length; i++) {
            data.append(files[i].name, files[i]);
        }
        data.append('FK_HrArchiveLevel1Id', archiveId1);
        data.append('FK_HrArchiveLevel2Id', archiveId2);
        data.append('FK_HrArchiveLevel3Id', archiveId3);
        data.append('FK_EmployeeId', employeeId);
        data.append('fileName', fileName);
        data.append('hdnRefrenceId', refrenceId);
        $.ajax({
            type: 'POST',
            url: '/HrArchive/Upload',
            contentType: false,
            processData: false,
            data: data,
            success: function (result) {
                if (result === 'noFile') {

                    $('#divError').css('display', 'block');
                    $('#error').empty();
                    $('#error').append(Resources.NoFileSelectedMsgResource);
                    return false;
                }
                $('#fileName').val('');
                var ids = result;
                var oldAttachedIds = $('#hdnAttachmentIds').val();
                if (oldAttachedIds != '') {
                    $('#hdnAttachmentIds').val(result.concat(oldAttachedIds));
                    ids = result.concat(oldAttachedIds);
                }
                $('#hdnAttachmentIds').val(ids);
                var url = '/HrArchive/GetDetailFiles?refId=' + refrenceId+'&attachmentIds=' + ids;
                var divAttachmentList = $('#divAttachmentList');
                divAttachmentList.load(url);
                clearFile();
            },
            error: function () {
                $('#divError').css('display', 'block');
                $('#error').empty();
                $('#error').append(Resources.ErrorMsgResource);
            }
        });
    } else {
        if (fileName.length == 0 || fileName ==null) {
            $("#validFileName").text(Resources.Required);
        }
        $('#divError').css('display', 'block');
        $('#error').empty();
        $('#error').append(Resources.DataNotCompletedResource);
    }
    
   
}

function checkFile(file) {
    if (!file) {
        $('#divError').css('display', 'block');
        $('#error').empty();
        $('#error').append(Resources.NoFileSelectedMsgResource);
        return false;
    } else {
        var fileSize = file.size / 1024 / 1024;
        var fileName = file.name;
        var dotPosition = fileName.lastIndexOf(".");
        var fileExt = fileName.substring(dotPosition);

        if (fileSize > 10) {
            $('#divError').css('display', 'block');
            $('#error').empty();
            $('#error').append(Resources.MaxAllowedFileSizeMsgResource);
            return false;
        }
        else {
            $('#divError').css('display', 'none');
            $('#error').empty();
            return true;
        }
    }
}

function clearFile() {
    $('#error').empty();
    $('#divError').css('display', 'none');
    $('#files').val('');
    selectedFile = null;
}

function deleteFile(id)
{
    var modulePage = $('#hdnModulePage').val();
    var refrenceId = $('#hdnRefrenceId').val();
    var attachmentIds = $('#hdnAttachmentIds').val();
    $('#hdnAttachmentIds').val(removeDeleted(attachmentIds, id));
    $.ajax({
        type: 'POST',
        url: '/HrArchive/Delete/'+id,
        contentType: false,
        processData: false,
        data: id,
        success: function (result) {
            if (result === 'error') {
                $('#divError').css('display', 'block');
                $('#error').empty();
                $('#error').append(Resources.ErrorMsgResource);
                return false;
            }
            var url = '/HrArchive/GetDetailFiles?refId=' + refrenceId + '&attachmentIds=' + attachmentIds;
            var divAttachmentList = $('#divAttachmentList');
            divAttachmentList.load(url);
            clearFile();
        },
        error: function () {
            $('#divError').css('display', 'block');
            $('#error').empty();
            $('#error').append(Resources.ErrorMsgResource);
        }
    });
}

function removeDeleted(array, toRemove) {
    var elements = array.split(",");
    var removeIndex = elements.indexOf(toRemove);
    elements.splice(removeIndex, 1);
    var result = elements.join(",");
    return result;
}

$(document).ready(function () {

    var hdnAttachmentIds = $('#hdnAttachmentIds').val() == "" ? "0" : $('#hdnAttachmentIds').val();
    var refrenceId = $('#hdnRefrenceId').val();
    var url = '/HrArchive/GetDetailFiles?refId=' + refrenceId + '&attachmentIds=' + hdnAttachmentIds;
    var divAttachmentList = $('#divAttachmentList');
    divAttachmentList.load(url);
});