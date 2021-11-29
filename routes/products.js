const express = require('express');
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
   
  return router;
};