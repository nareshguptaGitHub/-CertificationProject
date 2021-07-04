const express = require('express');
const router = express.Router();
const app = express();



const expressLayout = require('express-ejs-layouts');
// For encrypting Password
const bcrypt = require('bcryptjs');
// For generating Token
const jwt = require('jsonwebtoken');
//For config setting
const config = require('../config');
const users = require('../models/usermodel');
const bodyParser = require('body-parser');
const newsmodel = require('../models/newsmodel');


app.set('views', '../views');
app.set('view engine', 'ejs')

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static('../public'));
//app.use(expressLayout);
//app.set('layout', './layouts/layout.ejs')

const LocalStorage = require('node-localstorage').LocalStorage;
const localStorage = new LocalStorage('./scratch');


router.get('/', (req, res) => {
    res.redirect('/admin/signin');

})

router.get('/signin', (req, res) => {
    //redirect messaging variables : msg, invalid
    res.render('signin',
        {
            invalid: req.query.invalid ? req.query.invalid : '',
            msg: req.query.msg ? req.query.msg : '',
            layout: './layouts/layout.ejs'
        })

})
router.post('/login', (req, res) => {


    users.findOne({ email: req.body.email }, (err, user) => {
        if (err) return res.status(500).send("unable to login");
        if (!user) {
            res.render('signin',
            {
                invalid: req.query.invalid ? req.query.invalid : '',
                msg: 'Please provide vaild login',
                layout: './layouts/layout.ejs'
            })
        }

        console.log(req.body.password);
        console.log(user.password);

        const isvaliduser = bcrypt.compareSync(req.body.password, user.password);
        if (isvaliduser) {
            var token = jwt.sign({ id: user._id }, config.secret, {
                expiresIn: 86400 // expires in 24 hours
            });
            localStorage.setItem('authtoken', token)
            //res.render('add'); // need to mention redirect page
            res.redirect('/news/addnews');
        }
        else {
            const string = encodeURIComponent('Please provide valid login');
            res.render('signin',
                {
                    invalid: req.query.invalid ? req.query.invalid : '',
                    msg: 'Please provide vaild login',
                    layout: './layouts/layout.ejs'
                })
        }
    })

})

router.post('/register', (req, res) => {

    const hashedPassword = bcrypt.hashSync(req.body.password, 8);
    var userobj = {
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword,
        usertype: "admin"
    }
    users.create(userobj, (err, user) => {

        if (err) {
            res.staus(500).send(err);
        }
        else {
            // create a token
            var token = jwt.sign({ id: user._id }, config.secret, {
                expiresIn: 86400 // expires in 24 hours
            });

            const string = encodeURIComponent('Success Fully Register Please Login');
            //res.redirect('/admin/?msg=' + string);
            //res.redirect('/?msg=' + string);
            res.render('signin',
                {
                    invalid: req.query.invalid ? req.query.invalid : '',
                    msg: 'Success Fully Register Please Login',
                    layout: './layouts/layout.ejs'
                })
        }
    })


})
router.get('/newsForm', (req, res) => {
    let htmlMsg = encodeURIComponent('Added New User DONE !');
    res.render('addNewsForm', { msg: htmlMsg, editnewsPage: false, layout: './layouts/adminlayout.ejs' })
});

router.get('/editnewsForm', (req, res) => {
    let htmlMsg = encodeURIComponent('Added New User DONE !');
    newsmodel.find({  }, (err, user) => {
        if (err) return res.status(500).send("unable to login");
        if (!user) {
            res.render('signin',
            {
                invalid: req.query.invalid ? req.query.invalid : '',
                msg: 'Please provide vaild login',
                layout: './layouts/layout.ejs'
            })
        }
        
        else {
            const string = encodeURIComponent('Please provide valid login');
            let data = user;
            res.render('editNewsForm', { msg:'',data: data, editnewsPage: true, layout: './layouts/adminlayout.ejs' })
        }
    })
    
});
module.exports = router;





