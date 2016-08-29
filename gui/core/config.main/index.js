const configDefaults={
  firstRun:true,
  currentImage:""
};

function config() {
  const self=this;
  self.config=configDefaults;
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
    self.config=new configFile(file,configDefaults);
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
