sap.ui.define(
    ["sap/ui/core/mvc/Controller", "../model/models", "sap/m/MessageToast"],
    (Controller, Model) => {
      "use strict";
  
      return Controller.extend("employeemanagement.controller.OverviewPage", {
        onInit() {},
  
        // Press each line item
        onItemPress: function (oEvent) {
          const oRouter = this.getOwnerComponent().getRouter();
  
          // Get selected item
          const oSelectedItem = oEvent.getSource();
  
          // Get binding context path from the selected item using named model "EmployeeModel"
          const sPath = oSelectedItem?.getBindingContext("EmployeeModel").sPath;
  
          // Get model data using the path
          const oEmpInfo = this.getOwnerComponent()
            .getModel("EmployeeModel")
            .getProperty(sPath);
  
          // Navigate to "detail" route with employee ID
          oRouter.navTo("DetailEmployee", {
            id: oEmpInfo.id,
          });
        },
  
        // Press Input Form button
        onInputForm: function (oEvent) {
          const oRouter = this.getOwnerComponent().getRouter();
          oRouter.navTo("CreateEmployee");
        },
  
        // Press Employee List button
        onEmpList: function (oEvent) {
          const oRouter = this.getOwnerComponent().getRouter();
          oRouter.navTo("OverviewPage");
        },
  
        // Filter function
        onFilterChange: function () {
          const oView = this.getView();
  
          // Get filter values
          const sDepartment = oView.byId("departmentFilter").getSelectedKey();
          const sLevel = oView.byId("levelFilter").getSelectedKey();
  
          // Build filters
          const aFilters = [];
          if (sDepartment) {
            aFilters.push(
              new sap.ui.model.Filter(
                "department",
                sap.ui.model.FilterOperator.EQ,
                sDepartment
              )
            );
          }
          if (sLevel) {
            aFilters.push(
              new sap.ui.model.Filter(
                "level",
                sap.ui.model.FilterOperator.EQ,
                sLevel
              )
            );
          }
  
          // Apply filters to table binding
          const oTable = oView.byId("employeeTable");
          const oBinding = oTable.getBinding("items");
          oBinding.filter(aFilters);
        },
      });
    }
  );
  