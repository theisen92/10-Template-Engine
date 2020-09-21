const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

const render = require("./lib/htmlRenderer");

var empArr = [];

const prompts = [
  {
    type: "input",
    name: "name",
    message: "What is your name?",
  },
  {
    type: "input",
    name: "id",
    message: "What is your ID?",
  },
  {
    type: "input",
    name: "email",
    message: "What is your email?",
  },
  {
    type: "list",
    message: "What is your role?",
    name: "role",
    choices: ["Intern", "Engineer", "Manager"],
  },
  {
    type: "input",
    name: "school",
    message: "What school did you attend or currently attend?",
    when: function (answers) {
      return answers.role === "Intern";
    },
  },
  {
    type: "input",
    name: "github",
    message: "What is your GitHub user name?",
    when: function (answers) {
      return answers.role === "Engineer";
    },
  },
  {
    type: "input",
    name: "officeNumber",
    message: "What is your office number?",
    when: function (answers) {
      return answers.role === "Manager";
    },
  },
  {
    type: "confirm",
    message: "Do you want to add another employee to the team?",
    name: "add",
  },
];

function getInfo() {
  inquirer.prompt(prompts).then((val) => {
    empArr.push(val);

    if (val.add) {
      getInfo();
    } else {
      createEmployee(empArr);
    }
  });
}

function createEmployee(workers) {
  let employee = [];
  workers.forEach((person) => {
    if (person.role === "Manager") {
      manager = new Manager(
        person.name,
        person.id,
        person.email,
        person.officeNumber
      );
      employee.push(manager);
    } else if (person.role === "Engineer") {
      engineer = new Engineer(
        person.name,
        person.id,
        person.email,
        person.github
      );
      employee.push(engineer);
    } else if (person.role === "Intern") {
      intern = new Intern(person.name, person.id, person.email, person.school);
      employee.push(intern);
    }
    rendered = render(employee);
    fs.writeFile(outputPath, rendered, (err) => {
      if (err) throw err;
    });
    console.log("New emplyee added!");
  });
}

getInfo();
