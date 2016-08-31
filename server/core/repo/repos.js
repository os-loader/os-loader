const client=require("core/repo/client");
const repoDefaults={
  last:new Date(0),
  sources:{},
  current:"",
  dir:"",
  keyid:"",
  name:"",
  about:{
    name:"Unknown (Update...)",
    desc:"(Update to fetch necessary data)",
    maintainer:"Unknown <@>",
    os:[],
    icon: null
  },
  lastErr:null,
  files:[],
  checksum:{}
}
function repos() {
  if (!config.sources) throw new Error("Invalid Config");
  //const self=this;
  var clients=[];
  const byId={};
  function u() {
    app.repos=clients.map(function(c) {
      var o=extend({},c.conf.data);
      if (typeof o.about.icon=="string") if (!o.about.icon.startsWith(c.dir)) o.about.icon=pth.join(c.dir,o.about.icon);
      o.isUpdate=c.isUpdate;
      return o;
    });
  }
  function add(conf) {
    if (!conf) throw new Error("Nothing to add");
    if (!conf.name) throw new Error("No name");
    config.sources.push(conf.name);
    config.config.save();
    var c=new client(conf);
    clients.push(c);
    byId[conf.name]=c;
    u();
    return c;
  }
  function remove(conf,cb) {
    if (conf.name) conf=conf.name;
    byId[conf.name].remove(function(e) {
      u();
      if (e) return cb(e);
      clients=clients.filter(function(c) {
        return c.name==conf?null:c;
      });
      config.sources=config.sources.filter(function(c) {
        return c==conf?null:c;
      });
      u();
      cb();
    });
  }
  function newRepo(conf) {
    var r=repoDefaults;
    r.sources=conf.sources;
    r.name=uuid();
    r.keyid=conf.keyid;
    r.dir="repo_"+r.name;
    return r;
  }
  function update(id,cb) {
    if (!cb&&id) {cb=id;id=null;}
    app.repoUpdate=true;
    new w(clients.filter(function(c) {if (id) if (c.conf.name==id) return c; else return null; else return c;}),function(c,done) {
      c.isUpdate=true;
      u();
      c.update(function(e) {
        c.conf.lastErr=e?e.toString():e;
        c.isUpdate=false;
        u();
        return done(null,e);
      });
    })(function(e,err) {
      u();
      app.repoUpdate=false;
      return cb(e,err);
    });
  }
  app.repoUpdate=false;
  config.sources.map(function(c) {
    var cc=new client(repoDefaults,c);
    clients.push(cc);
    byId[c.name]=cc;
  });
  u();
  this.update=update;
  this.newRepo=newRepo;
  this.remove=remove;
  this.add=add;
}
module.exports=repos;
