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
  files:[],
  checksum:{}
}
function repos() {
  if (!config.sources) throw new Error("Invalid Config");
  //const self=this;
  var clients=[];
  const byId={};
  function add(conf) {
    if (!conf) throw new Error("Nothing to add");
    if (!conf.name) throw new Error("No name");
    config.sources.push(conf.name);
    config.config.save();
    var c=new client(conf);
    clients.push(c);
    byId[conf.name]=c;
    return c;
  }
  function remove(conf,cb) {
    if (conf.name) conf=conf.name;
    byId[conf.name].remove(function(e) {
      if (e) return cb(e);
      clients=clients.filter(function(c) {
        return c.name==conf?null:c;
      });
      config.sources=config.sources.filter(function(c) {
        return c==conf?null:c;
      });
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
  function update(cb) {
    new w(clients.slice(0),function(c,done) {
      c.update(function(e) {
        return done(null,e);
      });
    })(cb);
  }
  config.sources.map(function(c) {
    var cc=new client(repoDefaults,c);
    clients.push(cc);
    byId[c.name]=cc;
  });
  this.update=update;
  this.newRepo=newRepo;
  this.remove=remove;
  this.add=add;
}
module.exports=repos;
