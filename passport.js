/**
 * Created by asma on 13-Nov-14.
 */
var Admin = require('./model/admin.model');
var LocalStrategy = require('passport-local').Strategy;
module.exports = function(passport,flash){
    passport.use('local',new LocalStrategy({
            passReqToCallback : true
        },

        function(req,username, password, done) {
            console.log("inside login");
            console.log(username);
            Admin.findOne({ username: username.toLowerCase()}, function (err, user) {
                console.log(err);
                console.log(user);
                if (err) { return done(err); }

                if (!user) {

                    return done(null, false, req.flash('message','User not found.'));

                }

                else{
                    user.comparePassword(password, function (err, isMatch) {
                        if (err) throw err;
                        if(isMatch){
                            return done(null, user);

                        }else{
                            return
                            (null, false, req.flash('message','Incorrect password.'));
                        }
                    });
                }
               /* else
                {
                    return done(null, false, req.flash('message', 'Sorry! You are not an active user'));
                }*/
            });
            /*return done(null, false, req.flash('message', 'Sorry! You are not an active user'));*/
        }
    ));

    passport.use('local-register', new LocalStrategy({
            passReqToCallback : true
        },
        function(req,username, password,done) {
            console.log("in register");
            Admin.findOne({ username :  username }, function(err, user) {
                // if there are any errors, return the error
                if (err)
                {
                    return done(err);
                }

                // check to see if there is already a user with that email
                if (user) {
                    return done(null, false, req.flash('message','Username already in use'));
                }
                else {
                    // if there is no user with that email
                    // create the user
                    var newUser = new Admin();

                    // set the user's local credentials

                    newUser.username = username;
                    newUser.password = password;
                    newUser.firstName = req.body.fname;
                    newUser.lastName = req.body.lname;
                    //newUser.role=role._id;


                    /*newUser.token = Math.floor((Math.random() * 100) + 54);*/    //generating token
                    // save the user
                    newUser.save(function (err, obj) {
                        if (err) {
                            return done(err);
                        }
                        return done(null, newUser);
                    });
                }
            });
        }
    ));

    passport.serializeUser(function(user, done) {
        console.log("ser");
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
        console.log("deser")
        Admin.findById(id, function(err, user) {
            done(err, user);
        });
    });
};
