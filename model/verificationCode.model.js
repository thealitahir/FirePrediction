/**
 * Created by ali on 12/21/2017.
 */
var mongoose = require("mongoose");
var Schema =  mongoose.Schema;

var verificationCodeSchema = new Schema({

    email:String,
    code:String
});

module.exports = mongoose.model("verificationCode",verificationCodeSchema,"verificationCode");
