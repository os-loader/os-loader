//Upload to the IPFS
function ipfs(bin,config) {
  newLogger("ipfs",this);
  log({do:"load",config:config});
  function add(dir,cb) {

  }
  this.add=add;
}
module.exports=ipfs;
