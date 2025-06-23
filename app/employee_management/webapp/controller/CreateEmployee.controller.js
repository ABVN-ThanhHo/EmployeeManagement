sap.ui.define(
  ["sap/ui/core/mvc/Controller", "../model/models", "sap/ui/core/Fragment"],
  function (Controller, Model, Fragment) {
    "use strict";

    return Controller.extend("employeemanagement.controller.CreateEmployee", {
      onInit: function () {
        this.getView().setModel(
          new sap.ui.model.json.JSONModel({
            avatarSrc: "",
          }),
          "viewModel"
        );
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

      // Click Avatar
      onAvatarPress: function () {
        const oUploader = this.byId("fileUploader");
        oUploader.setValue(""); //
        oUploader.getFocusDomRef().click();
      },

      onUploadImage: function (oEvent) {
        const oFile = oEvent.getParameter("files")[0];
        const oAvatar = this.byId("avatar");

        if (oFile && FileReader) {
          const reader = new FileReader();
          reader.onload = function (e) {
            oAvatar.setSrc(e.target.result);
          };
          reader.readAsDataURL(oFile);
        }
      },

      // Delete avatar
      onDeleteImage: function () {
        const oAvatar = this.byId("avatar");
        oAvatar.setSrc(""); // Remove image
        // Optionally reset to fallback icon by clearing src
      },

      // On email change
      onEmailChange: function (oEvent) {
        const sEmail = oEvent.getParameter("value").trim();
        const oInput = oEvent.getSource();

        const bValid = this._validateEmail(sEmail);

        if (!bValid) {
          oInput.setValueState("Error");
          oInput.setValueStateText("Please enter a valid email address.");
        } else {
          oInput.setValueState("None"); // Clear error
        }
      },

      // Validate email
      _validateEmail: function (email) {
        // Simple email regex
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
      },

      // Add Certificate
      onAddCertificate: function () {
        const oView = this.getView();
        const oInput = oView.byId("newCertificateInput");
        const sValue = oInput.getValue().trim();
        const oListVBox = oView.byId("certificateList");

        if (!sValue) {
          sap.m.MessageToast.show("Please enter a certificate.");
          return;
        }

        // Create a container HBox for each certificate row
        const oHBox = new sap.m.HBox({
          alignItems: "Center",
          justifyContent: "SpaceBetween",
          width: "100%",
          items: [
            new sap.m.Input({
              class: "certification",
              value: sValue,
              editable: false,
              width: "180%",
            }),
            new sap.m.Button({
              icon: "sap-icon://decline",
              type: "Reject",
              tooltip: "Delete certificate",
              width: "10%",
              press: function () {
                oListVBox.removeItem(oHBox);
              },
            }),
          ],
        });

        oListVBox.addItem(oHBox);

        // Clear the input field
        oInput.setValue("");
      },

      // onCertificateChange: function (oEvent) {
      //   const oUploader = oEvent.getSource();
      //   const aFiles = oEvent.getParameter("files");
      //   const oFile = aFiles && aFiles[0];

      //   if (!oFile) {
      //     sap.m.MessageToast.show("No file selected.");
      //     return;
      //   }

      //   const sFileName = oFile.name;
      //   const oList = this.byId("certificateList");

      //   // Check for duplicate filenames
      //   const bExists = oList
      //     .getItems()
      //     .some((item) => item.getItems()[0].getText() === sFileName);
      //   if (bExists) {
      //     sap.m.MessageToast.show("This certificate has already been added.");
      //     oUploader.setValue("");
      //     return;
      //   }

      //   // Add filename to certificate list
      //   const oItem = new sap.m.HBox({
      //     justifyContent: "SpaceBetween",
      //     alignItems: "Center",
      //     items: [
      //       new sap.m.Text({ text: sFileName }),
      //       new sap.m.Button({
      //         icon: "sap-icon://decline",
      //         type: "Transparent",
      //         press: function () {
      //           oList.removeItem(oItem);
      //         },
      //       }),
      //     ],
      //   });

      //   oList.addItem(oItem);
      //   oUploader.setValue("");
      // },

      // onTriggerCertificateUpload: function () {
      //   const oUploader = this.byId("certificateUploader");
      //   oUploader.setValue(""); // Allow selecting same file again
      //   oUploader.getFocusDomRef().click();
      // },

      // Validate required fields
      _validateRequiredFields: function () {
        const oView = this.getView();
        let bValid = true;

        const aFields = [
          oView.byId("name111"),
          oView.byId("gender1"),
          oView.byId("dob1"),
          oView.byId("department1"),
          oView.byId("wfrom1"),
          oView.byId("level1"),
          oView.byId("email1"),
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

      // When press Submit button
      onSubmit: function () {
        // Validate required fields
        if (!this._validateRequiredFields()) {
          sap.m.MessageToast.show("Please fill all required fields.");
          return;
        }

        // Check email
        const sEmail = this.byId("email1").getValue().trim();
        const bValidEmail = this._validateEmail(sEmail);

        if (!bValidEmail) {
          this.byId("email1").setValueState("Error");
          this.byId("email1").setValueStateText(
            "Please enter a valid email address."
          );
          sap.m.MessageToast.show("Please enter a valid email address.");
          return;
        } else {
          this.byId("email1").setValueState("None");
        }

        // Check duplicate certificate
        const oCertListVBox = this.byId("certificateList");
        const aCertInputs = oCertListVBox.getItems();

        const aCertValues = aCertInputs.map(function (oHBox) {
          return oHBox.getItems()[0].getValue().trim().toLowerCase(); // Normalize case
        });

        const hasDuplicates = new Set(aCertValues).size !== aCertValues.length;

        if (hasDuplicates) {
          sap.m.MessageToast.show(
            "Duplicate certificates detected. Please remove or rename them."
          );
          return;
        }

        // Load fragment only once
        if (!this._oConfirmDialog) {
          Fragment.load({
            name: "employeemanagement.view.fragment.ConfirmDialog",
            controller: this,
          }).then(
            function (oDialog) {
              this._oConfirmDialog = oDialog;
              this.getView().addDependent(oDialog);
              oDialog.open();
            }.bind(this)
          );
        } else {
          this._oConfirmDialog.open();
        }
      },

      // Press Close in Confirm dialog
      onCloseDialog: function () {
        this._oConfirmDialog.close();
      },

      // Press OK in Confirm dialog
      onConfirmSubmit: function () {
        const oView = this.getView();
        const oGlobalModel = this.getOwnerComponent().getModel("EmployeeModel");
        const aEmployees = oGlobalModel.getProperty("/employees") || [];

        // Read certificate Inputs from the VBox
        // const oList = oView.byId("certificateList");
        // const aFiles = oList
        //   .getItems()
        //   .map((item) => item.getItems()[0].getText());
        const oCertListVBox = oView.byId("certificateList");
        const aCertInputs = oCertListVBox.getItems(); // Each item is an HBox with Input
        const aCertificates = [];

        aCertInputs.forEach(function (oHBox) {
          const oInput = oHBox.getItems()[0]; // Get the Input from HBox
          const sCertValue = oInput.getValue().trim();
          if (sCertValue) {
            aCertificates.push(sCertValue);
          }
        });

        // Collect form data
        const oNewEmployee = {
          id: Date.now(), // Use timestamp as ID
          name: oView.byId("name111").getValue(),
          gender: oView.byId("gender1").getSelectedKey(),
          dob: oView.byId("dob1").getValue(),
          department: oView.byId("department1").getSelectedKey(),
          wfrom: oView.byId("wfrom1").getValue(),
          level: oView.byId("level1").getSelectedKey(),
          email: oView.byId("email1").getValue(),
          // avatarSrc: oView.getModel("viewModel").getProperty("/avatarSrc") || "",
          certificates: aCertificates,
        };

        // Add new employee to model
        aEmployees.push(oNewEmployee);
        oGlobalModel.setProperty("/employees", aEmployees);

        // Clear form
        this.resetForm();
        // Close dialog
        this._oConfirmDialog.close();

        // Navigate to Overview page
        const oRouter = this.getOwnerComponent().getRouter();
        oRouter.navTo("Overview");
      },

      // Reset form after submission
      resetForm: function () {
        const oView = this.getView();

        // Clear static inputs
        oView.byId("name111").setValue("");
        oView.byId("gender1").setSelectedKey("");
        oView.byId("dob1").setValue("");
        oView.byId("department1").setSelectedKey("");
        oView.byId("wfrom1").setValue("");
        oView.byId("level1").setSelectedKey("");
        oView.byId("email1").setValue("");

        // Reset email validation state
        oView.byId("email1").setValueState("None");

        // Reset avatar image (if you're using a viewModel for it)
        this.getView().getModel("viewModel").setProperty("/avatarSrc", "");

        // Clear certificates
        oView.byId("certificateList").removeAllItems();

        // Clear certificate input
        oView.byId("newCertificateInput").setValue("");
      },
    });
  }
);
