var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var ClickSchema = new Schema({

     link_id : String,
     time : Date,
     user_agent : String,
     referrer : String,
     from : String

});
mongoose.model('Click',ClickSchema);

