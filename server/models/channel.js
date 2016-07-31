
var ChannelSchema = mongoose.Schema({
  for:String,
  name:String,
  desc:String,
  id:String,
  beta:Boolean,
  stable:Boolean,
  hooks:{
    install:Object,
    remove:Object,
    update:Object
  }
});

module.exports = mongoose.model('Channel', ChannelSchema);
