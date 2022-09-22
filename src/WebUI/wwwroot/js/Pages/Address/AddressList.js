$(document).ready(function () {


    loadPaySupplierAddressGrid();

    function loadPaySupplierAddressGrid() {
        var hdRefrenceId = $("#hdnRefrenceId").val();
        var hdAddressIds = $("#hdnAddressIds").val();
        var hdmodeulePage = $("#hdnModulePage").val();
        var dataSource = new kendo.data.DataSource({
            transport: {
                read: {
                    url: "/Address/GetByIds?id=" + hdAddressIds + "&&refId=" + hdRefrenceId + "&&modulePage=" + hdmodeulePage,
                    Type: "GET"
                }
            },
            error: function (e) {
                alert("Status: " + e.status + "; Error message: " + e.errorThrown);
            },
            pageSize: Resources.GridPageSize,
            schema: {
                model: {
                    id: "id",
                    fields: {
                        id: { editable: false },
                        addressAr: { editable: false },
                        addressEn: { editable: false },
                        description: { editable: false },
                        FK_CreatorId: { editable: false },
                        creationDate: { type: "date", editable: false },
                        lastModifiedDate: { type: "date", editable: false },
                        isDefaultAddress: { editable: false },
                        isDeliveryAddress: { editable: false },
                        isActive: { editable: false },
                        isDeleted: { editable: false },

                    }
                }
            }
        });


        var grid = $("#PaySupplierAddressGrid").kendoGrid({
            excel: {
                fileName: "Supplier.xlsx",
                allPages: Resources.GridAllPages,
                filterable: Resources.GridFilterable
            },
            dataSource: dataSource,
            pageSize: 20,
            serverPaging: Resources.GridServerPaging,
            serverFiltering: Resources.GridServerFiltering,
            filterable: false,
            height: Resources.GridHeight,
            groupable: false
            ,
            sortable: Resources.GridSortable,
            resizable: Resources.GridResizable,
            noRecords: Resources.GridNoRecords,
            messages: {
                noRecords: Resources.GridNoRecordsMessage
            },
            pageable: {
                pageSizes: [20, 40, 60, Resources.All],
                numeric: Resources.GridNumeric,
                refresh: Resources.GridRefresh,

            },
            columns: [

                { field: "addressAr", title: Resources.NameArResource, width: Resources.AddressWidth },
                { field: "addressEn", title: Resources.NameEnResource, width: Resources.AddressWidth },
                { width: Resources.CheckboxWidth, template: "<input type='checkbox' data-bind='checked:isDefaultAddress' class= 'control-label i-check' disabled = 'disabled' />", headerTemplate: Resources.DefaultAddressResource },
                { width: Resources.CheckboxWidth, template: "<input type='checkbox' data-bind='checked:isDeliveryAddress' class= 'control-label i-check' disabled = 'disabled' />", headerTemplate: Resources.DeliveryAddressResource },
                //{ width: "90px", template: "<input type='checkbox' data-bind='checked:isActive' class= 'control-label i-check' disabled = 'disabled' />", headerTemplate: resources.status },

                //{
                //    field: "creationDate", title: resources.creationDate, format: "{0:yyyy/MM/dd}", width: "150px",
                //    filterable: {
                //        operators: {
                //            date: {
                //                gte: resources.isAfterOrEqualTo,
                //                lte: resources.isBeforeOrEqualTo
                //            }
                //        },
                //        extra: false,
                //        ui: function (element) {
                //            element.kendoDatePicker({
                //                format: '{0: dd/MM/yyyy}'
                //            })
                //        }
                //    }
                //},
                { width: Resources.ActionWidth, template: "<a class='btn btn-danger btn-sm btnDelete ' ><i class='fas fa-trash-alt'></i></a>" },

            ],
            dataBound: function (e) {
                e.sender.items().each(function () {
                    var dataItem = e.sender.dataItem(this);
                    kendo.bind(this, dataItem);

                });

            },
            //resizable: true
        });
        grid.data("kendoGrid").table.on("click", ".btnDelete", removePaySupplierAddress);
    }

    function removePaySupplierAddress() {

        //var deletee = stringify(resources.delete).serialize();

        var row = $(this).closest("tr"),
            grid = $("#PaySupplierAddressGrid").data("kendoGrid"),
            dataItem = grid.dataItem(row);
        //var filters = grid.dataSource.filter();
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
                    url: "/Address/Delete?Id=" + dataItem.id,
                    type: "Get",
                    contentType: 'application/json; charset=utf-8',
                    success: function (result) {
                        debugger;
                        if (result) {
                            loadPaySupplierAddressGrid();
                            //grid.refresh();
                            //grid.dataSource.filter(filters);
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

    $("#btnAddAddress").click(function () {

        var addressAr = $("#AddressAr").val();
        var addressEn = $("#AddressEn").val();
        var isDefaultAddress = $("#IsDefaultAddress").is(":checked");
        var isDeliveryAddress = $("#IsDeliveryAddress").is(":checked");
        var hdModule = $("#hdnModule").val();
        var hdModulePage = $("#hdnModulePage").val();
        var hdRefrenceId = $("#hdnRefrenceId").val();
        var hdAddressIds = $("#hdnAddressIds").val();
        if (addressAr.trim() == "") {
            $("#AddressArVlidation").text(Resources.Required);
            return;
        } else {
            $("#AddressArVlidation").text("");
        }

        if (addressEn.trim() == "") {
            $("#AddressEnVlidation").text(Resources.Required);
            return;
        } else {
            $("#AddressEnVlidation").text("");
        }


        var data = {
            AddressAr: addressAr,
            AddressEn: addressEn,
            IsDefaultAddress: isDefaultAddress,
            IsDeliveryAddress: isDeliveryAddress,
            ModulePage: hdModulePage,
            FK_ReferenceId: hdRefrenceId
        }

        $.ajax({
            url: '/Address/Create',
            type: "POST",
            data: { addEditAddressVM: data },
            success: function (e) {
                if (e > 0) {
                    if (hdAddressIds == "0") {
                        $("#hdnAddressIds").val(e)
                    } else {
                        $("#hdnAddressIds").val(hdAddressIds + "," + e);
                    }
                    $("#AddressAr").val("");
                    $("#AddressEn").val("");
                    document.getElementById("IsDefaultAddress").checked = false;
                    document.getElementById("IsDeliveryAddress").checked = false;
                    loadPaySupplierAddressGrid();
                }

            }
        })
    })

});
$(".exportExcel").on('click', function () {
    $("#PaySupplierAddressGrid").getKendoGrid().saveAsExcel();
});


