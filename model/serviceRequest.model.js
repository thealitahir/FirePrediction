/**
 * Created by haris on 11/14/2017.
 */
var mongoose = require("mongoose");
var Schema =  mongoose.Schema;

var serviceRequestSchema = new Schema({
    user_id:String,
    service_id:String,
    service_note:String,
    vendor_id:String,
    user_lat:String,
    user_lng:String,
    address:String,
    request_time:String,
    request_status:Boolean,
    cancelled_vendors:Array
});

module.exports = mongoose.model("serviceRequest",serviceRequestSchema,"serviceRequests");