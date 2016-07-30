//Passport Auth`n`Stuff
var passportLocalMongoose = require('passport-local-mongoose');

var UserSchema = mongoose.Schema({
  admin:Boolean,
});


UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', UserSchema);
