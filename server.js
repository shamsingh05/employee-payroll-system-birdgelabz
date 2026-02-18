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
  const employees = await readEmployees();
  res.render("index", { employees });
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

app.listen(PORT, async () => {
  console.log(`Server running on http://localhost:${PORT}`);

  const employees = await readEmployees();
  console.log("Employees data: ");
  console.log(employees);
});
