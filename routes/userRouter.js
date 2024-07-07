const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');

const User = require('../models/user');
const passport = require('passport');

router.get('/register' , (req,res) => {
    res.render('users/register.ejs')
})

router.post('/register' ,catchAsync(async (req,res,next) => {
    try{
        const {email , username , password} = req.body;
        const newuser = new User({email , username})
        const registeredUser = await User.register(newuser , password );
        req.login(registeredUser , (err) => {
            if(err){
                return next(err);
            }
            res.redirect('/campgrounds');
        })
    }
    catch(e){
        res.redirect('/register');
    }
}))

router.get('/login' , (req,res) => {
    res.render('users/login.ejs')
})


router.post('/login' ,  passport.authenticate('local' , {failureRedirect : '/login'})  , (req,res) => {
    res.redirect('/campgrounds')
})

router.post('/logout', (req, res, next) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        res.redirect('/campgrounds');
    });
}); 

module.exports = router;