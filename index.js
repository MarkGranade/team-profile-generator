// packages
const inquirer = require('inquirer');
// local
const generateTemplate = require('./src/page-template');
const { writeFile, copyFile } = require('./utils/generate-site');
// classes
const Manager = require('./lib/Manager');
const Engineer = require('./lib/Engineer');
const Intern = require('./lib/Intern');
// array to hold team data
const teamData = [];

const promptManager = () => {
    return inquirer.prompt([
        // manager's name
        {
            type: 'input',
            name: 'name',
            message: 'Enter team manager (Required)',
            validate: managerInput => {
                if (managerInput) {
                    return true;
                } else {
                    console.log('Please enter team manager');
                    return false;
                }
            }
        },
        // manager's ID
        {
            type: 'input',
            name: 'id',
            message: 'Enter employee id',
            validate: idInput => {
                if (idInput) {
                    return true;
                } else {
                    console.log('Please enter employee ID (Required');
                    return false;
                }
            } 
        },
        // manager's email
        {
            type: 'input',
            name: 'email',
            message: "Please enter employee's email address.",
            validate: emailInput => {
                if (emailInput) {
                    return true;
                } else {
                    return false;
                }
            }
        },
        // manager's office number
        {
            type: 'input',
            name: 'officeNumber',
            message: "Please enter team manager's office number.",
            validate: phoneInput => {
                if (phoneInput) {
                    return true;
                } else {
                    return false;
                }
            }
        },
    ])
    .then((managerData) => {
        let { name, id, email, officeNumber } = managerData;
        const manager = new Manager(name, id, email, officeNumber);
        teamData.push(manager);
    });
};

const promptTeam = () => {
    console.log(`
=================
Add a Team Member
=================
`);
    return inquirer.prompt([
        // employee's role
        {
            type: 'list',
            name: 'role',
            message: "What is the employee's role?",
            choices: ['Engineer', 'Intern']
        },
        // employee's name
        {
            type: 'input',
            name: 'name',
            message: "Please enter the employee's name",
            validate: (nameInput) => {
                if (nameInput) {
                    return true;
                } else {
                    return false;
                }
            }
        },
        // employee's ID
        {
            type: 'input',
            name: 'id',
            message: "Please enter the employee's ID",
            validate: (idInput) => {
                if (idInput) {
                    return true;
                } else {
                    return false;
                }
            }
        },
        // employee's email
        {
            type: 'input',
            name: 'email',
            message: "Please enter the employee's email address",
            validate: (emailInput) => {
                if (emailInput) {
                    return true;
                } else {
                    return false;
                }
            }
        },
        {
            type: 'input',
            name: 'github',
            message: 'Please enter github',
            when: answers => answers.role === 'Engineer'
        },
        {
            type: 'input',
            name: 'school',
            message: 'Please enter school',
            when: answers => answers.role === 'Intern'
        },
        {
            type: 'confirm',
            name: 'addTeam',
            message: 'Would you like to add another team memeber?',
            default: false,
        },
    ])
    .then((employeeData) => {
        let { name, id, email, role, github, school, addTeam } = employeeData;

        if (role === 'Engineer') {
            teamMember = new Engineer(name, id, email, github);
        } else if (role === 'Intern') {
            teamMember = new Intern(name, id, email, school);
        }
        teamData.push(teamMember);

        if (addTeam) {
            return promptTeam(teamData);
        } else {
            return teamData;
        }
    });
};

promptManager()
    .then(promptTeam)
    .then((teamData) => {
        console.log('teamData: ', teamData);
        return generateTemplate(teamData);
    })
    .then(pageHTML => {
        return writeFile(pageHTML);
    })
    .then(writeFileResponse => {
        console.log(writeFileResponse);
        return copyFile();
    })
    .then(copyFileResponse => {
        console.log(copyFileResponse);
    })
    .catch(err => {
        console.log(err);
    });

module.exports = promptManager;
