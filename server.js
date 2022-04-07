//start with the dependencies
const mysql = require("mysql2");
const inquirer = require("inquirer");
require("console.table");

const questions = [
    {
        type: "list",
        name: "task",
        message: "Would you like to do?",
        choices: [
            "View Employees",
            "View Employees by Department",
            "Add Employee",
            "Remove Employees",
            "Update Employee Role",
            "Add Role",
            "End"
        ]  
    }
]


async function choicePrompt() {
    const result = await inquirer.prompt(questions);
    switch (result.task) {
        case "View Employees":
          viewEmployee();
          break;

        case "View Employees by Department":
          viewEmployeeByDepartment();
          break;
      
        case "Add Employee":
          addEmployee();
          break;

        case "Remove Employees":
          removeEmployees();
          break;

        case "Update Employee Role":
          updateEmployeeRole();
          break;

        case "Add Role":
          addRole();
          break;

        case "End":
          connection.end();
          break;
    }
}

function viewEmployee() {
    console.log("Viewing employees\n");
  
    let query =
    `SELECT e.id, e.first_name, e.last_name, r.title, d.name AS department, r.salary, CONCAT(m.first_name, ' ', m.last_name) AS manager
    FROM employee e
    LEFT JOIN role r
    ON e.role_id = r.id
    LEFT JOIN department d
    ON d.id = r.department_id
    LEFT JOIN employee m
    ON m.id = e.manager_id`
   
    connection.query(query, function (err, res) {
        if (err) throw err;
    
        console.table(res);
        console.log("Employees viewed!\n");
    
        choicePrompt();
    });
    
}

function viewEmployeeByDepartment() {
    console.log("Viewing employees by department\n");
  
    let query =
    `SELECT d.id, d.name, r.salary AS budget
    FROM employee e
    LEFT JOIN role r
    ON e.role_id = r.id
    LEFT JOIN department d
    ON d.id = r.department_id
    GROUP BY d.id, d.name`
  
    connection.query(query, function (err, result) {
      if (err) throw err;
  
      const departmentChoices = result.map(data => ({
        value: data.id, name: data.name
      }));
  
      console.table(result);
      console.log("Department view succeed!\n");
  
      promptDepartment(departmentChoices);
    });
}

function promptDepartment(departmentChoices) {

    inquirer
      .prompt([
        {
          type: "list",
          name: "departmentId",
          message: "Which department would you choose?",
          choices: departmentChoices
        }
      ])
      .then(function (answer) {
        console.log("answer ", answer.departmentId);
  
        let query =
        `SELECT e.id, e.first_name, e.last_name, r.title, d.name AS department 
        FROM employee e
        JOIN role r
        ON e.role_id = r.id
        JOIN department d
        ON d.id = r.department_id
        WHERE d.id = ?`
  
        connection.query(query, answer.departmentId, function (err, result) {
          if (err) throw err;
  
          console.table("response ", result);
          console.log(result.affectedRows + "Employees are viewed!\n");
  
          choicePrompt();
        });
      });
}

function addEmployee() {
    console.log("Adding an employee!")
  
    var query =
      `SELECT r.id, r.title, r.salary 
        FROM role r`
  
    connection.query(query, function (err, result) {
      if (err) throw err;
  
      const roleChoices = result.map(({ id, title, salary }) => ({
        value: id, title: `${title}`, salary: `${salary}`
      }));
  
      console.table(result);
      console.log("Role Added!");
  
      promptAddEmployee(roleChoices);
    });
}
  
