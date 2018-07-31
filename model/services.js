/**
 * Created by ali on 11/21/2017.
 */
var mongoose = require("mongoose");
var Schema =  mongoose.Schema;

var servicesSchema = new Schema({
    service_name:String,
    service_image:String,
    service_detail:String,
    service_price:String
});

module.exports = mongoose.model("services",servicesSchema, "services");