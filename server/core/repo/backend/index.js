function repo(config,server) {
  const state=new configFile("repo.json",{
    "__comment":"DO NOT EDIT! - Edit config.json instead",
    last:new Date(0)
  });
  const self=this;
  self.update=false;
  function update(date) {
    if (self.update) return true;
    self.update=true;
    server.queue("Repo Update",function(a,done) {
      require("core/repo").generate(config.out,{key:"000000"},function(e) {
        state.last=new Date();
        self.update=false;
        done(e);
      });
    },3,date);
  }
  function status() {
    return {
      update:self.update,
      last:new Date(state.last)
    };
  }
  self.status=status;
  self.updateRepo=update;
}
module.exports=repo;
