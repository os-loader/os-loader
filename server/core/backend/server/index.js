function server(config) {
  const self=this;
  newLogger("backend",self);
  var online=false;
  var loop=false;
  const tasks=[];
  const count=new configFile("state.json",{
    "__comment":"DO NOT EDIT! - Edit config.json instead",
    uptime:0,
    fails:0,
    sucess:0,
    total:0
  });
  count.uptime=new Date().getTime();
  function queue(name,func,trys,date) {
    if (!online) return online;
    var id=tasks.push({name:name,fc:func,trys:trys||1,date:date||new Date()});
    if (!loop) doloop();
    return id;
  }
  function doloop() {
    if (!online) {
      self.warn("Trying to queue task while server is offline");
      return false;
    }
    loop=true;
    var t=tasks.shift();
    if (!t) {
      self.info({pause:true},"No new tasks - pause");
      loop=false;
      return;
    }
    self.info({left:tasks.length+1},"Processing Tasks");
    if (t.date>new Date().getTime()) {
      self.info("Task "+t.name+" is not for now - move along");
      tasks.push(t);
      return doloop();
    }
    process.nextTick(function() { //MUST be async
      t.fc([t],function(err,res) {
        if (err) {
          self.error(err,"Task "+t.name+" failed with error");
          t.trys--;
          count.fails++;
          count.total++;
          if (t.trys) {
            self.warn({task:t.name},"Try again");
            tasks.push(t);
          }
        } else {
          count.sucess++;
          count.total++;
          self.info(res?res:t,"Task "+t.name+" finished!");
        }
        return doloop();
      });
    });
  }
  function doOnline() {
    online=true;
    return doloop();
  }
  self.online=doOnline;
  self.queue=queue;
  function status() {
    return {
      queue:tasks.length,
      count:count,
      active:loop
    }
  }
  self.status=status;
}
module.exports=server;
