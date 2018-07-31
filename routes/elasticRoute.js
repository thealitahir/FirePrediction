/**
 * Created by ali on 12/8/2017.
 */
var app = require('../app');
var User =  require("../model/user.model.js");
var Vendor =  require("../model/vendor.model");
var Trip =  require("../model/trip.model");
var VendorLocation=require("../model/vendorLocation.model");
var serviceRequest=require("../model/serviceRequest.model");
var service = require("../model/services");
var Review = require("../model/reviews.model");
var geolib = require("geolib");
var crg = require('country-reverse-geocoding').country_reverse_geocoding();
var compare = require('alphanumeric-sort').compare;
/*var Sync = require('sync');*/
/*
var client = require('../bin/connection.js');
var elasticsearch=require('elasticsearch');
*/
request = require('request-json');
//var requestClient = request.createClient('http://localhost:9200/');
var elasticsearch=require('elasticsearch');
var client = new elasticsearch.Client({
    hosts: [ 'http://10.0.4.206:9200']
});

exports.test = function(req,res)
{
    client.delete({
        index: 'vendorlocation',
        type: 'vendorlocation',
        id: 'Link Dhobi Ghat Rd, Block R Model Town, Lahore, Punjab, Pakistan'
    }, function (error, response) {
        if(error)
            res.send(errors)
        else
            res.send(response);
    });
    /*client.indices.create({
        index:'polygon'
    },function( err,resp,status){
        if (err) {
            console.log("Error occurred " + err);
        } else {
            console.log("create", resp);
        }
    });

    client.indices.putMapping({
        index: 'polygon',
        type: 'polygon',
        body: {
            properties: {
                some_id: {type: "string", store: true},
                address: {type: "string", store: true},
                poly: {
                    "store": true,
                    "type":    "geo_point",
                    "lat_lon": true
                }
            }
        }
    });

    client.index({
            index: 'polygon',
            type: 'polygon',
            body: {
                some_id: "456",
                address: "xyz",
                poly: {
                    "type": "geo_point",
                    "coordinates":[
                        40.8,
                        -73.0
                    ]
                }
            }
        },
        function (err, result, ElasticStatus) {
            if(err){
                res.send({status:500, message:"Unable to add Vendor Location."});
                //res.send("Unable to add Vendor Location" + err );
            }
            else{
                res.send({status:200, message:"Location .", data:result});
                console.log("Location Stored "+result);
                //res.send(result);
            }


        });
    client.search({
        index: 'polygon',
        type: 'polygon',
        body: {
            /!*from: from,
            size: size,*!/
            "query": {
            "bool" : {
                "must" : {
                    "match_all" : { }
                },
                    filter: {
                        geo_distance: {
                            distance: '100000km',
                            poly: [
                                0.0,
                                 0.0
                            ]
                        }
                    }
                }
            }
            /!*"query": {
                "bool" : {
                    "must" : {
                        "match_all" : { }
                    },
                    "filter" : {
                        /!*"term": {
                            "some_id": 123
                        }*!/

                        "geo_bounding_box": {
                            "type":"indexed",
                            "poly": {
                                "top_left": {
                                    "lat":  40.8,
                                    "lon": -74.0
                                },
                                "bottom_right": {
                                    "lat":  40.7,
                                    "lon":  -73.0
                                }
                            }
                        }
                    }
                }
            }*!/
        }
    }).then(function (resp) {
        var hits = resp.hits.hits;
        console.log(hits.length, "items around");
    }).catch(function (error) {
        console.log("Error on geo_distance (coordiates) " + error);
    });*/
};

