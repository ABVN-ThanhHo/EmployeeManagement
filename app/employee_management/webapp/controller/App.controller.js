sap.ui.define(["sap/ui/core/mvc/Controller"], (BaseController) => {
  "use strict";

  return BaseController.extend("employeemanagement.controller.App", {
    onInit() {},

    onNavToOverview: function () {
      this.getOwnerComponent().getRouter().navTo("OverviewPage");
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
});
