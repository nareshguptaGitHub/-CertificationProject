const mongoose = require('mongoose');
const aboutusSchema = mongoose.Schema({
    lat:String,
    lon:String,
    location:String,
    text:String,
    city:String,
    createddate: {type:Date, default: Date.now}
});

module.exports = mongoose.model('aboutus', aboutusSchema, 'aboutus');