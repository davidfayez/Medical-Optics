$(document).ready(function () {
    debugger
    var modulePage = $('#hdnModulePage').val();
    var refrenceId = $('#hdnRefrenceId').val();
    var url = '/Attachment/Get?modulePage=' + modulePage + '&refId=' + refrenceId;
    var divAttachmentList = $('#divAttachmentList');
    divAttachmentList.load(url);


});


