$(document).ready(function () {

    
    var dateFrom = $("#DateFrom").val(),
        dateTo = $("#DateTo").val(),
        fK_StStatusId = $("#FK_StStatusId").val(),
        serialNumber = $("#SerialNumber").val(),
        fK_PaySupplierId = $("#FK_PaySupplierId").val();
    debugger
    url = "/PurPriceOffer/GetAll?dateFrom=" + dateFrom + "&dateTo=" + dateTo + "&fK_PaySupplierId=" + fK_PaySupplierId + "&serialNumber=" + serialNumber + "&fK_StStatusId=" + fK_StStatusId 

    loadPurPriceOfferGrid();

    function loadPurPriceOfferGrid() {
        var dataSource = new kendo.data.DataSource({
            transport: {
                read: {
                    url: url,
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
                        serialNumberText: {editable: false },
                        offerDate: { type: "date", editable: false },
                        responsiblePerson: { editable: false },
                        statusType: { editable: false },

                    }
                }
            }
        });


        var grid = $("#PurPriceOfferGrid").kendoGrid({
            excel: {
                fileName: "Purchase Price Offer.xlsx",
                allPages: Resources.GridAllPages,
                filterable: Resources.GridFilterable
            },
            dataSource: dataSource,
            pageSize: 10,
            serverPaging: Resources.GridServerPaging,
            serverFiltering: Resources.GridServerFiltering,
            filterable: Resources.GridFilterable,
            height: Resources.GridHeight,
            groupable: Resources.GridGroupable,           
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

                { field: "serialNumberText", title: Resources.PurchaseOrderNumber, width: Resources.NameWidth },
                {
                    field: "offerDate", title: Resources.OfferDate, format: "{0:yyyy/MM/dd}", width: Resources.DateWidth,
                    filterable: {
                        operators: {
                            date: {
                                gte: Resources.IsAfterOrEqualTo,
                                lte: Resources.IsBeforeOrEqualTo
                            }
                        },
                        extra: false,
                        ui: function (element) {
                            element.kendoDatePicker({
                                format: '{0: dd/MM/yyyy}'
                            })
                        }
                    }
                },
                { field: "responsiblePerson", title: Resources.ResponsiblePerson, width: Resources.NameWidth },
                { field: "statusType", title: Resources.Status, width: Resources.NameWidth },
                {
                    width: Resources.NoteWidth, template: "<a  href='/PurPriceOffer/Edit/#= id #'  class='btn btn-success btn-sm btnEdit'><i class='fas fa-edit'></i></a>  <a href='/PurPriceOffer/Reject/#= id #' class='btn btn-danger btn-sm btnReject' >" + Resources.Reject + "</a>  <a  href='/PurPriceOffer/Approve/#= id #'  class='btn btn-success btn-sm btnApprove'>" + Resources.Approve + "</a> <a  href='/PurPriceOfferDetailSupplierPrice/Create/#= id #'  class='btn btn-success btn-sm btnAddPrice'>" + Resources.AddPrice + "</a><a  href='/PurPriceOfferDetailSupplierPrice/Compare/#= id #'  class='btn btn-warning btn-sm btnComparePrice'>" + Resources.PriceCompare + "</a>"
                },

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
            resizable: true,
        });

    }

    $("#btnSearch").on('click', function () {        
        var dateFrom = $("#DateFrom").val(),
            dateTo = $("#DateTo").val(),
            fK_StStatusId = $("#FK_StStatusId").val(),
            serialNumber = $("#SerialNumber").val(),
            fK_PaySupplierId = $("#FK_PaySupplierId").val();
        debugger
        url = "/PurPriceOffer/GetAll?dateFrom=" + dateFrom + "&dateTo=" + dateTo + "&fK_PaySupplierId=" + fK_PaySupplierId + "&serialNumber=" + serialNumber + "&fK_StStatusId=" + fK_StStatusId 
        loadPurPriceOfferGrid();


    });

}) 