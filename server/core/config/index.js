//Load the config
function config(file,defaults) {
  const self=this;
  /* jshint ignore:start */
  const el=[];
  for (var p in defaults) {
    el.push(p);
    (function(p) {
      'use strict';
      Object.defineProperty(self, p, {
          get: function() {
            return data[p];
          },
          set: function(n) {
            data[p]=n;
            write();
          }
      });
    }(p));
  }
  /* jshint ignore:end */
  newLogger({name:"config",file:file},self);
  var data={};
  function read(cb) {
    try {
      var obj=jsonfile.readFileSync(file);
      for (var p in defaults) {
        if (!obj[p]) obj[p]=defaults[p];
      }
      data=obj;
      return cb();
    } catch(e) {
      return cb(e);
    }
  }
  function write(c) {
    try {
      jsonfile.writeFileSync(file,data,{spaces:2});
      self.log("Config file saved!");
    } catch(e) {
      self.error(e,"Config file save failed!");
      if (c) throw e; //critical
    }
  }
  read(function(err) {
    if (err) {
      data=defaults;
      self.error(err,"Config file load failed!");
      write(true);
    }
  });
  this.save=write;
}
module.exports=config;
