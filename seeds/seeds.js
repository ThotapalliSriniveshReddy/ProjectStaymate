const mongoose = require('mongoose');
const cities =  require('./cities');
const {places , descriptors} =  require('./seedHelper');
const campground = require('../models/campground');

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

mongoose.connect('mongodb://localhost:27017/yelp-camp')
.then(()=>{
    console.log("connection made");
})
.catch((err)=>{
    console.log("failed to make a db connection");
    console.log(err);
})


//delete every thing in that connection
const seedDB = async() => {
    await campground.deleteMany({});
    for(let i = 1 ; i<= 50; i++)
        {
            let newcity = cities[getRandomInt(0,cities.length-1)];
            let newtitle = `${descriptors[getRandomInt(0,descriptors.length-1)]} ${places[getRandomInt(0,places.length-1)]}`
            let p = new campground({
                title : newtitle,
                location : `${newcity.city}, ${newcity.state}`,
                image : 'https://picsum.photos/400?random=${Math.random()}',
                price: getRandomInt(50,500)*10,
                description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean fermentum vitae ex eget blandit. Sed ac justo neque. Aenean gravida nisi sit amet tellus feugiat, ultricies sodales magna congue. Donec nec mattis erat. Quisque leo sapien, varius nec ex nec, volutpat auctor libero. Ut laoreet turpis at ipsum condimentum, ut varius ex luctus. Pellentesque vel felis nec sem sagittis porttitor quis id urna. Curabitur varius fermentum ante, quis ornare orci egestas congue.'
            });
            p.save()
                .then((p) => {console.log(p)})
                .catch((e) => {console.log(e)})
        }
}


seedDB()



