//Load the config
function config(file,defaults) {
  const self=this;
  /* jshint ignore:start */
  const el=[];
  var enoent=false;

  var lock=false;
  function preWrite() {
    if (!lock) {
      lock=true;
      process.nextTick(function() {
        lock=false;
        write();
      });
    }
  }

  for (var p in defaults) {
    el.push(p);
    (function(p) {
      'use strict';
      Object.defineProperty(self, p, {
          get: function() {
            return self.data[p];
          },
          set: function(n) {
            self.data[p]=n;
            preWrite();
          }
      });
    }(p));
  }
  /* jshint ignore:end */
  newLogger({name:"config",file:file},self);
  self.data={};

  function read(cb) {
    try {
      var obj=jsonfile.readFileSync(file);
      for (var p in defaults) {
        if (!obj[p]) obj[p]=defaults[p];
      }
      self.data=obj;
      return cb();
    } catch(e) {
      self.data=defaults;
      return cb(e);
    }
  }
  function write(c) {
    try {
      jsonfile.writeFileSync(file,self.data,self.data.__comment?{}:{spaces:2});
      self.debug("Config file saved!");
    } catch(e) {
      self.error(e,"Config file save failed!");
      if (c) throw e; //critical
    }
  }
  read(function(err) {
    if (err) {
      if (err.code=="ENOENT"&&!enoent) {
        self.warn("Config file dosen't exist, creating");
        enoent=true;
        write(true);
        return false;
      }
      self.data=defaults;
      self.error(err,"Config file load failed!");
      write(true);
    }
  });
  this.defaults=defaults;
  this.save=write;
  this.file=file;
}
module.exports=config;
