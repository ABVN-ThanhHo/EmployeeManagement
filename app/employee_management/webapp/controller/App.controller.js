sap.ui.define(["sap/ui/core/mvc/Controller"], (BaseController) => {
  "use strict";

  return BaseController.extend("employeemanagement.controller.App", {
    onInit() {
      const data = [
        {
          id: 1,
          name: "Alice",
          department: "IT",
          email: "Alice@email.com",
          level: "Jr.Specialist",
          gender: "Male",
          dob: "2001/12/03",
          wfrom: "2025/12/03",
          certificates: ["abc.pdf", "haha.png"],
        },
        {
          id: 2,
          name: "Jane",
          department: "HR",
          email: "Jane@email.com",
          level: "Specialist",
          gender: "Female",
          dob: "2001/03/03",
          wfrom: "2022/01/03",
          certificates: ["htd.pdf"],
        },
      ];

      // Set data to global model EmployeeModel
      const oModel = this.getOwnerComponent().getModel("EmployeeModel");
      oModel.setData({ employees: data });
    },

    onNavToOverview: function () {
      this.getOwnerComponent().getRouter().navTo("Overview");
    }
  });
});
