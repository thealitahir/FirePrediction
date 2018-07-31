/**
 * Created by admin on 4/24/2018.
 */
var mongoose = require("mongoose");
var Schema =  mongoose.Schema;

var VehicleModelSchema = new Schema({
    model_name: String,
    company_id:{type:mongoose.Schema.Types.ObjectId , ref: 'VehicleCompany'},
    years: [],
    colors:[{type:mongoose.Schema.Types.ObjectId , ref: 'VehicleColor'}]
},{ usePushEach: true });

module.exports = mongoose.model("VehicleModel",VehicleModelSchema);