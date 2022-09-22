$(document).ready(function () {

    

    //Active in Create
    $('input[type=radio][name=IsActive]').change(function () {
        if (this.value == "True") {
            $(".disabled-input").attr("disabled", "disabled");
            $("#FK_DefFreezingReasonId").val("");
            $("#FreezingReasons").val("");
        }
        else
            $(".disabled-input").removeAttr('disabled');
    });
    //Active In Edit
    var activeVal = $('input[name="IsActive"]:checked').val();
    if (activeVal == "False") {
        $(".disabled-input").removeAttr('disabled');
    }
    var url = document.URL;
    var id = url.substring(url.lastIndexOf('/') + 1);
    //alert(id); 
    var url = "/TaxReturn/GetDetailsById?id=" + id;
    loadAllReturnDetail();
    function loadAllReturnDetail() {
        $("#gridTaxReturnDetail").kendoGrid({
            dataSource: {
                //type: "jsonp",
                transport: {
                    read: url
                },
                schema: {
                    model: {
                        id: "id",
                        fields: {
                            accountCode: { type: "string" },
                            accountNameAr: { type: "string" },
                            //total: { type: "string" }
                        }
                    }
                },
                //pageSize: 30
            },
            height: Resources.GridHeight,
            scrollable: true,
            noRecords: Resources.GridNoRecords,
            messages: {
                noRecords: Resources.GridNoRecordsMessage
            },
            //pageable: true,
            columns: [
                //{
                //    title: 'Select All',
                //    headerTemplate: "<input type='checkbox' id='header-chb' class='k-checkbox header-checkbox'><label class='k-checkbox-label' for='header-chb'></label>",
                //    template: function (dataItem) {
                //        return "<input type='checkbox' id='" + dataItem.id + "' class='k-checkbox row-checkbox'><label class='k-checkbox-label' for='" + dataItem.id + "'></label>";
                //    },
                //    width: 20
                //},
                {
                    field: "accountCode",
                    title: Resources.Code,
                    width: 30
                },
                {
                    field: "accountNameAr",
                    title: Resources.NameArResource,
                    width: 40
                },
                //{
                //    field: "total",
                //    title: resources.total,
                //    width: 40
                //},
                
                { width: "40px", template: "<input type='text' data-bind='value:glAccountGross' readonly maxlength='40'/>", headerTemplate: Resources.Total, validation: { max: 100 } }
                ,

                { width: "40px", template: "<input type='number' data-bind='value:adjustmentAmount' readonly maxlength='40'/>", headerTemplate: Resources.AdjustmentAmount, validation: { max: 100 } }
                ,

                { width: "40px", template: "<input type='number' data-bind='value:glAccountTax' readonly maxlength='40'/>", headerTemplate: Resources.GlAccountTax, validation: { max: 100 } }

            ],
            dataBound: function (e) {
                e.sender.items().each(function () {
                    var dataItem = e.sender.dataItem(this);
                    kendo.bind(this, dataItem);
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
  

    //bind click event to the checkbox

});

var checkedIds = {};

//on click of the checkbox:


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
