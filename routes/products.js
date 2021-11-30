const express = require('express');
const { serialize } = require('pg-protocol');
const router  = express.Router();

module.exports = (db) => {
  router.get("/", (req, res) => {
    db.query(`SELECT * FROM products;`)
      .then(data => {
        const products = data.rows;
        res.render('products');
        // res.json(products);
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });


  router.get("/newProducts", (req, res) => {
    db.
    query(`SELECT * FROM users;`)
    .then((data) => {
      const user = data.rows;
      const user_email = req.session.user_email;
      const is_admin = req.session.is_admin;
      const templateVars = {user, user_email, is_admin};

      return res.render("newProducts", templateVars);
    })
    .catch((err) => {
      res.status(500).json({error: err.message});
    })
  });


  router.post("/newProducts", (req, res) => {
    const name = req.body.name;
    const price = (req.body.price * 100);
    const brand = req.body.brand;
    const screenSize = req.body.screen_size;
    const color = req.body.color;
    const operatingSystem = req.body.operating_system;
    const hardDriveCapacity = req.body.hard_drive_capacity;
    const ram = req.body.RAM;
    const userID = req.session.user_id;
    const description = req.body.description;
    const imageURL = req.body.image_url;

    const sql = `INSERT INTO products (seller_id, name, brand, price, screen_size, color, operating_system, hard_drive_capacity, RAM, description, image_url) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11);`
  db.query(sql, [userID, name, brand, price, screenSize, color, operatingSystem, hardDriveCapacity, ram, description, imageURL])
    .then(() => {
      res.redirect("/products")
    })
    .catch(err => {
      res
        .status(500)
        .json({ error: err.message });
    });
  });


  router.get("/:product_id", (req, res) => {
    const user_email = req.session.user_email;
    const is_admin = req.session.is_admin;
    const user_id = req.session.user_id;
    const product_id = req.params.product_id;
    const sql = `
    SELECT * FROM products
    WHERE products.id = $1;`
  db.query(sql, [product_id])
    .then((data) => {
      const product = data.rows[0];
      const templateVars = {user_email, is_admin, user_id, product};
res.render("productPage", templateVars);
    })
  });

  return router;
};






