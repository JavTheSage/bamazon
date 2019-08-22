var inquirer = require("inquirer");

var mysql = require("mysql");

var connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "bOnafidemerchantsea09",
    database: "bamazon_db"
});

var promptUser = function () {
    inquirer.prompt([
        {
            message: "What is the ID of the product you want to buy?",
            type: "input",
            name: "whatProduct"
        },

        {
            message: "How many do you want to buy?",
            type: "input",
            name: "howMany"
        }
    ])
        .then(function (response) {

            var id = parseInt(response.whatProduct);
            var amount = parseInt(response.howMany);

            connection.query("SELECT stock_quantity, price FROM products WHERE item_id=" + id, function (err, response) {
                if (err) throw (err);

                var totalAmount = response[0].stock_quantity;

                if (amount > totalAmount) {
                    console.log("Not enough product available.");
                    promptUser();
                } else {
                    connection.query(`UPDATE products SET stock_quantity = ${totalAmount -= amount} WHERE item_id=${id}`, function (err) {
                        if (err) throw err;
                        console.log("Purchase went through\nTotal: $" + (response[0].price * amount));
                        connection.end();
                    }
                    )
                }
            })
        })
};


connection.connect(function (err) {
    if (err) throw (err)
    connection.query("select * from products", function (err, data) {
        if (err) throw (err)
        console.log(data)
        promptUser();
    })
});

