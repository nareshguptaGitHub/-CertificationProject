const mongoose = require('mongoose');
const contactusSchema = mongoose.Schema({
    email:String,
    query:String,
    //subject:String,
    createddate: {type:Date, default: Date.now}
});

module.exports = mongoose.model('contactus', contactusSchema, 'contactus');