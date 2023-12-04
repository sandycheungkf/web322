/********************************************************************************
* WEB322 – Assignment 06
*
* I declare that this assignment is my own work in accordance with Seneca's
* Academic Integrity Policy:
*
* https://www.senecacollege.ca/about/policies/academic-integrity-policy.html
*
* Name: Kwai Fong Cheung Student ID: 111951224 Date: Dec 4 2023
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
const authData = require('./modules/auth-service');
const clientSessions = require('client-sessions');

app.use(
  clientSessions({
    cookieName: 'session', 
    secret: 'o6LjQ5EVNC28ZgK64hDELM18ScpFQr', 
    duration: 2 * 60 * 1000,
    activeDuration: 1000 * 60, 
  })
);

app.use((req, res, next) => {
  res.locals.session = req.session;
  next();
});


function ensureLogin(req, res, next) {
  if (!req.session.user) {
    res.redirect('/login');
  } else {
    next();
  }
}

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

  app.post("/lego/addSet", ensureLogin, async (req, res) => {
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

  app.post("/lego/editSet", ensureLogin, async (req, res) => {
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

  app.get("/login",(req,res)=>{
    res.render('login');
  });

  app.get("/register",(req,res)=>{
    res.render('register');
  });

  app.post("/register", (req, res) => {
    authData.registerUser(req.body)
      .then(() => {
        res.render('register', { successMessage: "User created" });
      })
      .catch((err) => {
        res.render('register', { errorMessage: err.message, userName: req.body.userName });
      });
  });
  
  app.post("/login",(req, res) => {
    req.body.userAgent = req.get('User-Agent');
  
    authData
    .checkUser(req.body)
      .then((user) => {
        req.session.user = {
          userName: user.userName,
          email: user.email,
          loginHistory: user.loginHistory,
        };
        res.redirect('/lego/sets');
      })
      .catch((err) => {
        res.render('login', { errorMessage: err.message, userName: req.body.userName });
      });
  });
    
  app.get("/logout",ensureLogin,(req,res)=>{
    req.session.reset();
    res.redirect('/');
  });

  app.get("/userHistory",ensureLogin, (req,res)=>{
    res.render('userHistory');
  });

  app.use((req, res, next) => {
    res.status(404).render("404", {message: "I'm sorry, we're unable to find what you're looking for."});
  });


  legoData.Initialize()
  .then(authData.Initialize)
.then(function(){
    app.listen(HTTP_PORT, function(){
        console.log(`app listening on:  ${HTTP_PORT}`);
    });
}).catch(function(err){
    console.log(`unable to start server: ${err}`);
});




