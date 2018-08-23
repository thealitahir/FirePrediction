var express = require('express');
var path = require('path');
var flash = require('connect-flash');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
var ind= require('./routes/index.js');
var passport = require('passport');
require('./passport')(passport,flash);
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);

//-------------------------------------------Variables-----------------------//
var mongoose =  require('mongoose');
mongoose.Promise = global.Promise;
var routes = require('./routes/routes');
var filePredictorRoute = require('./routes/firePredictorController');
var elasticRoute = require('./routes/elasticRoute');
var app = express();
app.use(fileUpload());
mongoose.connect("mongodb://216.168.41.46:9876/test");
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("DB CONNECTED");
});

app.use(session({ secret: 'keyboard cat', store : new MongoStore(
    {
	    url: 'mongodb://216.168.41.46:9876'
    }),
  resave: true, saveUninitialized: true }));


//const fileUpload = require('express-fileupload');

//-------------------------------------------Variables-----------------------//


// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
const requestIp = require('request-ip');
app.use(requestIp.mw())
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

//app.set('view engine', 'jade');
//app.use(fileUpload());
//-----------------------------------Redirect HANDLER----------------------------//
app.use(function(req, res, next) {

  // if user is authenticated in the session, carry on
  if (!req.isAuthenticated() && ((req.url == '/') || (req.url == '/updateService/')|| (req.url == '/AddService/')))
  {
    res.redirect('/login');
  }
  else{
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    return next();
  }
});

