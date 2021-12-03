const { response } = require('express');
const express = require('express');
const router  = express.Router();

module.exports = (db) => {

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

  //render page to send messages to other users//
  router.get("/newMessage/:product_id/:seller_id", (req, res) => {
    const user_id = req.session.user_id;
    const receiver_id = req.params.seller_id
    const user_email = req.session.user_email;
    const is_admin = req.session.is_admin;
    const product_id = req.params.product_id
    if (user_email) {
  const value = [receiver_id, user_id]
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
          const input = [req.params.seller_id]
          const productQuery = `
          SELECT seller_id, users.name as seller_name
          FROM products
          INNER JOIN users ON seller_id = users.id
          WHERE seller_id = $1;`
          db.query(productQuery, input)
          .then((data2) => {
            const seller_name = data2.rows[0]["seller_name"];
            console.log("seller name:", seller_name);
            const templateVars = {user_id, receiver_id, product_id, user_email, is_admin, messages, seller_name};
            res.render("newMessage", templateVars);
          })
        })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      })
    } else {
      res.send("Sorry, you must be logged in to contact a seller.");
    }
    })

  //post route to send messages to other users//
  router.post("/newMessage/:product_id/:seller_id", (req, res) => {
    const user_id = req.session.user_id;
    const receiver_id = req.params.seller_id;
    const product_id = req.params.product_id
    const is_for_admin = false;
    const content = req.body.text;
    const value = [user_id, receiver_id, product_id, content, is_for_admin]
    const sqlQuery = `INSERT INTO messages (sender_id, receiver_id, product_id, content, is_for_admin) VALUES ($1, $2, $3, $4, $5)`
    db.query(sqlQuery, value)
    .then(() => {
     res.redirect(`/messages/${receiver_id}`)
    })
    .catch(err => {
      res
        .status(500)
        .json({ error: err.message });
    })
    });

    //render page to send messages to the admimn//
    router.get("/adminMessage", (req, res) => {
      const user_id = req.session.user_id;
      const receiver_id = 1;
      const user_email = req.session.user_email;
      const is_admin = req.session.is_admin;
      const value = [receiver_id, user_id];
      if (user_email) {
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
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      })
    } else {
      res.send("Sorry, you must be logged in to contact the Admin.");
    }
    })

    //post route to send messages from users to admins//
    router.post("/adminMessage", (req, res) => {
      const user_id = req.session.user_id;
      const receiver_id = 1;
      const is_for_admin = true;
      const content = req.body.text;
      const value = [user_id, receiver_id, content, is_for_admin]
      const sqlQuery = `INSERT INTO messages (sender_id, receiver_id, content, is_for_admin) VALUES ($1, $2, $3, $4)`
      db.query(sqlQuery, value)
      .then(() => {
       res.redirect(req.originalUrl)
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      })
      });


 //post route to send message from user to user//
    router.post("/messages/:sender_id", (req, res) => {
      const user_id = req.session.user_id;
      const receiver_id = req.params.sender_id
      const content = req.body.text;
      const value = [user_id, receiver_id, content]
      const sqlQuery = `INSERT INTO messages (sender_id, receiver_id, content) VALUES ($1, $2, $3)`
      db.query(sqlQuery, value)
      .then(() => {
       res.redirect(req.originalUrl)
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
      });

  //render individual conversation with sender from user to admin or other user//
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
    .catch(err => {
      res
        .status(500)
        .json({ error: err.message });
    })
  } else if (user_email && !is_admin) {
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
      const username = ""
      if (data.rows[0].sender_id === user_id) {
        user_name = data.rows[0].receiver_name;
        const messages = data.rows;
      const templateVars = {user_id, sender_id, user_email, is_admin, messages, user_name};
      res.render("respondUser", templateVars);
      }
      if (data.rows[0].sender_id !== user_id)
      user_name = data.rows[0].sender_name;
      const messages = data.rows;
      const templateVars = {user_id, sender_id, user_email, is_admin, messages, user_name};
      res.render("respondUser", templateVars);
    })
    .catch(err => {
      res
        .status(500)
        .json({ error: err.message });
    })
  }
  });


  return router;
};
