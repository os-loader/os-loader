function udev() {
  function udevexec(p,cb) {
    exec("udevadm info --query=property --path="+p,function(e,out) {
      if (e) return cb(e);
      var ro={};
      out.toString().split("\n").map(function(r) {
        if (r) {
          ro[r.split("=")[0]]=r.split("=")[1];
        }
      });
      for (var p in ro) {
        if (p.endsWith("_ENC")) {
          ro[p.replace("_ENC","")]=ro[p].replace(/\\x20/g," ");
          delete ro[p];
        }
      }
      for (p in ro) ro[p.replace("ID_","").toLowerCase()]=ro[p];
      cb(null,ro);
    });
  }
  function query(cb) {
    fs.readdir("/sys/block",function(e,l) {
      if (e) return cb(e);
      w(l,function(id,cb) {
        udevexec("/sys/block/"+id,cb);
      })(cb);
    });
  }
  function partitions(d,cb) {
    fs.readdir("/sys/class/block",function(e,l) {
      if (e) return cb(e);
      w(l,function(id,cb) {
        if (!id.startsWith(d)||id==d) return cb();
        udevexec("/sys/class/block/"+id,cb);
      })(cb);
    });
  }
  this.query=query;
  this.part=partitions;
  this.getInfo=udevexec;
}
module.exports=new udev();
