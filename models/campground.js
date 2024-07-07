const mongoose = require('mongoose');
const Schema =  mongoose.Schema;

const CampgroundSchema = new Schema({
    title : {
        type : String,
    },
    price: {
        type :Number,
        min : 0
    },
    image :{
        type : String,
    },
    description : { 
        type : String,
    },
    location : {
        type : String,
    },
    reviews:[{
        type : Schema.Types.ObjectId,
        ref : 'review'
}]

})

//compile the model
module.exports = mongoose.model('Campground',CampgroundSchema);