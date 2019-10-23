// All routes in this file are mounted onto url/maps/...

const express = require('express');
const router  = express.Router();

module.exports = (db) => {

  // GETS user maps page
  router.get("/", (req, res) => {
    db.query(`SELECT * FROM maps;`)
      .then(data => {
        const maps = data.rows;
        res.json({ maps });
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });

  // GETS create map page
  router.get("/:id", (req, res) => {
    db.query(`SELECT * FROM pins
    WHERE map_id = ${req.params.id};`)
    .then(result => {
    res.json( {result: result.rows})
    })
  });

  // GETS edit map page
  router.get("/:id/edit", (req, res) => {

  });



  // POST edit map page
  router.post("/:id/edit", (req, res) => {
    res.redirect("/maps");
  });

   return router;
};
