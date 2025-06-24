sap.ui.define(
  ["sap/ui/core/mvc/Controller", "../model/models", "sap/ui/core/Fragment"],
  function (Controller, Model, Fragment) {
    "use strict";

    return Controller.extend("employeemanagement.controller.DetailEmployee", {
      onInit: function () {
        const oRouter = this.getOwnerComponent().getRouter();
        oRouter
          .getRoute("DetailEmployee")
          .attachPatternMatched(this._onRouteMatched, this);

        // Set edit mode
        this._bEditMode = false;
        this._oOriginalData = null;
      },

      _onRouteMatched: async function (oEvent) {
        const sId = oEvent.getParameter("arguments").id;
        const oODataModel = this.getOwnerComponent().getModel("EmployeeModel");

        const sPath = `/Employees('${sId}')`;

        try {
          // Bind context and request the object from OData V4
          const oContext = oODataModel.bindContext(sPath, undefined, {
            parameters: {
              $expand: "role,department",
            },
          });

          const oData = await oContext.requestObject();

          if (oData) {
            // Set it into a JSONModel for the view
            let oViewModel = this.getView().getModel("EmployeeDetail");
            if (!oViewModel) {
              oViewModel = new sap.ui.model.json.JSONModel();
              this.getView().setModel(oViewModel, "EmployeeDetail");
            }

            // You can enrich or transform oData here if needed
            oViewModel.setData(oData);
          } else {
            sap.m.MessageToast.show("Employee not found.");
          }
        } catch (error) {
          console.error("Failed to load employee:", error);
          sap.m.MessageBox.error("Error loading employee data.");
        }
      },

      // Press Input Form button
      onInputForm: function (oEvent) {
        // Refresh detail and reset UI
        this._bEditMode = false;
        this._setInputsEditable(false);
        this._toggleButtons(false);
        // Navigate to Create Employee Page
        const oRouter = this.getOwnerComponent().getRouter();
        oRouter.navTo("CreateEmployee");
      },

      // Press Employee List button
      onEmpList: function (oEvent) {
        // Refresh detail and reset UI
        this._bEditMode = false;
        this._setInputsEditable(false);
        this._toggleButtons(false);
        // Navigate to Overview Page
        const oRouter = this.getOwnerComponent().getRouter();
        oRouter.navTo("OverviewPage");
      },

      // Press Master Data button
      onMasterData: function () {
        // Refresh detail and reset UI
        this._bEditMode = false;
        this._setInputsEditable(false);
        this._toggleButtons(false);
        // Navigate to Master data Page
        const oRouter = this.getOwnerComponent().getRouter();
        oRouter.navTo("MasterDataPage");
      },

      // Switch to edit mode
      onEditPress: function () {
        this._bEditMode = true;
        const oView = this.getView();

        // Save original data to revert if needed
        this._oOriginalData = JSON.parse(
          JSON.stringify(oView.getModel("EmployeeDetail").getData())
        );

        // Enable inputs: find inputs by IDs and set editable
        this._setInputsEditable(true);

        // Toggle buttons visibility
        this._toggleButtons(true);
      },

      // Cancel editing
      onCancelPress: function () {
        this._bEditMode = false;
        const oView = this.getView();

        // Revert data
        oView.getModel("EmployeeDetail").setData(this._oOriginalData);

        // Disable inputs
        this._setInputsEditable(false);

        // Toggle buttons
        this._toggleButtons(false);
      },

      // Validate form
      _validateRequiredFields: function () {
        const oView = this.getView();
        let bValid = true;

        const aFields = [
          oView.byId("name"), // first name
          oView.byId("name2"), // last name
          oView.byId("gender"), // gender
          oView.byId("dob"), // date of birth
          oView.byId("department"), // department
          oView.byId("hireDate"), // hire date
          oView.byId("role"), // role
          oView.byId("email"), // email
        ];

        aFields.forEach(function (oField) {
          const sValue = oField.getValue?.() || oField.getSelectedKey?.();

          if (!sValue) {
            oField.setValueState("Error");
            oField.setValueStateText("This field is required");
            bValid = false;
          } else {
            oField.setValueState("None");
          }
        });

        return bValid;
      },

      // When mail change
      onEmailChange: function (oEvent) {
        const sEmail = oEvent.getParameter("value").trim();
        const oInput = oEvent.getSource();

        const bValid = this._validateEmail(sEmail);

        if (!bValid) {
          oInput.setValueState("Error");
          oInput.setValueStateText("Please enter a valid email address.");
        } else {
          oInput.setValueState("None");
        }
      },

      // Validate Email
      _validateEmail: function (email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
      },

      // Update button pressed
      onUpdatePress: function () {
        const oView = this.getView();

        // Run required field validation
        const bValid = this._validateRequiredFields();

        if (!bValid) {
          sap.m.MessageToast.show("Please fill all required fields.");
          return;
        }

        // Check hire date is not in future
        const sHireDate = oView.byId("hireDate").getValue().trim();
        if (sHireDate) {
          const hireDate = new Date(sHireDate);
          const today = new Date();
          today.setHours(0, 0, 0, 0);

          if (hireDate > today) {
            sap.m.MessageToast.show("Hire Date cannot be in the future.");
            return;
          }
        }

        // Check email
        const sEmail = oView.byId("email").getValue().trim();
        const bValidEmail = this._validateEmail(sEmail);

        if (!bValidEmail) {
          const oEmailField = oView.byId("email");
          oEmailField.setValueState("Error");
          oEmailField.setValueStateText("Please enter a valid email address.");
          sap.m.MessageToast.show("Please enter a valid email address.");
          return;
        } else {
          oView.byId("email").setValueState("None");
        }

        // Open confirmation dialog
        this._openConfirmDialog({
          title: "Confirm Update",
          message: "Are you sure you want to update this employee?",
          state: "Information",
          confirmText: "Update",
          cancelText: "Cancel",
        });
      },

      // Open Confim fragment
      _openConfirmDialog: function (oParams) {
        if (!this._oConfirmDialog) {
          Fragment.load({
            id: this.getView().getId(),
            name: "employeemanagement.view.fragment.ConfirmDialog",
            controller: this,
          }).then(
            function (oDialog) {
              this._oConfirmDialog = oDialog;
              this.getView().addDependent(oDialog);
              this._setDialogProperties(oParams);
              oDialog.open();
            }.bind(this)
          );
        } else {
          this._setDialogProperties(oParams);
          this._oConfirmDialog.open();
        }
      },

      // Convert Date
      _convertToISODate: function (sDate) {
        if (!sDate) return null;
        const parts = sDate.split("-");
        if (parts.length !== 3) return null;
        // parts = [dd, MM, yyyy]
        const isoDate = `${parts[2]}-${parts[1]}-${parts[0]}`;
        return isoDate; // yyyy-MM-dd
      },

      // Set Dialog Properties
      _setDialogProperties: function (oParams) {
        const oDialogModel = new sap.ui.model.json.JSONModel({
          dialogTitle: oParams.title,
          dialogMessage: oParams.message,
          dialogState: oParams.state,
          confirmText: oParams.confirmText,
          cancelText: oParams.cancelText,
        });
        this._oConfirmDialog.setModel(oDialogModel, "dialog");
      },

      //Update employee
      _handleEmployeeUpdate: async function () {
        const oView = this.getView();
        const oDetailModel = oView.getModel("EmployeeDetail");
        const oData = { ...oDetailModel.getData() };
        const sEmployeeID = oData.ID;

        if (!sEmployeeID) {
          throw new Error("Employee ID is required.");
        }

        // Remove read-only or backend-managed fields
        delete oData.ID;
        delete oData.createdAt;
        delete oData.__metadata;

        // Convert dates to valid ISO format
        if (oData.dateOfBirth) {
          const dob = new Date(oData.dateOfBirth);
          if (!isNaN(dob)) oData.dateOfBirth = dob.toISOString().slice(0, 10);
        }

        if (oData.hireDate) {
          const hireDate = new Date(oData.hireDate);
          if (!isNaN(hireDate))
            oData.hireDate = hireDate.toISOString().slice(0, 10);
        }
        try {
          // Use correct OData format
          const sUrl = `/odata/v4/employee/Employees('${sEmployeeID}')`;

          const response = await fetch(sUrl, {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(oData),
          });

          if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Update failed (${response.status}): ${errorText}`);
          }

          sap.m.MessageToast.show("Employee updated successfully");
        } catch (err) {
          console.error("Failed to update employee:", err);
          sap.m.MessageBox.error(
            "Failed to update employee:\n" + (err.message || "")
          );
        }
        // Refresh detail and reset UI
        this._refreshEmployeeDetail(sEmployeeID);
        this._bEditMode = false;
        this._setInputsEditable(false);
        this._toggleButtons(false);
      },

      // On confirm Update
      onConfirm: function () {
        this._handleEmployeeUpdate();
        this._oConfirmDialog.close();
      },

      // On confirm close Update
      onCancel: function () {
        this._oConfirmDialog.close();
      },

      // Utility: enable/disable inputs by ID
      _setInputsEditable: function (bEditable) {
        const oView = this.getView();
        [
          "name",
          "name2",
          "dob",
          "gender",
          "department",
          "hireDate",
          "role",
          "email",
        ].forEach((id) => {
          const oControl = oView.byId(id);
          if (oControl && oControl.setEditable) {
            oControl.setEditable(bEditable);
          }
        });
      },

      // Utility: toggle button visibility for edit/update/cancel
      _toggleButtons: function (bEditMode) {
        const oView = this.getView();
        oView.byId("btnEdit").setVisible(!bEditMode);
        oView.byId("btnUpdate").setVisible(bEditMode);
        oView.byId("btnCancel").setVisible(bEditMode);
      },

      // Utility: refresh employee detail model data after update
      _refreshEmployeeDetail: async function (sEmployeeID) {
        try {
          const oView = this.getView();
          const oModel = oView.getModel("EmployeeModel");
          const sPath = `/Employees('${sEmployeeID}')`;

          // Create a context binding and request the object
          const oContextBinding = oModel.bindContext(sPath);
          const oContext = await oContextBinding.requestObject();

          // Update the EmployeeDetail model with fresh data
          oView.getModel("EmployeeDetail").setData(oContext);
        } catch (oError) {
          console.error("Failed to refresh employee details", oError);
          sap.m.MessageBox.error("Failed to refresh employee details.");
        }
      },

      // Validate for comboBox
      onRoleChange: function (oEvent) {
        const oComboBox = oEvent.getSource();
        const sInputValue = oComboBox.getValue().trim();
        const aItems = oComboBox.getItems();

        let bMatchFound = false;
        let sMatchedKey = null;

        for (let i = 0; i < aItems.length; i++) {
          const oItem = aItems[i];
          if (oItem.getText().toLowerCase() === sInputValue.toLowerCase()) {
            bMatchFound = true;
            sMatchedKey = oItem.getKey();
            break;
          }
        }

        if (bMatchFound) {
          oComboBox.setValueState("None");
          oComboBox.setSelectedKey(sMatchedKey); // update the selectedKey if needed
        } else {
          oComboBox.setValueState("Error");
          oComboBox.setValueStateText(
            "Invalid selected. Please choose from the list."
          );
          oComboBox.setSelectedKey(""); // clear invalid key
        }
      },
    });
  }
);
