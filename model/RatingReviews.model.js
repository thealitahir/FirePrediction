/**
 * Created by admin on 4/26/2018.
 */
var mongoose = require("mongoose");
var Schema =  mongoose.Schema;

var RatingReview = new Schema({
    user_id:{type:mongoose.Schema.Types.ObjectId , ref: 'User'},
    vendor_id:{type:mongoose.Schema.Types.ObjectId , ref: 'Vendor'},
    rating:String,
    review:String,
    date:String,
    rating_by:String
});

module.exports = mongoose.model("RatingReview",RatingReview);