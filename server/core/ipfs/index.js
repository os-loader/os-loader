//Upload to the IPFS
function ipfs(bin,conf) {
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
    p=exec(bin,["daemon"],{env:{IPFS_PATH:conf.dir}});
    p.on("exit",function(e,s) {
      exit=e||s;
    });
    return p;
  }

  function stop() {
    if (!run) return false;
    p.kill(15);
    return true;
  }

  this.add=add;
  this.ls=ls;
  this.get=get;
}
module.exports=ipfs;
