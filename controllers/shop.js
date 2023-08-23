const Product = require("../models/product");
const Cart = require("../models/cart");

exports.getProducts = (req, res, next) => {
  // ////////// MySQL
  // Product.fetchAll()
  //   .then(([rows, fieldData]) => {
  //     res.render("shop/product-list", {
  //       prods: rows,
  //       pageTitle: "All Products",
  //       path: "/products",
  //     });
  //   })
  //   .catch((err) => {
  //     console.log(err);
  //   });


  // Sequelize
  Product.findAll()
  .then(products => {
    res.render("shop/product-list", {
      prods: products,
      pageTitle: "Shop",
      path: "/",
    });
  })
  .catch((err) => {
    console.log(err);
  });
};

exports.getProduct = (req, res, next) => {
  const productId = req.params.productId;
  /////////////////////////////
  // Product.findById(productId)
  //   .then(([product]) =>
  //     res.render("shop/product-detail", {
  //       pageTitle: "All Products",
  //       product: product[0],
  //       path: "/products",
  //     })
  //   )
  //   .catch((err) => {
  //     console.log(err);
  //   });

  ////////////////////////////
  // Approach 1 -> findByPk method
  Product.findByPk(productId)
    .then((product) =>
      res.render("shop/product-detail", {
        pageTitle: "All Products",
        product: product,
        path: "/products",
      })
    )
    .catch((err) => {
      console.log(err);
    });

  // Approach 2 -> findAll method
  // Product.findAll({
  //   where: {id: productId}
  // }).then(products => {
  //   res.render("shop/product-detail", {
  //     pageTitle: products[0].title,
  //     product: products[0],
  //     path: "/products",
  //   })
  // }).catch(err => {
  //   console.log(err);
  // })
};



exports.getIndex = (req, res, next) => {
  // ///////////////// MySQL
  // Product.fetchAll()
  //   .then(([rows, fieldData]) => {
  //     res.render("shop/index", {
  //       prods: rows,
  //       pageTitle: "Shop",
  //       path: "/",
  //     });
  //   })
  //   .catch((err) => {
  //     console.log(err);
  //   });

  // /////////// Sequelize  
  Product.findAll()
    .then(products => {
      res.render("shop/index", {
        prods: products,
        pageTitle: "Shop",
        path: "/",
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getCart = (req, res, next) => {
  Cart.getCart((cart) => {
    Product.fetchAll((products) => {
      const cartProducts = [];
      for (product of products) {
        const cartProductData = cart.products.find(
          (prod) => prod.id === product.id
        );
        if (cartProductData) {
          cartProducts.push({ productData: product, qty: cartProductData.qty });
        }
      }
      res.render("shop/cart", {
        path: "/cart",
        pageTitle: "Your Cart",
        products: cartProducts,
      });
    });
  });
};

exports.postCart = (req, res, next) => {
  const productId = req.body.productId;
  Product.findById(productId, (product) => {
    Cart.addProduct(productId, product.price);
  });
  res.redirect("/cart");
};

exports.postDeleteCart = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findById(prodId, (product) => {
    Cart.deleteProduct(prodId, product.price);
    res.redirect("/cart");
  });
};

exports.getOrders = (req, res, next) => {
  res.render("shop/orders", {
    path: "/orders",
    pageTitle: "Your Orders",
  });
};

exports.getCheckout = (req, res, next) => {
  res.render("shop/checkout", {
    path: "/checkout",
    pageTitle: "Checkout",
  });
};
