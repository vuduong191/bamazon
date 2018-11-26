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
  console.log("connected as id " + connection.threadId);
  buying();

//   inquireCustomer();

});


function buying() {
  connection.query("SELECT * FROM products", function(err, res) {
      console.log("\n\nHere is all we have!\n\n")
    for (var i = 0; i < res.length; i++) {
      console.log(res[i].item_id + " | " + res[i].product_name + " | " + "$"+res[i].price );
    }
    console.log("-----------------------------------\n\n");
    inquirer.prompt([
        {
            type: "input",
            name: "idInput",
            message: "Please provide the ID of the product you would like to buy!"            
        },
        {
            type: "input",
            name: "quantityInput",
            message: "How many would you like to buy?"            
        },        

    ]).then(function(answer){
        var idReceived = parseInt(answer.idInput);
        var quantityReceived = parseInt(answer.quantityInput);

        if(idReceived>res.length){
            console.log("\nWe're sorry! This ID is not associated with any product. Please try again!\n");
            buying();            
        } else {
            if(quantityReceived>res[idReceived-1].stock_quantity){
                console.log("\nWe're sorry! It seems like we do not have enough stock. Please buy another!\n");
                buying();
            } else {
                var totalOrder = quantityReceived*res[idReceived-1].price;
                console.log("\nCool! Your total order is $"+totalOrder+". Thank you!");
                var newSales = res[idReceived-1].product_sales+totalOrder;
                var newQuantity = res[idReceived-1].stock_quantity - quantityReceived;
                updateStock(idReceived, newQuantity, newSales);
            }
        }
    })

  });
};
function updateStock(id,updatedQuantity,updatedSales){
    connection.query("UPDATE products SET stock_quantity =?, product_sales=? WHERE item_id="+id,[updatedQuantity,updatedSales], function(err, res2) {
        if(err) throw err;
        console.log("Order went through!")
    });
    connection.end();    
};

