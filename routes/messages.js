const { response } = require('express');
const express = require('express');
const router  = express.Router();

module.exports = (db) => {

  //render page to send messages to other users//
  router.get("/newMessage", (req, res) => {
    const user_email = req.session.user_email;
    const user_id = req.session.user_id;
    const user_name = req.session.user_name;
    const is_admin = req.session.is_admin;
    const value = [user_email];
    const sqlQuery = `SELECT * FROM users WHERE email = $1;`
    db.query(sqlQuery, value)
    .then((data) => {
        const templateVars = {is_admin, user_email, user_id, user_name};
        return res.render("newMessage", templateVars);
      })
    .catch((err) => {
      res.status(500).json({error: err.message});
    })
  });

  //post route to send messages to other users//
  router.post("/newMessage", (req, res) => {
    const user_id = req.session.user_id;
    const receiver_id = req.body.receiver_id;
    const product_id = req.body.product_id;
    const is_for_admin = req.body.is_admin;
    const content = req.body.text;
    const value = [user_id, receiver_id, product_id, content, is_for_admin]
    const sqlQuery = `INSERT INTO messages (sender_id, receiver_id, product_id, content, is_for_admin) VALUES ($1, $2, $3, $4, $5)`
    db.query(sqlQuery, value)
    .then(() => {
     res.redirect("/login")
    });
    });

    //render page to send messages to the admimn//
    router.get("/adminMessage", (req, res) => {
      const user_email = req.session.user_email;
      const user_id = req.session.user_id;
      const user_name = req.session.user_name;
      const is_admin = req.session.is_admin;
      const value = [user_email];
      const sqlQuery = `SELECT * FROM users WHERE email = $1;`
      db.query(sqlQuery, value)
      .then((data) => {
          const templateVars = {is_admin, user_email, user_id, user_name};
          return res.render("adminMessage", templateVars);
        })
      .catch((err) => {
        res.status(500).json({error: err.message});
      })
    });

    //post route to send messages from users to admins//
    router.post("/adminMessage", (req, res) => {
      const user_id = req.session.user_id;
      const receiver_id = 1;
      const is_for_admin = req.body.is_admin;
      const user_email = req.body.user_email;
      const user_name = req.body.user_name;
      const content = req.body.text;
      const value = [user_id, receiver_id, content, is_for_admin]
      const sqlQuery = `INSERT INTO messages (sender_id, receiver_id, content, is_for_admin) VALUES ($1, $2, $3, $4)`
      db.query(sqlQuery, value)
      .then(() => {
       res.redirect("/login")
      });
      });

//render messages page to display all messages for admins/users//
router.get("/Messages", (req, res) => {
  const user_email = req.session.user_email;
  const user_id = req.session.user_id;
  const is_admin = req.session.is_admin;
  if (user_email && is_admin) {
  const sqlQuery = `
  SELECT * FROM messages
  ORDER BY messages.is_for_admin DESC, messages.id DESC;`
  db.query(sqlQuery)
  .then((data) => {
    const messages = data.rows;
    console.log(messages);
      const templateVars = {messages, is_admin, user_email, user_id,};
      return res.render("messages", templateVars);
    })
  .catch((err) => {
    res.status(500).json({error: err.message});
  })
} else if (user_email && !is_admin) {
  const value = [user_id]
  const sqlQuery = `
  SELECT * FROM messages
  WHERE user_id = $1
  ORDER BY messages.is_for_admin DESC, messages.id DESC;`
db.query(sqlQuery, value)
.then((data) => {
  const messages = data.rows;
  const templateVars = {messages, is_admin, user_email, user_id, user_name};
      return res.render("messages", templateVars);
    })
  .catch((err) => {
    res.status(500).json({error: err.message});
  })
} else if (!user_email) {
  res.redirect("/login")
}
});

router.get("/message/:product_id", (req, res) => {
  res.send('hello')
})

  return router;
};
