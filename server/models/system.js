
var SystemSchema = mongoose.Schema({
  name:String,
  desc:String,
  icon:String,
  theme:String,
  type:{
    live:String,
    system:String
  }
});

module.exports = mongoose.model('System', SystemSchema);
