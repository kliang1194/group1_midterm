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
    const image = req.body.image;
    const brand = req.body.brand;
    const screenSize = req.body.screen-size;
    const colour = req.body.colour;
    const operatingSystem = req.body.operating-system;
    const hardDriveCapacity = req.body.hard-drive-capacity;
    const ram = req.body.ram;
    const userID = req.session.user_id;
    const description = req.body.description;
    const imageURL = req.body.image-url;

    const sql = `INSERT INTO products (seller_id, name, brand, price, screen_size, color, operating_system, hard_drive_capacity, RAM, description, image_url) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING *;`
  db.query(sql, [userID, name, brand, price, screenSize, colour, operatingSystem, hardDriveCapacity, ram, description, imageURL])
    .then(() => {
      res.redirect("/products")
    })
    .catch(err => {
      res
        .status(500)
        .json({ error: err.message });
    });
  })

  return router;
};






