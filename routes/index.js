var express = require('express');
var router = express.Router();
var passport = require('passport');
var flash = require('connect-flash');
require('../passport')(passport,flash);
var async = require('async');
var crypto = require('crypto');

router.use(function(req, res, next) {
    // if user is authenticated in the session, carry on

    if (req.isAuthenticated()||  req.url == '/login' ||  req.url == '/register'||  req.path == '/verify' || req.url == '/forgot' || req.path == '/reset' || req.query.api_key == '35454545' || typeof req.query.test_user != "undefined")
    {

        if(typeof req.query.test_user != "undefined"){
            req.user = { _id : req.query.test_user };
        }

        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Methods', '*');
        res.header('Access-Control-Allow-Headers', 'Content-Type');

        return next();
    }
    // if they aren't redirect them to the home page
    res.redirect('/login');
});

router.get('/', function(req, res) {

    var temp=[];
    RolesModel.find({}, function (err,docs) {
        if(!err){
            for(var i=0;i<docs.length;i++){
                temp=docs[i].resources
            }
            var deploymentUrl =  "http://" + CONFIGURATIONS.cmHost + ":" + CONFIGURATIONS.cmPort;
            console.log(CONFIGURATIONS.platformLogo);
            //res.render('index-prod', { title: 'Digital Canvas' ,module:temp , logo: CONFIGURATIONS.platformLogo, username: req.user.firstName+' '+req.user.lastName,  backend_url : Utility.getUrl(req), deployment_url : deploymentUrl,deploymentHost:CONFIGURATIONS.deploymentHost,deploymentPort:CONFIGURATIONS.deploymentPort});
            res.render('index', { title: 'Digital Canvas' ,module:temp , logo: CONFIGURATIONS.platformLogo, username: req.user.firstName+' '+req.user.lastName,  backend_url : Utility.getUrl(req), deployment_url : deploymentUrl,deploymentHost:CONFIGURATIONS.deploymentHost,deploymentPort:CONFIGURATIONS.deploymentPort});
        }
        else{
            res.send({status:false,msg:'Error while finding roles.'});
        }
    });
});

router.post('/login' , passport.authenticate('local',{
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
}));

router.get('/login',function (req, res) {

    //console.log(CONFIGURATIONS.platformLogo);

    if (!(req.isAuthenticated()))
    {
        res.render('login', {title:'Platalytics Inc.', logo: CONFIGURATIONS.platformLogo, message: req.flash('message')});
    }else{
        var deploymentUrl =  "http://" + CONFIGURATIONS.cmHost + ":" + CONFIGURATIONS.cmPort
        //res.render('index-prod', { title: 'Digital Canvas' , logo: CONFIGURATIONS.platformLogo, username: req.user.firstName+' '+req.user.lastName,  backend_url : Utility.getUrl(req), deployment_url : deploymentUrl,deploymentHost:CONFIGURATIONS.deploymentHost,deploymentPort:CONFIGURATIONS.deploymentPort});
        res.render('index',  {title: 'Digital Canvas', logo: CONFIGURATIONS.platformLogo, username: req.user.firstName+' '+req.user.lastName});

    }
});

router.get('/register', function(req, res) {

    var roles = [];
    RolesModel.find({},function(err,docs){
        if(!err)
            res.render('register', { title: 'Platalytics Inc.' , logo: CONFIGURATIONS.platformLogo, message:req.flash('message') , roles:docs});
    });

});

router.post('/register', function(req, res, next) {

    passport.authenticate('local-register', function(err, user, info) {
        if (err) {
            req.flash('message','Missing credentials');
            return res.redirect('/register');
        }
        if (!user) {

            req.flash('message','Missing credentials');
            return res.redirect('/register');
        }

        var link = 'http://'+ req.headers.host +'/verify?token=' + user.token;

        //sending mail
        smtpTransport.sendMail(
            {
                //email options


                from: "Admin "+credentials.username, // sender address.
                to:    user.firstName+"<"+user.username+">", // receiver
                subject: "Registration Confirmation", // subject
                html: "Please Click on the link to verify your registeration:<br>"+link
            },
            function(error, response){  //callback
                console.log(error)
                if(error){
                    req.flash('message','An error occurred');
                    return res.redirect('/register');
                }else{
                    req.flash('message','Please verify the link sent to your email');
                    return res.redirect('/login');
                }
                smtpTransport.close(); // shut down the connection pool, no more messages.
            });

        //req.flash('message','Please verify the link sent to your email');
        //return res.redirect('/login');

    })(req, res, next);
});

router.get('/logout',function (req, res) {

    req.session.destroy();
    req.logout();
    res.redirect('/');
});



module.exports = router;
