function plugin(path,pl) {
  const source=pth.join(path,pl);
  const self=this;
  const hooks={};
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
  this.tryHook=tryHook;
  this.hook=hook;

  const f=require(source);
  f.plugin=self;
  for (var p in self) f[p]=self[p];
  f(self);
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