exports.setVendorLocation = function(req,res)
{
    /*client.indices.create({
    index:"vendorlocation"
    },function( err,resp,status){
        if (err) {
            console.log("Error occurred " + err);
            res.send("Error occurred " + err);
        } else {
            console.log("create", resp);
            client.indices.putMapping({
                index: "vendorlocation",
                type: "vendorlocation",
                body: {

                    "properties": {
                        "vendor_id": {type: "text", store: true},
                        "address": {type: "text", store: true},
                        "location": {
                            "type": "geo_point"
                        }
                    }
                }
            },function(err,response){
                if(err)
                {
                    console.log("Error in mappimg : " + err);

                    //res.send("Error in mappimg : " + err)
                }
                else
                {
                    console.log("mappimg done: " + response);
                    //res.send("mappimg done : " + err)
                }
            });
        }
    });*/
    var result_id;
    console.log("in setVendorLocation elasticsearch");
    //console.log(req.params);
    client.search({
        index: "vendorlocation",
        type: "vendorlocation",
        q: 'vendor_id:'+ req.params.id
    }, function (error, response) {
        console.log(response);
        if(response.hits.hits[0] == undefined || response == undefined)
        {
            client.index({
                    index: "vendorlocation",
                    type: "vendorlocation",
                    body: {
                        address: req.params.address,
                        "location" : {
                            "lat" : req.params.lat,
                            "lon" : req.params.lng
                        },
                        vendor_id: req.params.id
                    }
                },
                function (err, result, ElasticStatus) {
                    if(err)
                    {
                        res.send({status:500, message:"Unable to insert Vendor Location."});
                        //res.send("Unable to insert Vendor Location" + err );
                    }
                    else{
                        console.log("id " + result._id);
                        data = {};
                        data.vendorLocationId = result._id;
                        res.send({status:200, message:"Vendor Location added.", data:data});
                        /*client.search({
                            index: 'vendorlocation',
                            type: 'vendorlocation',
                            body: {
                                "query": {
                                    "bool": {
                                        "must": {
                                            "match_all": {}
                                        },
                                        "filter": {
                                            "term": {
                                                "_id":result._id
                                            }

                                        }
                                    }
                                }
                            }
                        }).then(function (resp) {
                            console.log("id " + result_id);
                            console.log(resp);
                            console.log("set vendor location elastic search");
                            console.log(resp.hits.hits[0]._source);
                            res.send({status:200, message:"Vendor Location added." + resp.hits.hits[0]._source});
                        }, function (err) {
                            console.trace(err.message);
                        });*/
                    }
                });
        }
        else {
            console.log("Response -> " + JSON.stringify(response.hits.hits[0]));
            //console.log(response.hits.hits[0]._id);
            //res.send(response.hits.hits[0]._id);
            var locationId = response.hits.hits[0]._id;

            client.update({
                index: "vendorlocation",
                type: "vendorlocation",
                id: locationId,
                body: {
                    // put the partial document under the `doc` key
                    doc_as_upsert: true,
                    doc: {
                        address: req.params.address,
                        "location" : {
                            "lat" : req.params.lat,
                            "lon" : req.params.lng
                        },
                        vendor_id: req.params.id
                    }
                }
            }, function (error, record) {
                if (error){
                    res.send({status:500, message:"Unable to update Vendor Location."});
                    //res.send("Unable to update Vendor Location" + error);
                }
                else {
                    console.log("record : " + record._id)
                    data = {};
                    data.vendorLocationId = record._id;
                    res.send({status: 200, message: "Vendor Location updated.", data: data});
                    /*client.search({
                        index: "vendorlocation",
                        type: "vendorlocation",
                        q: '_id:'+ record._id
                    }, function (error, result) {
                        if(error){
                            res.send({status: 500, message: "Unable to update Vendor Location."});
                        }
                        else {
                            res.send({status: 200, message: "Vendor Location updated.", data: result.hits.hits[0]._source});
                        }
                        //res.send(result.hits.hits[0]._source);
                    });*/
                }
            })
        }
    });

};

exports.getNewVendorLocation = function(req,res)
{
    client.search({
        index: "vendorlocation",
        type: "vendorlocation",
        q: '_id:'+ req.params.id
    }, function (error, record) {
        if(error)
            console.log(error);
        else{
            console.log(record);
            console.log("set vendor location elastic search");
            console.log(record.hits.hits[0]._source);
            res.send({status:200, message:"Vendor Location added." + record.hits.hits[0]._source});
            //res.send(record.hits.hits[0]._source);
        }
    });
};

exports.getVendor = function(req,res)
{
    console.log("In get Vendor Api elasticsearch");
    var vendorArray = [];
        User.findOne({_id:req.params.id}).exec(function(err,user) {
        if (err || req.params.auth_key != user.auth_key) {
            res.send({status:300, message:"Authentication Failed."});
            //res.status(500).json("Authentication Failed");
        }
        else {
            Vendor.findOne({_id: req.params.vendor_id}).exec(function (err, vendor) {
                if (err) {
                    res.send({status:500, message:"Unable to find Vendor."});
                    console.log("Unable to find Vendor");
                }
                else {
                    vendorArray.push(vendor);
                    client.search({
                            index: 'vendorlocation',
                            type: 'vendorlocation',
                            q: 'vendor_id:'+ vendor._id
                        }, function (error, response)
                        {
                            console.log("vendor : " + vendor._id);
                            console.log(response.hits.hits[0]._source);
                            vendorArray.push(response.hits.hits[0]._source);
                            var data = {};
                            data.array = vendorArray;
                            res.send({status:200, message:"Vendor location found.", data:data});
                            //res.status(200).json(vendorArray);
                        });
                    }
                });
            }
        });
};

