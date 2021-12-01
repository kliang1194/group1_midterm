const express = require('express');
const router  = express.Router();

module.exports = (db) => {
  router.get("/", (req, res) => {
    const user_email = req.session.user_email;
    const is_admin = req.session.is_admin;
    const user_id = req.session.user_id;

    if (is_admin) {
      return res.redirect('/admin/products');
    }
    
    db.query(`SELECT * FROM products;`)
      .then(data => {
        const products = data.rows;
        const templateVars = {is_admin, user_email, products, user_id};
        res.render('products', templateVars);
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });

  router.post("/:product_id/:user_id/newFavorite", (req, res) => {
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
    
    db.query(`INSERT INTO favorite_products (user_id, product_id) VALUES ($1, $2)`, [current_user_id, product_id])
      .then(data => {
        return;
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
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