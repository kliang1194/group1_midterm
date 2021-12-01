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
      const user_id = req.session.user_id;
      const receiver_id = 1;
      const user_email = req.session.user_email;
      const is_admin = req.session.is_admin;
      const value = [receiver_id, user_id];
      const sqlQuery = `
      SELECT m.*, us.name as sender_name, ur.name as receiver_name
      FROM messages m
      INNER JOIN users us on m.sender_id = us.id
      INNER JOIN users ur on m.receiver_id = ur.id
      WHERE (sender_id = $1 AND receiver_id = $2) OR (receiver_id = $1 AND sender_id = $2)
      ORDER BY timestamp ASC;`
      db.query(sqlQuery, value)
      .then((data) => {
        const messages = data.rows;
        const templateVars = {user_id, receiver_id, user_email, is_admin, messages};
        res.render("adminMessage", templateVars);
      })
    })

    //post route to send messages from users to admins//
    router.post("/adminMessage", (req, res) => {
      const user_id = req.session.user_id;
      const receiver_id = 1;
      const is_for_admin = true;
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


 //post route to send message from admin to user//
    router.post("/messages/:sender_id", (req, res) => {
      const user_id = req.session.user_id;
      const receiver_id = req.params.sender_id
      const content = req.body.text;
      const value = [user_id, receiver_id, content]
      const sqlQuery = `INSERT INTO messages (sender_id, receiver_id, content) VALUES ($1, $2, $3)`
      db.query(sqlQuery, value)
      .then(() => {
       res.redirect(req.originalUrl)
      });
      });

//render individual conversation with sender from admin//
router.get("/messages/:sender_id", (req, res) => {
  const user_id = req.session.user_id;
  const sender_id = req.params.sender_id;
  const user_email = req.session.user_email;
  const is_admin = req.session.is_admin;
  if (user_email && is_admin) {
  const value = [sender_id, user_id];
  const sqlQuery = `
  SELECT m.*, us.name as sender_name, ur.name as receiver_name
  FROM messages m
  INNER JOIN users us on m.sender_id = us.id
  INNER JOIN users ur on m.receiver_id = ur.id
  WHERE (sender_id = $1 AND receiver_id = $2) OR (receiver_id = $1 AND sender_id = $2)
  ORDER BY timestamp ASC;`
  db.query(sqlQuery, value)
  .then((data) => {
    const user_name = data.rows[0].sender_name
    const messages = data.rows;
    console.log(messages);
    const templateVars = {user_id, sender_id, user_email, is_admin, messages, user_name};
    res.render("respondUser", templateVars);
  })
}
if (user_email && !is_admin) {
  const value = [sender_id, user_id];
  const sqlQuery = `
  SELECT m.*, us.name as sender_name, ur.name as receiver_name
  FROM messages m
  INNER JOIN users us on m.sender_id = us.id
  INNER JOIN users ur on m.receiver_id = ur.id
  WHERE (sender_id = $1 AND receiver_id = $2) OR (receiver_id = $1 AND sender_id = $2)
  ORDER BY timestamp ASC;`
  db.query(sqlQuery, value)
  .then((data) => {
    const user_name = data.rows[0].sender_name
    const messages = data.rows;
    console.log(messages);
    const templateVars = {user_id, sender_id, user_email, is_admin, messages, user_name};
    res.render("respondUser", templateVars);
  })
}
})

//render messages page to display all messages for the logged in user//
router.get("/messages", (req, res) => {
  const user_email = req.session.user_email;
  const user_id = req.session.user_id;
  const is_admin = req.session.is_admin;
  if (user_email && is_admin) {
  const sqlQuery = `
  SELECT m.*, us.name as sender_name, ur.name as receiver_name
  FROM messages m
  INNER JOIN users us on m.sender_id = us.id
  INNER JOIN users ur on m.receiver_id = ur.id
  WHERE m.receiver_id = $1
  ORDER BY timestamp DESC;`
  db.query(sqlQuery, [user_id])
  .then((data) => {
    const messages = data.rows;
    console.log(messages);
      const templateVars = {messages, is_admin, user_email, user_id};
      return res.render("messages", templateVars);
    })
  .catch((err) => {
    res.status(500).json({error: err.message});
  });
} else if (user_email && !is_admin) {
  const sqlQuery = `
  SELECT m.*, us.name as sender_name, ur.name as receiver_name
  FROM messages m
  INNER JOIN users us on m.sender_id = us.id
  INNER JOIN users ur on m.receiver_id = ur.id
  WHERE m.receiver_id = $1 OR m.sender_id = $1
  ORDER BY timestamp DESC;`
  db.query(sqlQuery, [user_id])
  .then((data) => {
    const messages = data.rows;
      const templateVars = {messages, is_admin, user_email, user_id};
      return res.render("messages", templateVars);
    })
  .catch((err) => {
    res.status(500).json({error: err.message});
  });
};
});


  return router;
};
