
var ReleaseSchema = mongoose.Schema({
  for:String,
  date:Date,
  name:String,
  version:String,
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

module.exports = mongoose.model('Release', ReleaseSchema);
