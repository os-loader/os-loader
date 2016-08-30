const loader=require("./load.js");
function repo(conf2,name) {
  if (!name) name=conf2.name;
  const conf=new configFile(pth.join(config.confdir,"repo:"+name+".json"),conf2);

  conf.last=new Date(conf.last);
  const self=this;
  self.conf=conf;
  newLogger({name:"repo",id:conf.name},self);
  function load(file,cb) {
    return loader(file,pth.join(mountdir,"repo",conf.dir),function(e,r) {
      if (e) return cb(e);
      var s=r.about.sources;
      delete r.about.sources;
      if (s) {
        for (var source in s) {
          if (conf.sources[source]) {
            if (conf.sources[source]==s[source]) self.debug("Skip",source);
            if (conf.sources[source]!=s[source]) {
              self.info("Update",source,conf.sources[source],"=>",s[source]);
              conf.sources[source]=s[source];
            }
          } else {
            self.info("Add",sources[source]);
            conf.sources[source]=s[source];
          }
        }
        conf.sourcesmap=[];
        conf.sourcesmap.push({url:"",protocol:"EOF"});
        for (var s2 in conf.sources) {
          conf.sourcesmap.push({url:conf.sources[s2],protocol:s2});
        }
      }
      conf.last=new Date();
      conf.about=r.about;
      conf.files=r.files;
      conf.checksum=r.checksum;
      cb(e,r);
    });
  }
  function gettmp() {
    return "/tmp/osl_repo_"+conf.name+"_"+uuid();
  }
  function update(cb) {
    var ok=false;
    w(conf.sourcesmap.slice(0),function(s,done) {
      if (s.protocol=="EOF"&&!ok) return done(new Error("Couldn't Update - No Source is online/available"));
      if (ok) return done();
      protocols.plain(s.protocol,s.url.replace("repo.tar.gz","repo.sha256"),function(err,res) {
        if (err) self.error(err,s.protocol+"@"+s.url+" is offline");
        if (err) return done();
        if (conf.current!=res||!conf.current||true) {
          setTimeout(function() {
            var p=gettmp()+".tar.gz";
            var w=fs.createWriteStream(p);
            var err_=false;
            w.on("finish",function() {
              if (!err_) {
                err_=true; //Prevent Double Emitting
                ok=true;
                load(p,function(e) {
                  if (e) return done(e);
                  if (res) conf.current=res;
                  return done();
                });
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
          ok=true;
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
