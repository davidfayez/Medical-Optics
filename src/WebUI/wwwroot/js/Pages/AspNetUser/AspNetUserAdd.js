$(document).ready(function () {

    $("#FK_DefBranchId").kendoDropDownList({
        filter: "contains",
        height: 300,
        dataTextField: "branchNameAr",
        dataValueField: "id",
        dataSource: {
            type: "json",
            transport: {
                read: {
                    url: "/DefBranch/GetAllBranches",
                }
            }
        },
        select: onSelectBranch,

    });
    function onSelectBranch(e) {

        var dataItem = e.dataItem;
        $("#FK_HrEmployeeId").data("kendoDropDownList").dataSource.read({ fK_DefBranchId:dataItem.id});
    };
    $("#FK_HrEmployeeId").kendoDropDownList({
        filter: "contains",
        height: 300,
        dataTextField: "codeAndName",
        dataValueField: "id",
        dataSource: {
            type: "json",
            transport: {
                read: {
                    url: "/HrEmployee/GetAllEmployeeForDDList",
                },
                parameterMap: function (data, action) {
                    if (action === "read") {
                        if (Object.keys(data).length > 0 ) {
                            return {
                                //code: data.filter.filters[0].value,
                                
                                fK_DefBranchId: data["fK_DefBranchId"]
                            };
                        } else {
                            return {
                                fK_DefBranchId: parseInt($("#FK_DefBranchId").val())
                            };
                        }

                    } else {
                        return data;
                    }
                }
            }
        },
        select: onSelect,

    });

    function onSelect(e) {

        var dataItem = e.dataItem;
        if (dataItem.id > 0) {
            $("#employeeIdValidation").hide();
            $.ajax({
                url: "/HrEmployee/GetCardData?id=" + e.dataItem.id,
                type: "Get",
                contentType: false,
                processData: false,
                success: function (data) {
                    $("#userImage").attr("src", "../../images/Employee/" + data.imagePath);

                }
            });
        }
        else {
            $("#employeeIdValidation").show();
        }
    };


    $("#btnSubmit").on('click', function () {
        if ($("#FK_HrEmployeeId").val() == 0)
            $("#employeeIdValidation").show();
        else
            $("#employeeIdValidation").hide();


        if ($("#CreateFormUser").valid() && $("#FK_HrEmployeeId").val() > 0) {
            $("#CreateFormUser").submit();
        }
        return;
    });

    
});

function setImage(e) {
    var selectedFile = e.files[0];
    var reader = new FileReader();

    var imgtag = document.getElementById("userImage");
    imgtag.title = selectedFile.name;

    reader.onload = function (event) {
        imgtag.src = event.target.result;
    };

    reader.readAsDataURL(selectedFile);
}