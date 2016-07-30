//Upload to the IPFS
function ipfs(bin,conf) {
  this.ee=new ee();
  var p,run=false,exit;
  newLogger("ipfs",this);
  log({do:"load",config:config});

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
    this.info("IPFS Starting...");
    p=exec(bin,["daemon"],{env:{IPFS_PATH:conf.dir},stdio:["ignore","ignore","pipe"]});
    p.on("exit",function(e,s) {
      exit=e||s;
      if (run) this.warn("IPFS Killed or Crashed",ipfs); else this.info("IPFS Stopped",exit);
    });
    return p;
  }

  function stop() {
    if (!run) return false;
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
  this.on=ee.on.bind(ee);
  this.once=ee.once.bind(ee);
}
module.exports=ipfs;
