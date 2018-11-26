var mysql = require("mysql");
var inquirer = require("inquirer");


var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "9Ngusaonoi",
  database: "bamazon",
  multipleStatements: true
});

connection.connect(function(err) {
  if (err) throw err;
  SupervisorOptions();
});

function SupervisorOptions() {
  inquirer
    .prompt({
      name: "action",
      type: "list",
      message: "What would you like to do?",
      choices: [
        "View Product Sales by Department",
        "Create New Department",
        "Quit"
      ]
    })
    .then(function(answer) {
        console.log("\n\n\n");        
      switch (answer.action) {
      case "View Product Sales by Department":
        viewProductSales();
        break;

      case "Create New Department":
        addDepartment();
        break;

      case "Quit":
        console.log("Session ended. Thank you!");
        connection.end();            
        process.exit(0);
        
        break;        
      }
    });
};
function viewProductSales() {
    var query = "SELECT departments.department_id, department_name, over_head_costs, COALESCE(SUM(product_sales),0) AS total_product_sales, COALESCE(SUM(product_sales),0)-over_head_costs AS total_profit"+
        " FROM departments LEFT JOIN products ON departments.department_id = products.department_id"+
        " GROUP BY department_id"+
        " ORDER BY total_profit DESC";

    connection.query(query, function(err, res) {
        if(res.length==0){
            console.log("\nYou don't have any department.")
        } else {        
            for (var i = 0; i < res.length; i++) {
            console.log("\nID: " + res[i].department_id + " || Department: " + res[i].department_name + " || Overhead Costs: " + res[i].over_head_costs + " || Total Sales: " + res[i].total_product_sales + " || Profit: "+res[i].total_profit);
            };
        };
        console.log("\nTotal: "+res.length)
        console.log("\n\n\n");
        SupervisorOptions();
    });
};
function addDepartment() {
    console.log("Please provide department information below:\n")
    inquirer.prompt([
        {
            type: "input",
            name: "nameInput",
            message: "Name"            
        },
        {
            type: "input",
            name: "costInput",
            message: "Overhead Cost"            
        },
    ]).then(function(answer){
        var newinput = {
            department_name: answer.nameInput,
            over_head_costs: answer.costInput
        };
        newDepartment(newinput);
        console.log("Cool! A new department was added. Thank you!");
        console.log("\n\n\n");
        SupervisorOptions();            
    })
 
};

function newDepartment(newDept) {
    connection.query("INSERT INTO departments SET ?", newDept, function(err, res2) {
        if(err) throw err;
    });
};