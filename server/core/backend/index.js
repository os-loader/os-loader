function backend(config) {
  const self=this;
  const IPFS=require("core/repo/ipfs");
  const REPO=require("core/repo/backend");
  const SERVER=require("core/backend/server");
  newLogger("backend",self);
  self.info("Backend Starting...");

  //IPSF
  self.ipfs=new IPFS(pth.join(maindir,config.repo.ipfs.bin),pth.join(maindir,config.repo.ipfs.config));
  self.ipfs.start();

  //Server (for background tasks)
  self.server=new SERVER(config);
  self.server.online();

  //Repo
  self.repo=new REPO(config.repo,self.server);
  self.repocfg=config.repo;

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
