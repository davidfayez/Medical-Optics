$(document).ready(function () {

    var resources = {
        AccountName: Resources.AccountName,
        SupplierName: Resources.SupplierNameResource,

    };
 


    $("#saveEstimate").click(function () {
        if ($("#mainForm").validate()) {
            var grid = $("#estimateGrid")[0].children
            var details = [];
            var accountType = $("input[name='AccountType']:checked").val();
            var isActive = $("input[name='IsActive']:checked").val();
            debugger;
            for (var i = 0; i < grid.length; i++) {
                var row = {
                    Id: grid[i].children[0].children[0].id,
                    IsActive: grid[i].children[0].children[0].checked,
                    PreviousGross: grid[i].children[4].children[0].value,
                    CurrentGross: grid[i].children[5].children[0].value,
                    NextGross: grid[i].children[6].children[0].value,
                }
                details.push(row)
            }
            var data = {
                Id: $("#Id").val(),
                BudgetNameAr: $("#BudgetNameAr").val(),
                BudgetNameEn: $("#BudgetNameEn").val(),
                Description: $("#Description").val(),
                IsActive: isActive,
                FK_GlFinancialPeriodId: $("#FK_GlFinancialPeriodId").val(),
                FreezingReasons: $("#FreezingReasons").val(),
                FK_DefFreezingReasonId: $("#FK_DefFreezingReasonId").val(),
                SelectedAccountTypeName: accountType,
                listDetails: details
            }

            $.ajax({
                url: '/EstimatedBudget/Update',
                type: 'POST',
                data: { listEstimatedBudgetVM: data },
                success: function (e) {
                    if (e) {
                        document.location = "../../EstimatedBudget/Index"
                    }
                }
            });
        }


    })

   
});
function validNumber(e) {
    if (e.value > 0) {

    } else {
        e.value = 0;
    }
}