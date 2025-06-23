sap.ui.define(
    ["sap/ui/model/json/JSONModel", "sap/ui/Device"],
    function (JSONModel, Device) {
      "use strict";
  
      return {
        /**
         * Provides runtime information for the device the UI5 app is running on as a JSONModel.
         * @returns {sap.ui.model.json.JSONModel} The device model.
         */
        createDeviceModel: function () {
          var oModel = new JSONModel(Device);
          oModel.setDefaultBindingMode("OneWay");
          return oModel;
        },
  
        /**
         * set Model to View
         * @param {*} oView : View to be set model
         * @param {*} oData : DataModel
         * @param {*} sModelName : Model Name
         */
        _setModel: function (oView, oModel, sModelName) {
          oView.setModel(new JSONModel(oModel), sModelName);
        },
  
        /**
         * get Model from View
         * @param {*} oView : View to be get model
         * @param {*} sModelName : Model Name
         */
        _getModel: function (oView, sModelName) {
          let oModel = oView.getModel(sModelName);
          return oModel;
        },
  
        getEmployeeModel: function () {
          const oEmployee = {
            id: 0,
            name: "",
            department: "",
            email: "",
            level: "",
            gender: "",
            dob: "",
            wfrom: "",
          };
          return oEmployee;
        },
      };
    }
  );
  