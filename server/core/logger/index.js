function logger(opt,self) {
  var log=bunyan.createLogger(typeof opt =="object"?opt:{name:opt});
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
}
module.exports=logger;
