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
  ManagerOptions();
});

function ManagerOptions() {
  inquirer
    .prompt({
      name: "action",
      type: "list",
      message: "What would you like to do?",
      choices: [
        "View Products for Sale",
        "View Low Inventory",
        "Add to Inventory",
        "Add New Product",
        "Quit"
      ]
    })
    .then(function(answer) {
        console.log("\n\n\n");        
      switch (answer.action) {
      case "View Products for Sale":
        viewAll();
        break;

      case "View Low Inventory":
        viewLowInventory();
        break;

      case "Add to Inventory":
        addToInventory();
        break;

      case "Add New Product":
        addNewProduct();
        break;

      case "Quit":
        console.log("Session ended. Thank you!");
        connection.end();            
        process.exit(0);
        
        break;        
      }
    });
};

function viewAll() {
      var query = "SELECT * FROM products";
      connection.query(query, function(err, res) {
        for (var i = 0; i < res.length; i++) {
          console.log("ID: " + res[i].item_id + " || Product: " + res[i].product_name + " || Price: " + res[i].price + " || Stock: "+res[i].stock_quantity);
        }
        console.log("\n\n\n");
        ManagerOptions();
      });
};
function viewLowInventory() {
      var query = "SELECT * FROM products WHERE stock_quantity<5";
      connection.query(query, function(err, res) {
        console.log("\n\n")
        if(res.length==0){
            console.log("Don't worry! Your stock is to the roof.")
        } else {        
            for (var i = 0; i < res.length; i++) {
            console.log("ID: " + res[i].item_id + " || Product: " + res[i].product_name + " || Price: " + res[i].price + " || Stock: "+res[i].stock_quantity);
            };
        };
        console.log("\nTotal: "+res.length)
        console.log("\n\n\n");
        ManagerOptions();
      });
};

function addToInventory() {
    connection.query("SELECT * FROM products", function(err, res) {
        for (var i = 0; i < res.length; i++) {
        console.log("ID: " + res[i].item_id + " || Product: " + res[i].product_name + " || Price: " + res[i].price + " || Stock: "+res[i].stock_quantity);
        }
        console.log("\n\n\n");
        inquirer.prompt([
            {
                type: "input",
                name: "idInput",
                message: "Please provide the ID of the product you would like to restock!"            
            },
            {
                type: "input",
                name: "quantityInput",
                message: "How many would you like to add?"            
            },        

        ]).then(function(answer){
            var idReceived = parseInt(answer.idInput);
            var quantityReceived = parseInt(answer.quantityInput);
            if(idReceived>res.length){
                console.log("\nWe're sorry! This ID is not associated with any product. Please try again.\n");
                addToInventory();
            } else {
                var newQuantity = res[idReceived-1].stock_quantity + quantityReceived;                            
                updateStock(idReceived,newQuantity);
                console.log("\nCool! The stock for this product is now "+newQuantity+". Thank you!");
                console.log("\n\n\n");
                ManagerOptions();
            }            
        })

    });    
};
function addNewProduct() {
    console.log("Please provide product information below:\n")
    inquirer.prompt([
        {
            type: "input",
            name: "nameInput",
            message: "Name"            
        },
        {
            type: "input",
            name: "priceInput",
            message: "Price"            
        },
        {
            type: "input",
            name: "departmentInput",
            message: "Department ID"            
        },                
        {
            type: "input",
            name: "stockInput",
            message: "Stock Quantity"            
        },
        {
            type: "input",
            name: "salesInput",
            message: "Product Sales"            
        },                  

    ]).then(function(answer){
        var newinput = {
            product_name: answer.nameInput,
            department_id: answer.departmentInput,
            price: answer.priceInput,
            stock_quantity: answer.stockInput,
            product_sales: answer.salesInput
        };
        newProduct(newinput);
        console.log("Cool! A new product was added. Thank you!");
        console.log("\n\n\n");
        ManagerOptions();            
    })
 
};
function updateStock(id,updatedQuantity){
    connection.query("UPDATE products SET stock_quantity ="+ updatedQuantity+" WHERE item_id="+id, function(err, res2) {
        if(err) throw err;
    });
};
function newProduct(newprod) {
    connection.query("INSERT INTO products SET ?", newprod, function(err, res2) {
        if(err) throw err;
    });
}