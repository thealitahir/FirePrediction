/**
 * Created by ali on 7/27/2018.
 */

var mongoose = require("mongoose");
var Schema =  mongoose.Schema;

var firePredictorSchema = new Schema({

});

module.exports = mongoose.model("firePredictorValues",firePredictorSchema);