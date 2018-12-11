var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "root",
  database: "bamazon_db"
});

connection.connect(function(err) {
  if (err) throw err;
//   console.log(connection, "no error");
    readProducts();
});

function readProducts() {
    console.log("Selecting all products...\n");
    connection.query("SELECT * FROM Products", function(err, res) {
        if (err) throw err;
        console.log(res); 
        runSelect();
    });
}

function runSelect() {
inquirer
    .prompt([
    {
        type: "rawlist",
        name: "itemId",
        message: "Please select an item number to purchase.",
        choices: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11"]
    }, 
    {
        type: "input",
        name: "quantity",
        message: "How many would you like?", 
        validate: function(value) {
        if (isNaN(value) === false) {
            return true;
        }
        return false;
        }
    }
    ])
    .then(function(answer) {
        console.log(answer);
        // runQuantity(); 
        connection.query(
            "INSERT INTO auctions SET ?",
            {
              product_name: answer.itemId,
              stock_quantity: answer.quantity,
            //   starting_bid: answer.startingBid,
            //   highest_bid: answer.startingBid
            },
            function(err) {
              if (err) throw err;
              console.log("Your purchase was successful!");
              // re-prompt the user for if they want to bid or post
              start();
            }
          );  
    })
}

function runQuantity() {
    inquirer
        .prompt({
            type: "input",
            name: "quantity",
            message: "How many would you like?", 
            validate: function(value) {
            if (isNaN(value) === false) {
                return true;
            }
            return false;
            } 
        })
        .then(function(answer) {
            // when finished prompting, insert a new item into the db with that info
            connection.query(
              "INSERT INTO auctions SET ?",
              {
                item_name: answer.item,
                category: answer.category,
                starting_bid: answer.startingBid,
                highest_bid: answer.startingBid
              },
              function(err) {
                if (err) throw err;
                console.log("Your purchase was successful!");
                // re-prompt the user for if they want to bid or post
                start();
              }
            );
          });
}

// switch (answer.itemId) {
// case "1":
// 1();
// break;
// case "2":
// 2();
// break;
// case "3":
// 3();
// break;
// case "4":
// 4();
// break;
// case "5":
// 5();
// break;
// case "6":
// 6();
// break;
// case "7":
// 8();
// break;
// case "9":
// 9();
// break;
// case "10":
// 10();
// break;
// case "11":
// 11();
// break;
// default:
// console.log("Please select an item for purchase.");
// }