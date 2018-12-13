var mysql = require("mysql");
var inquirer = require("inquirer");

var Connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "root",
  database: "bamazon_db"
});

Connection.connect(function(err) {
  if (err) throw err;
    ReadProducts();
});

var Table = require('cli-table');
 
// instantiate
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
        runSelect(res);
    });
}

function runSelect(res) {
inquirer
    .prompt([
    {
        type: "rawlist",
        name: "itemId",
        message: "Please select an item number to purchase.",
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
        message: "How many would you like to purchase?", 
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
    .then(function(answer) {
        if (answer.confirm) {
            console.log("\nYou would like to purchase " + answer.quantity + " of the item #" + answer.itemId);
            var chosenItem;
            var chosenId = answer.itemId.split(",");
            var newId = parseInt(chosenId[0]);
            for (var i = 0; i < res.length; i++) {
              if (res[i].item_id === newId) {
                chosenItem = res[i];
              }
            }

            if (chosenItem.stock_quantity > parseInt(answer.quantity)) {
              Connection.query(
                "UPDATE products SET ? WHERE ?",
                [
                  {
                    stock_quantity: chosenItem.stock_quantity-answer.quantity
                  },
                  {
                    item_id: chosenItem.item_id
                  }
                ],
                function(error) {
                  if (error) throw error;
                  console.log("\nCongratulations you purchased " + answer.quantity + " of the item #" + answer.itemId + ". Your total is $" + chosenItem.price + ".");
                }                    
              ); 
            } else {
                console.log("Insufficient quantity!");
            } 
        //   ReadProducts(); 
        } else {
            console.log("\nThat's okay, come again when you are ready to make a purchase.\n");
        }
    })
}
