function repo(conf) {
  function load(file,cb) {
    console.log("Downloaded "+file);
    console.error("LOAD NOT IMPLENTED");
    return cb();
  }
  function gettmp() {
    return "/tmp/osl_repo_"+uuid();
  }
  function update(cb) {
    var ok=false;
    w(conf.sourcesmap.slice(0),function(s,done) {
      if (ok) return done();
      protocols.plain(s.protocol,s.url,function(err,res) {
        if (err) return done();
        if (conf.current!=res) {
          var p=gettmp()+".tar.gz";
          var w=fs.createWriteStream(p);
          var err_=false;
          w.on("end",function() {
            if (!err_) {
              load(file,done);
            }
          });
          protocols.pipe(s.protocol,s.url).on("error",function(e) {
            err_=true;
            return done(e);
          }).pipe(w);
        } else {
          return done(); //check next - might not be up-to-date (like with ipfs without ipns)
        }
      });
    })(cb);
  }
  conf.sourcesmap=[];
  for (var s in conf.sources) {
    conf.sourcesmap.push({url:conf.sources[s],protocol:s});
  }
  this.update=update;
}
module.exports=repo;
