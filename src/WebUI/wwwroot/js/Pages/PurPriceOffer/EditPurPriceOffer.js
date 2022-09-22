$(document).ready(function () {
    var url = window.location.pathname;
    var id = url.substring(url.lastIndexOf('/') + 1);

    var values = new Array();
    $('#SelectedSuppliers option').each(function () {
        var row = {
            supplierNameAr: this.text,
            id: parseInt(this.value)
        }
        values.push(row);
    });
    
    //var multiselect = $('#multiselect').data("kendoMultiSelect");
    //multiselect.value(values);
    

    $("#mainCategorie").change(function () {
        if ($("#mainCategorie").val() > 0) {
            $.ajax({
                url: '/StLookups/GetAllStItemByMainCategory?id=' + $("#mainCategorie").val(),
                success: function (items) {
                    var options = '<option value="">' + Resources.SelectOne + '</option>'
                    for (var i = 0; i < items.length; i++) {
                        options += '<option value="' + items[i].id + '">' + items[i].itemName + '</options>'
                    }
                    $("#FK_StItemId").html(options)
                }
            })
        }
    });

    $("#FK_StItemId").change(function () {
        if ($("#FK_StItemId").val() > 0) {
            $.ajax({
                url: '/StLookups/GetItemData?id=' + $("#FK_StItemId").val(),
                success: function (item) {
                    $("#ItemBarcode").val(item.barcodeCode);
                    $("#FK_StUnitId").val(item.fK_StUnitId);
                    $("#ItemUnit").val(item.unitName);
                }
            })
        }
    })


    var tempSource = new kendo.data.DataSource({
        transport: {
            read: {
                url: "/PurPriceOffer/GetPurOfferDetailsById?id=" + $("#Id").val(),
                Type: "GET"
            },
            parameterMap: function (options, operation) {
                if (operation !== "read" && options.models) {
                    return { models: kendo.stringify(options.models) };
                }
            }
        },
        //autoSync: true,
        batch: true,
        //pageSize: 20,
        schema: {
            model: {
                id: "id",
                fields: {
                    id: { editable: true },
                    fK_PurPriceOfferId: { editable: true },
                    fK_StItemId: { editable: false },
                    fK_StUnitId: { editable: false },
                    fK_StMainCategoryId: { editable: false },
                    itemBarcode: { validation: { required: true } },
                    itemName: { validation: { required: true, message: Resources.Required } },
                    categoryName: { editable: false },
                    itemUnit: { editable: false },
                    quantity: { editable: false },
                }
            }
        }
    });

    var PurPriceOfferGrid = $("#PurPriceOfferGrid").kendoGrid({
        dataSource: tempSource,
        navigatable: true,
        pageable: false,
        scrollable: false,
        columns: [
            { field: "fK_PurPriceOfferId", hidden: true },
            { field: "fK_StItemId", hidden: true },
            { field: "fK_StUnitId", hidden: true },
            { field: "fK_StMainCategoryId", hidden: true },
            { field: "itemBarcode", title: Resources.Code, width: Resources.CodeWidth },
            { field: "itemName", title: Resources.ItemName, width: Resources.NameWidth },
            { field: "categoryName", title: Resources.MainCategories, width: Resources.NameWidth },
            { field: "itemUnit", title: Resources.Unit, width: Resources.NameWidth },
            { field: "quantity", title: Resources.Quantity, width: Resources.NameWidth },

            { width: Resources.ActionWidth, template: "<a  class='btn btn-danger btn-sm btnDelete' ><i class='fas fa-trash-alt'></i></a>" }
        ],
        editable: false,
        selectable: "multiple, cell",


    });
    $("#btnAddNewDetail").on('click', function () {
        debugger;
        var FK_StItemId = $("#FK_StItemId").val(),
            FK_StUnitId = $("#FK_StUnitId").val(),
            FK_MainCategories = $("#mainCategorie").val(),
            ItemBarcode = $("#ItemBarcode").val(),
            ItemName = $("#FK_StItemId option:selected").text(),
            CategoryName = $("#mainCategorie option:selected").text(),
            ItemUnit = $("#ItemUnit").val(),
            Quantity = $("#Quantity").val();
        debugger
        if (FK_StItemId > 0 && Quantity > 0 && FK_StUnitId > 0) {

            var totalRecords = $("#PurPriceOfferGrid").data("kendoGrid").dataSource.data().length;
            var Index = parseInt($("#Index").val());
            if (!isNaN(Index))
                totalRecords = Index - 1;
            tempSource.insert(totalRecords, {
                fK_StItemId: FK_StItemId,
                fK_StUnitId: FK_StUnitId,
                fK_StMainCategoryId: FK_MainCategories,
                itemBarcode: ItemBarcode,
                itemName: ItemName,
                categoryName: CategoryName,
                itemUnit: ItemUnit,
                quantity: Quantity,
            });

            ClearFormDetails();
        } else {
            debugger
            if (isNaN(FK_StItemId) || FK_StItemId <= 0) {

                swal({
                    title: Resources.EnterRequiredResource + " " + Resources.ItemName,
                    confirmButtonText: Resources.DoneResource,
                    type: "error"
                });
            }
            else if (isNaN(FK_StUnitId) || FK_StUnitId <= 0) {

                swal({
                    title: Resources.EnterRequiredResource + " " + Resources.Unit,
                    confirmButtonText: Resources.DoneResource,
                    type: "error"
                });
            }

        }


    });

    PurPriceOfferGrid.data("kendoGrid").table.on("click", ".btnDelete", removeRow);
    var thisRow = "";

    function ClearFormDetails() {
        $("#FK_StItemId").val("");
        $("#ItemBarcode").val("");
        $("#ItemBarcodehid").val("");
        $("#Quantity").val(null);
        $("#ItemUnit").val("");
        $("#FK_StUnitId").val("");
    }

    function removeRow() {
        debugger;
        var row = $(this).closest("tr"),
            grid = $("#PurPriceOfferGrid").data("kendoGrid"),
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
                var dataSource = $("#PurPriceOfferGrid").data("kendoGrid").dataSource;

                if (dataSource.remove(dataItem)) {
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

            }, 1000);
        });
    }

    var multiSelectSource = new kendo.data.DataSource({
        serverFiltering: true,
        type: "json",
        transport: {
            read: {
                url: "/PayLookups/GetAllPaySupplier"
            },
            parameterMap: function (data, action) {
                if (action === "read") {
                    return {
                        firstCode: $("#FirstCode").val(),
                        secondCode: $("#SecondCode").val(),
                    };
                } else {
                    return data;
                }
            }
        }
        ,
        schema: {
            model: {
                id: "id",
                fields: {

                    fullName: {
                        type: "string"
                    },
                    code: {
                        type: "string"
                    }
                }
            }
        }
    });
    var multiselect= $("#multiselect").kendoMultiSelect({
        headerTemplate: '<div class="dropdown-header k-widget k-header">' +
            '<span style="margin-left:100px">' + Resources.Code + ' </span>' +
            '<span>' + Resources.SupplierNameResource + '</span>' +

            '</div>',
        template: '<span style="margin-left:100px">#: data.supplierCode #</span>' +
            '<span>#: data.supplierNameAr #</span>',
        dataTextField: "supplierNameAr",
        dataValueField: "id",
        value: values,
        //placeholder: Resources.AutocompleateChoose,
        dataSource: multiSelectSource
    });


    $("#btnSaveBalance").click(function () {
        if ($("#SerialNumber").val() > 0)
            $("#SerialNumberValid").text("")
        else
            $("#SerialNumberValid").text(Resources.Required)

        if ($("#ExpireAfter").val() > 0)
            $("#ExpireAfterValid").text("")
        else
            $("#ExpireAfterValid").text(Resources.Required)

        var multiselect = $("#multiselect").data("kendoMultiSelect");
        var multiDataItems = multiselect.dataItems();
        if (multiDataItems.length == 0)
            $("#SupplierMultiSelectValid").text(Resources.Required)


        var purPriceOfferSupplier = [];

        for (var i = 0; i < multiDataItems.length; i++) {
            var detail = {
                FK_PaySupplierId: multiDataItems[i].id,
            }
            purPriceOfferSupplier.push(detail);
        }

        var table = $("#PurPriceOfferGrid").data("kendoGrid").dataSource.data();
        if (table.length == 0) {
            swal({
                title: Resources.GridLengthZeroResource,
                confirmButtonText: Resources.DoneResource,
                type: "error"
            });

        }
        if (table.length > 0) {
            var purPriceOfferDetail = [];
            for (var i = 0; i < table.length; i++) {
                var detail = {
                    Id: table[i].id,
                    FK_StItemId: table[i].fK_StItemId,
                    FK_StUnitId: table[i].fK_StUnitId,
                    FK_StMainCategoryId: table[i].fK_StMainCategoryId,
                    Quantity: table[i].quantity,
                    FK_PurPriceOfferId: table[i].fK_PurPriceOfferId,
                }
                debugger
                purPriceOfferDetail.push(detail);
            }
            var purPriceOffer = {
                Id: $("#Id").val(),
                SerialNumber: $("#SerialNumber").val(),
                FK_PayLookupsId: $("#FK_PayLookupsId").val(),
                FK_HrDepartmentId: $("#FK_HrDepartmentId").val(),
                OfferDate: $("#OfferDate").val(),
                FK_StStatusId: $("#FK_StStatusId").val(),
                FK_DefCurrencyId: $("#FK_DefCurrencyId").val(),
                MeansOfSendingOffer: $("#MeansOfSendingOffer").val(),
                ExpireAfter: $("#ExpireAfter").val(),
                FK_PeriodTypeId: $("#FK_PeriodTypeId").val(),
                Description: $("#Description").val(),
                hdnAttachmentIds: $("#hdnAttachmentIds").val(),
                details: purPriceOfferDetail,
                suppliers: purPriceOfferSupplier
            }
            debugger
            $.ajax({
                url: '/PurPriceOffer/Edit',
                type: 'POST',
                data: { purPriceOfferVM: purPriceOffer },
                success: function (result) {
                    if (result>0) {
                        swal({
                            title: Resources.SavedSuccessfullyResource,
                            confirmButtonText: Resources.DoneResource,
                            type: "success"
                        });
                        document.location = "../../PurPriceOffer/Index";
                    } else {
                        swal({
                            title: Resources.ErrorMsgResource,
                            confirmButtonText: Resources.DoneResource,
                            type: "success"
                        });
                    }
                }
            })
        }
    })

    $(".btnExport").on('click', function () {
        $("#PurPriceOfferGrid").getKendoGrid().saveAsExcel();
    });


    $(".btnPrint").on('click', function () {
        var url = "/PurPriceOffer/Print?id=" + $("#Id").val();
        window.open(url, '_blank');
    });
})

