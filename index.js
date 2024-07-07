const express = require('express');
const path = require('path');//path is needed for what we do in next line
const methodOverride = require('method-override')
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate')
const session = require('express-session')
const passport = require('passport')
const LocalStrategy = require('passport-local')
const User = require('./models/user')

const campgroundsRouter = require('./routes/campgroundsRouter')
const reviewRouter = require('./routes/reviewRouter')
const userRouter = require('./routes/userRouter')


const app = express();

//use the ejs mate engine instead of default default engine
app.engine('ejs',ejsMate)
app.set('view engine','ejs');
app.set('views' , path.join(__dirname,'views')); //make views as currdir+views


mongoose.connect('mongodb://localhost:27017/yelp-camp')
.then(()=>{
    console.log("connection made");
})
.catch((err)=>{
    console.log("failed to make a db connection");
    console.log(err);
})

const sessionConfig = {
    secret : 'randomsecret',
    resave : false,
    saveUninitialized : true,
    cookie : {
        httpOnly : true,
        expires : Date.now() + 1000*60*60*24*7,
        maxAge : 1000*60*60*24*7
    }
}

app.use(express.urlencoded({extended : true}))
app.use(methodOverride('_method'))
app.use(express.static(path.join(__dirname,'public')))
app.use(session(sessionConfig))

app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))


passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.use((req,res,next) => {
    res.locals.currentUser = req.user;
    next();
})


//start the server
app.listen(3000, () => {
    console.log("works good")
})


app.use('/',userRouter);
app.use('/campgrounds/:campid/review',reviewRouter);
app.use('/campgrounds',campgroundsRouter);


app.use((err,req,res,next) => {

    const {statusCode = 500} = err;
    if(!err.message) {err.message = "page not found"}
    res.status(statusCode).render("error" , {err});
})