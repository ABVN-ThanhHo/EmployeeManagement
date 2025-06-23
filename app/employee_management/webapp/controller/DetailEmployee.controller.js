sap.ui.define(
  ["sap/ui/core/mvc/Controller", "../model/models"],
  function (Controller, Model) {
    "use strict";

    return Controller.extend("employeemanagement.controller.DetailEmployee", {
      onInit: function () {
        const oRouter = this.getOwnerComponent().getRouter();
        oRouter
          .getRoute("DetailEmployee")
          .attachPatternMatched(this._onRouteMatched, this);
      },

      _onRouteMatched: function (oEvent) {
        // Get Id from route
        const sId = oEvent.getParameter("arguments").id;
        const oEmployeeModel = this.getOwnerComponent().getModel("EmployeeModel");
        const aEmployees = oEmployeeModel.getProperty("/employees");

        // Find the employee by ID
        const oEmployee = aEmployees.find((emp) => emp.id === parseInt(sId));

        if (oEmployee) {
          // Create view model if it doesn't exist
          let oViewModel = this.getView().getModel("EmployeeDetail");
          if (!oViewModel) {
            oViewModel = new sap.ui.model.json.JSONModel();
            this.getView().setModel(oViewModel, "EmployeeDetail");
          }
          // Set employee data to view model
          oViewModel.setData(oEmployee);
        } else {
          // Handle case where employee not found
          sap.m.MessageToast.show("Employee not found.");
        }
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
    });
  }
);
