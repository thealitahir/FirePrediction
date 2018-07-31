/**
 * Created by admin on 5/25/2018.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    //bcrypt = require('bcrypt-nodejs'),
    SALT_WORK_FACTOR = 10;
var Schema =  mongoose.Schema;

var AdminSchema = new Schema({
    firstName:String,
    lastName:String,
    username:String,
    password:String

});
AdminSchema.pre('save', function(next) {
    var user = this;

// only hash the password if it has been modified (or is new)
    if (!user.isModified('password')) return next();

// generate a salt
    /*bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
        if (err) return next(err);

        // hash the password using our new salt
        bcrypt.hash(user.password, salt,null, function(err, hash) {
            if (err) return next(err);

            // override the cleartext password with the hashed one
            user.password = hash;
            next();
        });
    });*/


});

AdminSchema.methods.comparePassword = function(candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
};
module.exports = mongoose.model("admin",AdminSchema);