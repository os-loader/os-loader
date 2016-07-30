function backend(config) {
  const self=this;
  const IPFS=require("core/repo/ipfs");
  newLogger("backend",self);
  self.info("Backend Starting...");
  self.ipfs=new IPFS(pth.join(maindir,config.repo.ipfs.bin),pth.join(maindir,config.repo.ipfs.config));
  self.ipfs.start();
  //self.ipfs=require("")
  self.status={
    get ipfs() {
      return self.ipfs.status();
    },
    get server() {
      return self.server.status();
    },
    get repo() {
      return self.repo.status();
    }
  };
}
module.exports=backend;
