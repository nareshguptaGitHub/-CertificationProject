const mongoose = require('mongoose');
const userSchema = mongoose.Schema({
    name:String,
    email:String,
    password:String,
    usertype:String,
    createddate: {type:Date, default: Date.now}
});

module.exports = mongoose.model('newsuser', userSchema, 'newsuser');