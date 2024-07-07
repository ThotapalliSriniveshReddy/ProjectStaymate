const  express = require('express');
const Campground = require('../models/campground');
const ExpressError = require('../utils/ExpressError')
const catchAsync = require('../utils/catchAsync')
const {campgroundSchema} = require('../validations/schemas')
const {isLoggedIn} = require('../utils/middleware')

const router = express.Router();

const validateCampground = (req,res,next) => {
    //if error is there destructure it
    const {error} = campgroundSchema.validate(req.body)
    //pass the error to our error handler 
    if(error){
        throw new ExpressError(error.details.map(el => el.message).join(','),400)
    }
    else{
        next();
    }
}

//index page
router.get('/' ,async (req,res) => {    
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index.ejs', {campgrounds})
})

//new page
router.get('/new' ,isLoggedIn, (req,res) => {
    res.render('campgrounds/new.ejs')
})

//show page
router.get('/:id' ,async (req,res) => {
    const id = req.params.id;
    const camp = await Campground.findById(id).populate('reviews');
    res.render('campgrounds/show.ejs', {camp})
})

//edit page
router.get('/edit/:id' ,isLoggedIn,async (req,res) => {

    const {id} = req.params;
    const camp = await Campground.findById(id)
    res.render('campgrounds/edit.ejs', {camp})
})

//new campground post
router.post('/' ,validateCampground ,isLoggedIn, catchAsync(async (req,res,next) => {
    const newCamp = new Campground(req.body.campground)
    const savedCamp = await newCamp.save();
    res.redirect(`/campgrounds/${savedCamp._id}`)
}))


//edit campgroung put
router.put('/:id' ,validateCampground ,catchAsync(async (req,res,next) => {
const {id} = req.params;
const camp = await Campground.findByIdAndUpdate(id , req.body.campground , {new : true});
res.render('campgrounds/show.ejs', {camp})
}))



//delete campgroung delete
router.delete('/:id' ,isLoggedIn,async (req,res) => {
    const {id} = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect('/campgrounds');
})

module.exports = router;