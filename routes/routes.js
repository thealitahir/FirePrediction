var app = require('../app');
var passport = require('passport');
var flash = require('connect-flash');
var admin = require('../model/admin.model.js')
require('../passport')(passport,flash);
var fs = require('fs');
var csvdata = require('csvdata');
var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;
var User =  require("../model/user.model.js");
var Vendor =  require("../model/vendor.model");
var Trip =  require("../model/trip.model");
var Review =  require("../model/reviews.model");
var VendorLocation=require("../model/vendorLocation.model");
var serviceRequest=require("../model/serviceRequest.model");
var service = require("../model/services");
var VerificationCode=require("../model/verificationCode.model");
var ChatModel = require("../model/chat.model");
var geolib = require("geolib");
var crypto = require('crypto'),
    algorithm = 'aes-256-ctr',
    password = 'd6F3Efeq';
var path = require('path');
var geocoder = require('geocoder');
var random = require('generate-random-data');
const accountSid = "AC850ac130eb4ec670cd181c1d1ae2cf1b";
const authToken = "e801e2dae1ded27652f83258b5902477";
const client1 = require('twilio')(accountSid, authToken);
var nodemailer = require('nodemailer');
var elasticsearch=require('elasticsearch');
var VehicleModel =  require("../model/VehicleModel.model.js");
var VehicleCompany = require("../model/VehicleCompany.model");
var VehicleColor = require("../model/VehicleColor.model");
var VehicleInfo = require("../model/vehicleInfo.model.js");
var RatingReview = require("../model/RatingReviews.model");
var FCM = require('fcm-push');
//var await = require('await')
var stripe = require("stripe")("sk_test_Tio7eUT6kSIkdAOTQznU6o9C",{
    api_key: "pk_test_Afu4RW1Ix0wadeWJkr6iNVtq"
});
stripe.setApiVersion('2018-02-06');

var cron = require('node-cron');
var client = new elasticsearch.Client({
    hosts: [ 'http://10.0.4.206:9200']
});
var crg = require('country-reverse-geocoding').country_reverse_geocoding();
//var fs = require('fs');
//const fileUpload = require('express-fileupload');
//app.use(fileUpload());

//var socket = io.connect("http://192.168.23.74:3000");

var task= cron.schedule('* * * 1 Jan,Apr,July,Oct *',function(){
   console.log("cron running");
    Vendor.find({'invite_by':{$exists:true}}).exec(function(err,vend){
        for( var i=0;i<vend.length;i++){
          // change here for wallet transfer of vendor in invite_by
        }
    });
});

function encrypt(text)
{
    /*var cipher = crypto.createCipher(algorithm,password);
    var crypted = cipher.update(text,'utf8','hex');
    crypted += cipher.final('hex');*/
    return text;
};

function decrypt(text)
{
    /*var decipher = crypto.createDecipher(algorithm,password)
    var dec = decipher.update(text,'hex','utf8')
    dec += decipher.final('utf8');*/
    return text;
};

