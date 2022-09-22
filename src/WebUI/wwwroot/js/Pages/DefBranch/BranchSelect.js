$(document).ready(function () {

    //$.ajax({
    //    url: "/DefBranch/GetAllBranches",
    //    type: "GET",
    //    success: function (branch) {
    //        var branches = ""
    //        for (var i = 0; i < branch.length; i++) {
    //            branches += "<option value=" + branch[i].id + ">" + branch[i].branchNameAr+"</option>";
    //        }
    //        $("#DefBranches").html(branches);
    //        $("#DefBranches").html(branches);
    //        $("#DefBranches").val(getCookie("branchId"));
    //        $("#FK_DefBranchId").val(getCookie("branchId"));

    //    }
    //})
    $("#DefBranches").change(function () {
        $("#FK_DefBranchId").val($("#DefBranches").val())
    })
    //function getCookie(cname) {
    //    var name = cname + "=";
    //    var  cookie = document.cookie;
    //    var ca = cookie.split(';');
    //    for (var i = 0; i < ca.length; i++) {
    //        var c = ca[i];
    //        while (c.charAt(0) == ' ') {
    //            c = c.substring(1);
    //        }
    //        if (c.indexOf(name) == 0) {
    //            return c.substring(name.length, c.length);
    //        }
    //    }
    //    return "";
    //}

})