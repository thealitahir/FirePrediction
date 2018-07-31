/**
 * Created by admin on 4/24/2018.
 */
var mongoose = require("mongoose");
var Schema =  mongoose.Schema;

var VehicleColorSchema = new Schema({
    color_name:String,
    color_code:String
});

module.exports = mongoose.model("VehicleColor",VehicleColorSchema);