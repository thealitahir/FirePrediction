/**
 * Created by ali on 7/27/2018.
 */

var app = require('../app');
var firePredictor =  require("../model/firePredictorModel.js");

exports.getFirePredictorValues = function(req,res)
{
    firePredictor.find({},function(err,data)
    {
       if(err)
       {
           res.send({status:500, message:"No Data Found.", data:err});
       }
       else
       {
           res.send({status:200, message:"Record Found.", data:data});
       }
    });
}