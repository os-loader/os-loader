function repo(config,server,about) {
  const state=new configFile("repo.json",{
    "__comment":"DO NOT EDIT! - Edit config.json instead",
    last:new Date(0),
    exists:false
  });
  const self=this;
  self.update=false;
  function update(date) {
    if (self.update) return true;
    if (!date) self.update=true;
    server.queue("Repo Update",function(a,done) {
      self.update=true;
      require("core/repo").generate(config.out,{key:"000000",about:about},function(e) {
        state.last=new Date();
        self.update=false;
        state.exists=!e;
        done(e);
      });
    },3,date);
  }
  function status() {
    return {
      update:self.update,
      last:new Date(state.last),
      exists:state.exists
    };
  }
  update((new Date(new Date(state.last).getTime()+(3600*24*1000)).getTime()<new Date().getTime())?null:new Date(new Date(state.last).getTime()+(3600*24*1000)));
  self.status=status;
  self.updateRepo=update;
}
module.exports=repo;
