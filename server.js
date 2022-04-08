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
exports.choicePrompt = choicePrompt;

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
   
        connection.query(query, (err, result) => {
            if (err) throw err;

            console.table(result);
            console.log("Employees viewed.\n");

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
  
    connection.query(query, (err, result) => {
      if (err) throw err;
  
      const departmentChoices = result.map(data => ({
        value: data.id, name: data.name
      }));
  
      console.table(result);
      console.log("Department view succeed.\n");
  
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
      .then( (answer) => {
        console.log("answer ", answer.departmentId);
  
        let query =
        `SELECT e.id, e.first_name, e.last_name, r.title, d.name AS department 
        FROM employee e
        JOIN role r
        ON e.role_id = r.id
        JOIN department d
        ON d.id = r.department_id
        WHERE d.id = ?`
  
        connection.query(query, answer.departmentId, (err, result) => {
          if (err) throw err;
  
          console.table("response ", result);
          console.log(`${result.affectedRows}Employees are viewed.\n`);
  
          choicePrompt();
        });
    });
}

function addEmployee() {
    console.log("Adding an employee.")
  
    const newLocal = `SELECT r.id, r.title, r.salary 
        FROM role r`;
    let query =
      newLocal
  
    connection.query(query, (err, result) => {
      if (err) throw err;
  
      const roleChoices = result.map(({ id, title, salary }) => ({
        value: id, title: `${title}`, salary: `${salary}`
      }));
  
      console.table(result);
      console.log("Role Added.");
  
      promptAddEmployee(roleChoices);
    });
}
  
function promptAddEmployee(roleChoices) {

    inquirer
      .prompt([
        {
          type: "input",
          name: "first_name",
          message: "What is the employee's first name?"
        },
        {
          type: "input",
          name: "last_name",
          message: "What is the employee's last name?"
        },
        {
          type: "list",
          name: "roleId",
          message: "What is the employee's role?",
          choices: roleChoices
        },
      ])
      .then( (answer) => {
        console.log(answer);
  
        let query = `INSERT INTO employee SET ?`
        connection.query(query,
          {
            first_name: answer.first_name,
            last_name: answer.last_name,
            role_id: answer.roleId,
            manager_id: answer.managerId,
          },
            (err, result) => {
            if (err) throw err;
  
            console.table(result);
            console.log(`${result.insertedRows}Successfully Inserted.\n`);
  
            choicePrompt();
        });
    });
}

function removeEmployees() {
    console.log("Delete an employee");
  
    let query =
      `SELECT e.id, e.first_name, e.last_name
        FROM employee e`
  
    connection.query(query, (err, result) => {
            if (err)
                throw err;

            const deleteEmployeeChoices = res.map(({ id, first_name, last_name }) => ({
                value: id, name: `${id} ${first_name} ${last_name}`
            }));

            console.table(result);
            console.log("ArrayToDelete.\n");

            promptDelete(deleteEmployeeChoices);
        });
}
  
function promptDelete(deleteEmployeeChoices) {
  
    inquirer
      .prompt([
        {
          type: "list",
          name: "employeeId",
          message: "Which employee do you want to remove?",
          choices: deleteEmployeeChoices
        }
      ])
      .then((answer) => {

              let query = `DELETE FROM employee WHERE ?`;
              connection.query(query, { id: answer.employeeId }, function (err, result) {
                if (err)
                throw err;

                  console.table(result);
                  console.log(`${result.affectedRows}Deleted\n`);

                  choicePrompt();
              });
          });
}

function updateEmployeeRole() { 
    employeeArray();
  
  }
  
  function employeeArray() {
    console.log("Updating an employee");
  
    let query =
      `SELECT e.id, e.first_name, e.last_name, r.title, d.name AS department, r.salary, CONCAT(m.first_name, ' ', m.last_name) AS manager
    FROM employee e
    JOIN role r
      ON e.role_id = r.id
    JOIN department d
    ON d.id = r.department_id
    JOIN employee m
      ON m.id = e.manager_id`
  
    connection.query(query, function (err, result) {
      if (err) throw err;
  
      const employeeChoices = result.map(({ id, first_name, last_name }) => ({
        value: id, name: `${first_name} ${last_name}`      
      }));
  
      console.table(result);
      console.log("employeeArray To Update.\n")
  
      roleArray(employeeChoices);
    });
  }
  
  function roleArray(employeeChoices) {
    console.log("Updating an role");
  
    let query =
      `SELECT r.id, r.title, r.salary 
        FROM role r`
    let roleChoices;
  
    connection.query(query, (err, result) => {
            if (err)
            throw err;

            roleChoices = result.map(({ id, title, salary }) => ({
            value: id, title: `${title}`, salary: `${salary}`
            }));

            console.table(result);
            console.log("roleArray to Update!\n");

            promptEmployeeRole(employeeChoices, roleChoices);
        });
  }
  
function promptEmployeeRole(employeeChoices, roleChoices) {
  
    inquirer
      .prompt([
        {
          type: "list",
          name: "employeeId",
          message: "Which employee do you want to set with the role?",
          choices: employeeChoices
        },
        {
          type: "list",
          name: "roleId",
          message: "Which role do you want to update?",
          choices: roleChoices
        },
      ])
      .then( (answer) => {
  
        let query = `UPDATE employee SET role_id = ? WHERE id = ?`
        connection.query(query,
          [ answer.roleId,  
            answer.employeeId
          ],
          (err, result) => {
              if (err)
                throw err;

              console.table(result);
              console.log(`${result.affectedRows}Successfully Updated.`);

              firstPrompt();
          });
      });
  }