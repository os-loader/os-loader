function query(cb) {
  fs.readdir("/sys/block",function(e,l) {
    if (e) return cb(e);
    w(l,function(id,cb) {
      exec("udevadm info --query=property --path=/sys/block/"+id,function(e,out) {
        if (e) return cb(e);
        var ro={};
        out.toString().split("\n").map(function(r) {
          if (r) {
            ro[r.split("=")[0]]=r.split("=")[1];
          }
        });
        cb(null,ro);
      });
    })(cb);
  });
}
module.exports=query;
