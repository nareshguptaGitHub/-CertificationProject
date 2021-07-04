const express = require('express');
const router = express.Router();
const app = express();

const request = require('request');
const path = require('path');
const http = require('http');


// For encrypting Password
const bcrypt = require('bcryptjs');
// For generating Token
const jwt = require('jsonwebtoken');
//For config setting
const config = require('../config');
const newsmodel = require('../models/newsmodel');
const users = require('../models/usermodel');
const bodyParser = require('body-parser');
const LocalStorage = require('node-localstorage').LocalStorage;
const localStorage = new LocalStorage('./scratch');
let io = require('socket.io');
app.set('views', '../views');
app.set('view engine', 'ejs')


const weatherUrl = "http://api.openweathermap.org/data/2.5/forecast/daily?q=New Delhi&mode=json&units=metric&cnt=5&appid=fbf712a5a83d7305c3cda4ca8fe7ef29";

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static('../public'));


function getWeather(url) {
    // Setting URL and headers for request
    var options = {
        url: weatherUrl,
        headers: {
            'User-Agent': 'request'
        }
    };
    // Return new promise 
    return new Promise(function(resolve, reject) {
        // Do async job
        request.get(options, function(err, resp, body) {
            if (err) {
                reject(err);
            } else {
                resolve(body);
            }
        })
    })
}

router.get('/find_by_name',(req,res) =>{
    console.log(' recieveved find by name news route.',req.query.id);
    console.log(' recieveved find by params name route.',req.params.id);
    newsmodel.findOne({ _id: req.query.id }, function (err, info) {
        if(err){
            res.sendStatus(500);
        }else{
            res.send(info);
        }
     });
});

router.delete('/deleteNews',(req,res)=>{
    console.log(req.body.id);
    newsmodel.deleteOne({_id :req.body.id},function(err,info){
        if(err){
            res.send(500);
        }else{
            res.send(200);
        }
    });
});


router.put('/updateNews',(req,res)=>{
    console.log(req.body);
    console.log(req.query.newsId);
    newsmodel.findByIdAndUpdate(req.query.newsId, { title: req.body.title,description:req.body.description,imageurl:req.body.imageurl},function(err,info){
        if(err){
            res.send(500);
        }else{
            res.send(200);
        }
    });
});

router.get('/', (req, res) => {
    res.send('Received');
    // var newstype = req.params.newstype;
    
    // newsmodel.find(({newstype:newstype},{ sort: { createddate: -1 },limit: 3}), (err, result) => {
    //     if (err) {
    //         res.status(500).send(err);
    //     }
    //     else {
    //         objemplist = result;
    //         res.render('/', objemplist);

    //     }
    // });

});

router.get('/addnews', (req, res)=>{
    res.render('addNewsForm',
                {
                    invalid: req.query.invalid ? req.query.invalid : '',
                    msg: req.query.msg ? req.query.msg : '',
                    editnewsPage: false,
                    layout: './layouts/adminlayout.ejs'
                })

}
);
// Update 24 x 7 Latest News Home Page
router.get('/home',(req,res) => {
    
    var newstype = 'generic';
    
    newsmodel.find({newstype:newstype}).sort({ createddate: -1 }).limit(3).exec((err, newsList) => {
        if (err) {
            res.status(500).send(err);
        }
        else {
            //objemplist = result;
           // res.render('/', objemplist);
           console.log("Test");
            console.log(newsList);
            var dataPromise = getWeather();
            // Get user details after that get followers from URL
            //let newsList = {news1:'This is news1', news2:'This is news2', news3:'This is news3'};
            let imageList = {image1:'/images/img_nature_wide.jpg', image2:'/images/img_snow_wide.jpg', image3:'/images/img_mountains_wide.jpg'};
            dataPromise.then(JSON.parse)
                       .then(function(result) {
                            res.render('home',{result,title:'***Weather App***', newsList, imageList, layout: false});
                        })

        }
    }

    );

    

   
})

router.get('/sports',(req,res) => {
    
    var newstype = 'sports';
    
    newsmodel.find({newstype:newstype}).sort({ createddate: -1 }).limit(3).exec((err, sportsList) => {
        if (err) {
            res.status(500).send(err);
        }
        else {
            //objemplist = result;
           // res.render('/', objemplist);
           console.log("Test Sport");
           console.log(sportsList);
            var dataPromise = getWeather();
            // Get user details after that get followers from URL
            //let sportsList = {news1:'This is today\'s latest sports news1', news2:'This is today\'s latest sports news2', news3:'This is today\'s latest sports news3'};
            let spimageList = {image1:'/images/img_nature_wide.jpg', image2:'/images/img_snow_wide.jpg', image3:'/images/img_mountains_wide.jpg'};
            dataPromise.then(JSON.parse)
                       .then(function(result) {
                            res.render('sports',{result,title:'***Weather App***', sportsList, spimageList, layout: false});
                        })
        }
    });

   
})


router.get('/contactus',(req,res) => {
	res.render('contact', {layout: false});
})

// Update 24 x 7 Latest About Us Page
router.get('/aboutus',(req,res) => {
	res.render('about', {layout: false});
})

router.post('/add', (req, res) => {

    console.log(req.body);
    // var date = jQuery("#datepicker").datepicker("getDate");
    // console.log(date);
    // alert(jQuery.datepicker.formatDate("dd-mm-yy", date));
    var token = localStorage.getItem('authtoken')
    console.log(token);
    if (!token) {
        res.redirect('/admin/')
    }

    var newsobj = {
        title: req.body.title,
        description: req.body.description,
        naewsurl: req.body.url,
        imageurl: req.body.urlToImage,
        newstype: req.body.role,//req.body.newstype,
        publishedat:Date.now()//req.body.publishedat
    }
    console.log(newsobj);
    jwt.verify(token, config.secret, function (err, decoded) {
        if (err) {
            res.redirect('/admin/')
        };
        console.log(decoded);
        users.findById(decoded.id, { password: 0 }, function (err, user) {
            if (err) { res.redirect('/admin/') }
            if (!user) { res.redirect('/') }
            console.log("user post>>>");
            console.log(user);
            if (user.usertype != "admin") { res.redirect('/admin/') }
            newsmodel.create(newsobj, (err, prod) => {

                if (err) {
                    res.status(500).send(err);
                }
                else if (!prod) {
                    const string = encodeURIComponent('Error in news addition');
                    res.redirect('/news/addnews');
                    //res.redirect('/?msg=' + string);
                }
                else {

                    const string = encodeURIComponent('News added Success Fully');
                    res.redirect('/news/addnews?msg='+string);
                    //res.redirect('/addnews?msg=' + string);
                }
            })

        });
    });





})

module.exports = router;





