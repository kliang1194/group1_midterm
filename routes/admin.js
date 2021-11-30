const express = require('express');
const router  = express.Router();

module.exports = (db) => {
  router.get("/products", (req, res) => {
    const user_email = req.session.user_email;
    const is_admin = req.session.is_admin;
    const user_id = req.session.user_id;

    if(!is_admin) {
      return res.status(401).send("No authorization for admin functionality! (Admin page)");
    };
    
    db.query(`SELECT * FROM products;`)
      .then(data => {
        const products = data.rows;
        const templateVars = {is_admin, user_email, products, user_id};
        return res.render('admin_products', templateVars);
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });


  // Send delete request upon clicking the Delete Button 
  router.post("/products/:product_id/delete", (req, res) => {
    const is_admin = req.session.is_admin;
    const product_id = req.params.product_id;

    if(!is_admin) {
      return res.status(401).send("No authorization for admin functionality! (Admin Delete function)");
    };

    if(!product_id) {
      return res.status(400).send("Product_id does not exist! (Admin Delete function)");
    };

    const value = [product_id];
    db.query(`DELETE FROM products WHERE id = $1;`, value)
      .then(data => {
        const products = data.rows;
        console.log("Item deleted, products: ", products);
        return res.redirect('/products');
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });

  router.post("/products/:product_id/sold", (req, res) => {
    const is_admin = req.session.is_admin;
    const product_id = req.params.product_id;

    if(!is_admin) {
      return res.status(401).send("No authorization for admin functionality! (Admin Delete function)");
    };

    if(!product_id) {
      return res.status(400).send("Product_id does not exist! (Admin Sold function)");
    };

    const sold_url = 'https://i.imgur.com/bnNBGDN.jpg';
    const value = [sold_url, false, product_id];
    db.query(`UPDATE products
              SET image_url = $1, is_available = $2
              WHERE id = $3;`, value)
      .then(data => {
        const product = data.rows[0];
        console.log("Item mark as SOLD, product: ", product);
        return res.redirect('/products');
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });

  return router;
};