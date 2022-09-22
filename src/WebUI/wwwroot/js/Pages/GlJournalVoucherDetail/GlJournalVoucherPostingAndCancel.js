$(document).ready(function () {


    $("#JournalVoucher").change(function () {
        debugger
        if ($("#JournalVoucher").is(':checked')) { //Voucher
            //$('#FK_DefDocumentTypeId').prop("disabled", true);
            $("#FK_DefDocumentTypeId").data("kendoDropDownList").enable(false);
            $("#FK_DefDocumentTypeId").data("kendoDropDownList").value("0");

            $('#FK_DefDocumentTypeId').val("");
            $("#FK_GlJournalVoucherCategoryId").data("kendoDropDownList").enable(true);

            //$('#FK_GlJournalVoucherCategoryId').prop("disabled", false);
        } else {

        }


    });
    $("#FK_HrEmployeeId").kendoDropDownTree({
        placeholder: Resources.Choose,
        filter: "contains",
        dataTextField: "codeAndName",
        dataValueField: "id",
        height: 300,
        checkboxes: true,
        checkAll: true,
        autoClose: false,
        dataSource: {
            type: "json",
            //serverFiltering: true,
            transport: {
                read: {
                    url: "/HrEmployee/GetAllEmployeesForDDList",
                },
                parameterMap: function (data, action) {

                    if (action === "read") {
                        return {
                            code: $("#FK_HrEmployeeId").text(),
                            fK_DefBranchId: $("#FK_DefBranchId").val()
                        };


                    } else {
                        return data;
                    }
                }
            }
        }

    });
    $("#DeferredBond").change(function () {
        debugger
        if ($("#DeferredBond").is(':checked')) { //Voucher
            //$('#FK_GlJournalVoucherCategoryId').prop("disabled", true);
            $("#FK_GlJournalVoucherCategoryId").data("kendoDropDownList").enable(false);
            $("#FK_GlJournalVoucherCategoryId").data("kendoDropDownList").value("1");

            $('#FK_GlJournalVoucherCategoryId').val("");
            //$('#FK_DefDocumentTypeId').prop("disabled", false);
            $("#FK_DefDocumentTypeId").data("kendoDropDownList").enable(true);

        } else {

        }
    });

    var url = "/GlJournalVoucher/GetAllVoucherByDate";
    loadAllVoucher();
    $("#btnShowBonds").bind("click", function () {
        var multiemp = $("#FK_HrEmployeeId").data("kendoDropDownTree");
        var empIds = multiemp.value().join(", ");

        url = {
            url: "/GlJournalVoucher/GetAllVoucherByDate",
            type: 'POST',
            data: {
                from: $("#txtFrom").val(), to: $("#txtTo").val(), posted: $("input[name='IsPosted']:checked").val(), voucherCode: $("#VoucherCode").val().trim(), voucherType: $("input[name='VoucherType']:checked").val(), documentTypeId: $("#FK_DefDocumentTypeId").val(), categoryId: $("#FK_GlJournalVoucherCategoryId").val(), fK_DefBranchId: parseInt($("#FK_DefBranchId").val()), empIds: empIds,
            }
        };
        loadAllVoucher();
    });
    function loadAllVoucher() {
        checkedIds = {};
        $("#gridJournalVouchers").kendoGrid({
            dataSource: {
                //type: "jsonp",
                transport: {
                    read: url
                },
                schema: {
                    model: {
                        id: "id",
                        fields: {
                            voucherDate: { type: "date" },
                            isPosted: { editable: false },
                            serial: { type: "string" },
                            creationDate: { type: "date" },
                            creatorUserName: { type: "string" },
                            documentSerial: { type: "string" },
                            isActive: { editable: false },
                            postedDate: { type: "date" },
                            notes: { type: "string" },
                            postedUserName: { type: "string" },
                            totalCridet: { type: "string" },
                            totalDebit: { type: "string" }
                        }
                    }
                },
                //pageSize: 30
            },
            height: 540,
            scrollable: true,
            //sortable: true,
            //reorderable: true,
            //groupable: true,
            resizable: true,
            //filterable: true,
            //columnMenu: true,
            noRecords: true,
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
                },
                {
                    field: "serial",
                    title: Resources.BondCode,
                    width: Resources.CodeWidth
                },
                //{
                //    field: "voucherCode",
                //    title: "اسم السند",
                //    width: 40
                //},
                {
                    field: "totalDebit",
                    title: Resources.Debit,
                    width: Resources.AmountWidth,
                    template: '#if((totalCridet - totalDebit)==0){# <span > #: totalDebit # </span>  #}else{# <span class="text-danger"> #: totalDebit # </span>  #}#'
                },
                {
                    field: "totalCridet",
                    title: Resources.Credit,
                    width: Resources.AmountWidth,
                    template: '#if((totalCridet - totalDebit)==0){# <span > #: totalCridet # </span>  #}else{# <span class="text-danger"> #: totalCridet # </span>  #}#'
                },
                { width: Resources.CheckboxWidth, template: "<input type='checkbox' data-bind='checked:isActive' class= 'control-label i-check' disabled = 'disabled' />", headerTemplate: Resources.Status },
                //{
                //    field: "isPosted",
                //    template: "#= isActive ? 'مفعل' : 'غير مفعل' #",
                //    title: "حالة السند",
                //    lockable: false,
                //    width: 40
                //},
                {
                    field: "creatorUserName",
                    title: Resources.EmployeeName,
                    width: Resources.NameWidth
                },
                {
                    field: "voucherDate",
                    title: Resources.VoucherDate,
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
                { width: Resources.NoteWidth, template: "<input type='text' data-bind='value:notes' maxlength='80'/>", headerTemplate: Resources.Notes, validation: { max: 100 } },
                { width: Resources.CodeWidth, template: "#if(serial!=null) {#<a href='/GlJournalVoucher/GlJournalVoucherDetailsReport/#= id #'  target='_blank' class='btn btn-success btn-sm'><i class='fas fa-eye'></i></a>#} else {# <a href='/GlBond/GlBondDetailsReport/#= id #'  target='_blank' class='btn btn-success btn-sm'><i class='fas fa-eye'></i></a>#}#" }

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

    $("#FK_DefDocumentTypeId").kendoDropDownList({
        filter: "contains",
        height: 300,
        dataTextField: "codeAndName",
        dataValueField: "id",
        dataSource: {
            type: "json",
            //serverFiltering: true,
            transport: {
                read: {
                    url: "/GlBond/GetAllDocumentTypesForDDList",
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

    $("#FK_GlJournalVoucherCategoryId").kendoDropDownList({
        filter: "contains",
        height: 300,
        dataTextField: "codeAndName",
        dataValueField: "id",
        dataSource: {
            type: "json",
            //serverFiltering: true,
            transport: {
                read: {
                    url: "/GlJournalVoucher/GetAllCategoriesForDDList",
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
    $("#FK_GlJournalVoucherCategoryId").data("kendoDropDownList").value("1");
    //bind click event to the checkbox
    $("#gridJournalVouchers").data("kendoGrid").table.on("click", ".row-checkbox", selectRow);

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
        } else {
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
                        url: '/GlJournalVoucher/UpdateVoucherPosting',
                        type: 'POST',
                        data: { vouchers: data },
                        success: function (result) {

                            if (result) {
                                if (isEqual == false) {
                                    swal({
                                        title: Resources.DebitCreditNotEqual,
                                        confirmButtonText: Resources.DoneResource,
                                        type: "error"
                                    });
                                } else {
                                    swal({
                                        title: Resources.PostingSuccessResource,
                                        confirmButtonText: Resources.DoneResource,
                                        type: "success"
                                    });
                                }
                                isEqual = true;
                                loadAllVoucher();
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
        }

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
                    url: '/GlJournalVoucher/UpdateVoucherUnposting',
                    type: 'POST',
                    data: { vouchers: data },
                    success: function (result) {

                        if (result) {

                            swal({
                                title: Resources.UnPostingSuccessResource,
                                confirmButtonText: Resources.DoneResource,
                                type: "success"
                            });
                            loadAllVoucher();
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
                    url: "/GlJournalVoucher/DeleteVoucher",
                    type: 'POST',
                    data: { vouchers: data },
                    success: function (result) {

                        if (result) {

                            swal({
                                title: Resources.DeleteSuccessResource,
                                confirmButtonText: Resources.DoneResource,
                                type: "success"
                            });
                            loadAllVoucher();
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

    var isEqual = true;
    function getCheckedData() {
        debugger
        var editedData = [];
        gridData = $("#gridJournalVouchers").data("kendoGrid").dataSource._data;
        for (var i = 0; i < gridData.length; i++) {
            if (checkedIds[gridData[i].id]) {
                if ((gridData[i].totalCridet - gridData[i].totalDebit) == 0) {
                    var row = { id: gridData[i].id, notes: gridData[i].notes, serial: gridData[i].serial };
                    editedData.push(row);
                } else {

                    isEqual = false;
                }

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
        grid = $("#gridJournalVouchers").data("kendoGrid"),
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