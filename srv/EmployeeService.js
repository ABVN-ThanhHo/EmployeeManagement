module.exports = cds.service.impl(async function () {
  const { Employees, Departments, Roles } = this.entities;

  //
  // this.on("READ", Employees, async (req) => {
  //   const tx = cds.transaction(req);
  //   const { Employees, Roles } = tx.entities("my.company");
  //   const emps = await tx.run(
  //     SELECT.from(Employees)
  //       .columns("*", {
  //         salary:
  //           Roles.baseSalary +
  //           { "+": { val: 1000, mul: { years: { now: "hireDate" } } } },
  //       })
  //       .join(Roles)
  //       .on("role = Roles.ID")
  //   );
  //   return emps.map((emp) => {
  //     const years = Math.floor(
  //       (new Date() - new Date(emp.hireDate)) / (365 * 24 * 60 * 60 * 1000)
  //     );
  //     emp.salary = Number(emp.baseSalary) + 1000 * years;
  //     return emp;
  //   });
  // });

  // Calculate Salary
  // this.on("calculateSalary", Employees, ({ hireDate }) => {
  //   const years = Math.floor(
  //     (Date.now() - new Date(hireDate)) / (365 * 24 * 60 * 60 * 1000)
  //   );
  //   // fetch baseSalary
  //   return srv.tx
  //     .run(
  //       SELECT.one
  //         .from("my.company.Roles")
  //         .columns("baseSalary")
  //         .where({ ID: this.hireDate.role_ID })
  //     )
  //     .then((role) => Number(role.baseSalary) + 1000 * years);
  // });
});
