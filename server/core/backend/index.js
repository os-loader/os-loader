function backend(config) {
  const self=this;
  newLogger("backend",self);
  self.info("Backend Starting...");
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
