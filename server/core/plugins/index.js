function plugin(path,pl) {
  const source=pth.join(path,pl);
  const self=this;
  const hooks={};
  var f;
  newLogger({name:"p:"+pl},self);

  self.fancy=function(txt) {
    return "["+pl+"] "+txt;
  }

  self.debug(self.fancy("Enabling"));

  function hook(on,func) {
    hooks[on]=func;
  }
  function tryHook(name,data,cb) {
    if (!hooks[name]) return cb();
    hooks[name](data,function(e,r) {
      self.debug("Running hook "+name);
      cb(true,e,r);
    });
  }
  function config(def) {
    self.config=new configFile("p."+pl+".json",def);
    f.config=self.config;
  }
  this.config=config;
  this.tryHook=tryHook;
  this.hook=hook;

  var s=require(source);
  new s(function(el) {
    f=el;
    f.plugin=self;
    for (var p in self) f[p]=self[p];
  });
  self.info(self.fancy("Enabled"));
}

function plugins(path) {
  const list=fs.readdirSync(path);
  const pls=[];
  const plid={};
  const self=this;
  newLogger("plugins",self);
  list.map(function(pl) {
    var p=new plugin(path,pl);
    pls.push(p);
    plid[pl]=p;
  });
  function hook(name,data,cb) {
    new w(pls.slice(0),function(pl,done) {
      pl.tryHook(name,data,function(exec,e,r) {
        if (!exec) return done();
        e.hook=name;
        if (e) pl.error(e,"Hook "+name+" failed");
        done(null,r);
      });
    })(cb);
  }
  this.hook=hook;
}
module.exports=new plugins(pth.join(maindir,"plugins"));
