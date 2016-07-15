var LocalStrategy   = require('passport-local').Strategy;
var User = require('../models/user');
var bcrypt = require('bcrypt-nodejs');

module.exports = function(passport){
  passport.use('signup', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback : true // allows us to pass back the entire request to the callback
  }, function(req, email, password, done) {
    process.nextTick(function (){
    // find a user in Mongo with provided email
    User.findOne({ email :  email }, function(err, user) {
      // In case of any error, return using the done method
      if (err){
        console.log('Error in SignUp: '+err);
        return done(err);
      }
      // already exists
      if (user) {
        console.log('User already exists with email: '+email);
        return done(null, false, 'registered'); 
      } else {
        User.findOne({}, function(err, user) {
          var newUser = new User({
            email: email,
            password: createHash(password),
            fname: req.body.fname,
            lname: req.body.lname,
            grade: req.body.grade,
            dob: req.body.dob,
            phone: req.body.phone,
            sid: req.body.sid,
            gender: req.body.gender,
            isAdmin: user ? false : true // first user to sign up is admin
          });
          // save the user
          newUser.save(function(err) {
            if (err){
              console.log('Error in Saving user: '+err);  
              throw err;  
            }
            console.log('User Registration succesful');  
            return done(null, newUser);
          });
        });
      }
    });
  });
}));

  function createHash(password){
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
  }

}