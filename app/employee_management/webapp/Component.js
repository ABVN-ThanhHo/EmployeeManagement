sap.ui.define(
  ["sap/ui/core/UIComponent", "employeemanagement/model/models"],
  (UIComponent, models) => {
    "use strict";

    return UIComponent.extend("employeemanagement.Component", {
      metadata: {
        manifest: "json",
        interfaces: ["sap.ui.core.IAsyncContentCreation"],
      },

      async init() {
        // call the base component's init function
        UIComponent.prototype.init.apply(this, arguments);

        // Load master data model
        const masterDataModel = await models.createMasterDataModel();
        this.setModel(masterDataModel, "MasterDataModel");

        // enable routing
        this.getRouter().initialize();
      },
    });
  }
);
