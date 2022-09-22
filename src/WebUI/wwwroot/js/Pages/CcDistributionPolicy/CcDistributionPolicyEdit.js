$().ready(function () {
    var url = window.location.pathname;
    var id = url.substring(url.lastIndexOf('/') + 1);
 

    if (!$('#isActive').is(':checked'))
        $(".isActive").removeAttr('disabled');

    var costCenterDataSource = new kendo.data.DataSource({
        serverFiltering: true,
        type: "json",
        transport: {
            read: {
                url: "/CostCenter/GetAllAutoCompleteBySearch"
            },
            parameterMap: function (data, action) {
                if (action === "read") {
                    return {
                        code: data.filter.filters[0].value
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

                    costCenterCode: {
                        type: "string"
                    }
                }
            }
        }
    });
    $("#costCenterAutoComplete").kendoAutoComplete({

        dataSource: costCenterDataSource,
        select: onSelectCostCenter,
        change: onChangeCostCenter,
        headerTemplate: '<div class="dropdown-header k-widget k-header">' +
            '<span style="margin-left:25px">' + Resources.CostCenterCodeCCResource + ' </span>' +
            '<span>' + Resources.CostCenterNameCCResource + '</span>' +

            '</div>',
        template: '<span style="margin-left:110px">#: data.costCenterCode #</span>' +
            '<span>#: data.costCenterNameAr #</span>',
        dataTextField: "costCenterCode",
        dataValueField: "id",
        filter: "contains",
        minLength: 1,
        placeholder: Resources.AutocompleateChoose
    });

    function onSelectCostCenter(e) {
        $("#CostCenterId").val(e.dataItem.id);
        $("#CostCenterName").val(e.dataItem.costCenterNameAr);
    }
    function onChangeCostCenter(e) {
        var code = this.value();

        $.ajax({
            type: "POST",
            url: "/CostCenter/CheckCostCenterExist?code=" + code,
            data: "name=John&location=Boston",
            dataType: "json",
            success: function (response) {

                if (response != null) {
                    $("#CostCenterId").val(response.id);
                    $("#CostCenterName").val(response.costCenterNameAr);

                } else {
                    $("#CostCenterId").val(null);
                    $("#CostCenterName").val(null);
                    swal({
                        title: Resources.CostCenterCodeNotFoundResource,
                        confirmButtonText: Resources.DoneResource,
                        type: "error"
                    });
                }

            }
        });
    }

    // Grid

    LoadGridDistributionPolicyDetails();
    function LoadGridDistributionPolicyDetails() {
        tempSource = new kendo.data.DataSource({
            transport: {
                read: {
                    url: "/CcDistributionPolicy/GetExchangeBondDetailsById?id=" + id,
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
                        fK_CostCenterId: { editable: false },
                        costCenterCode: { type: "text", editable: false },
                        costCenterName: { type: "text", editable: false },
                        distributionValue: { type: "number", editable: false },
                        distributionPercent: { type: "number", editable: false }
                    }
                }
            }
        });
        var gridBound = $("#GridDistributionPolicyDetails").kendoGrid({
            dataSource: tempSource,
            navigatable: true,
            pageable: false,
            columns: [

                { field: "fK_CostCenterId", hidden: true },
                { field: "costCenterCode", width: Resources.CodeWidth, title: Resources.CostCenterCodeCCResource },
                { field: "costCenterName", width: Resources.NameWidth, title: Resources.CostCenterNameCCResource },
                { field: "distributionValue", title: Resources.DistributionValueResource, width: Resources.AmountWidth },
                { field: "distributionPercent", title: Resources.DistributionPercentResource, width: Resources.AmountWidth },
                { width: Resources.ActionWidth, template: "<a  class='btn btn-danger btn-sm btnDelete' ><i class='fas fa-trash-alt'></i></a>" }
            ],
            editable: true,
            selectable: "multiple, cell",
            noRecords: true,
            messages: {
                noRecords: Resources.GridNoRecordsMessage
            },

        });
        gridBound.data("kendoGrid").table.on("click", ".btnDelete", removeDistributionPolicyDetailRow);
    }
    function removeDistributionPolicyDetailRow() {

        var row = $(this).closest("tr"),
            grid = $("#GridDistributionPolicyDetails").data("kendoGrid"),
            dataItem = grid.dataItem(row),
            detailId = dataItem.id,
            dataSource = $("#GridDistributionPolicyDetails").data("kendoGrid").dataSource;
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

            if (detailId != "" && detailId != null) {
                setTimeout(function () {
                    $.ajax({
                        url: "/CcDistributionPolicy/DeleteDistributionPolicyDetail?id=" + detailId,
                        type: "Get",
                        contentType: 'application/json; charset=utf-8',
                        success: function (result) {

                            if (result) {
                                dataSource.remove(dataItem)
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
            } else {
                setTimeout(function () {

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
            }
        });


    }
    $("#btnAddDistributionDetail").on('click', function () {

        var FK_CostCenterId = $("#CostCenterId").val(),
            costCenterCode = $("#costCenterAutoComplete").val(),
            costCenterName = $("#CostCenterName").val(),
            distributionValue = $("#DistributionValue").val(),
            distributionPercent = $("#DistributionPercent").val();


        if (FK_CostCenterId == "" || isNaN(FK_CostCenterId)) {

            swal({
                title: Resources.ChooseCostCenterResource,
                confirmButtonText: Resources.DoneResource,
                type: "error"
            });
        }
        else if (distributionValue == "") {

            swal({
                title: Resources.DistributionValueRequiredResource,
                confirmButtonText: Resources.DoneResource,
                type: "error"
            });
        }
        else if (distributionPercent == "") {

            swal({
                title: Resources.DistributionPercentRequiredResource,
                confirmButtonText: Resources.DoneResource,
                type: "error"
            });
        }
        else {
            tempSource.insert(0, {
                fK_CostCenterId: FK_CostCenterId,
                costCenterCode: costCenterCode,
                costCenterName: costCenterName,
                distributionValue: distributionValue,
                distributionPercent: distributionPercent,
            });


            $("#CostCenterId").val("");
            $("#CostCenterName").val("");
            $("#DistributionPercent").val("");
            $("#DistributionValue").val("");
            $("#costCenterAutoComplete").val("");
        }


    });
});



$("input[name='IsActive']").on('click', function () {
    if ($("input[name='IsActive']:checked").val() == "true") {
        $(".isActive").attr("disabled", "disabled");
        $(".isActive").val(null);
    }
    else {
        $(".isActive").removeAttr('disabled');
        $(".isActive").val(null);
    }

});

$("#DistributionValue").keyup(function () {
    var distributionValue = parseFloat($(this).val()),
        gross = parseFloat($("#Gross").val());

    if (!isNaN(distributionValue) && !isNaN(gross)) {
        var result = (distributionValue / gross) * 100;
        $("#DistributionPercent").val(result);
    }

});

$("#DistributionPercent").keyup(function () {
    var distributionPercent = parseFloat($(this).val()),
        gross = parseFloat($("#Gross").val());

    if (!isNaN(distributionPercent) && !isNaN(gross)) {
        var result = gross / distributionPercent;
        $("#DistributionValue").val(result);
    }

});

function SubmitDistributionPolicyEdit() {
    if ($("#DistributionPolicyEditForm").valid()) {
        var listDetails = [];
        var gridData = $('#GridDistributionPolicyDetails').data("kendoGrid").dataSource.data();

        if (gridData.length == 0) {
            swal({
                title: Resources.GridLengthZeroResource,
                confirmButtonText: Resources.DoneResource,
                type: "error"
            });
        }
        else {
            for (var i = 0; i < gridData.length; i++) {
                if (gridData[i].id == "") {
                    var detail = {
                        Id: 0,
                        FK_CostCenterId: parseInt(gridData[i].fK_CostCenterId),
                        DistributionPercent: parseFloat(gridData[i].distributionPercent),
                        DistributionValue: parseFloat(gridData[i].distributionValue),
                    };
                    listDetails.push(detail);
                }

            }
          
            var isActive = $("input[name='IsActive']:checked").val();
            if (isActive == "true")
                isActive = true;
            else
                isActive = false;

            var Obj = {
                Id: parseInt($("#Id").val()),
                PolicyCode: $("#PolicyCode").val(),
                PolicyNameAr: $("#PolicyNameAr").val(),
                PolicyNameEn: $("#PolicyNameEn").val(),
                Description: $("#Description").val(),
                Gross: parseFloat($("#Gross").val()),
                IsActive: isActive,
                FK_DefFreezingReasonId: parseInt($("#FK_DefFreezingReasonId").val()),
                FreezingReasons: $("#FreezingReasons").val(),
                hdnAttachmentIds: $("#hdnAttachmentIds").val(),
                ListDetails: listDetails
            };
            debugger;
            $.ajax({
                url: "/CcDistributionPolicy/Edit",
                type: "Post",
                cache: false,
                processData: false,
                data: JSON.stringify(Obj),
                contentType: 'application/json',
                success: function (result) {

                    if (result) {

                        swal({
                            title: Resources.SavedSuccessfullyResource,
                            confirmButtonText: Resources.DoneResource,
                            type: "success"
                        }, function () {
                            window.location.href = '/CcDistributionPolicy/Index';
                        });
                    }
                    else {
                        swal({
                            title: Resources.DefaultErrorMessageResource,
                            confirmButtonText: Resources.DoneResource,
                            type: "error"
                        });
                    }
                }
            });
        }


    }

}