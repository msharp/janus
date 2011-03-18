var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var LinkSchema = new Schema({
     link_id : String,
     url : String,
     generate_date : Date
});   

mongoose.model('Link',LinkSchema);

// var link = mongoose.model('Link');
// exports.link = link;

