
var VersionSchema = mongoose.Schema({
  for:String,
  date:Date,
  name:String,
  codename:String,
  files:Object,
  upgradeNext:Boolean,
  upgradeTo:String,
  hooks:{
    install:Object,
    update:Object,
    remove:Object,
    patches:Object
  }
});

module.exports = mongoose.model('Version', VersionSchema);
