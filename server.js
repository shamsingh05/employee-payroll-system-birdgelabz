const express = require("express");
const app = express();

const { readEmployees, writeEmployees } = require("./modules/fileHandler");

const PORT = 3000;
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));


// app.get("/",async (req,res)=>{
//   const employees = await readEmployees();
//   res.send(employees);
// })

app.get("/", async (req, res) => {

  let employees = await readEmployees();

  const search = req.query.search;

  if (search) {
    employees = employees.filter(emp =>
      emp.name.toLowerCase().includes(search.toLowerCase()) ||
      emp.department.toLowerCase().includes(search.toLowerCase())
    );
  }

  const totalEmployees = employees.length;

  const departments = new Set(employees.map(emp => emp.department));
  const totalDepartments = departments.size;

  const totalBasicSalary = employees.reduce((sum, emp) => sum + emp.salary, 0);

  const totalTax = employees.reduce((sum, emp) => sum + emp.salary * 0.12, 0);

  const totalNetSalary = totalBasicSalary - totalTax;

  const avgSalary = totalEmployees === 0 ? 0 : totalBasicSalary / totalEmployees;

  res.render("index", {
    employees,
    totalEmployees,
    totalDepartments,
    totalBasicSalary,
    totalTax,
    totalNetSalary,
    avgSalary,
    search
  });
});


app.get("/add", (req, res) => {
  res.render("add");
});

app.post("/add", async (req, res) => {

  const { name, department, salary } = req.body;

  if (!name || !department || salary < 0) {
    return res.send("Invalid input");
  }

  const employees = await readEmployees();

  let newId = 1001;

  if (employees.length > 0) {
    const maxId = Math.max(...employees.map(emp => emp.id));
    newId = maxId + 1;
  }

  const newEmployee = {
    id: newId,
    name,
    department,
    salary: Number(salary)
  };

  employees.push(newEmployee);
  await writeEmployees(employees);

  res.redirect("/");
});

app.get("/delete/:id",async (req,res)=>{
  const id = Number(req.params.id);
  let employees = await readEmployees();
  employees = employees.filter(emp => emp.id !=id);
  await writeEmployees(employees);
  res.redirect("/");
});

app.get("/edit/:id", async (req,res)=>{
  const id = Number(req.params.id);

  const employees = await readEmployees();

  const employee = employees.find(emp => emp.id === id);

  res.render("edit", { employee });
})

app.post("/edit/:id", async (req, res) => {

  const id = Number(req.params.id);
  const { name, department, salary } = req.body;

  let employees = await readEmployees();

  const index = employees.findIndex(emp => emp.id === id);

  if (index !== -1) {
    employees[index].name = name;
    employees[index].department = department;
    employees[index].salary = Number(salary);
  }

  await writeEmployees(employees);

  res.redirect("/");
});


app.listen(PORT, async () => {
  console.log(`Server running on http://localhost:${PORT}`);

  const employees = await readEmployees();
  console.log("Employees data: ");
  console.log(employees);
});
