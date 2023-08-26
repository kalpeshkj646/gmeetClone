const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");

const errorController = require("./controllers/error");

const app = express();

// Setting Up Sequilize DB
const sequelize = require("./util/database");
const Product = require("./models/product");
const User = require("./models/user");
const Cart = require("./models/cart");
const CartItem = require("./models/cart-item");
const Order = require("./models/order");
const OrderItem = require("./models/order-item");

// setting up a user for all our routes
// this is a temperory action which will be followed till we create a user authentication system
// ṇow the major question is -> how?
// What we do is, we set up a middleware for all the routes before a specific route is defined, such that whenever any route is hit our users login will be there at that time
app.use((req, res, next) => {
  User.findByPk(1)
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((err) => {
      console.log(err);
    });
});

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
Product.belongsTo(User, { constraints: true, onDelete: "CASCADE" });
User.hasMany(Product);

User.hasOne(Cart);
Cart.belongsTo(User);
Cart.belongsToMany(Product, { through: CartItem });
Product.belongsToMany(Cart, { through: CartItem });

Order.belongsTo(User);
User.hasMany(Order);
Order.belongsToMany(Product, {through: OrderItem});

sequelize
  // .sync({force: true})
  .sync()
  .then((result) => {
    // console.log(result);
    return User.findByPk(1);
  })
  .then((user) => {
    if (!user) {
      return User.create({ email: "kj@gmail.com", password: "kj@646" });
    }
    return user;
  })
  .then((user) => {
    // console.log(user);
    return user.createCart();
  })
  .then((cart) => {
    // starting server
    app.listen(3000);
  })
  .catch((err) => {
    console.log(err);
  });
