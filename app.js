const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");

const errorController = require("./controllers/error");

const app = express();

// Setting Up Sequilize DB
const sequelize = require("./util/database");
const Product = require('./models/product');
const User = require('./models/user');

// setting Templating Engines
app.set("view engine", "ejs");
app.set("views", "views");

// setting up db connection
// const db = require("./util/database");
// First db data extraction
// db.execute("SELECT * FROM products")
//   .then((result) => {
//     console.log(result[0]);
//   })
//   .catch((err) => {
//     console.log(err);
//   });


// bodyparser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

// setting up routes
const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");

// initialising routes
app.use("/admin", adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

// Initialising Sequelize DB so that we can initialise all the db models automatically

// Creating Associations in our different kinds of data models
Product.belongsTo(User, {constraints: true, onDelete: 'CASCADE' });
User.hasMany(Product);


sequelize
  .sync()
  .then((result) => {
    // console.log(result);
    // starting server
    app.listen(3000);
  })
  .catch((err) => {
    console.log(err);
  });
   
