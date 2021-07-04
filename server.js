require('@babel/register')({})


const express = require('express');
const app=express();
const expressLayout = require('express-ejs-layouts');

const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const request = require('request');
const path = require('path');
const http = require('http');


const LocalStorage = require('node-localstorage').LocalStorage;
const localStorage = new LocalStorage('./scratch');
const iplocate = require("node-iplocate");
const publicIp = require('public-ip');

let io = require('socket.io');
//var port=5200;


const userroute = require('./routs/userroute');
const newsroute = require('./routs/newsroute');
const contactroute = require('./routs/contactusroute');


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.set('views', './views');
app.set('view engine', 'ejs')
app.set('port', process.env.PORT || 5200);
app.use(express.static('./public'));
app.use(expressLayout);
app.set('layoutUser', './layouts/layout.ejs');
app.set('layoutAdmin', './layouts/adminlayout.ejs');

// For encrypting Password
const bcrypt = require('bcryptjs');
// For generating Token
const jwt = require('jsonwebtoken');
//For config setting
const config = require('./config');
const users = require('./models/usermodel');

//class="<%= page_name === 'newsForm' ? 'active' : '' %>"
mongoose.connect('mongodb://127.0.0.1:27017/mydemo',{ useNewUrlParser: true, useUnifiedTopology: true }, (err)=>
{
    if(err)
    {
        console.log('Unable to connect from mango db');
    }
    // else{
    //     app.listen(port,(err)=>
    //     {
    //         if(err)
    //         {
    //             console.log('Unable to start server');
    //         }
    //         else{
    //             console.log(`Server started:${app.get('port')}`);
    //         }
    //     })
    // }
})

let server = http.createServer(app).listen(app.get('port'), function(){
    console.log("Port: " + app.get('port'));
	console.log("Express server listening on port " + app.get('port'));
});


io = require('socket.io')(server);
let numUsers = 0;

app.get('/', (req, res)=>{
   res.redirect('/admin/signin');
})

// app.get('/signup', (req, res)=>{
//     res.render('signup');
//  })
io.sockets.on('connection',  (socket) => {

    var list = io.sockets.sockets;
    var users = Object.keys(list);

    // Set the nickname property for a given client
    socket.on('nick', (nick) => {
		++numUsers;
		socket.nickname = nick;
        socket.emit('userlist', users);
    });

   

    // Relay chat data to all clients
    socket.on('chat', (data) => {
		console.log("Data: " + data.message);
            publicIp.v4().then(ip => {
                iplocate(ip).then(function(results) {
                    let respo = JSON.stringify(results.city, null, 2)
                    localStorage.setItem('userlocal',respo)
               });
            });

            //let nickname = err ? 'Anonymous' : nick;
			let nickname = socket.nickname;

            let payload = {
                message: data.message,
                nick: nickname,
                location:localStorage.getItem('userlocal')
            };

            socket.emit('chat',payload);
            socket.broadcast.emit('chat', payload);
        //});
    });
});

app.use('/admin', userroute);
app.use('/news/', newsroute);
app.use('/contact/', contactroute);