app.get('/test', function(req, res) {
  res.render('test');
});
app.get('/' , routes.index);
/*app.get('/test',routes.test);
app.get('/test1',elasticRoute.test);
app.get('/login/:email/:password/:type',routes.login);
app.get('/logout/:id/:type/:auth_key', routes.logout);
app.post('/createTrip',routes.createTrip);//vendor
app.get('/finishTrip/:trip_id/:end_time/:id/:auth_key',routes.finishTrip);//vendor
app.get('/getAllVendors',routes.getAllVendors);// not used
//app.get('/getVendor/:vendor_id/:id/:auth_key',routes.getVendor);//user
app.get('/getVendor/:vendor_id/:id/:auth_key',elasticRoute.getVendor);//user
app.get('/getUser/:user_id/:id/:auth_key',routes.getUser);//vendor
app.get('/getVendorLocation/:id',routes.getVendorLocation);// not used
//app.get('/setVendorLocation/:id/:lat/:lng/:address/:auth_key',routes.setVendorLocation);//vendor
app.get('/setVendorLocation/:id/:lat/:lng/:address/:auth_key',elasticRoute.setVendorLocation);//vendor- using elastic search
app.get('/updateEndTime/:id/:end_time',routes.updateEndTime);// not used
//app.get('/getNearbyVendors/:u_lat/:u_lng/:range/:id/:auth_key',routes.getNearbyVendors);//user
app.get('/getNearbyVendors/:u_lat/:u_lng/:range/:id/:auth_key',elasticRoute.getNearbyVendors);//user
//app.get('/getNearestVendor/:u_lat/:u_lng/:range/:id/:auth_key',routes.getNearestVendor);//user
app.get('/getNearestVendor/:u_lat/:u_lng/:range/:id/:auth_key',elasticRoute.getNearestVendor);//user
app.post('/requestVendor',routes.requestVendor);//user
//app.get('/requestVendor/:service_id/:service_note/:u_id/:u_lat/:u_lng/:address/:requestTime/:range/:auth_key',routes.requestVendor);//user
app.get('/updateRequestStatus/:req_id/:vendor_id/:request_status/:auth_key',routes.updateRequestStatus);//vendor
app.get('/cancelRequest/:req_id/:id/:user_type/:auth_key',routes.cancelRequest);//user
app.get('/getServices', routes.getServices);//user
app.get('/setVendorStatus/:vendor_id/:status/:auth_key',routes.setVendorStatus);//vendor
app.post('/setTripRoute',routes.setTripRoute);//vendor
app.post('/editProfile',routes.editProfile);//user-vendor
app.get('/getTrips/:type/:id/:auth_key',routes.getTrips);//user-vendor
app.post('/register', routes.register);//user-vendor(authentication work is to be done)
app.post('/uploadImage',routes.uploadImage);
app.get('/changePassword/:id/:oldPassword/:newPassword/:type/:auth_key', routes.changePassword);
app.post('/setRating', routes.setRating);
app.get('/forgetPassword/:email/:type', routes.forgetPassword);
app.get('/codeValidation/:email/:code/:type' , routes.codeValidation);
app.get('/updatePassword/:email/:type/:password' , routes.updatePassword);
app.post('/updateTrip' , routes.updateTrip);
app.get('/getChats/:tripId',routes.getChats);
app.get('/verifyPhone/:type/:phone', routes.verifyPhone);
app.get('/verifyCode/:type/:phone/:code', routes.verifyCode);
app.get('/getVehicleCompany/:id/:auth_key',routes.getVehicleCompany);
app.get('/getVehicleModel/:id/:auth_key/:company_id',routes.getVehicleModel);
app.get('/getVehicleInfo/:id/:auth_key',routes.getVehicleInfo);
app.get('/setCardInfo/:id/:auth_key/:customerId/:cardIamge',routes.setCardInfo);
app.post('/setVehicleInfo',routes.setVehicleInfo);
app.post('/setRatingReview', routes.setRatingReview);
app.get('/getRatingReview/:type/:id/:auth_key',routes.getRatingReview);
app.put('/UpdateVendorServices',routes.UpdateVendorServices);
app.post('/UpdatePhoneNumber',routes.UpdatePhoneNumber);
app.post('/chargePayment', routes.chargePayment);
app.post('/chargeAndTransferPayment', routes.chargeAndTransferPayment);
app.post('/getCustomerId', routes.getCustomerId);
app.get('/getNewVendorLocation/:id', elasticRoute.getNewVendorLocation);
app.get('/setDeviceToken/:id/:auth_key/:device_token/:type',routes.setDeviceToken);
app.get('/getRequest/:id/:auth_key/:userid',routes.getRequest);
//Stripe Account
app.get('/createStripeAccount/:type/:country/:email/:auth_key',routes.createStripeAccount);
app.get('/connectExternalAccount/:account_id/:token_id/:id/:auth_key',routes.connectExternalAccount);
app.get('/transferFunds/:amount/:currency/:destination/:source_transaction/:id/:auth_key',routes.transferFunds);
app.post('/bankToken',routes.bankToken);
app.get('/updateAccountTOS/:account_id/:ip/:id/:auth_key',routes.updateAccountTOS);
app.post('/createIdentity',routes.createIdentity);*/
//front end
app.get('/getFirePredictorValues',filePredictorRoute.getFirePredictorValues)
app.get('/getUser',filePredictorRoute.getUser);
app.get('/getUsers',routes.getUsers);
app.get('/login',routes.renderLoginTemplate);
app.get('/registerAdmin',routes.renderSignUpTemplate);
app.post('/registerAdmin',passport.authenticate('local-register',{
  successRedirect: '/login',
  failureRedirect: '/registerAdmin',
  failureFlash: true
}));
app.post('/login',passport.authenticate('local',{
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash: true
}));
app.delete('/userdelete/:id',routes.userdelete);
app.delete('/vendordelete/:id',routes.vendordelete);
app.delete('/servicedelete/:id',routes.servicedelete);
app.get('/getService/:id', routes.getService);
app.post('/updateService',routes.updateService);
app.post('/AddService',routes.AddService);
app.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});
app.get('/getallVehicleCompany',routes.getallVehicleCompany);
app.get('/getallmodels',routes.getallmodels);
app.post('/setVehicleModel',routes.setVehicleModel);
//-----------------------------------Post HANDLER----------------------------//
// catch 404 and forward to error handler
app.use(function(req, res, next)
{
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

module.exports = app;
