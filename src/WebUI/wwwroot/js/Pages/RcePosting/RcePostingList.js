$(document).ready(function () {


    var url = "/RcePosting/GetAllRceByDate";
    loadAllBonds();
    $("#btnShowBonds").click(function () {

        url = "/RcePosting/GetAllRceByDate?dateFrom=" + $("#txtFrom").val() + "&&dateTo=" + $("#txtTo").val() + "&&id=" + $("#selectBond").val() + "" + "&&branchId=" + parseInt($("#FK_DefBranchId").val()) + "&&posted=" + $("input[name='IsPosted']:checked").val(); 
        loadAllBonds();

    });
    function loadAllBonds() {
        debugger
        $("#payBondsGrid").kendoGrid({
            dataSource: {
                //type: "jsonp",
                transport: {
                    read: url
                },
                schema: {
                    model: {
                        id: "id",
                        fields: {
                            billDate: { type: "date" },
                            isPosted: { editable: false },
                            serial: { type: "string" },
                            glAccountName: { type: "string" },
                            rceClientName: { type: "string" },
                            creationDate: { type: "date" },
                            creatorUserName: { type: "string" },
                            isActive: { editable: false },
                            postedDate: { type: "date" },
                            postedUserName: { type: "string" },
                            gross: { type: "string" },
                            payType: { type: "string" }
                        }
                    }
                },
                //pageSize: 30
            },
            height: Resources.GridHeight,
            scrollable: true,
            //sortable: true,
            //reorderable: true,
            //groupable: true,
            resizable: true,
            //filterable: true,
            //columnMenu: true,
            noRecords: Resources.GridNoRecords,
            messages: {
                noRecords: Resources.GridNoRecordsMessage
            },
            //pageable: true,
            columns: [
                {
                    title: 'Select All',
                    headerTemplate: "<input type='checkbox' id='header-chb' class='k-checkbox header-checkbox'><label class='k-checkbox-label' for='header-chb'></label>",
                    template: function (dataItem) {
                        return "<input type='checkbox' id='" + dataItem.id + "' class='k-checkbox row-checkbox'><label class='k-checkbox-label' for='" + dataItem.id + "'></label>";
                    },
                    width: Resources.CheckboxWidth
                }, {
                    field: "serial",
                    title: Resources.Serial,
                    width: Resources.CodeWidth
                },
                {
                    field: "rceClientName",
                    title: Resources.ClientNameResource,
                    width: Resources.NameWidth
                },
                //{
                //    template: $("#selectBond option:selected").html(),
                //    title: resources.BondType,
                //    width: 40,
                //},
                {
                    field: "gross",
                    title: Resources.Amount,
                    width: Resources.AmountWidth
                },
                { width: Resources.CheckboxWidth, template: "<input type='checkbox' data-bind='checked:isActive' class= 'control-label i-check' disabled = 'disabled' />", headerTemplate: Resources.Status },
                {
                    field: "creatorUserName",
                    title: Resources.EmployeeName,
                    width: Resources.NameWidth
                },
                {
                    field: "billDate",
                    title: Resources.BondDate,
                    format: "{0:yyyy/MM/dd}",
                    width: Resources.DateWidth
                },
                {
                    field: "postedUserName",
                    title: Resources.EmployeeWhoPosted,
                    width: Resources.NameWidth
                }, {
                    field: "postedDate",
                    title: Resources.PostedDate,
                    format: "{0:yyyy/MM/dd}",
                    width: Resources.DateWidth
                },
                { width: Resources.CheckboxWidth, template: "<input type='checkbox' data-bind='checked:isPosted' class= 'control-label i-check' disabled = 'disabled' />", headerTemplate: Resources.Posted },


            ],
            dataBound: function (e) {
                e.sender.items().each(function () {
                    var dataItem = e.sender.dataItem(this);
                    kendo.bind(this, dataItem);
                    //if (dataItem.isActive) {
                    //    $(this).addClass("k-state-selected");
                    //}
                    //if (dataItem.isPosted) {
                    //    $(this).addClass("k-state-selected");

                    //}
                });

                var view = this.dataSource.view();
                for (var i = 0; i < view.length; i++) {
                    if (checkedIds[view[i].id]) {
                        this.tbody.find("tr[data-uid='" + view[i].uid + "']")
                            .addClass("k-state-selected")
                            .find(".k-checkbox")
                            .attr("checked", "checked");
                    }
                }
            }
        });
    }

    $("#selectBond").kendoDropDownList({
        filter: "contains",
        height: 300,
        dataTextField: "text",
        dataValueField: "value",
        dataSource: {
            type: "json",
            //serverFiltering: true,
            transport: {
                read: {
                    url: "/RcePosting/GetAllBondTypeForDDL",
                },
                parameterMap: function (data, action) {

                    if (action === "read") {
                        return {
                            //fK_DefBranchId: parseInt($("#FK_DefBranchId").val()),
                        };


                    } else {
                        return data;
                    }
                }
            }
        },
        //change: onSelectInvoiceType

    });

    //bind click event to the checkbox
    $("#payBondsGrid").data("kendoGrid").table.on("click", ".row-checkbox", selectRow);

    $('#header-chb').change(function (ev) {
        var checked = ev.target.checked;
        var s = $('.row-checkbox');
        $('.row-checkbox').each(function (idx, item) {
            if (checked) {
                var c = $(item).closest('tr').is('.k-state-selected');
                if (!($(item).closest('tr').is('.k-state-selected'))) {
                    $(item).click();
                }

            } else {
                if ($(item).closest('tr').is('.k-state-selected')) {
                    $(item).click();
                }

            }
        });
    });

    $("#submitPostedBonds").bind("click", function () {


        var data = getCheckedData();
        if (data.length === 0) {
            swal("", Resources.NoRecordSelectedResource, "error");
            return false;
        }
        swal({
            title: Resources.PostingResource,
            text: Resources.PostingConfirmResource,
            type: "info",
            showCancelButton: true,
            confirmButtonText: Resources.PostingResource,
            cancelButtonText: Resources.CancelResource,
            closeOnConfirm: false,
            showLoaderOnConfirm: true
        }, function () {
            setTimeout(function () {
                $.ajax({
                    url: '/RcePosting/UpdateRcePosting',
                    type: 'POST',
                    data: { listRcePosting: data, id: $("#selectBond").val() },
                    success: function (result) {

                        if (result) {

                            swal({
                                title: Resources.PostingSuccessResource,
                                confirmButtonText: Resources.DoneResource,
                                type: "success"
                            });
                            loadAllBonds();
                        }
                        else {
                            swal({
                                title: Resources.ErrorMsgResource,
                                confirmButtonText: Resources.DoneResource,
                                type: "error"
                            });
                        }
                    },
                    error: function (err, xqr, txt) { }
                });

            }, 3000);
        });
    });

    $("#submitCancelPostedBonds").bind("click", function () {

        var data = getCheckedData();
        if (data.length === 0) {
            swal("", Resources.NoRecordSelectedResource, "error");
            return false;
        }
        swal({
            title: Resources.UnPostingResource,
            text: Resources.UnPostingConfirmResource,
            type: "info",
            showCancelButton: true,
            confirmButtonText: Resources.UnPostingResource,
            cancelButtonText: Resources.CancelResource,
            closeOnConfirm: false,
            showLoaderOnConfirm: true
        }, function () {
            setTimeout(function () {
                $.ajax({
                    url: '/RcePosting/UpdateRceUnposting',
                    type: 'POST',
                    data: { listRcePosting: data, id: $("#selectBond").val() },
                    success: function (result) {

                        if (result) {

                            swal({
                                title: Resources.UnPostingSuccessResource,
                                confirmButtonText: Resources.DoneResource,
                                type: "success"
                            });
                            loadAllBonds();
                        }
                        else {
                            swal({
                                title: Resources.ErrorMsgResource,
                                confirmButtonText: Resources.DoneResource,
                                type: "error"
                            });
                        }
                    },
                    error: function (err, xqr, txt) { }
                });

            }, 3000);
        });



    });

    $("#deleteBonds").bind("click", function () {
        var data = getCheckedData();
        if (data.length === 0) {
            swal("", Resources.NoRecordSelectedResource, "error");
            return false;
        }
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
                    url: "/RcePosting/DeleteRce",
                    type: 'POST',
                    data: { listRcePosting: data, id: $("#selectBond").val() },
                    success: function (result) {

                        if (result) {

                            swal({
                                title: Resources.DeleteSuccessResource,
                                confirmButtonText: Resources.DoneResource,
                                type: "success"
                            });
                            loadAllBonds();
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
    })

    function getCheckedData() {
        var editedData = [];
        gridData = $("#payBondsGrid").data("kendoGrid").dataSource._data;
        for (var i = 0; i < gridData.length; i++) {
            if (checkedIds[gridData[i].id]) {
                var row = { id: gridData[i].id };
                editedData.push(row);
            }
            //for (var j in checkedIds) {
            //    if (gridData[i].id == j) {
            //        var row = { id: gridData[i].id, notes: gridData[i].notes, voucherCode: gridData[i].voucherCode };
            //        editedData.push(row);
            //    }
            //}
        }
        return editedData;
    }

});

var checkedIds = {};

//on click of the checkbox:
function selectRow() {
    var checked = this.checked,
        row = $(this).closest("tr"),
        grid = $("#payBondsGrid").data("kendoGrid"),
        dataItem = grid.dataItem(row);

    checkedIds[dataItem.id] = checked;

    if (checked) {
        //-select the row
        row.addClass("k-state-selected");

        var checkHeader = true;

        $.each(grid.items(), function (index, item) {
            if (!($(item).hasClass("k-state-selected"))) {
                checkHeader = false;
            }
        });

        $("#header-chb")[0].checked = checkHeader;
    } else {
        //-remove selection
        row.removeClass("k-state-selected");
        $("#header-chb")[0].checked = false;
    }
}

//on dataBound event restore previous selected rows:
function onDataBound(e) {
    var view = this.dataSource.view();
    console.log(view);
    for (var i = 0; i < view.length; i++) {
        if (checkedIds[view[i].id]) {
            this.tbody.find("tr[data-uid='" + view[i].uid + "']")
                .addClass("k-state-selected")
                .find(".k-checkbox")
                .attr("checked", "checked");
        }
    }
}