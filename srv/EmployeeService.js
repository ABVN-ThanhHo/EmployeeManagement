module.exports = cds.service.impl(async function () {
  const { Employees, Departments, Roles } = this.entities;

  this.on("calculateSalary", async (req) => {
    const employeeID = req.params[0].ID;

    // Get employee and role base salary
    const employee = await cds
      .transaction(req)
      .run(
        SELECT.one
          .from(Employees)
          .columns("hireDate", "role_ID")
          .where({ ID: employeeID })
      );

    if (!employee) {
      return req.error(404, "Employee not found");
    }

    const role = await cds
      .transaction(req)
      .run(
        SELECT.one
          .from(Roles)
          .columns("baseSalary")
          .where({ ID: employee.role_ID })
      );

    if (!role) {
      return req.error(404, "Role not found");
    }

    const baseSalary = parseFloat(role.baseSalary) || 0;

    // Calculate years of service
    const hireDate = new Date(employee.hireDate);
    const now = new Date();
    let yearsOfService = now.getFullYear() - hireDate.getFullYear();

    // Adjust if current date is before hire anniversary
    const monthDiff = now.getMonth() - hireDate.getMonth();
    const dayDiff = now.getDate() - hireDate.getDate();
    if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
      yearsOfService--;
    }

    const bonus = yearsOfService * 1000;
    const totalSalary = baseSalary + bonus;

    return totalSalary;
  });
});
