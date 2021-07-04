const mongoose = require('mongoose');
const weatherSchema = mongoose.Schema({
    lat:String,
    lon:String,
    appid:String,
    language:String,
    city:String,
    createddate: {type:Date, default: Date.now}
});

module.exports = mongoose.model('weather', weatherSchema, 'weather');