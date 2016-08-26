const configDefaults={
  firstRun:true
};

function config() {
  const self=this;
  var config=configDefaults;
  /* jshint ignore:start */
  for (var p in configDefaults) {
    (function(p) {
      'use strict';
      Object.defineProperty(self, p, {
          get: function() {
            return self.config[p];
          },
          set: function(n) {
            self.config[p]=n;
          }
      });
    }(p));
  }
  /* jshint ignore:end */
  function initfor(file) {
    config=new configFile(file,configDefaults);
    self.config=config;
  }
  var initd=false;
  function init() {
    if (initd) return false;
    self.confdir=pth.join(mountdir,"os-loader","config");
    initfor(pth.join(self.confdir,"config.json"));
    initd=true;
    return initd;
  }
  this.init=init;
}
module.exports=new config();
