/**
 * Created by admin on 4/24/2018.
 */
var mongoose = require("mongoose");
var Schema =  mongoose.Schema;

var VehicleInfoSchema = new Schema({
    company_id:{type:mongoose.Schema.Types.ObjectId , ref: 'VehicleCompany'},
    model_id:{type:mongoose.Schema.Types.ObjectId , ref: 'VehicleModel'},
    color_id:{type:mongoose.Schema.Types.ObjectId , ref: 'VehicleColor'},
    user_id:{type:mongoose.Schema.Types.ObjectId , ref: 'User'},
    year : String
});

module.exports = mongoose.model("VehicleInfo",VehicleInfoSchema,"vehicleinfos");