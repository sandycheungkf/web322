/********************************************************************************
* WEB322 – Assignment 05
*
* I declare that this assignment is my own work in accordance with Seneca's
* Academic Integrity Policy:
*
* https://www.senecacollege.ca/about/policies/academic-integrity-policy.html
*
* Name: Kwai Fong Cheung Student ID: 111951224 Date: Nov 27 2023
*
* Published URL: https://zany-jade-jackrabbit-garb.cyclic.app/
*
********************************************************************************/
const legoData = require("./modules/legoSets");
const express = require('express');
const app = express();
const HTTP_PORT = process.env.PORT || 3000;
app.use(express.static('public'));
app.use(express.urlencoded({extended:true}));
app.set('view engine', 'ejs');

  app.get('/', (req, res) => {
    res.render('home');
  });
  
  app.get('/about', (req, res) => {
    res.render('about');
});
  
app.get("/lego/sets", async (req, res) => {
  try {
    let sets;
    if (req.query.theme) {
      sets = await legoData.getSetsByTheme(req.query.theme);
    } else {
      sets = await legoData.getAllSets();
    }
    res.render("sets", { sets: sets }); 
  } catch (err) {
    res.status(404).render("404", { message: "Unable to find requested sets." });
  }
});
  

  
  app.get("/lego/sets/:num", async (req,res)=>{
    try{
      let set = await legoData.getSetByNum(req.params.num);
      res.render("set", {set: set});
    }catch(err){
    res.status(404).render("404", {message: "Unable to find requested set."});
    }
  });

  app.get("/lego/addSet", async (req,res)=>{
    try{
      let themeData = await legoData.getAllThemes();
      res.render("addSet", { themes: themeData });
    }catch(err){
    res.status(404).render("404", {message: "Unable to add set."});
    }
  });

  app.post("/lego/addSet", async (req, res) => {
    try {
      await legoData.addSet(req.body)
      res.redirect('/lego/sets')
    } catch (err) {
      res.render("500", { message: `I'm sorry, but we have encountered the following error: ${err}` });
    }
  });
    
  app.get("/lego/editSet/:num", async (req,res)=>{
    try {
      const setNum = req.params.num;
      const setData = await legoData.getSetByNum(setNum);
      const themeData = await legoData.getAllThemes();
      res.render("editSet", { themes: themeData, set: setData });
    } catch (err) {
      res.status(404).render("404", {
        message: "No Sets found for a specific set num",
      });
    }
  });

  app.post("/lego/editSet", async (req, res) => {
    try {
      await legoData.editSet(req.body)
      res.redirect('/lego/sets')
    } catch (err) {
      res.render("500", { message: `I'm sorry, but we have encountered the following error: ${err}` });
    }
  });

  app.get("/lego/deleteSet/:num", async (req,res)=>{
    try {
      const setNum = req.params.num;
      const setData = await legoData.deleteSet(setNum);
      res.redirect('/lego/sets')
    } catch (err) {
      res.render("500", { message: `I'm sorry, but we have encountered the following error: ${err}` });
    }
  });



  app.use((req, res, next) => {
    res.status(404).render("404", {message: "I'm sorry, we're unable to find what you're looking for."});
  });

  legoData.Initialize().then(()=>{
    app.listen(HTTP_PORT, () => { console.log(`server listening on: ${HTTP_PORT}`) });
  });

