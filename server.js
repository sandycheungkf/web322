/********************************************************************************
* WEB322 – Assignment 04
*
* I declare that this assignment is my own work in accordance with Seneca's
* Academic Integrity Policy:
*
* https://www.senecacollege.ca/about/policies/academic-integrity-policy.html
*
* Name: Kwai Fong Cheung Student ID: 111951224 Date: Nov 8 2023
*
* Published URL: https://zany-jade-jackrabbit-garb.cyclic.app/
*
********************************************************************************/
const legoData = require("./modules/legoSets");
const express = require('express');
const path = require('path');
const app = express();
const HTTP_PORT = process.env.PORT || 3000;
app.use(express.static('public'));
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.render('home');
  });
  
  app.get('/about', (req, res) => {
    res.render('about');
});
  
  app.get("/lego/sets", async (req,res)=>{
  
    try{
      if(req.query.theme){
        let sets = await legoData.getSetsByTheme(req.query.theme);
        res.render("sets", {sets: sets});
      }else{
        let sets = await legoData.getAllSets();
        res.render("sets", {sets: sets});
      }
    }catch(err){
    res.status(404).render("404", {message: "Unable to find requested sets."});    }
  
  });
  

  
  app.get("/lego/sets/:num", async (req,res)=>{
    try{
      let set = await legoData.getSetByNum(req.params.num);
      res.render("set", {set: set});
    }catch(err){
    res.status(404).render("404", {message: "Unable to find requested set."});
    }
  });
  
  app.use((req, res, next) => {
    res.status(404).render("404", {message: "I'm sorry, we're unable to find what you're looking for."});
  });
  
  
  legoData.Initialize().then(()=>{
    app.listen(HTTP_PORT, () => { console.log(`server listening on: ${HTTP_PORT}`) });
  });

