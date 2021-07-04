const mongoose = require('mongoose');
const newsSchema = mongoose.Schema({
    title:String,
    description:String,
    newsurl:String,
    imageurl:String,
    newstype:String,
    publishedat:{type:Date},
    createddate: {type:Date, default: Date.now}
});

module.exports = mongoose.model('news', newsSchema, 'news');