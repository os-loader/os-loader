function Logger(add) {
  var opt="";
  if (typeof add=="string") opt="["+add+"] "; else {
    var name=add.name;
    delete add.name;
    for (var p in add) opt+=p+"="+add[p]+", "
    opt="["+name+"] "+opt;
    opt=opt.slice(0,-2);
  }
  function dummy(t) {
    return function() {
      var a=[].slice.call(arguments,0);
      a.unshift(opt.replace("]","/"+t+"]"));
      console[t].apply(console[t],a);
    }
  }
  this.fatal=dummy("error");
  this.error=dummy("error");
  this.warn=dummy("warn");
  this.info=dummy("log");
  this.debug=dummy("info");
  this.trace=dummy("log");
}

function logger(opt,self) {
  var log=new Logger(opt);
  self.logger=log;
  function ccb(type) {
    self[type]=function logger() {
      log[type].apply(log,arguments);
    }
  }
  ccb("info");
  self.log=self.info;
  ccb("warn");
  ccb("error");
  ccb("debug");
  ccb("trace");
  ccb("fatal");
}
module.exports=logger;
