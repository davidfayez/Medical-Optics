
function uploadFiles(e) {

    var fileUpload = $('#files').get(0);
    var files = fileUpload.files;
    var module = $('#hdnModule').val();
    var modulePage = $('#hdnModulePage').val();
    var refrenceId = $('#hdnRefrenceId').val();
    var data = new FormData();
    for (var i = 0; i < files.length; i++) {
        data.append(files[i].name, files[i]);
    }
    data.append('module', module);
    data.append('modulePage', modulePage);
    data.append('refrenceId', refrenceId);
    $.ajax({
        type: 'POST',
        url: '/Attachment/Upload',
        contentType: false,
        processData: false,
        data: data,
        success: function (result) {
            debugger
            if (result === 'noFile') {

                $('#divError').css('display', 'block');
                $('#error').empty();
                $('#error').append(Resources.NoFileSelectedMsgResource);
                return false;
            }
            var ids = result;
            var oldAttachedIds = $('#hdnAttachmentIds').val();
            if (oldAttachedIds != '') {
                $('#hdnAttachmentIds').val(result.concat(oldAttachedIds));
                ids = result.concat(oldAttachedIds);
            }
            $('#hdnAttachmentIds').val(ids);
            var url = '/Attachment/Get?modulePage=' + modulePage + '&refId=' + refrenceId + '&attachmentIds=' + ids;
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

function uploadDetailFiles(e) {
    
    var fileUpload = $('#detailFiles').get(0);
    var files = fileUpload.files;
    var module = $('#hdnModule').val();
    var modulePage = $('#hdnModulePageDetail').val();
    var refrenceId = 0;//$('#hdnRefrenceId').val();
    var data = new FormData();
    for (var i = 0; i < files.length; i++) {
        data.append(files[i].name, files[i]);
    }
    data.append('module', module);
    data.append('modulePage', modulePage);
    data.append('refrenceId', refrenceId);
    $.ajax({
        type: 'POST',
        url: '/Attachment/Upload',
        contentType: false,
        processData: false,
        data: data,
        success: function (result) {
            if (result === 'noFile') {

                $('#divErrorDetail').css('display', 'block');
                $('#errorDetail').empty();
                $('#errorDetail').append(Resources.NoFileSelectedMsgResource);
                return false;
            }
            var ids = result;
            var oldAttachedIds = $('#hdnAttachmentDetailIds').val();
            if (oldAttachedIds != '') {
                $('#hdnAttachmentDetailIds').val(result.concat(oldAttachedIds));
                ids = result.concat(oldAttachedIds);
            }
            $('#hdnAttachmentDetailIds').val(ids);
            var url = '/Attachment/Get?modulePage=' + modulePage + '&refId=' + refrenceId + '&attachmentIds=' + ids + '&redirect=' + "ViewDetails";;
            var divAttachmentDetailList = $('#divAttachmentDetailList');
            divAttachmentDetailList.load(url);
            clearDetailFile();
        },
        error: function () {
            $('#divErrorDetail').css('display', 'block');
            $('#errorDetail').empty();
            $('#errorDetail').append(Resources.ErrorMsgResource);
        }
    });
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

function checkDetailFile(file) {
    if (!file) {
        $('#divErrorDetail').css('display', 'block');
        $('#errorDetail').empty();
        $('#errorDetail').append(Resources.NoFileSelectedMsgResource);
        return false;
    } else {
        var fileSize = file.size / 1024 / 1024;
        var fileName = file.name;
        var dotPosition = fileName.lastIndexOf(".");
        var fileExt = fileName.substring(dotPosition);

        if (fileSize > 10) {
            $('#divErrorDetail').css('display', 'block');
            $('#errorDetail').empty();
            $('#errorDetail').append(Resources.MaxAllowedFileSizeMsgResource);
            return false;
        }
        else {
            $('#divErrorDetail').css('display', 'none');
            $('#errorDetail').empty();
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

function clearDetailFile() {
    $('#errorDetail').empty();
    $('#divErrorDetail').css('display', 'none');
    $('#detailFiles').val('');
    selectedFile = null;


}

function deleteFile(id) {
    var modulePage = $('#hdnModulePage').val();
    var refrenceId = $('#hdnRefrenceId').val();
    var attachmentIds = $('#hdnAttachmentIds').val();
    $('#hdnAttachmentIds').val(removeDeleted(attachmentIds, id));
    $.ajax({
        type: 'POST',
        url: '/Attachment/Delete/' + id,
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
            var url = '/Attachment/Get?modulePage=' + modulePage + '&refId=' + refrenceId + '&attachmentIds=' + attachmentIds;
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

function deleteFileDetail(id) {
    var modulePage = $('#hdnModulePageDetail').val();
    var refrenceId = 0; /*$('#hdnRefrenceId').val();*/
    var attachmentIds = $('#hdnAttachmentDetailIds').val();
    $('#hdnAttachmentDetailIds').val(removeDeleted(attachmentIds, id));
    $.ajax({
        type: 'POST',
        url: '/Attachment/Delete/' + id,
        contentType: false,
        processData: false,
        data: id,
        success: function (result) {
            if (result === 'error') {
                $('#divErrorDetail').css('display', 'block');
                $('#errorDetail').empty();
                $('#errorDetail').append(Resources.ErrorMsgResource);
                return false;
            }
            var url = '/Attachment/Get?modulePage=' + modulePage + '&refId=' + refrenceId + '&attachmentIds=' + attachmentIds + '&redirect=' + "ViewDetails";
            var divAttachmentDetailList = $('#divAttachmentDetailList');
            divAttachmentDetailList.load(url);
            clearDetailFile();
        },
        error: function () {
            $('#divErrorDetail').css('display', 'block');
            $('#errorDetail').empty();
            $('#errorDetail').append(Resources.ErrorMsgResource);
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