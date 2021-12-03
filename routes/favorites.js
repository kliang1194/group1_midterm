const express = require('express');
const router  = express.Router();

module.exports = (db) => {

  router.get("/", (req, res) => {
    const user_email = req.session.user_email;
    const is_admin = req.session.is_admin;
    const user_id = req.session.user_id;

    db.query(`SELECT products.*, users.name as seller_name FROM products
              INNER JOIN favorite_products ON products.id = favorite_products.product_id
              INNER JOIN users ON seller_id = users.id
              WHERE user_id = $1
              ORDER BY products.id DESC;`, [user_id])
      .then(data => {
        const products = data.rows;
        console.log(products);
        const templateVars = {is_admin, user_email, products, user_id};
        console.log(products)
        res.render('favorites', templateVars);
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });

  router.get("/json", (req, res) => {
    const user_id = req.session.user_id;

    db.query(`SELECT * FROM favorite_products
              WHERE user_id = $1;`, [user_id])
      .then(data => {
        const favorite_products = data.rows;
        res.json(favorite_products);
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });

  return router;
};
