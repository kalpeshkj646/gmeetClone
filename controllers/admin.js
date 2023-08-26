const Product = require("../models/product");

exports.getAddProduct = (req, res, next) => {
  res.render("admin/edit-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    editing: false,
  });
};

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;

  // Working with Sequelize
  req.user
    .createProduct({
      title: title,
      price: price,
      imageUrl: imageUrl,
      description: description,
    })
    .then((result) => {
      // console.log(result);
      res.redirect("/admin/add-product");
    })
    .catch((err) => {
      console.log(err);
    });

  // //////////// Working with MySQL
  // const product = new Product(null, title, imageUrl, description, price);
  // // save the data
  // product
  //   .save()
  //   .then(() => {
  //     res.redirect("/admin/add-product");
  //   })
  //   .catch((err) => {
  //     console.log(err);
  //   });
};

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect("/");
  }

  const productId = req.params.productId;
  // Product.findByPk(productId)

  req.user
    .getProducts({ where: { id: productId } })
    .then((products) => {
      const product = products[0];
      if (!product) {
        return res.redirect("/");
      }
      res.render("admin/edit-product", {
        pageTitle: "Edit Product",
        path: "/admin/edit-product",
        editing: editMode,
        product: product,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postEditProduct = (req, res, next) => {
  // get all the updated information through edit page so that we can just create an class instance and save it
  const prodId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedPrice = req.body.price;
  const updatedImagaUrl = req.body.imageUrl;
  const updatedDesc = req.body.description;
  // // create class instance to save the product information
  // const updatedProduct = new Product(
  //   prodId,
  //   updatedTitle,
  //   updatedImagaUrl,
  //   updatedDesc,
  //   updatedPrice
  // );
  // // Call Class save method to put all this data in the file
  // updatedProduct.save();
  // res.redirect("/admin/products");

  // Using Sequelize to do the same thing
  Product.findByPk(prodId)
    .then((product) => {
      product.title = updatedTitle;
      product.price = updatedPrice;
      product.description = updatedDesc;
      product.imageUrl = updatedImagaUrl;

      return product.save(); // This is the method provided by Sequelize to save the product, it will update the product in our database
    })
    .then((result) => {
      // console.log('Product Updated');
      res.redirect("/admin/products");
    })
    .catch((err) => {
      console.log(error);
    });
};

exports.deleteProduct = (req, res, next) => {
  const productId = req.body.productId;
  // Product.findById(productId, (product) => {
  //   res.redirect('admin/products')
  // });

  // Local DB code
  // Product.deleteById(productId);

  // Sequelize method to achieve the same
  Product.findByPk(productId)
    .then((product) => {
      return product.destroy();
    })
    .then((result) => {
      res.redirect("/admin/products");
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getProducts = (req, res, next) => {
  req.user
    .getProducts()
    .then((products) => {
      res.render("admin/products", {
        prods: products,
        pageTitle: "Admin Products",
        path: "/",
      });
    })
    .catch((err) => {
      console.log(err);
    });
};