function generateRandomCode()
{
    var text = "";
    var possible = "1234567890";
    for(var i = 0; i < 6; i++)
    {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
};

function generateRandomCode4()
{
    var text = "";
    var possible = "1234567890";
    for(var i = 0; i < 4; i++)
    {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
};

function generateRandomString()
{
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    for(var i = 0; i < 25; i++)
    {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    text += Date.now();
    return text;
};

exports.test = function(req,res)
{
    console.log("test");
    console.log(req);

    nexmo.message.sendSms(
        123456789, '+923227879881', 'hello kamil papu', function(err, responseData){
        if (err) {
                console.log(err);
        }else {
            console.dir(responseData);
        }
    });

    /*var c = new TMClient('thealitahir', 'C7XDKZOQZo6HvhJwtUw0MBcslfqwtp4');
    c.Messages.send({text: 'Hello world', phones:'+923009498431'}, function(err, res){
        console.log('Messages.send()', err, res);
    });*/

    /*var data = new test();
    var array = [];
    for (var i =0; i < 200;  i++)
    {
        data.firstname = random.maleFirstName();
        data.middlename = random.name();
        data.lastname = random.lastName();
        data.date = random.date(1, "YYYY-MM-DD");
        if(i/2 == 0)
            data.gender = "Male";
        data.gender = "Female";
        array.push(data);
    }
    csvdata.write('./my-file.csv',data,{header: 'gemder,date,lastname,middlename,firstname,id'});
    res.send(data);*/
    /*console.log(generateRandomString());*/
};

//show login page
exports.index = function (req,res)
{
    res.render('index' , {title:'Login' , action:'/index_post_handler'});

};
exports.login = function(req,res)
{
    var key = generateRandomString();
    if(req.params != null && req.params.type == 1)
    {
        User.findOne({'email': req.params.email}).exec(function(err,requiredUser){
            if(err || requiredUser == null)
            {
                //res.status(500).json("Your account credentials do not match.");
                res.send({status:500, message:"Your account credentials do not match."});
            }
            else
            {
                //console.log(requiredUser);
               // var currnetPassword = decrypt();
                if (requiredUser.password == req.params.password)
                {
                    User.findOneAndUpdate({ 'email': req.params.email}, {$set:
                        {
                            auth_key:key
                        }},
                        {new: true}, // to show updated result
                        function(err, user)
                        {
                            if(err)
                            {
                                res.send({status:500, message:"Unable to find user"});
                                //res.stauts(500).json("Unable to find user");
                            }
                            else
                            {
                                res.send({status:200, message:"User found", data:user});
                                //res.status(200).json(user);
                            }
                        });
                }
                else{
                    res.send({status:500, message:"Your account credentials do not match."});
                    //res.status(500).json("Your account credentials do not match.");
                }
            }
        });

    }
    else if (req.params != null)
    {
        Vendor.findOne({'email': req.params.email}).exec(function(err,requiredVendor){
            if(err || requiredVendor== null)
            {
                res.send({status:500, message:"Your account credentials do not match."});
                //res.stauts(500).json("Your account credentials do not match.");
            }
            else
            {
                var currentPassword = decrypt(requiredVendor.password);
                //console.log(currentPassword);
                if(currentPassword == req.params.password) {
                    Vendor.findOneAndUpdate({ 'email': req.params.email}, {$set:
                        {
                            auth_key:key
                        }},
                        {new: true}, //to show updated result
                        function(err, vendor)
                        {
                            if(err)
                            {
                                res.send({status:500, message:"Unable to find vendor."});
                                //res.stauts(500).json("Unable to find vendor");
                            }
                            else
                            {
                                res.send({status:200, message:"Vendor found.", data:vendor});
                                //res.status(200).json(vendor);
                            }
                        });
                }
                else{
                    res.send({status:500, message:"Your account credentials do not match."});
                    //res.status(500).json("Your account credentials do not match.");
                }
            }
        });

    }
    else{
        res.send({status:404, message:"Nothing Found."});
        //res.status(404).json("Nothing Found");
    }

};

exports.logout=function(req,res)
{
    if(req.params != null && req.params.type == 1)
    {
        User.findOne({_id:req.params.id}).exec(function(err,vendor){
            if(err || vendor.auth_key != req.params.auth_key)
            {
                res.send({status:300, message:"Authentication Failed."});
                //res.status(500).json("Authentication Failed");
            }
            else
            {
                User.findOneAndUpdate({ _id: req.params.id}, {$set:
                    {
                        auth_key:""
                    }},
                    function(err, user)
                    {
                        res.send({status:200, message:"User logout."});
                        //res.status(200);
                        //res.json(true);

                    });
            }
        });

    }
    else if (req.params != null)
    {
        Vendor.findOne({_id:req.params.id}).exec(function(err,vendor){
            if(err || vendor.auth_key != req.params.auth_key)
            {
                //res.status(500).json("Authentication Failed");
                res.send({status:300, message:"Authentication Failed."});
            }
            else
            {
                Vendor.findOneAndUpdate({ 'email': req.params.email,'password':req.params.password }, {$set:
                    {
                        auth_key:""
                    }},
                    function(err, vendor) {
                        res.send({status:200, message:"Vendor logout."});
                        //res.status(200);
                        //res.json(true);

                    });
            }
        });
    }
};

exports.createTrip=function(req,res)
{

    console.log("In create trip JSON");
    if(req.body.trip.nameValuePairs == undefined)
        var tripDetails = req.body.trip;
    else
        var tripDetails = req.body.trip.nameValuePairs;
    /*console.log(req.body);
    console.log(typeof req.body.trip);
    console.log(req.body.trip);*/
    console.log(tripDetails);
    var trip = new Trip();

    Vendor.findOne({_id:tripDetails.vendor_id}).exec(function(err,vendor){
        if(vendor == null || err || vendor.auth_key != tripDetails.auth_key)
        {
            res.send({status:300, message:"Authentication Failed."});
            //res.status(500).json("Authentication Failed");
        }
        else
        {
            trip.user_id = tripDetails.user_id;
            trip.user_name = tripDetails.user_name;
            trip.user_profilepic = tripDetails.user_profilepic;
            trip.source_lat_lng = tripDetails.source_lat_lng;
            trip.source_address = tripDetails.source_address;
            trip.destination_lat_lng = tripDetails.destination_lat_lng;
            trip.destination_address = tripDetails.destination_address;
            trip.vendor_id = tripDetails.vendor_id;
            trip.vendor_name = tripDetails.vendor_name;
            trip.vendor_profilepic = tripDetails.vendor_profilepic;
            trip.vendor_account_id = tripDetails.vendor_account_id;
            trip.start_time = tripDetails.start_time;
            trip.end_time = tripDetails.end_time;
            trip.service_id = tripDetails.service_id;
            trip.service_name = tripDetails.service_name;
            trip.service_price = tripDetails.service_price;
            trip.service_icon = tripDetails.service_icon;
            trip.trip_path = tripDetails.trip_path;
            trip.map_image = tripDetails.map_image;
            trip.save(function (err, trip) {
                if (err) {
                    res.send({status:500, message:"Error in adding Trip."});
                    //res.send("Error in adding Trip");
                }
                else {
                    //assigning trip id to vendor
                    Vendor.findOneAndUpdate({_id: trip.vendor_id}, {
                            $set: {
                                trip_id: trip._id,
                                service_status: "Busy"
                            }
                        },
                        function (err, vendor) {
                            if (err) {

                            }
                            else {

                            }
                        });

                    //assigning trip id to user
                    User.findOneAndUpdate({_id: trip.user_id}, {
                            $set: {
                                trip_id: trip._id
                            }
                        },
                        function (err, user) {
                            if (err) {

                            }
                            else {

                            }
                        });
                    serviceRequest.findByIdAndRemove(tripDetails.request_id).exec(function(err, ser){
                        if(err||ser== null){
                            res.send({status:500,message:"no such service"});
                        }
                        else{
                            res.send({status:200, message:"Trip created.", data:trip});
                        }
                    });

                    //res.status(200).json(trip);
                }
            });
        }
    });

};

exports.finishTrip = function (req , res)
{
    console.log("in finishTrip");

    Vendor.findOne({_id:req.params.id}).exec(function(err,vendor) {
        if (err || req.params.auth_key != vendor.auth_key)
        {
            res.send({status:300, message:"Authentication Failed."});
            //res.status(500).json("Authentication Failed");
        }
        else
        {
            if(vendor.invite_by!= null){
                vendor.wallet=vendor.wallet+0.7;
                vendor.save(function(err,vend){
                    if (err){
                        console.log("err",err);
                    }
                    else{
                     console.log("vendor",vendor);
                    }
                })
            }
            Trip.findOneAndUpdate({"_id": {'$in': [req.params.trip_id]}}, {
                    $set: {
                        end_time: req.params.end_time
                    }
                },
                function (err, trip) {
                    if (err) {
                        res.send({status:500, message:"Error in updating."});
                        //res.send("Error in updating");
                    }
                    else {
                        Trip.findOne({_id: trip._id}).exec(function (err, value) {
                            if (err) {
                                res.send({status:500, message:"Unable to find trip."});
                                console.log("some error occured");
                            }
                            else {
                                //assigning trip id to vendor
                                Vendor.findOneAndUpdate({_id: value.vendor_id}, {
                                        $set: {
                                            trip_id: "",
                                            service_status: "Free"
                                        }
                                    },
                                    function (err, vendor) {
                                        if (err) {

                                        }
                                        else {

                                        }
                                    });

                                //assigning trip id to vendor
                                User.findOneAndUpdate({_id: value.user_id}, {
                                        $set: {
                                            trip_id: ""
                                        }
                                    },
                                    function (err, user) {
                                        if (err) {

                                        }
                                        else {

                                        }
                                    });

                                //console.log(value);
                                io.emit('finishTrip', value);
                                res.send({status:200, message:"Trip finished.", data:value});
                                //res.send(value);
                            }
                        });
                    }
                });
        }
    });

};

// update the end time of trip
exports.updateEndTime = function (req , res)
{
    Trip.findOneAndUpdate({_id:req.params.id}, {$set:
        {
            end_time:req.params.end_time
        }},
        function(err,trips)
        {
            if(err)
            {
                res.send({status:500, message:"Error in updating end time."});
                //res.send("Error in updating");
            }
            else
            {
                res.send({status:500, message:"Updated end time.", data:trips});
                //res.json(trips);
            }
        });
};

//get All Vendors
exports.getAllVendors = function(req,res)
{
    console.log("In get All Vendors Api");
    Vendor.find({}).exec( function (err ,vendors)
    {
        if(err)
        {
            res.send({status:500, message:"Unable to find vendors."});
            //res.send("Error Occurred ");
        }else
        {
            res.send({status:200, message:"vendors found.", data:vendors});
            //res.status(200).json(vendors);
        }
    });

};

exports.getVendor = function(req,res)
{
    console.log("In get Vendor Api");
    var vendorArray = [];
    User.findOne({_id:req.params.id}).exec(function(err,user) {
        if (err || req.params.auth_key != user.auth_key)
        {
            res.send({status:300, message:"Authentication Failed."});
            //res.status(500).json("Authentication Failed");
        }
        else
        {
            Vendor.findOne({_id:req.params.vendor_id}).exec(function(err,vendor){
                if(err)
                {
                    res.send({status:500, message:"Unable to find Vendor."});
                    //console.log("Unable to find Vendor");
                }
                else
                {
                    vendorArray.push(vendor);
                    VendorLocation.findOne({vendor_id:vendor._id}).exec(function(err1,vendroLoc)
                    {
                        if(err1)
                        {
                            res.send({status:500, message:"Unable to find Vendor Location."});
                            //console.log("Unable to find Vendor Location");
                        }
                        else
                        {
                            vendorArray.push(vendroLoc);
                            var data = {
                            };
                            data.array = vendorArray
                            res.send({status:200, message:"Vendor got." , data:data});
                            //res.status(200).json(vendorArray);
                        }
                    });
                }
            });
        }
    });

};

exports.getUser = function(req,res)
{
    console.log("In get User Api");
    Vendor.findOne({_id:req.params.id}).exec(function(err,vendor) {
        if (err || req.params.auth_key != vendor.auth_key)
        {
            res.send({status:300, message:"Authentication Failed."});
            //res.status(500).json("Authentication Failed");
        }
        else
        {
            User.findOne({_id:req.params.user_id}).exec(function(err,user){
                if(err)
                {
                    res.send({status:500, message:"Unable to find User."});
                    console.log("Unable to find User");
                }
                else
                {
                    res.send({status:200, message:"User found.", data:user});
                    //res.status(200).json(user);
                }
            });
        }
    });
};

exports.getVendorLocation = function(req,res)
{
    VendorLocation.find({'vendor_id':req.params.id}).exec( function (err ,vendorLoc)
    {
        if(err)
        {
            res.send({status:500, message:"Unable to find Vendor Location."});
            //res.send("Error Occurred");
        }
        else
        {
            res.send({status:200, message:"Vendor Location found.", data:vendorLoc});
            //res.status(200).json(vendorLoc);
        }
    });

};

exports.setVendorLocation = function (req , res)
{
    console.log(req.params);
    Vendor.findOne({_id:req.params.id}).exec(function(err,vendor) {
        if (err || req.params.auth_key != vendor.auth_key) {
            res.send({status:300, message:"Authentication Failed."});
            //res.status(500).json("Authentication Failed");
        }
        else
        {
            VendorLocation.findOneAndUpdate({'vendor_id':req.params.id}, {$set:
                {
                    vendor_id:req.params.id,
                    latitude:req.params.lat ,
                    longitude:req.params.lng,
                    address:req.params.address
                }},
                function(err,data)
                {
                    if(err)
                    {
                        res.send({status:500, message:"Error in updating."});
                        //res.send("Error in updating");
                    }
                    else
                    {
                        console.log("Location Updated"+data);
                        res.send({status:200, message:"Location Updated.",data:data});
                        //res.send(data);
                    }
                });
        }
    });

};

exports.getNearbyVendors=function (req, res)
{
    var nearbyVendors=[];
    var country = crg.get_country(req.params.u_lat,req.params.u_lng);
    //console.log("lat : " + req.params.u_lat + " lng : " + req.params.u_lng);
    //console.log(country.name);
    if(country.name !=null)
    {
        User.findOne({_id: req.params.id}).exec(function (err, user)
        {
            if (err || req.params.auth_key != user.auth_key) {
                res.send({status:300, message:"Authentication Failed."});
                //res.status(500).json("Authentication Failed");
            }
            else {
                Vendor.find({"status": true}).exec(function (err, vendorss) {
                    if (err) {
                        res.send({status:500, message:"Unable to find Vendor."});
                        //res.send('Error Occured');
                    } else {
                        var ids = [];
                        for (var i = 0; i < vendorss.length; i++) {
                            ids.push(vendorss[i]._id);
                        }
                        VendorLocation.find({"vendor_id": {$in: ids}}).exec(function (err, vendors) {
                            if (err) {
                                res.send({status:500, message:"unable to find vendor location."});
                                //res.send('Error Occured');
                            } else {
                                for (var j = 0; j < vendors.length; j++) {
                                    var distance = geolib.getDistance(
                                        {latitude: req.params.u_lat, longitude: req.params.u_lng},
                                        {latitude: vendors[j].latitude, longitude: vendors[j].longitude}
                                    );

                                    if (country.name == "Pakistan") {
                                        //console.log("Pakistan");
                                        distance = (distance / 1000)
                                    }else {
                                        //console.log("USA");
                                        distance = (distance / 1000) / 1.609344;
                                    }if (distance <= req.params.range) {
                                        nearbyVendors.push(vendors[j]);
                                    }
                                }
                                var data={};
                                data.array = nearbyVendors;
                                res.send({status:200, message:"Nearby Vendors." ,data:data});
                                //res.json(nearbyVendors);
                            }
                        });
                    }
                });
            }
        });
    }
};

exports.getNearestVendor=function (req, res)
{
    var nearbyVendor;
    var minDistance = req.params.range;
    var country = crg.get_country(req.params.u_lat,req.params.u_lng);
    //console.log(country.name);
    if(country.name !=null)
    {
        User.findOne({_id:req.params.id}).exec(function(err,user) {
            if (err || req.params.auth_key != user.auth_key) {
                res.send({status:300, message:"Authentication Failed."});
                //res.status(500).json("Authentication Failed");
            }
            else
            {
                Vendor.find({"status":true}).exec(function(err,vendorss) {
                    if(err){
                        res.send({status:500, message:"Unable to find Vendor."});
                        //res.send('Error Occured');
                    }else{
                        var ids = [];
                        for (var i = 0; i < vendorss.length; i++){
                            ids.push(vendorss[i]._id);
                        }
                        VendorLocation.find({"vendor_id":{$in:ids}}).exec( function (err ,vendors) {
                            if(err){
                                res.send({status:500, message:"unable to find vendor location."});
                                //res.send('Error Occured');
                            }else{
                                for(var j=0;j<vendors.length;j++){
                                    var distance = geolib.getDistance(
                                        {latitude: req.params.u_lat, longitude: req.params.u_lng},
                                        {latitude: vendors[j].latitude, longitude: vendors[j].longitude}
                                    );
                                    if (country.name == "Pakistan") {
                                        //console.log("Pakistan");
                                        distance = (distance / 1000)
                                    }else {
                                        //console.log("USA");
                                        distance = (distance / 1000) / 1.609344;
                                    }
                                    if (distance <= minDistance) {
                                        minDistance = distance
                                        nearbyVendor = vendors[j];
                                    }
                                }
                                var data={};
                                data.array = nearbyVendor;
                                res.send({status:200, message:"Nearby Vendors." ,data:data});
                                //res.json(nearbyVendor);
                            }
                        });
                    }
                });
            }
        });
    }
};


exports.requestVendor=function(req,res)
{
    console.log('in request vendor api');

    var requestData = req.body.request;
    User.findOne({_id:requestData.user_id}).exec(function(err,user) {
        if (err || requestData.auth_key != user.auth_key) {
            res.send({status:300, message:"Authentication Failed."});
            //res.status(500).json("Authentication Failed");
        }
        else
        {
            var serviceRequests= new serviceRequest();
            serviceRequests.user_id=requestData.user_id;
            serviceRequests.service_note = requestData.service_note,
            serviceRequests.service_id=requestData.service_id;
            serviceRequests.vendor_id='';
            serviceRequests.address = requestData.address;
            serviceRequests.user_lat=requestData.lat;
            serviceRequests.user_lng=requestData.lng;
            serviceRequests.request_time=requestData.request_time;
            serviceRequests.request_status=false;

            serviceRequests.save(function(err ,data)
            {
                if(err)
                {
                    res.send({status:500, message:"Error in adding Service Request."});
                    //res.send("Error in adding Service Request");
                    console.log("Simple c line");
                }
                else
                {
                    console.log(data);
                    res.send({status:200, message:"Service request added.", data:data});
                    //res.json(data);
                }
            });
        }
    });
};

exports.updateRequestStatus = function (req , res)
{
    var socketData=[]
    var vend=new Vendor();
    var vendLoc=new VendorLocation();
    console.log("In update Request status API");

    for(i = 0; i < global.timeout_functions.length;i++){
        if(global.timeout_functions[i].vendor_id == req.params.vendor_id){
            console.log(global.timeout_functions);
            clearTimeout(global.timeout_functions[i].fun);
            global.timeout_functions.splice(i);
        }
    }

    Vendor.findOne({_id:req.params.vendor_id}).exec(function(err,vendor) {
        if (err || req.params.auth_key != vendor.auth_key) {
            res.send({status:300, message:"Authentication Failed."});
            //res.status(500).json("Authentication Failed");
        }
        else
        {
            serviceRequest.find({_id:req.params.req_id}).exec(function(err,serviceReq) {

                if (err) {
                    res.send({status:500, message:"Unable to find service request."});
                    console.log("error has occurred");
                }
                else if (serviceReq[0].request_status == true){
                    console.log("true");
                    /*var json = {
                        status:"This request already accepted by some other vendor"
                    }*/
                    res.send({status:500, message:"This request already accepted by some other vendor.", data:null});
                    //res.status(200).json(json);
                    return;
                }
                else{
                    serviceRequest.findOneAndUpdate({_id:req.params.req_id}, {$set:
                        {
                            vendor_id:req.params.vendor_id,
                            request_status:req.params.request_status
                        }},
                        function(err,serviceRequestUpd)
                        {
                            if(err)
                            {
                                res.send({status:500, message:"Unable to find service request."});
                                //res.send("Error in updating");
                            }
                            else
                            {
                                console.log("Service Request Updated");
                                io.emit('hideRequest',req.params.vendor_id);
                                console.log(serviceRequestUpd.vendor_id);
                                Vendor.findOne({_id:req.params.vendor_id}).exec( function (err ,vendor)
                                {
                                    if(err)
                                    {
                                        res.send({status:500, message:"Unable to find vendor"});
                                        //res.send("Error Occurred ");
                                    }
                                    else
                                    {
                                        vend=vendor;
                                        socketData.push(req.params.req_id);
                                        socketData.push(vendor)

                                        client.search({
                                            index: 'vendorlocation',
                                            type: 'vendorlocation',
                                            q: 'vendor_id:'+ req.params.vendor_id
                                        }, function (err, response)
                                        {
                                            if(err)
                                            {
                                                res.send({status:500, message:"Unable to find vendor location"});
                                                //res.send("Error Occurred ");
                                            }
                                            else
                                            {
                                                vendLoc.vendor_id = response.hits.hits[0]._source.vendor_id;
                                                vendLoc.address = response.hits.hits[0]._source.address;
                                                vendLoc.latitude = response.hits.hits[0]._source.location.lat;
                                                vendLoc.longitude = response.hits.hits[0]._source.location.lon;

                                                socketData.push(vendLoc);
                                                io.emit('acceptRequest', socketData);
                                                serviceRequest.findOne({_id:req.params.req_id}).exec( function (err ,serviceReq)
                                                {
                                                    if(err)
                                                    {
                                                        res.send({status:500, message:"Unable to find service request"});
                                                        //res.send("Error Occurred ");
                                                    }
                                                    else
                                                    {
                                                        var map = {
                                                            user :{
                                                            }
                                                        };
                                                        map.serviceRequests = serviceReq;
                                                        User.findOne({_id:serviceReq.user_id}).exec(function(err,user) {
                                                            if (err ) {
                                                                res.send({status:500, message:"Unable to find user"});
                                                                //res.status(500).json("failed");
                                                            }
                                                            else
                                                            {
                                                                console.log(user);
                                                                map.user = user;
                                                                service.findOne({_id:serviceReq.service_id}).exec(function(err,service) {
                                                                    if (err ) {
                                                                        res.send({status:500, message:"Unable to find service"});
                                                                        //res.status(500).json("failed");
                                                                    }
                                                                    else
                                                                    {
                                                                        console.log(service);
                                                                        map.service = service;
                                                                        res.send({status:200, message:"Request status updated",data:map});
                                                                        //res.json(map);
                                                                    }
                                                                });
                                                            }
                                                        });
                                                    }
                                                });
                                            }
                                            //res.status(200).json(vendorArray);
                                        });
                                    }
                                });
                            }
                        });
                }
            });
        }
    });
};

exports.cancelRequest = function(req,res)
{

    console.log("In cancel request");
    var user_type = req.params.user_type;
    if(user_type == 1){
        User.findOne({_id:req.params.id}).exec(function(err,user) {
            if (err || req.params.auth_key != user.auth_key) {
                res.send({status:300, message:"Authentication Failed."});
                return;
                //res.status(500).json("Authentication Failed");
            }
            else
            {
                serviceRequest.findOneAndRemove({_id:req.params.req_id}, function(err,data) {
                    if (err) {
                        res.send({status:500, message:"Error in Deleting Service Request."});
                        //res.send("Error in Deleting Service Request");
                    }
                    else {
                        console.log("Service Request Deleted");
                        io.emit('cancelRequest', req.params.req_id);
                        res.send({status:200, message:"Request Canceled."});
                        //res.send(true);
                    }
                });
            }
        });
    }
    else if (user_type == 2){
        for(i = 0; i < global.timeout_functions.length;i++){
            if(global.timeout_functions[i].vendor_id == req.params.id){
                console.log(global.timeout_functions);
                clearTimeout(global.timeout_functions[i].fun);
                global.timeout_functions.splice(i);
            }
        }
        removeRequest(req.params.id,req.params.req_id,req.params.auth_key,res)
    }
};

exports.cancelRequestAndSendToOtherVendor = function(vendor_id,req_id,auth_key,res){
    for(i = 0; i < global.timeout_functions.length;i++){
        if(global.timeout_functions[i].vendor_id == vendor_id){
            global.timeout_functions.splice(i);
        }
    }
    return removeRequest(vendor_id,req_id,auth_key,res);
};

function removeRequest(vendor_id,req_id,auth_key,res){
    console.log(vendor_id);
    Vendor.findOne({_id:vendor_id}).exec(function(err,vendor) {
        if (err || auth_key != vendor.auth_key) {
            if (res)
                res.send({status: 300, message: "Authentication Failed."});
            //res.status(500).json("Authentication Failed");
        }
        else {
            serviceRequest.findOneAndUpdate({_id: req_id}, {$push: {cancelled_vendors: vendor._id}}, {new: true}, function (err, request) {
                if (err) {
                    if (res)
                        res.send({status: 500, message: "Error in finding request."});
                    //res.send("Error in Deleting Service Request");
                }
                else {

                    values = {};
                    values.request_id = request._id;
                    values.service_note = request.service_note;
                    values.user_id = request.user_id;
                    values.service_id = request.service_id;
                    values.address = request.address;
                    values.lat = request.user_lat;
                    values.lng = request.user_lng;
                    values.request_time = request.request_time;
                    if (res)
                        res.send({status: 200, message: "Request Canceled."});
                    else
                        io.emit("ServiceRequestTimeout",{vendor_id:vendor_id})
                    sendRequest(values);
                }
            });
        }
    });
}

function sendRequest(values){
    console.log("sendRequest");
    var requestData = values;
    var country = crg.get_country(requestData.lat,requestData.lng);
    if(country.name == null)
    {
        var error= {
            status:"Invalid Location"
        };
        io.emit("ErrorOccured",error);
    }
    else {
        var map = {
            user :{

            }
        };
        var vendorIds = [];

        User.findOne({"_id":{'$in':[requestData.user_id]}}).exec( function (err ,user)
        {
            if(err)
            {
                var error= {
                    status:"Unable to Find user"
                }
                io.emit("ErrorOccured",error);
                //res.send({status:500, message:"Unable to find User"});
            }
            else
            {
                map.user = user;
                var serviceRequests= new serviceRequest();
                serviceRequests._id = requestData.request_id;
                serviceRequests.service_note = requestData.service_note;
                serviceRequests.user_id=requestData.user_id;
                serviceRequests.service_id=requestData.service_id;
                serviceRequests.vendor_id='';
                serviceRequests.address = requestData.address;
                serviceRequests.user_lat=requestData.lat;
                serviceRequests.user_lng=requestData.lng;
                serviceRequests.request_time=requestData.request_time;
                serviceRequests.request_status=false;
                map.serviceRequests = serviceRequests;
                service.findOne({_id:requestData.service_id}).exec( function (err ,services)
                {
                    if(err)
                    {
                        var error= {
                            status:"Unable to save service"
                        }
                        io.emit("ErrorOccured",error);
                    }
                    else
                    {
                        VehicleInfo.findOne({user_id:requestData.user_id}).populate('company_id').populate('model_id').populate('color_id').exec(function(err,vehicleInfo){
                            if(err){
                                var error= {
                                    status:"Unable to get vehicleinfo"
                                }
                                io.emit("ErrorOccured",error);
                            }
                            else {
                                console.log("vehicleinformation",vehicleInfo);
                                if (vehicleInfo != null) {
                                    /*map.vehicleinfo.model_id = vehicleInfo.model_id;
                                     map.vehicleinfo.company_id = vehicleInfo.company_id;
                                     map.vehicleinfo.color_id = vehicleInfo.color_id;
                                     map.vehicleinfo.year = vehicleInfo.year;*/
                                    map.vehicleinfo=vehicleInfo;
                                }
                                else{
                                    console.log("vehicle id is empty");
                                }
                            }
                        });
                        map.services = services ;

                        var venLoc =new VendorLocation();
                        var distance;
                        var country = crg.get_country(requestData.lat,requestData.lng);
                        if(country.name !=null) {

                            var distance = 15;

                            if (country.name != "Pakistan") {
                                distance = distance * 1.609344;
                            }
                            client.search({
                                index: 'vendorlocation',
                                type: 'vendorlocation',
                                body: {
                                    "query": {
                                        "bool": {
                                            "must": {
                                                "match_all": {}
                                            },
                                            "filter": {
                                                "geo_distance": {
                                                    "distance":  distance + "km",
                                                    "location": {
                                                        "lat": requestData.lat,
                                                        "lon": requestData.lng
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }, function (error, response) {
                                if (error) {
                                    //res.send({status:500, message:"Unable to find vendor location."});
                                    var error= {
                                        status:"Unable to find vendor location."
                                    }
                                    io.emit("ErrorOccured",error);
                                    //res.send("error occured " + error);
                                }
                                else {
                                    serviceRequest.findOne({"_id": requestData.request_id},function(err,request){
                                        cancelled_vendors = request.cancelled_vendors;
                                        if(err){

                                        }
                                        else {
                                            var nearbyVendorsId = [];
                                            for (var i = 0; i < response.hits.hits.length; i++) {
                                                for(j=0; j<cancelled_vendors.length; j++){
                                                    if(response.hits.hits[i]._source.vendor_id == cancelled_vendors[j])
                                                        break;
                                                }
                                                if(j == cancelled_vendors.length)
                                                    nearbyVendorsId.push(response.hits.hits[i]._source.vendor_id);
                                            }
                                            Vendor.find({"_id":{$in:nearbyVendorsId}, "status": true, "service_status": "Free",services_id:requestData.service_id}).exec(function (err, vendors) {

                                                if (err) {
                                                    //res.status(500).json("Unable to find Vendor");
                                                    //res.send({status:500, message:"Unable to find Vendor."});
                                                    var error= {
                                                        status:"Unable to find vendor."
                                                    }
                                                    io.emit("ErrorOccured",error);
                                                }

                                                else {
                                                    var activeVendors = [];
                                                    loop1:
                                                        for (var j = 0; j < nearbyVendorsId.length; j++)
                                                        {
                                                            loop2:
                                                                for(var i = 0 ; i <vendors.length;i++){
                                                                    if(vendors[i]._id == nearbyVendorsId[j]){
                                                                        activeVendors.push(nearbyVendorsId[j]);
                                                                        var selected_vendor = vendors[i];
                                                                        break loop1;
                                                                    }
                                                                }
                                                        }

                                                    map.vendorIds = activeVendors;
                                                    if(activeVendors.length > 0){
                                                        console.log("***********************************************");
                                                        io.emit('serviceRequest',map);
                                                        Vendor.findOne({"_id":activeVendors[0]}).exec(function(err,vend){
                                                            if (err){
                                                                console.log("no vendor");
                                                            }
                                                            else {
                                                                console.log("vendor",vend);
                                                                sendRequestNotification(vend.device_token, map.services.service_name, requestData.request_id);
                                                            }
                                                        });
                                                        fun = setTimeout(function(){
                                                            removeRequest(activeVendors[0],requestData.request_id,selected_vendor.auth_key,null);
                                                        }, 15000);
                                                        global.timeout_functions.push({
                                                            vendor_id:activeVendors[0],
                                                            fun: fun
                                                        });
                                                    }
                                                    else{
                                                        remove_service_request(request._id);
                                                        io.emit('noVendorFound',{message:"All Vendors are busy right now! Please request again."});
                                                    }
                                                }
                                            });
                                        }
                                    });
                                }
                            });
                        }
                    }
                });
            }
        });
    }
    return;
}

function remove_service_request(request_id){
    serviceRequest.findOneAndRemove({_id:request_id}, function(err,data) {
        if (err) {
            console.log("Error in Deleting Service Request.");
        }
        else {
            console.log("Service Request Deleted");
        }
    });
}

exports.setTripRoute = function(req,res)
{
    var object = req.body.path;
    var trip_id = req.body.tripId;
    console.log("in setTripRoute");
    console.log(object);
    Vendor.findOne({_id:req.body.id}).exec(function(err,vendor) {
        if (err || req.body.auth_key != vendor.auth_key) {
            res.send({status:300, message:"Authentication Failed."});
            //res.status(500).json("Authentication Failed");
        }
        else
        {
            var json = {
                object : object,
                tripId : trip_id,
                vendor_id : req.body.id
            }
            io.emit('tripRoute', json);
            res.send({status:200, message:"Trip route set."});
            //res.send(true);
        }
    });
};

exports.getServices = function(req,res)
{
    console.log("in getServices");
    service.find({}).exec( function (err ,services)
    {
        if(err)
        {
            res.send({status:500, message:"Unable to find service."});
            ///res.send("Error Occurred ");
        }else
        {
            var data={}
            data.array = services;
            res.send({status:200, message:"All services.", data:data});
            //res.status(200).json(services);
        }
    });

};

exports.setVendorStatus = function(req,res)
{
    console.log("in setVendorStatus");
    Vendor.findOne({_id:req.params.vendor_id}).exec(function(err,vendor) {
        if (err || req.params.auth_key != vendor.auth_key) {
            res.send({status:300, message:"Authentication Failed."});
            //res.status(500).json("Authentication Failed");
        }
        else
        {
            Vendor.findOneAndUpdate({"_id":{'$in':[req.params.vendor_id]}}, {$set:
                {
                    vendor_id:req.params.vendor_id,
                    status:req.params.status
                }},
                function(err,vendor)
                {
                    if(err)
                    {
                        res.send({status:500, message:"Error in updating status."});
                        //res.send(false,"Error in updating status");
                    }
                    else
                    {
                        console.log("vendor status updated");
                        res.send({status:200, message:"vendor status set."});
                        //res.send(true);
                    }
                });
        }
    });
};

exports.editProfile = function(req,res)
{
    //first_name, last_name, phoneNo, profile_pic
    console.log("In editUserProfile");
    var userDetails = req.body.user;
    console.log(userDetails);
    if(userDetails.type==1)
    {
        User.findOne({_id:userDetails.id}).exec(function(err,user) {
            if (err || userDetails.auth_key != user.auth_key) {
                res.send({status:300, message:"Authentication Failed."});
                //res.status(500).json("Authentication Failed");
            }
            else
            {
                User.update({"_id":{'$in':[user._id]}}, {$set:
                    {
                        first_name:userDetails.first_name,
                        last_name:userDetails.last_name,
                        phone:userDetails.phone,
                        profile_pic:userDetails.profile_pic,
                        cover_pic:userDetails.cover_pic
                    }},
                    function(err,user1)
                    {
                        if(err)
                        {
                            res.send({status:500, message:"Error in updating user."});
                            //res.send(false,"Error in updating user");
                        }
                        else
                        {
                            console.log("user record updated");
                            res.send({status:200, message:"User profile edited."});
                            //res.send(true);
                        }
                    });
            }
        });
    }
    else
    {
        console.log(userDetails);
        Vendor.findOne({_id:userDetails.id}).exec(function(err,vendor) {
            if (err || userDetails.auth_key != vendor.auth_key) {
                res.send({status:300, message:"Authentication Failed."});
                //res.status(500).json("Authentication Failed");
            }
            else
            {
                Vendor.update({"_id":{'$in':[vendor._id]}}, {$set:
                    {
                        first_name:userDetails.first_name,
                        last_name:userDetails.last_name,
                        phone:userDetails.phone,
                        profile_pic:userDetails.profile_pic,
                        cover_pic:userDetails.cover_pic
                    }},
                    function(err,vendor1)
                    {
                        if(err)
                        {
                            res.send({status:500, message:"Error in updating vendor."});
                            //res.send(false,"Error in updating vendor");
                        }
                        else
                        {
                            console.log("vendor record updated");
                            console.log(vendor1);
                            res.send({status:200, message:"Vendor profile edited."});
                            //res.send(true);
                        }
                    });
            }
        });
    }
};

exports.getTrips = function(req,res)
{

    console.log("in get Trips");
    if (req.params.type == 1)
    {
        User.findOne({_id:req.params.id}).exec(function(err,user) {
            if (err || req.params.auth_key != user.auth_key) {
                res.send({status:300, message:"Authentication Failed."});
                //res.status(500).json("Authentication Failed");
            }
            else
            {
                Trip.find({user_id:req.params.id}).exec(function(err,trips){
                    if(err)
                    {
                        res.send({status:500, message:"Unable to get user trips."});
                        //res.send("Unable to get user trips");
                    }
                    else
                    {
                        var data = {};
                        data.array = trips;
                        res.send({status:200, message:"All trips.", data:data});
                        //res.send(trips);
                    }
                });
            }
        });
    }
    else if (req.params.type == 0)
    {
        var tripArray = [];
        Trip.findOne({_id:req.params.id}).exec(function(err,trips){
            if(err)
            {
                res.send({status:500, message:"Unable to get trip object."});
                //res.send("Unable to get trip object");
            }
            else
            {
                tripArray.push(trips);
                var data={};
                data.array = tripArray;
                res.send({status:200, message:"All trips.", data:data});
                //res.send(tripArray);
            }
        });
    }
    else
    {
        Vendor.findOne({_id:req.params.id}).exec(function(err,vendor) {
            if (err || req.params.auth_key != vendor.auth_key) {
                res.send({status:300, message:"Authentication Failed."});
                //res.status(500).json("Authentication Failed");
            }
            else
            {
                Trip.find({vendor_id:req.params.id}).exec(function(err,trips){
                    if(err)
                    {
                        res.send({status:500, message:"Unable to get vendor trips."});
                        //res.send("Unable to get vendor trips");
                    }
                    else
                    {
                        var data={};
                        data.array = trips;
                        res.send({status:200, message:"Vendor trips.", data:data});
                        //res.send(trips);
                    }
                });
            }
        });

    }
};

exports.register = function(req,res)
{
    console.log("in register api");
    var key = generateRandomString();
    var jsonData = req.body.details;
    console.log(jsonData);
        if (jsonData.type == 1) {
            User.findOne({'email': jsonData.email}).exec(function (err, requiredUser) {
                if(requiredUser!=null && requiredUser.phone == jsonData.phone){
                    res.send({status: 500, message: "Phone Number already exists."});
                }
                else {
                    console.log(err);
                    console.log(requiredUser);
                    if (!err && requiredUser == null) {
                        var user = new User();
                        user.first_name = jsonData.firstname;
                        user.last_name = jsonData.lastname;
                        user.email = jsonData.email;
                        user.password = encrypt(jsonData.password);
                        user.phone = jsonData.phone;
                        user.profile_pic = jsonData.profilepic;
                        user.trip_id = "";
                        user.rating = "";
                        user.auth_key = key;
                        user.verified = false;
                        user.promo_code=Date.now();
                        user.save(function (err, userData) {
                            if (err) {
                                res.send({status: 500, message: "Unable to register user."});
                                //res.send("Unable to register user");
                            }
                            else
                            {
                                res.send({status: 200, message: "True"});
                            }
                        });
                    }
                    else {/*
                     var jsonObj = {
                     key:"Email already exists",
                     status:false
                     }*/
                        res.send({status: 500, message: "Email already exists."});
                        //res.status(500).json(jsonObj);
                    }
                }
            });
        }
        else {
            Vendor.findOne({'email': jsonData.email}).exec(function (err, requiredVendor) {
                if(requiredVendor!=null && requiredVendor.phone==jsonData.phone){
                    res.send({status: 500, message: "Phone Number already exists."});
                }
                else {
                    if (!err && requiredVendor == null) {
                        var vendor = new Vendor();
                        vendor.first_name = jsonData.firstname;
                        vendor.last_name = jsonData.lastname;
                        vendor.email = jsonData.email;
                        vendor.password = encrypt(jsonData.password);
                        vendor.phone = jsonData.phone;
                        vendor.profile_pic = jsonData.profilepic;
                        vendor.trip_id = "";
                        vendor.rating = "";
                        vendor.status = true;
                        vendor.service_status = "Free";
                        vendor.auth_key = key;
                        vendor.verified = false;
                        vendor.wallet=0.0;
                        vendor.promo_code=Date.now();
                        if(jsonData.invite_by!= null){
                            Vendor.findOne({_id:jsonData.invite_by,promo_code:jsonData.promo_code}).exec(function(err,ven){
                                if(err || ven == null){
                                    res.send({status:500,message:"unable to find invite_by"})
                                }
                                else{
                                    vendor.invite_by = jsonData.invite_by;
                                    vendor.save(function (err, userData) {
                                        if (err)
                                        {
                                            res.send({status: 500, message: "Unable to register user."});
                                        }
                                        else
                                        {
                                            res.send({status: 200, message: "True"});
                                        }
                                    });
                                }
                            });
                        }
                        if(jsonData.invite_by == null){
                            vendor.save(function (err, userData) {
                                if (err) {
                                    res.send({status: 500, message: "Unable to register user."});
                                }
                                else {
                                    res.send({status: 200, message: "True"});
                                }
                            });
                        }
                    }
                    else {
                        /*var jsonObj = {
                         key:"Email already exists",
                         status:false
                         }*/
                        res.send({status: 500, message: "Email already exists."});
                        //res.status(500).json(jsonObj);
                    }
                }
            });
        }
};

exports.verifyPhone = function(req,res)
{
    var code = generateRandomCode4();
    if(req.params.type == 1)
    {
        User.findOneAndUpdate({"phone": {'$in': [req.params.phone]}},{$set:
            {
                code:code
            }},
            {new:true},
            function (err, user) {
            if (err || user == null) {
                res.send({status:500, message:"Phone number not found."});
                //res.send(false, "Error in updating password");
            }
            else {
                console.log("phone number found "  + user);
                client1.messages.create(
                    {
                        to: req.params.phone,
                        from: '+16504902147',
                        body: 'Your Phone Verifaction Code is ' + user.code
                    },function(err, message){
                        if(err)
                        {
                            console.log("Unable to send verification code." + err);
                            res.send({status:500, message:"Unable to send verification code."});
                        }
                        else
                        {
                            console.log("message sent : " +message);
                            res.send({status:200, message:"A verification code has been sent to your phone number."});
                            //res.send(userData);
                        }
                    });
            }
        });
    }
    else
    {
        Vendor.findOneAndUpdate({"phone": {'$in': [req.params.phone]}},{$set:
            {
                code:code
            }},
            {new:true},
            function (err, vendor) {
            if (err || vendor == null) {
                res.send({status:500, message:"Phone number not found."});
                //res.send(false, "Error in updating password");
            }
            else
            {
                console.log("phone number found"  + vendor);
                client1.messages.create(
                    {
                        to: req.params.phone,
                        from: '+16504902147',
                        body: 'Your Phone Verifaction Code is ' + vendor.code
                    },function(err, message){
                        if(err)
                        {
                            console.log("Unable to send verification code." + err);
                            res.send({status:500, message:"Unable to send verification code."});
                        }
                        else
                        {
                            console.log("message sent : " +message);
                            res.send({status:200, message:"A verification code has been sent to your phone number."});
                            //res.send(userData);
                        }
                    });
            }
        });
    }
};

exports.verifyCode = function(req,res)
{
    if(req.params.type == 1)
    {
        User.findOne({"phone": {'$in': [req.params.phone]}}).exec(function (err, user) {
                if (err) {
                    res.send({status:500, message:"Invalid Number."});
                    //res.send(false, "Error in updating password");
                }
                else {
                    if (req.params.code == user.code) {
                        console.log("phone number found" + user);
                        User.findOneAndUpdate({"_id": {'$in': [user._id]}}, {
                                $set: {
                                    verified: true,
                                    code: ""
                                }
                            },
                            {new: true},
                            function (err, user1) {
                                if (err) {
                                    res.send({status: 500, message: "Error in registering user."});
                                    //res.send(false,"Error in updating user");
                                }
                                else {
                                    console.log("user record updated " + JSON.stringify(user1));
                                    res.send({status: 200, message: "Code Verified.", data: user1});
                                    //res.send(true);
                                }
                            });
                    }
                    else{
                        res.send({status: 500, message: "Invalid Code."});
                    }
                }
            });
    }
    else
    {
        console.log(req.params.phone);
        Vendor.findOne({"phone": {'$in': [req.params.phone]}}).exec(function (err, vendor) {
            if (err) {
                res.send({status:500, message:"Invalid Number."});
                //res.send(false, "Error in updating password");
            }
            else {
                console.log(vendor);
                if (req.params.code == vendor.code) {
                    console.log("phone number found" + vendor);
                    Vendor.findOneAndUpdate({"_id": {'$in': [vendor._id]}}, {
                            $set: {
                                verified: true,
                                code: ""
                            }
                        },
                        {new: true},
                        function (err, vendor1) {
                            if (err) {
                                res.send({status: 500, message: "Error in registering vendor."});
                                //res.send(false,"Error in updating user");
                            }
                            else {
                                console.log("vendor record updated " + vendor1);
                                res.send({status: 200, message: "Code Verified.", data: vendor1});
                                //res.send(true);
                            }
                        });
                }
                else{
                    res.send({status: 500, message: "Invalid Code."});
                }
            }
        });
    }
};

exports.uploadImage = function(req,res)
{
    if (!req.files){
        res.send({status:400, message:"No files were uploaded."});
        //res.status(400).send('No files were uploaded.');
    }
    var sampleFile = req.files.img;
    var fileName = req.body.id + req.files.img.name;
    console.log(fileName);
    sampleFile.mv(path.resolve(__dirname + '/../public/images/uploads/' + fileName), function(err){
        if (err){
            console.log("error in uploading image" + err);
            res.send({status:500, message:"Unable to save image.", err:err});
            //return res.status(500).send(err);
        }
        else{
            var imagepath = '/images/uploads/' + fileName;
            data = {};
            data.image = imagepath
            res.send({status:200, message:"Image saved successfuly.", data:data});
            //res.status(200).json(imagepath);
        }
    });
};

exports.changePassword = function(req,res)
{
    var oldPass = req.params.oldPassword;
    var newPass = encrypt(req.params.newPassword);
    if(req.params.type == 1)
    {
        User.findOne({_id:req.params.id}).exec(function(err,user) {
            if (err || req.params.auth_key != user.auth_key) {
                res.send({status:300, message:"Authentication Failed."});
                //res.status(500).json("Authentication Failed");
            }
            else
            {
                if(oldPass != decrypt(user.password)) {
                    res.send({status:500, message:"Your old password does not match with current password."});
                    //res.stauts(500).json("Your old password does not match with current password.");
                }
                else
                {
                    User.update({"_id": {'$in': [user._id]}}, {
                            $set: {
                                password: newPass
                            }
                        },
                        function (err, user1) {
                            if (err) {
                                res.send({status:500, message:"Error in updating password."});
                                //res.send(false, "Error in updating password");
                            }
                            else {
                                console.log("user password updated");
                                res.send({status:200, message:"password updated."});
                                //res.send(true);
                            }
                        });
                }
            }
        });
    }
    else {
        Vendor.findOne({_id: req.params.id}).exec(function (err, vendor) {
            if (err || req.params.auth_key != vendor.auth_key) {
                res.send({status:300, message:"Authentication Failed."});
                //res.status(500).json("Authentication Failed");
            }
            else
            {
                if(oldPass != decrypt(vendor.password)) {
                    res.send({status:500, message:"Your old password does not match with current password."});
                    //res.status(500).json("Your old password does not match with current password.");
                }
                else
                {
                    Vendor.update({"_id": {'$in': [vendor._id]}}, {
                            $set: {
                                password: newPass
                            }
                        },
                        function (err, vendor1) {
                            if (err) {
                                res.send({status:500, message:"Error in updating password."});
                                //res.send(false, "Error in updating password");
                            }
                            else {
                                console.log("vendor record password");
                                res.send({status:200, message:"password updated."});
                                //res.send(true);
                            }
                        });
                }
            }
        });
    }
};

exports.setRating = function(req,res)
{
        var jsonObject = req.body.rate;
    //var jsonObject = req.body.rate;
    var reviews = new Review();
    var rating = 0;
    console.log(jsonObject);
    console.log(jsonObject.rating);
    if(jsonObject.type == 1)
    {
        User.findOne({_id:jsonObject.by_id}).exec(function(err,user) {
            console.log(user);
            if (err || jsonObject.auth_key != user.auth_key) {
                res.send({status:300, message:"Authentication Failed."});
                //res.status(500).json("Authentication Failed");
            }
            else
            {
                reviews.review_by = jsonObject.by_id;
                reviews.review_for = jsonObject.for_id;
                reviews.date = jsonObject.date;
                if(jsonObject.review != "")
                    reviews.review = jsonObject.review;
                if (user.rating != null && user.rating != '')
                {
                    var rounded = (parseFloat(jsonObject.rating) + parseFloat(user.rating))/2;
                    var fixed = rounded.toFixed(1);
                    rating = fixed;
                }
                else
                {
                    var rounded = parseFloat(jsonObject.rating);
                    var fixed = rounded.toFixed(1);
                    rating = fixed;
                }
                console.log(rating);
                Vendor.update({"_id": {'$in': [jsonObject.for_id]}}, {
                            $set: {
                                rating: rating
                            }
                        },
                        function (err, updatedUser) {
                            if (err) {
                                res.send({status:500, message:"Unable to update vendor rating."});
                                //res.status(500).json(false);
                            }
                            else {
                                reviews.save(function(err,review){
                                    if(err){
                                        res.send({status:500, message:"Unable to add vendor review."});
                                        //res.status(500).json(false);
                                    }
                                    else
                                    {
                                        Trip.update({"_id": {'$in': [jsonObject.trip_id]}}, {
                                                    $set: {
                                                        vendor_rating: jsonObject.rating
                                                    }
                                                },
                                                function (err, trip) {
                                                    if (err) {
                                                        res.send({status:500, message:"Unable to add rating."});
                                                        //res.status(500).json(false);
                                                    }
                                                    else {
                                                        res.send({status:200, message:"Vendor rating set."});
                                                        //res.status(200).json(true);
                                                    }
                                                });
                                    }
                                });
                            }
                        });
            }
        });
    }
    else
    {
        Vendor.findOne({_id:jsonObject.by_id}).exec(function(err,vendor) {
            console.log(vendor);
            if (err || jsonObject.auth_key != vendor.auth_key) {
                res.send({status:300, message:"Authentication Failed."});
                //res.status(500).json("Authentication Failed");
            }
            else
            {
                reviews.review_by = jsonObject.by_id;
                reviews.review_for = jsonObject.for_id;
                reviews.date = jsonObject.date;
                if(jsonObject.review != "")
                    reviews.review = jsonObject.review;
                if (vendor.rating != null && vendor.rating != '')
                {
                    var rounded = (parseFloat(jsonObject.rating) + parseFloat(vendor.rating))/2;
                    var fixed = rounded.toFixed(1);
                    rating = fixed;
                }
                else
                {
                    var rounded = parseFloat(jsonObject.rating);
                    var fixed = rounded.toFixed(1);
                    rating = fixed;
                }
                console.log(rating);
                User.update({"_id": {'$in': [jsonObject.for_id]}}, {
                            $set: {
                                rating: rating
                            }
                        },
                        function (err, updatedVendor) {
                            if (err) {
                                res.send({status:500, message:"Unable to update user rating."});
                                //res.status(500).json(false);
                            }
                            else {
                                reviews.save(function(err,review){
                                    if(err){
                                        res.send({status:500, message:"Unable to add user review."});
                                        //res.status(500).json(false);
                                    }
                                    else
                                    {
                                        Trip.update({"_id": {'$in': [jsonObject.trip_id]}}, {
                                                    $set: {
                                                        user_rating: jsonObject.rating
                                                    }
                                                },
                                                function (err, trip) {
                                                    if (err) {
                                                        res.send({status:500, message:"Unable to add user rating."});
                                                        //res.status(500).json(false);
                                                    }
                                                    else {
                                                        res.send({status:200, message:"User rating set."});
                                                        //res.status(200).json(true);
                                                    }
                                                });
                                    }
                                });
                            }
                        });
            }
        });
    }
};

exports.forgetPassword = function(req,res)
{
    var code = generateRandomCode();
    var verificationCode = new VerificationCode();
    var transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: 'dev@platalytics.com',
            pass: 'platalytics123'
        },
        tls: {
            rejectUnauthorized: false
        }
    });
    console.log(req.params.email);
    var mailOptions = {
        from: 'dev@platalytics.com',
        to: req.params.email,
        subject: 'Verification Code - RoadAngles',
        text: 'Password Reset Code:\n' + code
    };
    if(req.params != null && req.params.type == 1) {
        User.findOne({'email':req.params.email}).exec(function (err, requiredUser) {
            console.log(requiredUser);
            if (err || requiredUser == null) {
                res.send({status:500, message:"Email does not exist."});
                //res.status(500).json("Email does not exist " + err);
            }
            else
            {
                transporter.sendMail(mailOptions, function(error1, info){
                    if (error1) {
                        res.send({status:500, message:"Unable to send email."});
                        console.log(error1);
                    } else {
                        console.log('Email sent: ' + info.response);
                        VerificationCode.findOneAndUpdate({ 'email': req.params.email}, {$set:
                            {
                                email:req.params.email,
                                code:code
                            }},
                            {upsert: true},
                            function(error, dbCode)
                            {
                                if(error)
                                {
                                    res.send({status:500, message:"Unable to send email."});
                                    //res.send(false, "Some error occurred");
                                }
                                else
                                {
                                    res.send({status:200, message:"Email sent."});
                                    //res.send(true);
                                }
                            });
                    }
                });
            }
        });
    }
    else if (req.params != null)
    {
        Vendor.findOne({'email': req.params.email}).exec(function (err, requiredVendor) {
            if (err || requiredVendor == null) {
                res.send({status:500, message:"Email does not exist."});
                //res.status(500).json("Email does not exist");
            }
            else
            {
                transporter.sendMail(mailOptions, function(error1, info){
                    if (error1) {
                        console.log(error1);
                        res.send({status:500, message:"Unable to send email."});
                    } else {
                        console.log('Email sent: ' + info.response);
                        VerificationCode.findOneAndUpdate({ 'email': req.params.email}, {$set:
                            {
                                email:req.params.email,
                                code:code
                            }},
                            {upsert: true},
                            /*{new: true}, // to show updated result*/
                            function(err, dbCode)
                            {
                                if(err)
                                {
                                    res.send({status:500, message:"Unable to send email."});
                                    //res.send(false, "Some error occurred");
                                }
                                else
                                {
                                    res.send({status:200, message:"Email sent."});
                                    ///res.send(true);
                                }
                            });
                    }
                });
            }
        });
    }
};

exports.codeValidation = function(req,res)
{
    VerificationCode.findOne({'email': req.params.email}).exec(function(err,dbCode){
        if(err)
        {
            res.send({status:500, message:"Code validation failed."});
            ///res.send("Some error occured");
        }
        else
        {
            console.log("params : " + req.params);
            console.log("params : " + req.params.code);
            console.log("DB : " + dbCode.code);
            if(dbCode.code == req.params.code)
            {
                res.send({status:200, message:"Code validation successful."});
                //res.send(true);
            }
            else {
                res.send({status:500, message:"Code validation failed."});
                //res.status(500).json(false);
            }
        }
    });
};

exports.updatePassword = function(req,res)
{
    if(req.params != null && req.params.type == 1) {
        User.findOne({'email': req.params.email}).exec(function (err, requiredUser) {
            if (err || requiredUser == null) {
                res.send({status:500, message:"Email does not exist."});
                //res.status(500).json("Email does not exist");
            }
            else
            {
                User.update({"_id": {'$in': [requiredUser._id]}}, {
                        $set: {
                            password: req.params.password
                        }
                    },
                    function (err, user) {
                        if (err) {
                            res.send({status:500, message:"Error in updating password."});
                            //res.send(false, "Error in updating password");
                        }
                        else {
                            console.log("user password updated");
                            VerificationCode.remove({'email': req.params.email}, function(err, result) {
                                if (err) {
                                    res.send({status:500, message:"Error in updating password."});
                                    //console.log(err);
                                }
                                res.send({status:200, message:"password updated."});
                                //res.send(true);
                            });
                        }
                    });
            }
        });
    }
    else if (req.params != null)
    {
        Vendor.findOne({'email': req.params.email}).exec(function (err, requiredVendor) {
            if (err || requiredVendor == null) {
                res.status(500).json("Email does not exist");
            }
            else
            {
                Vendor.update({"_id": {'$in': [requiredVendor._id]}}, {
                        $set: {
                            password: req.params.password
                        }
                    },
                    function (err, vendor) {
                        if (err) {
                            res.send(false, "Error in updating password");
                        }
                        else {
                            console.log("vendor record password");
                            VerificationCode.remove({'email': req.params.email}, function(err, result) {
                                if (err) {
                                    res.send({status:500, message:"Error in updating password."});
                                    console.log(err);
                                }
                                res.send({status:200, message:"password updated."});
                                //res.send(true);
                            });
                        }
                    });
            }
        });
    }
};

exports.updateTrip = function(req,res)
{
    var tripDetails = req.body.url
    Trip.update({"_id": {'$in': [tripDetails.id]}}, {
            $set: {
                map_image: tripDetails.long_url
            }
        },
        function (err, trip) {
            if (err) {
                console.log("Unable to update trip image");
                res.send({status:500, message:"Unable to update trip image."});
                //res.status(500).json(false);
            }
            else {
                console.log("Trip image updated");
                res.send({status:200, message:"Trip image updated."});
                //res.status(200).json(true);
            }
        });
};

exports.getChats = function(req,res)
{

    console.log("in get chats api");

        /*ChatModel.find({"$or":[ {"From.id":user._id} , {"To.id":user._id} ]}).exec(function(error,chatData){
            if(error){
                res.send({status:500, message:"No chat record found."});
            }
            else{
                var data ={}
                data.array = chatData;
                res.send({status:200, message:"Chat Record found.", data:data});
            }

        });*/
        ChatModel.find({"trip_id":req.params.tripId}).exec(function(error,chatData){
            if(error){
                res.send({status:500, message:"No chat record found."});
            }
            else{
                console.log("get all chats data : " +  chatData);
                var data ={}
                data.array = chatData;
                res.send({status:200, message:"Chat Record found.", data:data});
            }

        });


   /* else{
        Vendor.findOne({_id:req.params.id}).exec(function(err,vendor) {
            if (err || req.params.auth_key != vendor.auth_key) {
                res.send({status:300, message:"Authentication Failed."});
                //res.status(500).json("Authentication Failed");
            }
            else{

                ChatModel.find({"$or":[ {"From.id":vendor._id} , {"To.id":vendor._id} ]}).exec(function(error,chatData){
                    if(error){
                        res.send({status:500, message:"No chat record found."});
                    }
                    else{
                        var data ={}
                        data.array = chatData;
                        res.send({status:200, message:"Chat Record found.", data:data});
                    }

                });

            }
        });
    }*/

};

exports.getVehicleCompany = function(req,res)
{
    console.log('In Vehicle Company');
    User.findOne({_id:req.params.id}).exec(function(err,user){
        if (err || req.params.auth_key != user.auth_key) {
           res.send({status:300, message:"Authentication Failed."});
       }
        else{
            VehicleCompany.find({}).exec(function(err,VehicleCompany){
               if(err){
                   res.send({status:500, message:"Unable to find models."});
               }
               else{
                   var data= {};
                   console.log(VehicleCompany);
                   data.array = VehicleCompany;
                   res.send({status:200, message:"All company.", data:data});
               }
           });
       }
    });
};

exports.getVehicleModel = function(req,res)
{
    console.log('In Vehicle Model');
    User.findOne({_id:req.params.id}).exec(function(err,user){
        if (err || req.params.auth_key != user.auth_key) {
            res.send({status:300, message:"Authentication Failed."});
        }
        else{
            console.log(req.params.company_id);
            VehicleModel.find({company_id: req.params.company_id})
                .populate('colors')
                .exec(function(err,requiredModel) {
                /*VehicleModel.find({}).exec(function(err,VehicleModel){
                 if(err){
                 res.send({status:500, message:"Unable to find models."});
                 }
                 else{
                 var data= {};
                 console.log(VehicleModel);
                 data.array = VehicleModel;
                 res.send({status:200, message:"All company.", data:data});
                 }
                 });*/
                if(err)
                {
                    res.send({status:500, message:"error occurred.",err:err});
                    //res.send("Unable to register user");
                }
                else{
                    var data={}
                    data.array = requiredModel;
                    res.send({status:200, message:"All required models.", data:data});
                }
            });
        }
    });
};

exports.getVehicleInfo = function(req,res)
{
    console.log('In Vehicle info');
    User.findOne({_id:req.params.id}).exec(function(err,user){
        if (err || req.params.auth_key != user.auth_key) {
            res.send({status:300, message:"Authentication Failed."});
        }
        else{
            VehicleInfo.find({user_id:req.params.id}).populate('company_id').populate('model_id').populate('color_id').exec(function(err,VehicleInfo){
                if(err){
                    res.send({status:500, message:"Unable to find models."});
                }
                else{
                    var data= {};
                    console.log(VehicleInfo);
                    data.array = VehicleInfo;
                    res.send({status:200, message:"All company.", data:data});
                }
            });
        }
    });
};

exports.setCardInfo = function(req,res)
{
    console.log('In Card Token');
    User.findOneAndUpdate({_id:req.params.id , auth_key: req.params.auth_key},
        {$set:
        {
            "customer_id":req.params.customerId,
            "card_image":req.params.cardIamge
        }},{new:true}).exec(function(err,user) {
        console.log(user);
        if (user) {
            res.send({status:200, message:"token updated"});
        }
        else {
            res.send({status: 300, message: "Authentication Failed."});
        }
    });
};

exports.setVehicleInfo = function(req,res)
{
    console.log('In Vehicle info');
    var jsonData = req.body.details;
    console.log(jsonData);
    User.findOne({'_id': jsonData.user_id}).exec(function(err,requiredUser){
        console.log(err);
        console.log(requiredUser);
        if(err || requiredUser.auth_key != jsonData.auth_key){
            res.send({status: 300, message: "Authentication Failed."});
        }
        else {
            VehicleInfo.findOne({
                user_id: jsonData.user_id,
                _company_id: jsonData.company_id,
                _model_id: jsonData.model_id,
                year: jsonData.year,
                _color_id: jsonData.color_id
            }).exec(function (err, requiredVehicleInfo) {
                if(!err && requiredVehicleInfo == null){
                    var VehicleInfos = new VehicleInfo();
                    VehicleInfos.user_id=jsonData.user_id;
                    VehicleInfos.company_id= jsonData.company_id;
                    VehicleInfos.model_id= jsonData.model_id;
                    VehicleInfos.year= jsonData.year;
                    VehicleInfos.color_id= jsonData.color_id;
                    VehicleInfos.save(function(err ,data) {
                        if (err) {
                            res.send({status: 500, message: "Error in adding VehicleInfo."});
                            console.log("Error in adding VehicleInfo", err);
                        }
                        else{
                            requiredUser.vehicle_id=data.id;
                            requiredUser.save(function(err,usr){
                                if (err){
                                    res.send({status: 500, message: "Error in adding VehicleInfoId in user."});
                                }
                                else{
                                    var data = {}
                                    //data.user_id =  usr.id;
                                    data.id=requiredUser.vehicle_id;
                                    console.log(data);
                                    res.send({status: 200, message: "VehicleInfoid in user updated",data:data});
                                }
                            });
                        }
                });
                }
                else{
                    res.send({status:500, message:"VehicleInfo already exists."});
                    console.log("error",err);
                }
            });
        }
    });
};

exports.setRatingReview = function(req,res)
{
    var jsonObject = req.body.rate;
    //var jsonObject = req.body.rate;
    var reviews = new Review();
    var RatingReviews=new RatingReview();
    var rating = 0;
    console.log(jsonObject);
    console.log(jsonObject.rating);
    if(jsonObject.type == 1)
    {
        RatingReviews.rating_by="1";
        User.findOne({_id:jsonObject.by_id}).exec(function(err,user) {
            console.log(user);
            if (err || jsonObject.auth_key != user.auth_key) {
                res.send({status:300, message:"Authentication Failed."});
                //res.status(500).json("Authentication Failed");
            }
            else
            {
                reviews.review_by = jsonObject.by_id;
                reviews.review_for = jsonObject.for_id;
                reviews.date = jsonObject.date;
                RatingReviews.user_id=jsonObject.by_id;
                RatingReviews.vendor_id=jsonObject.for_id;
                RatingReviews.date=jsonObject.date;
                if(jsonObject.review != "") {
                    reviews.review = jsonObject.review;
                    RatingReviews.review=jsonObject.review;
                }
                if (user.rating != null && user.rating != '')
                {
                    var rounded = (parseFloat(jsonObject.rating) + parseFloat(user.rating))/2;
                    var fixed = rounded.toFixed(1);
                    rating = fixed;
                    RatingReviews.rating=jsonObject.rating;
                }
                else
                {
                    var rounded = parseFloat(jsonObject.rating);
                    var fixed = rounded.toFixed(1);
                    rating = fixed;
                }
                console.log(rating);
                Vendor.update({"_id": {'$in': [jsonObject.for_id]}}, {
                        $set: {
                            rating: rating
                        }
                    },
                    function (err, updatedUser) {
                        if (err) {
                            res.send({status:500, message:"Unable to update vendor rating."});
                            //res.status(500).json(false);
                        }
                        else {
                            reviews.save(function(err,review){
                                if(err){
                                    res.send({status:500, message:"Unable to add vendor review."});
                                    //res.status(500).json(false);
                                }
                                else
                                {
                                    RatingReviews.save(function(err,RatingReview){
                                        if(err){
                                            res.send({status:500, message:"Unable to add RatingReview ."});
                                        }
                                    });
                                    Trip.update({"_id": {'$in': [jsonObject.trip_id]}}, {
                                            $set: {
                                                vendor_rating: jsonObject.rating
                                            }
                                        },
                                        function (err, trip) {
                                            if (err) {
                                                res.send({status:500, message:"Unable to add rating."});
                                                //res.status(500).json(false);
                                            }
                                            else {
                                                res.send({status:200, message:"Vendor rating set."});
                                                //res.status(200).json(true);
                                            }
                                        });
                                }
                            });
                        }
                    });
            }
        });
    }
    else
    {
        RatingReviews.rating_by="0";
        Vendor.findOne({_id:jsonObject.by_id}).exec(function(err,vendor) {
            console.log(vendor);
            if (err || jsonObject.auth_key != vendor.auth_key) {
                res.send({status:300, message:"Authentication Failed."});
                //res.status(500).json("Authentication Failed");
            }
            else {
                reviews.review_by = jsonObject.by_id;
                reviews.review_for = jsonObject.for_id;
                reviews.date = jsonObject.date;
                RatingReviews.vendor_id = jsonObject.by_id;
                RatingReviews.user_id = jsonObject.for_id;
                RatingReviews.date = jsonObject.date;
                if (jsonObject.review != "") {
                    reviews.review = jsonObject.review;
                    RatingReviews.review=jsonObject.review;
                }
                if (vendor.rating != null && vendor.rating != '')
                {
                    var rounded = (parseFloat(jsonObject.rating) + parseFloat(vendor.rating))/2;
                    var fixed = rounded.toFixed(1);
                    rating = fixed;
                    RatingReviews.rating=jsonObject.rating;
                }
                else
                {
                    var rounded = parseFloat(jsonObject.rating);
                    var fixed = rounded.toFixed(1);
                    rating = fixed;
                }
                console.log(rating);
                User.update({"_id": {'$in': [jsonObject.for_id]}}, {
                        $set: {
                            rating: rating
                        }
                    },
                    function (err, updatedVendor) {
                        if (err) {
                            res.send({status:500, message:"Unable to update user rating."});
                            //res.status(500).json(false);
                        }
                        else {
                            reviews.save(function(err,review){
                                if(err){
                                    res.send({status:500, message:"Unable to add user review."});
                                    //res.status(500).json(false);
                                }
                                else
                                {
                                    RatingReviews.save(function(err,RatingReviews){
                                        if(err) {
                                            res.send({status: 500, message: "Unable to add user RatingReviews."});
                                        }
                                    });
                                    Trip.update({"_id": {'$in': [jsonObject.trip_id]}}, {
                                            $set: {
                                                user_rating: jsonObject.rating
                                            }
                                        },
                                        function (err, trip) {
                                            if (err) {
                                                res.send({status:500, message:"Unable to add user rating."});
                                                //res.status(500).json(false);
                                            }
                                            else {
                                                res.send({status:200, message:"User rating set."});
                                                //res.status(200).json(true);
                                            }
                                        });
                                }
                            });
                        }
                    });
            }
        });
    }
};

exports.getRatingReview= function(req,res)
{
    if(req.params.type == 1){
        User.findOne({_id:req.params.id}).exec(function(err,user){
            console.log(user);
           if(err || user.auth_key != req.params.auth_key){
               res.send({status:300, message:"Authentication Failed."});
           }
            else{
              /* RatingReview.find({user_id:req.params.id,rating_by:"0"}).populate('vendor_id').exec(function(err,RatingReviews){
                   console.log(RatingReviews);*/
               RatingReview.aggregate([
                   {
                       $lookup: {
                           from: "vendors",
                           localField: "vendor_id",
                           foreignField: "_id",
                           as: "user"
                       }
                   },
                   {
                       $match:{
                           "user_id": mongoose.Types.ObjectId(req.params.id),
                           "rating_by":"0"
                       }
                   }

               ]).exec(function (err, RatingReviews) {
                   if(err){
                       res.send({status:500, message:"ratingreview err",error:err});
                   }
                   else{
                       var data={};
                       data.array=RatingReviews;
                       res.send({status:200,message:"RatingReview data user",data:data});
                   }
               });
           }
        });
    }
    else{
        Vendor.findOne({_id:req.params.id}).exec(function(err,vendor){
            if(err || vendor.auth_key != req.params.auth_key){
                res.send({status:300, message:"Authentication Failed."});
            }
            else{
                //RatingReview.find({vendor_id:req.params.id,rating_by:"1"}).populate('user_id').exec(function(err,RatingReviews){
                RatingReview.aggregate([
                    {
                        $lookup: {
                            from: "users",
                            localField: "user_id",
                            foreignField: "_id",
                            as: "user"
                        }
                    },
                    {
                        $match:{
                            "vendor_id": mongoose.Types.ObjectId(req.params.id),
                            "rating_by":"1"
                        }
                    }

                ]).exec(function (err, RatingReviews) {
                    if(err){
                        res.send({status:500, message:"ratingreview err",error:err});
                    }
                    else{
                        var data={};
                        data.array=RatingReviews;
                        res.send({status:200,message:"RatingReview data vendor",data:data});
                    }
                });
            }
        });
    }
};

exports.UpdateVendorServices=function(req,res)
{
    var jsonObject = req.body.data;
    var str= req.body.data.service_id;
    //console.log(str);
    var temp = new Array();
    temp = str.split(",");
    Vendor.findOne({_id : req.body.data.id}).exec(function(err,vendor) {
        if (err || req.body.data.auth_key!= vendor.auth_key) {
            res.send({status: 300, message: "Authentication Failed."});
        }
        else {
            Vendor.update({"_id": {'$in': [req.body.data.id]}}, {
                    $set: {
                        services_id: temp
                    }
                },
                function (err, vendor) {
                    if (err) {
                        res.send({status: 300, message: "data not saved.", "err": err});
                    }
                    else {
                        res.send({status: 200, message: "data sent"});
                    }
                });
        }
    });
};

exports.UpdatePhoneNumber=function(req,res)
{
    console.log("in register api");
    var key = generateRandomString();
    var jsonData = req.body.details;
    console.log(jsonData);
    if (jsonData.type == 1) {
        User.findOne({'_id': jsonData.id}).exec(function (err, requiredUser) {
            console.log(err);
            console.log(requiredUser);
            if (err || requiredUser == null || requiredUser.auth_key != jsonData.auth_key) {
                res.send({status: 500, message: "user does not exists."});
            }
            else{
                if(requiredUser.phone == jsonData.phone){
                    res.send({status: 500, message: "phone number is same."});
                }
                else{
                    requiredUser.phone = jsonData.phone;
                    requiredUser.verified="false";
                    requiredUser.save(function (err, userData) {
                       if(err){
                           res.send({status: 500, message: "error updating."});
                       }
                        else{
                           res.send({status: 200, message: "Phone number updated."});
                       }
                    });
                }
            }
        });
    }
    else{
        Vendor.findOne({'_id': jsonData.id}).exec(function (err, requiredVendor) {
            console.log(err);
            console.log(requiredVendor);
            if (err || requiredVendor == null|| requiredUser.auth_key != jsonData.auth_key) {
                res.send({status: 500, message: "Vendor does not exists."});
            }
            else{
                if(requiredVendor.phone == jsonData.phone){
                    res.send({status: 500, message: "phone number is same."});
                    }
                else{
                    requiredVendor.phone = jsonData.phone;
                    requiredVendor.verified="false";
                    requiredVendor.save(function (err, userData) {
                        if(err){
                            res.send({status: 500, message: "error updating."});
                        }
                        else{
                            res.send({status: 200, message: "Phone number updated."});
                        }
                    });
                }
            }
        });
    }
};

exports.chargePayment = function(req,res)
{
    // Set your secret key: remember to change this to your live secret key in production
    // See your keys here: https://dashboard.stripe.com/account/apikeys
        console.log(req.body);

    /*var stripe = require("stripe")(req.body.details.secret_key,{
        api_key: req.body.details.api_key
    });*/

    // Token is created using Checkout or Elements!
    // Get the payment token ID submitted by the form:
    var customerId = req.body.details.customer_id;
    var amount = req.body.details.amount;
    var currency = req.body.details.currency;

    // Charge the user's card:
    stripe.charges.create({
        amount: amount,
        currency: currency,
        customer: customerId
    }, function(err, charge) {
        if(!err)
            res.send({status:200, message:"Card charged.", data:charge});
        else{
            console.log(err);
            res.send({status:err.raw.statusCode , message:err.raw.message, data:err.raw})
        }
    });
};

exports.chargeAndTransferPayment = function(req,res)
{
    // Set your secret key: remember to change this to your live secret key in production
    // See your keys here: https://dashboard.stripe.com/account/apikeys
        console.log(req.body);

    /*var stripe = require("stripe")(req.body.details.secret_key,{
        api_key: req.body.details.api_key
    });*/

    // Token is created using Checkout or Elements!
    // Get the payment token ID submitted by the form:
    var sourceId = req.body.details.source_id;
    var amount = req.body.details.amount;
    var currency = req.body.details.currency;
    var destinationAccountId = req.body.details.destination_account_id;

    // Charge the user's card:
    stripe.charges.create({
        amount: amount,
        currency: currency,
        source: sourceId,
        destination: {
            account: destinationAccountId,
          }
    }, function(err, charge) {
        if(!err)
            res.send({status:200, message:"Card charged.", data:charge});
        else{
            console.log(err);
            res.send({status:err.raw.statusCode , message:err.raw.message, data:err.raw})
        }
    });
};

exports.getCustomerId = function(req,res)
{
    console.log(req.body.details);
    /*var stripe = require("stripe")(req.body.details.secret_key,{
        api_key: req.body.details.api_key
    });*/
    stripe.customers.create({
        source: req.body.details.token,
        email: req.body.details.email
    }, function(err, cutomer){
      if(err)
      {
          console.log(err);
          res.send({status:500, message:"Unable to get customer id.", data:err});
      }
      else
      {
          console.log(cutomer.id);
          data = {};
          data.customerId = cutomer.id;
          res.send({status:200, message:"User access token updated.", data:data});
          /*User.findOneAndUpdate({"_id": req.body.details.id},{$set:
              {
                  customer_id:cutomer.id
              }},
              {new:true},
              function (error, user) {
                  if (error || user.auth_key != req.body.details.auth_key)
                  {
                      res.send({status:300, message:"Authentication Failed."});
                      //res.send(false, "Error in updating password");
                  }
                  else
                  {

                  }
              });*/
      }
    });
};

exports.setDeviceToken = function(req,res)
{
    if(req.params.type==1){
        User.findOne({'_id': req.params.id}).exec(function (err, requiredUser) {
            if(err || req.params.auth_key != requiredUser.auth_key){
                res.send({status: 300, message: "Authentication failed."})
            }
            else {
                requiredUser.device_token = req.params.device_token;
                requiredUser.save(function (err, userData) {
                    if (err) {
                        res.send({status: 500, message: "error updating."});
                    }
                    else {
                        res.send({status: 200, message: "user device token updated."});
                    }
                    // res.send({status: 200, message: "user Device Token Updated"})
                });
            }
        });
    }
    else{
        Vendor.findOne({'_id': req.params.id}).exec(function (err, requiredvendor) {
            if(err || req.params.auth_key != requiredvendor.auth_key){
                res.send({status: 300, message: "Authentication failed."})
            }
            else{
                requiredvendor.device_token = req.params.device_token;
                requiredvendor.save(function (err, userData) {
                    if (err) {
                        res.send({status: 500, message: "error updating."});
                    }
                    else {
                        res.send({status: 200, message: "vendor Device Token Updated"});
                    }
                    // res.send({status: 200, message: "user Device Token Updated"})
                });
            }
        });
    }
};

//stripe account

exports.createStripeAccount = function(req,res)
{
    /*stripe.accounts.createExternalAccount(ACCOUNT_ID, {
        external_account:TOKEN_ID},function(err,bank_account){

    });*/
    Vendor.findOne({email:req.params.email}).exec(function(err,vendor){
        if(vendor.auth_key==req.params.auth_key) {
            if (!err && vendor.account_id == null) {
                stripe.accounts.create({
                    type: req.params.type,
                    country: req.params.country,
                    email: req.params.email
                }, function (err, account) {
                    // asynchronously called
                    vendor.account_id = account.id;
                    vendor.save(function (err, vend) {
                        if (!err) {
                            res.send({status: 200, message: "account created", data: account});
                        }
                    })


                });
            }
            else {
                res.send({status: 500, message: "account exists already"});
            }
        }
        else{
            res.send({status:300,message:"Authentication Failed"});
        }
    });



};

exports.updateAccountTOS =function (req,res)
{
    console.log(req.params);
    var ip = req.params.ip;
    Vendor.findOne({_id:req.params.id}).exec(function(err,vendor) {
        if(vendor.auth_key==req.params.auth_key) {
            stripe.accounts.update(
                req.params.account_id,
                {
                    tos_acceptance: {
                        date: Math.floor(Date.now() / 1000),
                        ip: ip // Assumes you're not using a proxy
                    }
                }
            )
            vendor.tos_acceptance = true;
            vendor.save(function (err, vend) {
                if (!err) {
                    res.send({status: 200, message: "TOS service updated", data: vend});
                }
                else{
                    res.send({status:500,message:"TOS SERVICE NOT UPDATED",err:err});
                }
            })
        }
        else{
            res.send({status:300,message:"Authentication failed"})
        }
    });
};

exports.connectExternalAccount = function(req,res)
{
    Vendor.findOne({_id:req.params.id}).exec(function(err,vendor){
        if(vendor.auth_key==req.params.auth_key) {
            stripe.accounts.createExternalAccount(
                req.params.account_id,
                {external_account: req.params.token_id},
                function (err, card) {
                    if (err) {
                        res.send({status: 500, message: "error", err: err});
                    }
                    else {
                        vendor.external_bank_id=card.id;
                        vendor.save(function (err, vend) {
                            if (!err) {
                                res.send({status: 200, message: "External Bank Account Added", data: card});
                            }
                            else{
                                res.send({stauts:500,message:"external_bank_id not saved",err:err});
                            }
                        })
                    }
                    // asynchronously called
                }
            );
        }
        else{
            res.send({status:300,message:"Authentication Failed"})
        }
    });
};

exports.transferFunds = function(req,res)
{
    console.log(req.params);
    var amount = req.params.amount;
    var currency= req.params.currency;
    var destination =req.params.destination;
    var source_transaction=req.params.source_transaction;//charge payment api hit from android side
    User.findOne({_id:req.params.id}).exec(function(error,user) {
        if (user.auth_key== req.params.auth_key) {
            stripe.transfers.create({
                amount: amount,
                destination: destination,
                currency: currency,
                source_transaction: source_transaction

            }, function (err, transfer) {
                // asynchronously called
                if (err) {
                    res.send({status: 500, message: "Error", err: err});
                }
                else {
                    res.send({status: 200, message: "Funds Transfered", data: transfer});
                }
            });
        }
        else{
            res.send({status:300,message:"Authentication Failed",err:error});
        }
    });
};

exports.bankToken=function(req,res)
{
    var JsonObject=req.body.details;
    Vendor.findOne({_id:JsonObject.id}).exec(function(err,vendor)
    {
        if(vendor.auth_key==JsonObject.auth_key) {
            stripe.tokens.create({
                bank_account: {
                    country: JsonObject.country,
                    currency: JsonObject.currency,
                    account_holder_name: JsonObject.account_holder_name,
                    account_holder_type: JsonObject.account_holder_type,
                    routing_number: JsonObject.routing_number,
                    account_number: JsonObject.account_number
                }
            }, function (error, token) {
                // asynchronously called
                if (!error) {
                    vendor.bank_token= token.id;
                    vendor.save(function (err, vend) {
                        if (!err) {
                            res.send({status: 200, message: "Bank Token Created", data: token});
                        }
                        else{
                            console.log(err);
                            res.send({status:500,message:"Bank Token Not Saved",err:err});

                        }
                    })
                }
                else {
                    res.send({status: 500, message: "bank token error", err: error});
                }
            });
        }
        else{
            res.send({status:300,message:"Authentication failed"});
        }
    });
};

exports.createIdentity=function(req,res)
{
    var JsonObject=req.body.details;
    console.log(JsonObject);
    var first = JsonObject.first_name;
    var last = JsonObject.last_name;
    var dateofb = JsonObject.dob;
    var add = JsonObject.address;

    Vendor.findOne({_id:JsonObject.id}).exec(function(err,vendor){
        if(JsonObject.auth_key==vendor.auth_key){
            console.log("in stripe update");
            var date_t = new Date();
            console.log(date_t)
            stripe.accounts.update(
                JsonObject.account_id,
                {
                    legal_entity: {
                        additional_owners: {
                            0:{
                                first_name: JsonObject.first_name,
                                last_name: JsonObject.last_name,
                                dob:{
                                    day:JsonObject.day,
                                    month:JsonObject.month,
                                    year:JsonObject.year
                                },
                                address:{
                                    city:JsonObject.city,
                                    country:JsonObject.country,
                                    line1:JsonObject.line1,
                                    line2:JsonObject.line2,
                                    postal_code:JsonObject.postal_code,
                                    state:JsonObject.state
                                }
                            }
                        }
                    }
                }
                ,function(err,data){
                console.log("sadfalksjdf")
                if(!err){
                    vendor.identity_id=true;
                    vendor.save(function (error, vend) {
                        if (!error) {
                            res.send({status: 200, message: "IdentityId Updated", data: vend});
                        }
                        else{
                            res.send({status:500,message:"IdentityId Not Saved",err:error});
                            console.log("error",error);
                        }
                    })
                }
                else{
                    res.send({status:500,message:"error in updating user info",err:err});
                    console.log(err);
                }
            });

        }
        else{
            res.send({status:300,message:"Authentication Failed"})
        }
    })
};

// front end
exports.getUsers= function(req,res)
{
    User.find({}, function(err, users){
        if(err)
        {
            res.send({status:500, message:"Unable to get users.", data:users});
        }
        else
        {
            res.send({status:200, message:"Users found", data:users});
        }
    });
};

function sendRequestNotification(token,name,request_id)
{
    var serverKey = 'AAAABYCB890:APA91bH1_vqX6KdypU7mx9NRjrvrbmncXganeRwIAi-UdadnmCS9w_As7yOW-G5CqcjWnQKUyPu6C8txTGu7KSNfxNSljbQ7GlXHdGa4mCEp2gvYWwtmvRYLC79WcXUaqeNH7j7rtblC';
    var fcm = new FCM(serverKey);

    var message = {
        to: token, // required fill with device token or topics
        collapse_key: 'green',
        data: {
            request_id: request_id
        },
        notification: {
            title: '1 New Request',
            body: 'Got new service request : '+ name
           // click_action: 'com.platalytics.roadangles.Activities.SplashActivity'
        }
    };

//callback style
    fcm.send(message, function(err, response){
        if (err) {
            console.log("Something has gone wrong!",err);
        } else {
            console.log("Successfully sent with response: ", response);
        }
    });
};

exports.getRequest =function(req,res)
{
    Vendor.findOne({'_id': req.params.userid}).exec(function (err, requiredvendor) {
        if(err || req.params.auth_key != requiredvendor.auth_key){
            res.send({status: 300, message: "Authentication failed."})
        }
        else{

            serviceRequest.findOne({'_id':req.params.id}).exec(function(err,ser){
                console.log("getRequest");
                var requestData = ser;
                console.log("request_data",requestData);
                var country = crg.get_country(requestData.lat,requestData.lng);
                if(country.name == null)
                {
                    var error= {
                        status:"Invalid Location"
                    };
                    console.log("error occoured",error);
                }
                else {
                    var map = {
                        user :{

                        }
                    };
                    var vendorIds = [];

                    User.findOne({"_id":{'$in':[requestData.user_id]}}).exec( function (err ,user)
                    {
                        if(err)
                        {
                            var error= {
                                status:"Unable to Find user"
                            }
                            console.log("error occoured",error);
                            //res.send({status:500, message:"Unable to find User"});
                        }
                        else
                        {
                            console.log(user);
                            map.user = user;
                            service.findOne({_id:requestData.service_id}).exec( function (err ,services)
                            {
                                if(err)
                                {
                                    var error= {
                                        status:"Unable to save service"
                                    }
                                    console.log("error occoured",error);
                                }
                                else
                                {
                                    VehicleInfo.findOne({user_id:requestData.user_id}).populate('company_id').populate('model_id').populate('color_id').exec(function(err,vehicleInfo){
                                        if(err){
                                            var error= {
                                                status:"Unable to get vehicleinfo"
                                            }
                                            console.log("error occoured",error);
                                        }
                                        else {
                                            console.log("vehicleinformation",vehicleInfo);
                                            map.vehicleinfo=vehicleInfo;
                                        }
                                    });
                                    console.log("services",services);
                                    map.services = services ;

                                    var venLoc =new VendorLocation();
                                    var distance;
                                    var country = crg.get_country(requestData.user_lat,requestData.user_lng);
                                    if(country.name !=null) {

                                        var distance = 15;

                                        if (country.name != "Pakistan") {
                                            distance = distance * 1.609344;
                                        }
                                        client.search({
                                            index: 'vendorlocation',
                                            type: 'vendorlocation',
                                            body: {
                                                "query": {
                                                    "bool": {
                                                        "must": {
                                                            "match_all": {}
                                                        },
                                                        "filter": {
                                                            "geo_distance": {
                                                                "distance":  distance + "km",
                                                                "location": {
                                                                    "lat": requestData.user_lat,
                                                                    "lon": requestData.user_lng
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }, function (error, response) {
                                            if (error) {
                                                //res.send({status:500, message:"Unable to find vendor location."});
                                                var error= {
                                                    status:"Unable to find vendor location."
                                                }
                                                console.log("error occoured",error);
                                                //res.send("error occured " + error);
                                            }
                                            else {
                                                cancelled_vendors = ser.cancelled_vendors;
                                                var nearbyVendorsId = [];
                                                for (var i = 0; i < response.hits.hits.length; i++) {
                                                    for(j=0; j<cancelled_vendors.length; j++){
                                                        if(response.hits.hits[i]._source.vendor_id == cancelled_vendors[j])
                                                            break;
                                                    }
                                                    if(j == cancelled_vendors.length)
                                                        nearbyVendorsId.push(response.hits.hits[i]._source.vendor_id);
                                                }
                                                Vendor.find({"_id":{$in:nearbyVendorsId}, "status": true, "service_status": "Free",services_id:requestData.service_id}).exec(function (err, vendors) {

                                                    if (err) {
                                                        var error= {
                                                            status:"Unable to find vendor."
                                                        }
                                                        console.log("error occoured",error);
                                                    }
                                                    else {
                                                        var activeVendors = [];
                                                        loop1:
                                                            for (var j = 0; j < nearbyVendorsId.length; j++)
                                                            {
                                                                loop2:
                                                                    for(var i = 0 ; i <vendors.length;i++){
                                                                        if(vendors[i]._id == nearbyVendorsId[j]){
                                                                            activeVendors.push(nearbyVendorsId[j]);
                                                                            var selected_vendor = vendors[i];
                                                                            break loop1;
                                                                        }
                                                                    }
                                                            }
                                                        map.vendorIds = activeVendors;
                                                        map.serviceRequests =ser;
                                                        console.log("map",map);
                                                        res.send({status:200,message:"all data",data:map});
                                                    }
                                                });
                                            }
                                        });
                                    }
                                }
                            });
                        }
                    });
                    console.log(map);
                }
            });
        }
    });
};

exports.userdelete=function(req,res)
{
    User.findOne({_id:req.params.id}).exec(function(err,usr){
        if(!err&& usr){
            usr.remove();
            res.send({status:200,message:"user removed"});
        }
        else{
            res.send({status:500,message:"user not removed"});
        }
    })
};

exports.vendordelete=function(req,res)
{
    Vendor.findOne({_id:req.params.id}).exec(function(err,usr){
        if(!err&& usr){
            usr.remove();
            res.send({status:200,message:"vendor removed"});
        }
        else{
            res.send({status:500,message:"vendor not removed"});
        }
    })
};

exports.servicedelete=function(req,res)
{
        service.findOne({_id:req.params.id}).exec(function(err,ser){
      if(!err &&ser) {
          ser.remove();
          res.send({status: 200, message: "Service Removed"});
      }
    else{
        res.send({status:500,message:"Service not removed"})
    }
  })
};

exports.getService = function(req,res)
{
    console.log("in getService");
    service.findOne({_id:req.params.id}).exec( function (err ,services)
    {
        if(err)
        {
            res.send({status:500, message:"Unable to find service."});
            ///res.send("Error Occurred ");
        }else
        {
            console.log(services);
            res.send({status:200, message:" service.", data:services});
            //res.status(200).json(services);
        }
    });

};

exports.updateService= function(req,res)
{
    console.log("In Update Service");
    var jsonObject = req.body.data;
    console.log(jsonObject);
    service.findOne({_id:jsonObject._id}).exec(function(err,ser){
        if (err || ser == null){
            res.send({status:404,message:"service Not found "});
        }
        else {
            ser.service_name = jsonObject.service_name;
            ser.service_detail = jsonObject.service_detail;
            ser.service_price = jsonObject.service_price;
            ser.service_image = jsonObject.service_image;
            console.log(ser);
            ser.save(function (err) {
                if (err) {
                    res.send({status: 500, message: "service not updated"});
                }
                else {
                    res.send({status: 200, message: "Service updated", data: ser});
                }
            })
        }
    });
};

exports.AddService =function (req,res)
{
    console.log("In Add service");
    var jsonObject = req.body.data;
    var ser = new service();
    ser.service_name = jsonObject.service_name;
    ser.service_detail= jsonObject.service_detail;
    ser.service_price=jsonObject.service_price;
    ser.service_image = jsonObject.service_image;
    ser.save(function(err){
        if (err){
            res.send({status:500,message:"service not saved"});
        }
        else{
            res.send({status:200,message:"service added"});
        }
    })
};

exports.renderLoginTemplate = function (req,res)
{
    res.render('login');
};

exports.renderSignUpTemplate = function (req,res)
{
    res.render('register',{message:req.flash('message')});
};

exports.getallVehicleCompany =function (req,res)
{
    VehicleCompany.find({}).exec(function(err,vehicles){
        if (err){
            res.send({status:500,message:"Unable to Fetch vehicle Companies"});
        }
        else{
            res.send({status:200,message:"All Vehicle Companies",data:vehicles});
        }
    })
};

exports.setVehicleModel =function(req,res)
{
    var jsonObject = req.body;
    VehicleModel.findOne({model_name:jsonObject.model_name , company_id:jsonObject.company._id}).exec(function (err,veh){
       if (err){
           console.log("error",err);
           res.send({status:500,message:"err in vehicle model find"});
       }
        else if(veh== null){
           var vehicle = new VehicleModel;
           vehicle.model_name = jsonObject.model_name;
           vehicle.company_id = jsonObject.company._id;
           vehicle.years.push(jsonObject.year);
           vehicle.colors.push(jsonObject.color._id);
           vehicle.save(function(err,vec) {
               if (err) {
                   res.send({status: 500, message: "error in adding new model"});
                   console.log("error in saving vehicle model",err);
               }
               else {
                   res.send({status: 200, message: "vehicle model added"});
               }
           });
       }
        else
           {
               if(veh.years.indexOf(jsonObject.year)<=-1){
                   veh.years.push(jsonObject.year);
               }
               if(veh.colors.indexOf(jsonObject.color._id)<=-1){
                   veh.colors.push(jsonObject.color._id);
               }
               /*if(veh.years != jsonObject.year){
                   veh.years.push(jsonObject.year);
               }
               if(veh.colors != jsonObject.color._id) {
                   veh.colors.push(jsonObject.color._id);
               }*/
               veh.save(function (err, vec) {
                   if (err) {
                       res.send({status: 500, message: "error in updating"});
                   }
                   else {
                       res.send({status: 200, message: "vehicle model updated"})
                   }
               });
           }
    });
};

exports.getallmodels =function(req,res)
{
  VehicleColor.find({}).exec(function(err,colors){
    if(err){
        res.send({status:500,message:"error in finding all colors"})
    }
      else{
        res.send({status:200,message:"all colors",data:colors});
    }
  });
};