exports.getNearbyVendors=function (req, res)
{
    console.log("in getNearbyVendors elasticsearch");
    var nearbyVendors=[];
    var venLoc =new VendorLocation();
    var distance;
    var country = crg.get_country(req.params.u_lat,req.params.u_lng);
    if(country.name !=null) {
        User.findOne({_id: req.params.id}).exec(function (err, user) {
            if (err || req.params.auth_key != user.auth_key) {
                res.send({status:300, message:"Authentication Failed."});
                //res.status(500).json("Authentication Failed");
            }
            else {
                var distance = req.params.range;
                if (country.name != "Pakistan") {
                    distance = distance * 1.609344;
                }
                console.log("distance "+ distance);
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
                                            "lat": req.params.u_lat,
                                            "lon": req.params.u_lng
                                        }
                                    }
                                }
                            }
                        }
                    }
                }, function (error, response) {
                    if (error) {
                        console.log("error occured " + error);
                        res.send({status:500, message:"Unable to find nearby vendors."});
                        //res.send("error occured " + error);
                    }
                    else {
                        console.log("Search Response " + response.hits.hits.length);
                        var nearbyVendorsId = [];
                        for (var i = 0; i < response.hits.hits.length; i++) {
                            nearbyVendorsId.push(response.hits.hits[i]._source.vendor_id);
                        }
                        nearbyVendorsId.sort(compare);
                        console.log(nearbyVendorsId);
                        Vendor.find({"_id":{$in:nearbyVendorsId}, "status": true}).exec(function (err, vendors) {

                            if (err) {
                                //res.status(500).json("Unable to find Vendor");
                                res.send({status:500, message:"Unable to find vendor."});
                            }
                            else {
                                var activeVendors = [];
                                for (var j = 0; j < vendors.length; j++)
                                {
                                    activeVendors.push(vendors[j]._id.toString());
                                }
                                activeVendors.sort(compare);
                                for(var k = 0; k < activeVendors.length; k++)
                                {
                                    for (var l = 0; l < nearbyVendorsId.length; l++)
                                    {
                                        if (activeVendors[k] == nearbyVendorsId[l])
                                        {
                                            venLoc.vendor_id = response.hits.hits[l]._source.vendor_id;
                                            venLoc.address = response.hits.hits[l]._source.address;
                                            venLoc.latitude = response.hits.hits[l]._source.location.lat;
                                            venLoc.longitude = response.hits.hits[l]._source.location.lon;
                                            nearbyVendors.push(venLoc);
                                        }
                                    }
                                }
                                data={};
                                data.array = nearbyVendors
                                res.send({status:200, message:"Unable to find vendor.", data:data});
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
    console.log("in getNearestVendor elasticsearch");
    var nearbyVendors=[];
    var venLoc =new VendorLocation();
    var distance;
    var country = crg.get_country(req.params.u_lat,req.params.u_lng);
    if(country.name !=null) {
        User.findOne({_id: req.params.id}).exec(function (err, user) {
            if (err || req.params.auth_key != user.auth_key) {
                res.send({status:300, message:"Authentication Failed."});
                //res.status(500).json("Authentication Failed");
            }
            else {
                var distance = req.params.range;
                if (country.name != "Pakistan") {
                    distance = distance * 1.609344;
                }
                console.log("countary : " + country.name + " distance : " + distance);
                console.log("latitude : " + req.params.u_lat + " longitude : " + req.params.u_lng);
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
                                            "lat": req.params.u_lat,
                                            "lon": req.params.u_lng
                                        }
                                    }
                                }
                            }
                        },
                        "sort": [
                            {
                                "_geo_distance": {
                                    "location": {
                                        "lat":  req.params.u_lat,
                                        "lon": req.params.u_lng
                                    },
                                    "order": "asc",
                                    "unit": "km",
                                    "distance_type": "plane"
                                }
                            }
                        ]
                    }
                }, function (error, response) {
                    if (error || response.hits.hits.length == 0) {
                        console.log("error occured " + error);
                        res.send({status:500, message:"No vendor found."});
                        //res.send("error occured " + error);
                    }
                    else {
                        var nearbyVendorsId;
                        console.log("nearest response : " + JSON.stringify(response));
                        nearbyVendorsId = response.hits.hits[0]._source.vendor_id;
                        console.log(nearbyVendorsId);
                        Vendor.find({"_id":{$in:nearbyVendorsId}, "status": true}).exec(function (err, vendors) {
                            if (err) {
                                res.send({status:500, message:"Unable to find vendor."});
                                //res.status(500).json("Unable to find Vendor");

                            }
                            else {
                                if(vendors != undefined)
                                {
                                    venLoc.vendor_id = response.hits.hits[0]._source.vendor_id;
                                    venLoc.address = response.hits.hits[0]._source.address;
                                    venLoc.latitude = response.hits.hits[0]._source.location.lat;
                                    venLoc.longitude = response.hits.hits[0]._source.location.lon;
                                    res.send({status:200, message:"Unable to find nearby vendors.",data:venLoc});
                                    //res.send(venLoc);
                                }
                            }
                        });
                    }
                });
            }
        });
    }
};
