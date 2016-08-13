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
  self.info("Loading Systems...");
  System.find({},function(e,r) {
    if (e) return cb(e);
    w(r,function(s,sysCB) {
      sys.push(s._id);
      repo.addFile(s._id+".json",s);
      sysCB();
    })(function(e) {
      if (e) return cb(e);
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
