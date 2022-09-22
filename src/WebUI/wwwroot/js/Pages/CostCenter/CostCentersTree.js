$(document).ready(function () {
   
    loadCostCentersTree();
    function loadCostCentersTree() {
        accountData = new kendo.data.HierarchicalDataSource({
            transport: {
                read: {
                    url: "/CostCenter/GetCostCentersTree"
                }
            },
            schema: {
                model: {
                    id: "id",
                    hasChildren: "hasChildren"                    
                }
            }
        });
        $("#gridTreeCostCenter").kendoTreeView({
            dataSource: accountData,
            dataTextField: "costCenterNameAr"
        });
    }
})