const  express = require('express');
const Campground = require('../models/campground');
const review = require('../models/review');
const ExpressError = require('../utils/ExpressError')
const catchAsync = require('../utils/catchAsync')
const {reviewSchema} = require('../validations/schemas')
const {isLoggedIn} = require('../utils/middleware')


const router = express.Router({mergeParams: true});


const validateReview = (req,res,next) => {
    //if error is there destructure it
    const {error} = reviewSchema.validate(req.body)
    //pass the error to our error handler 
    if(error){
        throw new ExpressError(error.details.map(el => el.message).join(','),400)
    }
    else{
        next();
    }
}


router.post('/',isLoggedIn , validateReview , catchAsync(async (req,res,next) => {
    const {campid} = req.params;

    const newreview = new review({
        ...req.body.review,
        campground: campid
    });
    const savedreview = await newreview.save();
    const camp = await Campground.findById(campid);
    camp.reviews.push(savedreview);
    await camp.save();
    res.redirect(`/campgrounds/${campid}`)
}))

router.delete('/:reviewid' ,isLoggedIn, catchAsync(async (req,res,next) => {
    const {campid , reviewid} = req.params;
    const deletedReview = await review.findByIdAndDelete(reviewid);
    //get campgroud in fro deletedReview and go to it and remove this review from reviews array
    const camp = await Campground.findByIdAndUpdate(campid , {$pull : {reviews : reviewid}});
    res.redirect(`/campgrounds/${campid}#reviewsectiom`)
}))

module.exports = router;