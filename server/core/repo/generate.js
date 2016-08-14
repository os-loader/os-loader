//Exports the repo from the database
const REPO=require("./create.js");
function generate(out,conf,cb) {
  const tmp="/tmp/osl_image_server.repo."+uuid();
  const self=this;
  newLogger("repo",self);
  const repo=new REPO(tmp,out,conf);
  self.repo=repo;
  var sys=[];
  self.info({tmp:tmp,out:out},"Generating Repo");
  self.debug("Loading Systems...");
  System.find({},function(e,r) {
    if (e) return cb(e);
    w(r,function(s,sysCB) {
      self.debug("sys",s.name);
      sys.push(s._id);
      self.debug("Channels for "+s.name+" ...");
      Channel.find({for:s._id},function(e,r) {
        if (e) return sysCB(e);
        s.channels=[];
        new w(r,function(c,chCB) {
          self.debug("ch",c.name);
          s.channels.push(c._id);
          c.id=c._id;
          c.releases=[];
          self.debug("Releases for "+s.name+" ...");
          Release.find({for:c._id},function(e,r) {
            if (e) return chCB(e);
            new w(r,function(r,relCB) {
              self.debug("rel",r.name);
              c.releases.push(r);
              relCB();
            })(function(e) {
              repo.addFile(s._id+"/"+c._id+".json",c);
              chCB(e);
            });
          });
        })(function(e) {
          repo.addFile(s._id+".json",s);
          sysCB(e);
        });
      });
    })(function(e) {
      if (e) return cb(e);
      repo.addFile("main.json",{
        name:conf.about.name,
        desc:conf.about.desc,
        os:sys,
        maintainer:conf.about.maintainer,
        icon:null, // TODO: add icon config
        sources:null // TODO: alternative sources
      });
      try {
        self.info("Generating final repo.tar.gz");
        return cb(null,repo.generate())
      } catch(e) {
        return cb(e);
      }
    });
  });
}
module.exports=generate;
