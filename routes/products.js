const express = require('express');
const { serialize } = require('pg-protocol');
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


  router.get("/newProducts", (req, res) => {
    db.
    query(`SELECT * FROM users;`)
    .then((data) => {
      const user = data.rows;
      const user_email = req.session.user_email;
      const is_admin = req.session.is_admin;
      const templateVars = {user, user_email, is_admin};

      return res.render("newProducts", templateVars);
    })
    .catch((err) => {
      res.status(500).json({error: err.message});
    })
  });


  router.post("/newProducts", (req, res) => {
    const name = req.body.name;
    const price = (req.body.price * 100);
    const image = req.body.image;
    const description = req.body.description;
    const brand = req.body.brand;
    const screenSize = req.body.screenSize;
    const colour = req.body.colour;
    const operatingSystem = req.body.operatingSystem;
    const processorType = req.body.processorType;
    const hardDriveCapacity = req.body.hardDriveCapacity;
    const ram = req.body.ram;
    const userID = req.session.user_id;

    const sql = `INSERT INTO products (seller_id, name, brand, price, screen_size, color, operating_system, hard_drive_capacity, RAM, description, image_url) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING *;`
  db.query(sql, [userID, name, brand, price, screenSize, colour, operatingSystem, hardDriveCapacity, ram, description, image])
    .then(() => {
      res.redirect("/products")
    })
    .catch(err => {
      res
        .status(500)
        .json({ error: err.message });
    });
  })

  return router;
};





//post request to create new products//


// router.post("/newProducts", (req, res) => {
//   const email = req.body.email;
//   const values = [email];
//   const sqlQuery = `SELECT * FROM users WHERE email = $1`;
//   db
//     .query(sqlQuery, values)
//     .then((data) => {
//       const user = data.rows[0];
//       if (!user) {
//         const name = req.body.name;
//         const email = req.body.email;
//         const password = req.body.password;
//         const values2 = [images of products, name, brand, screen size, colour, operating system, processor type, hard drive capacity, ram, price, description];
//         const sqlQuery2 = `INSERT INTO products (images of products, name, brand, screen size, colour, operating system, processor type, hard drive capacity, ram, price, description) VALUES ($1, $2, $3)`;
//         return db
//         .query(sqlQuery2, values2)
//         .then((data) => {
//           res.redirect("/products");
//         })

//       }
//     })
//     .catch((err) => {
//       res.status(500).json({ err: err.message });
//     });
// });
