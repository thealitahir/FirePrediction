
/**
 * Created by haris on 11/9/2017.
 */

var mongoose = require("mongoose")
require('mongoose-double')(mongoose);
var Schema =  mongoose.Schema;

var vendorSchema = new Schema({
    first_name:String,
    last_name:String,
    email:String,
    password:String,
    phone:String,
    profile_pic:String,
    status:Boolean,
    service_status:String,
    trip_id:String,
    auth_key:String,
    rating:String,
    code:String,
    verified:Boolean,
    cover_pic:String,
    device_token:String,
    promo_code:String,
    services_id:Array,
    invite_by:String,
    account_id:String,
    tos_acceptance:Boolean,
    bank_token:String,
    external_bank_id:String,
    identity_id:Boolean,
    wallet:Number
});

vendorSchema.index({email:1});

module.exports = mongoose.model("Vendor",vendorSchema);