const express = require('express');
const router  = express.Router();

module.exports = (db) => {

  router.get("/", (req, res) => {
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

  router.get("/:user_id", (req, res) => {
    const user_email = req.session.user_email;
    const is_admin = req.session.is_admin;
    const user_id = req.session.user_id;
    
    db.query(`SELECT * FROM products 
              JOIN favorite_products ON products.id = favorite_products.product_id 
              WHERE user_id = $1;`, [user_id])
      .then(data => {
        const favorite_products = data.rows;
        const templateVars = {is_admin, user_email, favorite_products, user_id};
        res.render('favorites', templateVars);
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });
   
  return router;
};