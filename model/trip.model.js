/**
 * Created by haris on 11/10/2017.
 */
var mongoose = require("mongoose");
var Schema =  mongoose.Schema;

var tripSchema = new Schema({
    user_id:String,
    user_name:String,
    user_profilepic:String,
    source_lat_lng:String,
    source_address:String,
    destination_lat_lng:String,
    destination_address:String,
    vendor_id:String,
    vendor_name:String,
    vendor_profilepic:String,
    vendor_account_id:String,
    start_time:String,
    end_time:String,
    service_id:String,
    service_name:String,
    service_price:String,
    service_icon:String,
    trip_path:String,
    vendor_rating:String,
    user_rating:String,
    map_image:String,
    vendor_account_id:String
});



module.exports = mongoose.model("Trip",tripSchema,"trips");