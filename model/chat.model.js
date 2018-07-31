/**
 * Created by ali on 2/12/2018.
 */


var mongoose = require("mongoose");
var Schema =  mongoose.Schema;

var chatSchema = new Schema({
    To:{
        id:String,
        name:String,
        pic:String
    },
    From:{
        id:String,
        name:String,
        pic:String
    },
    date:String,
    message:String,
    trip_id:String
});

module.exports = mongoose.model("ChatModel",chatSchema);