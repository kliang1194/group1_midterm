const { response } = require('express');
const express = require('express');
const router  = express.Router();

module.exports = (db) => {

  router.get("/newMessage", (req, res) => {
    const user_email = req.session.user_email;
    const is_admin = req.session.is_admin;
    const value = [user_email];
    const sqlQuery = `SELECT * FROM users WHERE email = $1;`
    db.query(sqlQuery, value)
    .then((data) => {
        const templateVars = {is_admin, user_email};
        return res.render("newMessage", templateVars);
      })
    .catch((err) => {
      res.status(500).json({error: err.message});
    })
  });

  router.post("/newMessage", (req, res) => {
    const user_id = req.body.user_id;
    const product_id = req.body.product_id;
    const is_for_admin = req.body.is_admin;
    const content = req.body.message;
    const value = [user_id, product_id, content, is_for_admin]
    const sqlQuery = `INSERT INTO messages (user_id, product_id, content, is_for_admin) VALUES ($1, $2, $3, $4)`
    db.query(sqlQuery, value)
    .then(() => {
     res.redirect("/login")
    });
    });

    router.get("/adminMessage", (req, res) => {
      const user_email = req.session.user_email;
      const is_admin = req.session.is_admin;
      const value = [user_email];
      const sqlQuery = `SELECT * FROM users WHERE email = $1;`
      db.query(sqlQuery, value)
      .then((data) => {
          const templateVars = {is_admin, user_email};
          return res.render("adminMessage", templateVars);
        })
      .catch((err) => {
        res.status(500).json({error: err.message});
      })
    });

    router.post("/adminMessage", (req, res) => {
      const user_id = req.body.user_id;
      const product_id = req.body.product_id;
      const is_for_admin = req.body.is_admin;
      const content = req.body.message;
      const value = [user_id, product_id, content, is_for_admin]
      const sqlQuery = `INSERT INTO messages (user_id, product_id, content, is_for_admin) VALUES ($1, $2, $3, $4)`
      db.query(sqlQuery, value)
      .then(() => {
       res.redirect("/login")
      });
      });

  return router;
};
