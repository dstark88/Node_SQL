var mysql = require("mysql");
var inquirer = require("inquirer");
var Table = require('cli-table');

var Connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "root",
    database: "bamazon_db"
});
  
Connection.connect(function(err) {
if (err) throw err;
    manager();
});

var table = new Table({
    head: ['Item ID', 'Product Name', 'Department', 'Price', 'Stock'],
    colWidths: [10, 40, 15, 15, 8]
});

function manager() {
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
    .then(function(answer, res) {
        switch (answer.options) {
            case "View Products for in Inventory":
                ReadProducts();
                break;
            case "View Low Inventory":
                lowInventory();
                break;
            case "Add to Inventory":
                addInventory(res);
                break;
            case "Add New Product":
                newProduct();
                break;
            default:
                console.log("Please select an option.");
        }
    })
}

function mainMenu() {
    inquirer
    .prompt([
        {
            type: "confirm",
            name: "confirm",
            message: "What would you like to go back to the menu?",
            default: true
        }
        ])
        .then(function(answer) {
            if (answer.confirm) {
                manager();
            } else {
                console.log("\nThank you, come again!\n");
            }
        });
}

function ReadProducts() {
    console.log("Selecting all products...\n");
    Connection.query("SELECT * FROM Products", function(err, res) {
        if (err) throw err;
        // console.log(res);
        for (var i = 0; i < res.length; i++) {
            var id = res[i].item_id;
            var product = res[i].product_name;
            var department = res[i].department_name;
            var price = "$" + res[i].price;
            var stock = res[i].stock_quantity;

            table.push(
                [id, product, department, price, stock]
            );
        }
        console.log(table.toString()); 
        mainMenu();
    });
}

function lowInventory() {;
    console.log("Select all products with a low inventory...\n");
    inquirer
        .prompt([
            {
                type: "input",
                name: "start",
                message: "Enter a the low end inventory amount: ",
                validate: function(value) {
                    if (isNaN(value) === false) {
                        return true;
                    }
                    return false;
                }
            },
            {
                type: "input",
                name: "end",
                message: "Enter a high end inventory amount: ",
                validate: function(value) {
                    if (isNaN(value) === false) {
                    return true;
                    }
                    return false;
                }
            }
        ])
        .then(function(answer) {
            var query = "SELECT item_id,product_name,department_name,price,stock_quantity FROM products WHERE stock_quantity BETWEEN ? AND ?";
            Connection.query(query, [answer.start, answer.end], function(err, res) {
                // if (err) throw err;
                for (var i = 0; i < res.length; i++) {
                 
                    var id = res[i].item_id;
                    var product = res[i].product_name;
                    var department = res[i].department_name;
                    var price = "$" + res[i].price;
                    var stock = res[i].stock_quantity;
        
                    table.push(
                        [id, product, department, price, stock]
                    );
                }
                console.log(table.toString()); 
                mainMenu();
            })
        })
}

function addInventory(res) {
    console.log("Add products to inventory...\n");
    inquirer
    .prompt([
    {
        type: "rawlist",
        name: "itemId",
        message: "Please select an item number to add more inventory.",
        choices: [
            "1, Specalized S-Works Stumpjumper",
            "2, Mclaren Senna", 
            "3, Chateau Petrus Year 2010", 
            "4, Mosaic Table", 
            "5, Tag Heuer Monaco V4 Watch", 
            "6, Back to the Future Nike Air", 
            "7, Kiton Suis", 
            "8, Vivians's Wedding Dress", 
            "9, Glenlive 50 Year Single Malt Scotch", 
            "10, Sony 100 inch TV", 
            "11, 174.97 Ct Emerald and Diamond Necklace"
        ]
    }, 
    {
        type: "input",
        name: "quantity",
        message: "How many would you like to add to inventory?", 
        validate: function(value) {
        if (isNaN(value) === false) {
            return true;
        }
        return false;
        }
    },
    {
        type: "confirm",
        name: "confirm",
        message: "Are you sure?",
        default: true
    }
    ])
    .then(function(answer, res) {
        if (answer.confirm) {
            console.log("\nYou would like to add " + answer.quantity + " of the item #" + answer.itemId + " to inventory.");
            Connection.query("SELECT * FROM Products", function(err, res) {
                if (err) throw err;
                var chosenItem;
                var chosenId = answer.itemId.split(",");
                var newId = parseInt(chosenId[0]);
                // console.log("res", res);
                console.log("answer", answer);
                
                for (var i = 0; i < res.length; i++) {
                if (res[i].item_id === newId) {
                    chosenItem = res[i];
                    }
                }
                console.log("chosenItem", chosenItem);
                var adding = parseInt(chosenItem.stock_quantity) + parseInt(answer.quantity);
                    Connection.query(
                        "UPDATE products SET ? WHERE ?",
                        [
                        {
                            stock_quantity: adding
                        },
                        {
                            item_id: chosenItem.item_id
                        }
                        ],
                        function(error) {
                            if (error) throw error;
                            console.log("\nYou have added " + answer.quantity + " of the item #" + answer.itemId + " to inventory");
                            mainMenu();
                        }                    
                    );  
            })
        }
    })
}

function newProduct() {
    console.log("Add new products...\n");
    inquirer
    .prompt([
        {
        name: "itemId",
        type: "input",
        message: "Please enter the item ID.",
        validate: function(value) {
            if (isNaN(value) === false) {
              return true;
            }
            return false;
          }
        },
      {
        name: "product",
        type: "input",
        message: "What is the new product you would like to add to inventory?"
      },
      {
        name: "department",
        type: "input",
        message: "What is the department name?"
      },
      {
        name: "price",
        type: "input",
        message: "What is the price of the product?",
        validate: function(value) {
          if (isNaN(value) === false) {
            return true;
          }
          return false;
        }
      },
      {
        name: "stock",
        type: "input",
        message: "How many would you like to add to inventory?",
        validate: function(value) {
          if (isNaN(value) === false) {
            return true;
          }
          return false;
        }
      },
    ])
    .then(function(answer) {

        Connection.query(
          "INSERT INTO products SET ?",
          {
            item_id: answer.itemId,
            product_name: answer.product,
            department_name: answer.department,
            price: answer.price,
            stock_quantity: answer.stock
          },
          function(err) {
            if (err) throw err;
            console.log("Your have successfully added a new product to inventory.");

            mainMenu();
          }
        );
      });
}
