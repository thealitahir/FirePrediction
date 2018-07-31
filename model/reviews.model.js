/**
 * Created by ali on 11/30/2017.
 */
var mongoose = require("mongoose");
var Schema =  mongoose.Schema;

var reviewsSchema = new Schema({
    review_by:String,
    review_for:String,
    date:String,
    review:String
});

module.exports = mongoose.model("Reviews",reviewsSchema);
