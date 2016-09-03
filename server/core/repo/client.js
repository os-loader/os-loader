const loader=require("./load.js");
function repo(conf2,name) {
  if (!name) name=conf2.name;
  const conf=new configFile(pth.join(config.confdir,"repo:"+name+".json"),conf2);

  conf.last=new Date(conf.last);
  const self=this;
  self.isUpdate=false;
  self.conf=conf;
  self.dir=pth.join(mountdir,"os-loader",conf.dir);
  mkdirp.sync(self.dir);
  newLogger({name:"repo",id:conf.name},self);

  function getFile(f,cb) {
    if (!conf.files.filter(function(ff) {return f==ff;})[0]) return cb(new Error("Not Found"));
    fs.readFile(pth.join(self.dir,f),cb);
  }
  function hasFile(f) {
    return !!conf.files.filter(function(ff) {return f==ff;})[0];
  }
  function getJSON(f,cb) {
    if (!conf.files.filter(function(ff) {return f==ff;})[0]) return cb(new Error("Not Found"));
    jsonfile.readFile(pth.join(self.dir,f),cb);
  }

  function load(file,cb) {
    return loader(file,pth.join(mountdir,"repo",conf.dir),function(e,r) {
      if (e) return cb(e);
      require("recursive-readdir")(self.dir,function(e,files) {
        if (e) return cb(e);
        var fcp=r.files.slice(0);
        new w(files,function(f,done) {
          if (fcp.indexOf(f.replace(self.dir+"/",""))==-1) fs.unlink(f,done); else done();
        })(function(e) {
          if (e) return cb(e);
          new w(fcp,function(f,done) {
            mkdirp(pth.dirname(pth.join(self.dir,f)),function(e) {
              if (e) return cb(e);
              try {
                var wS=fs.createWriteStream(pth.join(self.dir,f));
                var rS=fs.createReadStream(pth.join(r.tmp,f));
                wS.on("finish",done);
                wS.on("error",done);
                rS.on("error",done);
                rS.pipe(wS);
              } catch(e) {
                done(e);
              }
            });
          })(function(e) {
            if (e) return cb(e);
            loadOK();
          });
        });
      });

      function loadOK() {
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
      }
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
        if (conf.current!=res||!conf.current||isdev) {
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
  this.getFile=getFile;
  this.getJSON=getJSON;
  this.hasFile=hasFile;
}
module.exports=repo;
