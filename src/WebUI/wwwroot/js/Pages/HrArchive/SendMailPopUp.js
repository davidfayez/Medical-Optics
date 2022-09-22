
$("#submitSendMailModel").on('click', function () {
    debugger;

    if ($("#SendMailModel").valid()) {

        var attachments = [];
        $.each($("input[name='archive']:checked"), function () {
            var Obj = {};
            var filePath = $(this).closest("label.file-div").find("input[name='filePath']").val();
            Obj.FileName = $(this).closest("label.file-div").find("input[name='fileName']").val();
            Obj.FilePath = filePath;
            filePath.substring(filePath.lastIndexOf('/') + 1)
            var fileType = filePath.substring(filePath.lastIndexOf('.') + 1);
            Obj.FileType = fileType;
            attachments.push(Obj);
        }); 

        var data = {
            To: $("#To").val(),
            Subject: $("#Subject").val(),
            Body: $("#Body").val(),
            Attachments: attachments,
        }

        $.ajax({
            url: "/HrArchive/SendMail",
            type: "post",
            cache: false,
            processData: false,
            data: JSON.stringify(data),
            contentType: 'application/json',
            success: function (result) {
                if (result) {
                    swal({
                        title: Resources.SentSuccessfully,
                        confirmButtonText: Resources.DoneResource,
                        type: "success"
                    });
                    $("#closeSendMailModel").click();
                }
                else {
                    swal({
                        title: Resources.SentFailure,
                        confirmButtonText: Resources.DoneResource,
                        type: "error"
                    });
                }

            }
        });
    }

});
$("#closeSendMailModel").on('click', function () {

    $("#To").val('');
    $("#Subject").val('');
    $("#Body").val('');

});

function getFilesName()
{
    var filesName = "";
    $.each($("input[name='archive']:checked"), function () {
        filesName += "\n\r" + $(this).closest("label.file-div").find("input[name='fileName']").val();
    }); 
    $('#spFileName').text(filesName);

}