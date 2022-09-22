$(document).ready(function () {
    
    $("#btnAddAddress").click(function () {

        var addressAr = $("#AddressAr").val();
        var addressEn = $("#AddressEn").val();
        var isDefaultAddress = $("#IsDefaultAddress").is(":checked");
        var isDeliveryAddress = $("#IsDeliveryAddress").is(":checked");
        var hdModule = $("#hdnModule").val();
        var hdModulePage = $("#hdnModulePage").val();
        var hdRefrenceId = $("#hdnRefrenceId").val();
        var hdAddressIds = $("#hdnAddressIds").val();
        var defBranchId = $("#FK_DefBranchId").val();
        if (addressAr.trim() == "") {
            $("#AddressArVlidation").text(Resources.Required);
            return;
        }

        if (addressEn.trim() == "") {
            $("#AddressEnVlidation").text(Resources.Required);
            return;
        }
        $("#AddressArVlidation").text("")
        var data = {
            AddressAr: addressAr,
            AddressEn: addressEn,
            IsDefaultAddress: isDefaultAddress,
            IsDeliveryAddress: isDeliveryAddress,
            ModulePage: hdModulePage,
            FK_ReferenceId: hdRefrenceId,
            FK_DefBranchId: defBranchId
        }

        $.ajax({
            url: '/Address/Create',
            type:"POST",
            data: { addEditAddressVM: data },
            success: function (e) {
                if (hdAddressIds == "0") {
                    $("#hdnAddressIds").val(e)
                } else {
                    $("#hdnAddressIds").val(hdAddressIds + "," + e);
                }
                loadPaySupplierAddressGrid();
            }
        })
    })
});

