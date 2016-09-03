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
  const self=this;
  self.db={};
  var dbLock=false;
  var dbQueue=[];
  if (!config.sources) throw new Error("Invalid Config");
  newLogger("repos",self);
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
    update(conf.name,function() {
    });
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
    var r=extend({},repoDefaults);
    r.sources=conf.sources;
    r.name=uuid();
    r.keyid=conf.keyid;
    r.dir="repo_"+r.name;
    return r;
  }
  function rebuildDB(cb) {
    if (dbLock) {
      dbQueue.push(cb);
      return;
    }

    dbLock=true;
    self.debug("db rebuild...");
    var db={
      os:[],
      osID:{},
      ch:[],
      chID:{},
      rel:[],
      relID:{}
    };
    new w(clients.slice(0),function(c,done) {
      if (!c.hasFile("main.json")) return done(); //skip empty
      c.getJSON("main.json",function(e,main) {
        if (e) return done(e);
        new w(main.os||[],function(o,done) {
          c.getJSON(o+".json",function(e,os) {
            if (e) return done(e);
            os.repo=c;
            if (typeof os.icon=="string") os.icon=pth.join(c.dir,os.icon);
            db.os.push(os);
            db.osID[os.id]=os;
            new w(os.channels||[],function(cc,done) {
              c.getJSON(os.id+"/"+cc+".json",function(e,ch) {
                if (e) return done(e);
                ch.os=os;
                db.ch.push(ch);
                db.chID[ch.id]=ch;
                ch.releases.map(function(r) {
                  db.rel.push(r);
                  db.relID[r.id]=r;
                });
                return done();
              });
            })(done);
          });
        })(done);
      });
    })(function(e) {
      if (e) self.error("DB rebuild failed!",e);
      if (!e) self.debug("db rebuild... ok!");
      self.db=db;
      app.repo=db;
      dbLock=false;
      var q=dbQueue;
      dbQueue=[];
      q.map(function(c) {
        process.nextTick(function() {
          rebuildDB(c);
        });
      });
      if (cb) cb(e,db);
    });
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
      rebuildDB(function() {
        app.repoUpdate=false;
        return cb(e,err);
      });
    });
  }
  app.repoUpdate=false;
  config.sources.map(function(c) {
    var cc=new client(repoDefaults,c);
    clients.push(cc);
    byId[c.name]=cc;
  });
  u();
  rebuildDB();
  this.rebuildDB=rebuildDB;
  this.update=update;
  this.newRepo=newRepo;
  this.remove=remove;
  this.add=add;
}
module.exports=repos;
