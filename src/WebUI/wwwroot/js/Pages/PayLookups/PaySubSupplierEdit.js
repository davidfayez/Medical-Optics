$(document).ready(function () {

    $('#DefBranches').change(function () {

        $("#FK_PaySupplierId").data("kendoDropDownList").value("0");
        $("#FK_PaySupplierId").data("kendoDropDownList").dataSource.read();
    });

    $("#FK_PaySupplierId").kendoDropDownList({
        filter: "contains",
        height: 300,
        dataTextField: "codeAndName",
        dataValueField: "id",
        dataSource: {
            type: "json",
            //serverFiltering: true,
            transport: {
                read: {
                    url: "/PayLookups/GetAllPaySupplierForDDList",
                },
                parameterMap: function (data, action) {

                    if (action === "read") {
                        return {
                            fK_DefBranchId: parseInt($("#FK_DefBranchId").val()),
                        };


                    } else {
                        return data;
                    }
                }
            }
        },

    });

    disableFreezing();
    $("#rdActive").change(function () {
        disableFreezing();
    })
    $("#rdInactive").click(function () {
        disableFreezing();
    })
    function disableFreezing() {
        var state = $("input[name='IsActive']:checked").val();
        if (state == "True") {
            $("#FK_DefFreezingReasonId").attr("disabled", "disabled");
            $("#FreezingNotes").attr("disabled", "disabled");
            $("#frezzingReasonBtn").attr("disabled", "disabled");

        } else {
            $("#FK_DefFreezingReasonId").removeAttr("disabled");
            $("#FreezingNotes").removeAttr("disabled");
            $("#frezzingReasonBtn").removeAttr("disabled");

        }
    }

    $("#btnEdit").click(function () {
        debugger;

        if ($("#FK_PaySupplierId").val() != "0")
            $("#FK_PaySupplierIdValid").text("")
        else
            $("#FK_PaySupplierIdValid").text(Resources.Required)


        if ($("#formSubSupplierEdit").valid())
            $("#formSubSupplierEdit").submit();

    });
})