const express = require("express");
const { serialize } = require("pg-protocol");
const router = express.Router();

module.exports = (db) => {
  router.get("/", (req, res) => {
    const user_email = req.session.user_email;
    const is_admin = req.session.is_admin;
    let user_id = req.session.user_id;

    if (is_admin) {
      return res.redirect("/admin/products");
    }

    db.query(`SELECT * FROM products;`)
      .then((data) => {
        if (user_id === undefined) {
          user_id = 'undefined';
        }
        const products = data.rows;
        const templateVars = { is_admin, user_email, products, user_id };
        res.render("products", templateVars);
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });

  router.get("/newProducts", (req, res) => {
    db.query(`SELECT * FROM users;`)
      .then((data) => {
        const user = data.rows;
        const user_email = req.session.user_email;
        const is_admin = req.session.is_admin;
        const templateVars = { user, user_email, is_admin };

        return res.render("newProducts", templateVars);
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });

  router.post("/newProducts", (req, res) => {
    const name = req.body.name;
    const price = req.body.price * 100;
    const brand = req.body.brand;
    const screenSize = req.body.screen_size;
    const color = req.body.color;
    const operatingSystem = req.body.operating_system;
    const hardDriveCapacity = req.body.hard_drive_capacity;
    const ram = req.body.RAM;
    const userID = req.session.user_id;
    const description = req.body.description;
    const imageURL = req.body.image_url;
    const sql = `INSERT INTO products (seller_id, name, brand, price, screen_size, color, operating_system, hard_drive_capacity, RAM, description, image_url) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11);`;
    db.query(sql, [
      userID,
      name,
      brand,
      price,
      screenSize,
      color,
      operatingSystem,
      hardDriveCapacity,
      ram,
      description,
      imageURL,
    ])
    .then(() => {
      db.query(`SELECT * FROM products
      WHERE seller_id = $1
      ORDER BY products.id DESC`, [userID])
    .then((data) => {
      const product_id = data.rows[0].id;
      const product = data.rows[0];
      console.log(product_id);
      res.redirect(`/products/${product_id}`);
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
    });
  });

  router.post("/:product_id/:user_id/newFavorite", (req, res) => {
    const is_admin = req.session.is_admin;
    const current_user_id = req.session.user_id;
    const user_id = req.params.user_id;
    const product_id = req.params.product_id;

    if(user_id === 'undefined' || current_user_id === 'undefined') {
      return res.redirect('/login');
    };

    if(current_user_id.toString() !== user_id) {
      return res.status(400).send("Invalid Favorite request! (User Favorite function)");
    };

    if(is_admin) {
      return res.redirect('/admin/products');
    };
    
    db.query(`INSERT INTO favorite_products (user_id, product_id) VALUES ($1, $2)`, [current_user_id, product_id])
      .then(data => {
        return;
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });

  router.get("/:product_id", (req, res) => {
    const user_email = req.session.user_email;
    const is_admin = req.session.is_admin;
    const user_id = req.session.user_id;
    const product_id = req.params.product_id;
    const sql = `
    SELECT products.*, users.name as seller_name
    FROM products
    INNER JOIN users ON seller_id = users.id
    WHERE products.id = $1;`;
    db.query(sql, [product_id]).
    then((data) => {
      const product = data.rows[0];
      const seller_name = data.rows[0]["seller_name"];
      const templateVars = {seller_name, user_email, is_admin, user_id, product };
      res.render("productPage", templateVars);
    });
  });

  router.post("/:product_id/:user_id/unFavorite", (req, res) => {
    const is_admin = req.session.is_admin;
    const current_user_id = req.session.user_id;
    const user_id = req.params.user_id;
    const product_id = req.params.product_id;

    if(current_user_id.toString() !== user_id) {
      return res.status(400).send("Invalid Favorite request! (User Favorite function)");
    };

    if(is_admin) {
      return res.redirect('/admin/products');
    };
    
    db.query(`DELETE FROM favorite_products
              WHERE user_id = $1 AND product_id = $2;`, [current_user_id, product_id])
      .then(data => {
        return;
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });
  
  return router;
};
