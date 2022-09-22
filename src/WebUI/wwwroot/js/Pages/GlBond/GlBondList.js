$(document).ready(function () {



    var grid = $("#GlBondsgrid").kendoGrid({
        excel: {
            fileName: "Bonds.xlsx",
            allPages: true,
            filterable: true
        },
        dataSource: {
            //type: "jsonp",
            transport: {
                read: "/GlBond/GetAll"
            },
            schema: {
                model: {
                    id: "id",
                    fields: {
                        voucherDate: { type: "date" },
                        serial: { type: "number" },
                        parentId: { type: "number" },
                        paymentDetailId: { type: "number" },
                        paymentDetailAmount: { type: "number" },
                        IsPosted: { type: "string" },
                        hasPayment: { editable: false },
                        creatorUserName: { type: "string" }
                    }
                }
            },
            pageSize: Resources.GridPageSize
        },
        height: Resources.GridHeight,
        sortable: Resources.GridSortable,
        reorderable: Resources.GridReorderable,
        groupable: Resources.GridGroupable,
        resizable: Resources.GridResizable,
        filterable: Resources.GridFilterable,
        columnMenu: Resources.GridColumnMenu,
        noRecords: Resources.GridNoRecords,
        messages: {
            noRecords: Resources.GridNoRecordsMessage
        },
        pageable: Resources.GridPageable,
        columns: [{
            field: "creatorUserName",
            title: Resources.EmployeeName,
            width: Resources.NameWidth
        }, {
            field: "serial",
            title: Resources.BondCodeResource,
            //locked: true,
            //lockable: false,
            width: Resources.CodeWidth
        }, {
            field: "voucherDate",
            title: Resources.BondDateResource,
            format: "{0:yyyy/MM/dd}",
            width: Resources.DateWidth
        },
        //{
        //    field: "documentSerial",
        //    title: Resources.SerialResource,
        //    width: Resources.CodeWidth,
        //    hidden: true
        //},
        { width: Resources.CheckboxWidth, template: "<input type='checkbox' data-bind='checked:isPosted' class= 'control-label i-check' disabled = 'disabled' />", headerTemplate: Resources.Posted },
        // { width: Resources.DoubleActionWidth, template: "<a  href='/GlBonds/Edit/#= id #'  class='btn btn-success btn-sm btnEdit'><i class='fas fa-edit'></i></a> <a  class='btn btn-danger btn-sm btnDelete' ><i class='fas fa-trash-alt'></i></a>" },
            { width: Resources.DoubleActionWidth, template: "#if(isPosted==true){# " + Resources.Posted + " #}else{# <a  href='/GlBond/Edit/#= id #'  class='btn btn-success btn-sm btnEdit'><i class='fas fa-edit'></i></a> <a  class='btn btn-danger btn-sm btnDelete' ><i class='fas fa-trash-alt'></i></a> <a  class='btn btn-warning btn-sm btnOpenReport'><i class='fas fa-eye'></i></a>#}# #if(hasPayment==true){# <button type='button' class='btn btn-info btn-sm btnOpenPayment' ><i class='fas fa-dollar-sign'></i></button> #}else{# <button type='button' class='btn btn-info btn-sm btnOpenPayment' disabled><i class='fas fa-dollar-sign'></i></button> #}#" },

        ],
        dataBound: function (e) {
            e.sender.items().each(function () {
                var dataItem = e.sender.dataItem(this);
                kendo.bind(this, dataItem);
                if (dataItem.isActive) {
                    //$(this).addClass("k-state-selected");
                }
            })
            if (!hasRoleEdit)
                $(".btnEdit").addClass('disabled');

            if (!hasRoleDelete)
                $(".btnDelete").addClass('disabled');
        },
        excelExport: function (e) {

            var sheet = e.workbook.sheets[0];
            for (var i = 0; i < sheet.rows.length; i++) {
                sheet.rows[i].cells.reverse();
                for (var ci = 0; ci < sheet.rows[i].cells.length; ci++) {
                    sheet.rows[i].cells[ci].hAlign = "right";
                }
            }
            //sheet.frozenRows = 2;
            sheet.mergedCells = ["A1:B1", "A2:B2"];
            sheet.name = $("#Name").val();
            var now = new Date(),
                today = now.getFullYear() + "-" + ("0" + (now.getMonth() + 1)).slice(-2) + "-" + ("0" + now.getDate()).slice(-2);
            var branch = getCookie("branchName");

            var myHeaders = [{
                value: Resources.Branch + " : " + branch + "       " + Resources.Date + " : " + today.toString('dd-MMM-yyyy'),
                textAlign: "right",
                background: "#FFFFFF",
                color: "#000000"
            }
            ];
            var title = [{
                value: $("#Name").val(),
                textAlign: "center",
                background: "#FFFFFF",
                color: "#000000"
            }];
            sheet.rows.splice(0, 0, { cells: myHeaders, type: "header", height: 40 });
            sheet.rows.splice(0, 0, { cells: title, type: "header", height: 40 });
        }
    });
    grid.data("kendoGrid").table.on("click", ".btnDelete", removeBond);
    grid.data("kendoGrid").table.on("click", ".btnOpenReport", OpenReport);
    grid.data("kendoGrid").table.on("click", ".btnOpenPayment", OpenPayment);
    function OpenReport() {

        var row = $(this).closest("tr"),
            grid = $("#GlBondsgrid").data("kendoGrid"),
            dataItem = grid.dataItem(row);

        if (dataItem.id > 0) { // سند اجل 
            var url = "/GlBond/GlBondDetailsReport/" + dataItem.id
            window.open(url, '_blank').print();
        }

        else {
            swal({
                title: Resources.ErrorMsgResource,
                confirmButtonText: Resources.DoneResource,
                type: "error"
            });
        }
    }
    function OpenPayment() {

        var row = $(this).closest("tr"),
            grid = $("#GlBondsgrid").data("kendoGrid"),
            dataItem = grid.dataItem(row);

        if (dataItem.parentId > 0 && dataItem.paymentDetailId > 0 && dataItem.paymentDetailAmount > 0) {
            var url = "/GlPaymentsCollection/Payment?payId=" + dataItem.parentId + "&payDetailId=" + dataItem.paymentDetailId + "&detAmount=" + dataItem.paymentDetailAmount
            window.open(url, '_blank');
        }

        else {
            swal({
                title: Resources.ErrorMsgResource,
                confirmButtonText: Resources.DoneResource,
                type: "error"
            });
        }
    }
    $("#DefBranches").change(function () {
        debugger;
        var fK_DefBranchId = parseInt($("#FK_DefBranchId").val());
        $('#GlBondsgrid').data('kendoGrid').dataSource.read({ fK_DefBranchId: fK_DefBranchId });
    });
});
function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function removeBond() {

    var row = $(this).closest("tr"),
        grid = $("#GlBondsgrid").data("kendoGrid"),
        dataItem = grid.dataItem(row);
    swal({
        title: Resources.DeleteResource,
        text: Resources.DeleteConfirmResource,
        type: "info",
        showCancelButton: true,
        confirmButtonText: Resources.DeleteResource,
        cancelButtonText: Resources.CancelResource,
        closeOnConfirm: false,
        showLoaderOnConfirm: true
    }, function () {
        setTimeout(function () {
            $.ajax({
                url: "/GlBond/Delete?id=" + dataItem.id,
                type: "Get",
                contentType: 'application/json; charset=utf-8',
                success: function (result) {
                    debugger;
                    if (result) {
                        $('#GlBondsgrid').data('kendoGrid').dataSource.read();
                        swal({
                            title: Resources.DeleteSuccessResource,
                            confirmButtonText: Resources.DoneResource,
                            type: "success"
                        });
                    }
                    else {
                        swal({
                            title: Resources.DeleteFailedResource,
                            confirmButtonText: Resources.DoneResource,
                            type: "error"
                        });
                    }
                },
                error: function (err, xqr, txt) { }
            });

        }, 3000);
    });
}

$("#btnDataReview").on('click', function () {

    var employeeName = $("#EmployeeName").val();
    var fK_DefBranchId = parseInt($("#FK_DefBranchId").val());

    $('#GlBondsgrid').data('kendoGrid').dataSource.read({ fK_DefBranchId: fK_DefBranchId, creatorName: employeeName });

});

$(".exportExcel").on('click', function () {
    $("#GlBondsgrid").getKendoGrid().saveAsExcel();
});