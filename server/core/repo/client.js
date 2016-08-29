function repo(conf) {
  const self=this;
  newLogger({name:"repo",test:true},self);
  function load(file,cb) {
    self.error("WIP");
    return cb();
  }
  function gettmp() {
    return "/tmp/osl_repo_"+uuid();
  }
  function update(cb) {
    var ok=false;
    w(conf.sourcesmap.slice(0),function(s,done) {
      if (s.protocol=="EOF"&&!ok) return done(new Error("Couldn't Update - No Source is online/available"));
      if (ok) return done();
      protocols.plain(s.protocol,s.url.replace("repo.tar.gz","repo.sha256"),function(err,res) {
        if (err) self.error(err,s.protocol+"@"+s.url+" is offline");
        if (err) return done();
        if (conf.current!=res) {
          setTimeout(function() {
            var p=gettmp()+".tar.gz";
            var w=fs.createWriteStream(p);
            var err_=false;
            w.on("finish",function() {
              if (!err_) {
                err_=true; //Prevent Double Emitting
                ok=true;
                load(p,done);
              }
            });
            try {
              pipe=protocols.pipe(s.protocol,s.url);
            } catch(e) {
              err_=true;
              return done(e);
            }
            pipe.on("response",function() {
              // TODO: add connection timeout
            });
            pipe.on("error",function(e) {
              err_=true;
              return done(e);
            })
            pipe.pipe(w);
          },10);
        } else {
          return done(); //check next - might not be up-to-date
        }
      });
    })(cb);
  }
  conf.sourcesmap=[];
  conf.sourcesmap.push({url:"",protocol:"EOF"});
  for (var s in conf.sources) {
    conf.sourcesmap.push({url:conf.sources[s],protocol:s});
  }
  this.update=update;
}
module.exports=repo;
