//Upload to the IPFS
function ipfs(bin,conf) {
  const self=this;
  this.ee=new ee();
  var p,run=false,exit;
  newLogger("ipfs",this);

  function add(dir,cb) {
    if (!run) return cb(null,new Error("IPSF Not Running"));

  }

  function get(hash,cb) {
    if (!run) return cb(null,new Error("IPSF Not Running"));

  }

  function ls(hash,cb) {
    if (!run) return cb(null,new Error("IPSF Not Running"));

  }

  function start() {
    if (run) return p;
    try {
      fs.lstatSync(pth.join(conf,"config"));
    } catch(e) {
      this.info("IPFS Repo doesn´t exist - creating...");
      try {
        execSync(bin+" init");
      } catch(e) {
        this.info("IPFS Instance already running - skipping");
        run=true;
        return run;
      }
    }
    this.info("IPFS Starting...");
    mkdirp.sync(conf);
    p=spawn(bin,["daemon"],{env:{IPFS_PATH:conf},stdio:"inherit"/*["ignore","ignore","pipe"]*/});
    run=true;
    p.on("exit",function(e,s) {
      exit=e||s;
      if (run) self.warn({bin:bin,path:conf},"IPFS Killed or Crashed: ",exit); else self.info("IPFS Stopped",exit);
    });
    return p;
  }

  function stop() {
    if (!run) return false;
    if (!p) return this.error("IPFS Running External - can not stop");
    this.info("Stopping IPFS");
    run=false;
    p.kill(15);
    return true;
  }

  this.add=add;
  this.ls=ls;
  this.get=get;
  this.start=start;
  this.stop=stop;
  this.on=this.ee.on.bind(ee);
  this.once=this.ee.once.bind(ee);
}
module.exports=ipfs;
