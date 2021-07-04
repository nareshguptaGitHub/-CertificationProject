const express = require('express');
const router = express.Router();
const app = express();

// For encrypting Password
const bcrypt = require('bcryptjs');
// For generating Token
const jwt = require('jsonwebtoken');
//For config setting
const config = require('../config');
const contactusmodel = require('../models/contactusmodel');
const users = require('../models/usermodel');
const bodyParser = require('body-parser');
const LocalStorage = require('node-localstorage').LocalStorage;
const localStorage = new LocalStorage('./scratch');

app.set('views', '../views');
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static('../public'));


router.post('/add', (req, res) => {

    var contactObj = {
        email: req.body.email,
        query: req.body.query
        //subject: req.body.subject
    }
    console.log(contactObj);
    console.log(req.body);
  
    contactusmodel.create(contactObj, (err, prod) => {

        if (err) {
            res.staus(500).send(err);
        }
        else if (!prod) {
            const string = encodeURIComponent('Error in news addition');
            res.redirect('/news/home');
        }
        else {

            const string = encodeURIComponent('News added Success Fully');
            res.redirect('/news/home/');
        }
    });





})

module.exports = router;





