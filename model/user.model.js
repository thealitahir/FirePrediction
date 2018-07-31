
var mongoose = require("mongoose");
var Schema =  mongoose.Schema;

var userSchema = new Schema({
    first_name:String,
    last_name:String,
    email:String,
    password:String,
    phone:String,
    profile_pic:String,
    trip_id:String,
    auth_key:String,
    rating:String,
    code:String,
    verified:Boolean,
    customer_id : String,
    card_image: String,
    cover_pic :String,
    device_token:String,
    promo_code:String,
    vehicle_id :{type:mongoose.Schema.Types.ObjectId , ref: 'VehicleInfo'}
});


userSchema.index({email:1});

module.exports = mongoose.model("User",userSchema);