$("#submitAccountTypeModal").on('click', function () {
    debugger;
    if ($("#accountTypeModal").valid()) {


        var cDate = new Date($("#CreationDate").text());
        var lDate = new Date($("#LastModifiedDate").text());
        var data = {
            Id: 0,
            TypeCode: $("#TypeCode").val(),
            TypeNameAr: $("#TypeNameAr").val(),
            TypeNameEn: $("#TypeNameEn").val(),
            Description: $("#accountTypeDescription").val(),
            FK_CreatorId: 1,
            CreationDate: cDate,
            LastModifiedDate: lDate,
            IsActive: true,
            IsDeleted: false,

        }

        $.ajax({
            url: "/GlAccountType/SaveCreatePopUp",
            type: "post",
            cache: false,
            processData: false,
            data: JSON.stringify(data),
            contentType: 'application/json',
            success: function (result) {
                $("#FK_GlAccountTypeId").append("<option selected='selected' value='" + result.id + "'>" + result.typeNameAr + "</option>");
                $("#Account-type").modal('toggle');
            }
        });
    }

});

$(document).ready(function () {

    $("#FK_SecModuleId").kendoDropDownList({
        optionLabel: Resources.ChoseModule,
        filter: "contains",
        height: 300,
        dataTextField: "moduleNameAr",
        dataValueField: "id",

        dataSource: {
            //serverFiltering: true,
            transport: {
                read: {
                    url: "/Role/GetAllSecModules",
                }
            }
        }
    });
});

$("#btnSubmit").on('click', function () {

    //submit form if valid
    if ($("#FK_SecModuleId").val() > 0)
        $("FK_SecModuleIdValidation").hide();
    else
        $("#FK_SecModuleIdValidation").show();



    if ($("#formDocumentType").valid() && $("#FK_SecModuleId").val() > 0)
        $("#formDocumentType").submit();
});