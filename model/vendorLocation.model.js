/**
 * Created by haris on 11/10/2017.
 */
var mongoose = require("mongoose");
var Schema =  mongoose.Schema;

var vendorLocationSchema = new Schema({

    vendor_id:String,
    latitude:String,
    longitude:String,
    address:String
});

module.exports = mongoose.model("vendorLocation",vendorLocationSchema,"vendorLocations");