/*
 * All routes for Users are defined here
 * Since this file is loaded in server.js into api/users,
 *   these routes are mounted onto /users
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router  = express.Router();

module.exports = (db) => {
  router.get("/", (req, res) => {
    const user_email = req.session.user_email;
    const is_admin = req.session.is_admin;
    const user_id = req.session.user_id;
    db.query(`SELECT * FROM users;`)
      .then(data => {
        const users = data.rows;
        const templateVars = {is_admin, user_email, user_id};
        res.render('index', templateVars);
      })
      .catch(err => {
          res.status(500)
          .json({ error: err.message });
      });
  });

//login route
router.get("/login", (req, res) => {
  const user_email = req.session.user_email;
  const is_admin = req.session.is_admin;
  const value = [user_email];
  const sqlQuery = `SELECT * FROM users WHERE email = $1;`
  db.query(sqlQuery, value)
  .then((data) => {
      const templateVars = {is_admin, user_email};
      return res.render("login", templateVars);
    })
  .catch((err) => {
    res.status(500).json({error: err.message});
  })
});

//post request to capture login information//
router.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const values = [email, password];
  const sqlQuery = `SELECT * FROM users WHERE email = $1 AND password = $2`;
  db
    .query(sqlQuery, values)
    .then((data) => {
      const user = data.rows[0];
      if (user) {
        req.session.user_email = user.email;
        req.session.is_admin = user.is_admin;
        req.session.user_id = user.id;
        req.session.user_name = user.name;
        res.redirect("/");
      } else {
        res.send("Your login information does not match our records. Please try again.");
      }
    })
    .catch((err) => {
      res.status(500).json({ err: err.message });
    });
});

//Registration route
router.get("/register", (req, res) => {
  db.
  query(`SELECT * FROM users;`)
  .then((data) => {
    const user = data.rows;
    const user_email = req.session.user_email;
    const templateVars = {user, user_email};
    return res.render("registration", templateVars);
  })
  .catch((err) => {
    res.status(500).json({error: err.message});
  })
});

//post request to create new user//
router.post("/register", (req, res) => {
  const email = req.body.email;
  const values = [email];
  const sqlQuery = `SELECT * FROM users WHERE email = $1`;
  db
    .query(sqlQuery, values)
    .then((data) => {
      const user = data.rows[0];
      if (!user) {
        const name = req.body.name;
        const email = req.body.email;
        const password = req.body.password;
        const values2 = [name, email, password];
        const sqlQuery2 = `INSERT INTO users (name, email, password) VALUES ($1, $2, $3)`;
        return db
        .query(sqlQuery2, values2)
        .then((data) => {
          res.redirect("/login");
        })
      } else {
        res.send("There is already a user account assoiated with this email.");
      };
    })
    .catch((err) => {
      res.status(500).json({ err: err.message });
    });
});

router.get("/features/json", (req, res) => {
  const value = [true, '3'];
  const sqlQuery = `SELECT * FROM products WHERE is_featured = $1 LIMIT $2;`
  db.query(sqlQuery, value)
  .then((data) => {
      const featured_items = data.rows;
      return res.json(featured_items);
    })
  .catch((err) => {
    res.status(500).json({error: err.message});
  })
});

//post to logout and delete cookies//
//deleting user session once user logs out
router.post("/logout", (req, res) => {
  req.session = null;
  res.redirect("/");
});




  return router;
};


