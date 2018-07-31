/**
 * Created by admin on 4/24/2018.
 */
var mongoose = require("mongoose");
var Schema =  mongoose.Schema;

var VehicleCompanySchema = new Schema({
    brand_name:String,
    brand_icon:String
});

module.exports = mongoose.model("VehicleCompany",VehicleCompanySchema);