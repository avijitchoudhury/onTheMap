/*
 * All routes for Users are defined here
 * Since this file is loaded in server.js into api/users,
 *   these routes are mounted onto /users
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */


const express = require('express');
const router  = express.Router();
const api_key = process.env.API_KEY;


module.exports = (db) => {

  // List of all maps user has created
  router.get("/maps", (req, res) => {
    //query here to retreive data from database of the maps of the user
    let templateVars = { api_key }
    console.log('template vars!',templateVars)
    res.render("users_maps", templateVars)
  })
  // GET users create page
    router.get("/maps/create", (req, res) => {
      let templateVars = { api_key }

     res.render("create_page", templateVars)
    })

    router.get("/maps/:id", (req, res) => {
      //query here to retreive data from database of the maps of the user
      let templateVars = { api_key }
      res.render("users_maps", templateVars)
    })

    //User submits new map
    router.post("/maps/create", async (req, res) => {
      let templateVars = { api_key }
      // insert data in this route
      // Must get pin data here as well
      //make a call to get lat lng from googlemap api
      const userId = req.session.user_id
      console.log("user_id", userId)
      console.log("req.body", req.body)
      try {
        const result = await db.query(`INSERT INTO maps (user_id, title, description)
        VALUES ($1, $2, $3 ) RETURNING *`, [userId, req.body.title, req.body.description])
        console.log(result.rows[0].id)
        console.log(req.body)

        //map_id, comment, latitute, longitude
        let str = "VALUES ";
        for (let pin of req.body.markers ) {
          str+= `( ${result.rows[0].id}, 'PIN', ${pin.lat}, ${pin.lng}),`
        }

        str = str.slice(0, str.length -1) + ';';

        console.log(str);
        db.query('INSERT INTO pins (map_id, comment, latitude, longitude) ' + str).then( () => {
          console.log("THINGS WORKED!!!!!");
          res.json({status:'ok'});
        })
      } catch (err) {
        console.error(err);
      }
    })

 // GET users favorites page
  router.get("/maps/favorites", (req, res) => {
    //check if user exists, if not redirect to homepage otherwise render /users/:id/maps
    res.render("favorites")
});

  //editing specific map
  router.get("/maps/:mapId/edit", (req, res) => {
    //query to fetch mapId
    let templateVars = { api_key }
    const mapId = req.params.mapId;
    console.log("here", mapId)
    db.query(`SELECT * FROM maps
    WHERE maps.id = $1`, [mapId])
    res.render("edit_page", templateVars)
  });

  router.post("/login", (req, res) => {
    db.query(`SELECT * FROM users WHERE email = $1 AND password = $2;`, [req.body.email, req.body.password])
    .then(data => {
      if (data.rows[0]) {
        // sets the cookie user_id to the user's id
        req.session.user_id = data.rows[0].id
        console.log("req.session.user_id", data.rows[0].id)
        console.log('TEST: ', data.rows[0].id)
        res.redirect("/")//if user is logged in send them to their users page
      } else {
        res.send("fields do not match")//else send them back to the home page
      }

    })
    .catch(err => {
      console.log("got an error", err)
    })
  });

  //logout
  router.post("/logout", (req, res)=> {
    req.session = null
    res.redirect("/");
  })
   return router;
};

