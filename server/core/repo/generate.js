//Exports the repo from the database
const REPO=require("./create.js");
function generate(out,conf,cb) {
  const tmp="/tmp/osl_image_server.repo."+uuid();
  const outtmp=pth.join(out,"tmp");
  const self=this;
  newLogger("repo",self);
  const repo=new REPO(tmp,outtmp,conf);
  self.repo=repo;
  var sys=[];
  self.info({tmp:tmp,out:out},"Generating Repo");
  self.debug("Exporting...");
  System.find({},function(e,r) {
    if (e) return cb(e);
    w(r,function(os2,sysCB) {
      var os={
        id:os2._id,
        name:os2.name,
        desc:os2.desc,
        icon:os2.icon,
        theme:os2.theme,
        type:os2.type,
        channels:[]
      }
      self.trace("sys",os.name);
      sys.push(os.id);
      self.trace("Channels for "+os.name+" ...");
      Channel.find({for:os.id},function(e,r) {
        if (e) return sysCB(e);
        new w(r,function(ch2,chCB) {
          var ch={
            id:ch2._id,
            for:os.id,
            name:ch2.name,
            desc:ch2.desc,
            beta:ch2.beta,
            stable:ch2.stable,
            hooks:ch2.hooks,
            releases:[]
          }
          self.trace("ch",ch.name);
          os.channels.push(ch.id);
          self.trace("Releases for "+os.name+" ...");
          Release.find({for:ch.id},function(e,r) {
            if (e) return chCB(e);
            new w(r,function(rel2,relCB) {
              var rel={
                for:ch.id,
                date:rel2.date,
                name:rel2.name,
                version:rel2.version,
                codename:rel2.codename,
                files:rel2.files,
                upgrade:rel2.upgradeNext?rel2.upgradeNext:rel2.upgradeTo,
                hooks:rel2.hooks
              }
              self.trace("rel",rel.name);
              ch.releases.push(rel);
              relCB();
            })(function(e) {
              self.trace("add ch",ch.id);
              repo.addFile(os.id+"/"+ch.id+".json",ch);
              chCB(e);
            });
          });
        })(function(e) {
          self.trace("add os",os.id);
          repo.addFile(os.id+".json",os);
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
        icon:conf.about.icon||null, // TODO: add icon config
        sources:null // TODO: alternative sources
      });
      plugins.hook("repo.files",repo,function() {
        try {
          self.info("Generating final repo.tar.gz");
          repo.generate(function(e,p) {
            if (e) return cb(e);
            hashFile("sha256",p,function(e,h) {
              if (e) return cb(e);
              fs.writeFile(p.replace(".tar.gz",".sha256"),h,function(e) {
                if (e) return cb(e);
                new w(["repo.tar.gz","repo.sha256"],function(p,cb) {
                  fs.rename(pth.join(outtmp,p),pth.join(out,p),cb);
                })(function(e) {
                  cb(e,p);
                });
              });
            });
          });
        } catch(e) {
          return cb(e);
        }
      })
    });
  });
}
module.exports=generate;
