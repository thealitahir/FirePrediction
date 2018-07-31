/**
 * Created by ali on 7/27/2018.
 */

var mongoose = require("mongoose");
var Schema =  mongoose.Schema;

var firePredictorSchema = new Schema({
    RH:Number,
    wind:Number,
    rain:Number,
    temp:Number,
    FFMC:Number,
    DMC:Number,
    DC:Number,
    ISI:Number,
    BUI:Number,
    FWI:Number
});

module.exports = mongoose.model("firePredictorValues",firePredictorSchema);