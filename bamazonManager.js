var mysql = require("mysql");
var inquirer = require("inquirer");
var Table = require('cli-table');
 
var table = new Table({
    head: ['Item ID', 'Product Name', 'Department', 'Price', 'Items in Stock'],
    colWidths: [5, 50, 20, 20, 10]
});

var Connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "root",
    database: "bamazon_db"
  });
  
Connection.connect(function(err) {
if (err) throw err;
    Manager();
});

function Manager(answer) {
inquirer
    .prompt([
    {
        type: "rawlist",
        name: "options",
        message: "What would you like to do?",
        choices: [
            "View Products for in Inventory",
            "View Low Inventory",
            "Add to Inventory",
            "Add New Product", 
        ]
    }
    ])
    .then(function(answer) {
        switch (answer.options) {
            case "View Products for in Inventory":
                ReadProducts();
                break;
            case "View Low Inventory":
                lowInventory();
                break;
            case "Add to Inventory":
                addInventory();
                break;
            case "Add New Product":
                newProduct();
                break;
            default:
                console.log("Please select an option.");
        }
    })
}
 
var table = new Table({
    head: ['Item ID', 'Product Name', 'Department', 'Price', 'Stock'],
    colWidths: [10, 50, 20, 10, 10]
});

function ReadProducts() {
    console.log("Selecting all products...\n");
    Connection.query("SELECT * FROM Products", function(err, res) {
        if (err) throw err;
        for (var i = 0; i < res.length; i++) {
            var id = res[i].item_id;
            var product = res[i].product_name;
            var department = res[i].department_name;
            var price = res[i].price;
            var stock = res[i].stock_quantity;

            table.push(
                [id, product, department, price, stock]
            );
        }
        console.log(table.toString()); 
    });
}

function lowInventory() {
    console.log("low Inventory");
}

function addInventory() {
    console.log("add Inventory");
}

function newProduct() {
    console.log("new Product");
}







// module.exports = 