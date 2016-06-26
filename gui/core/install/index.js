// TODO: add install / copy files / install bootloader / generate bootloader config

function installOn(dev,cb) {
  var g=new grub(dev);
  var p=new parted();
  function grubInstall(cb) {
    // TODO: make this functions work
    g.install(true,function(e) {
      if (e) return cb(e);
      g.update(function(e) {
        if (e) return cb(e);
        cb();
      });
    });
  }
  function copyFiles(cb) {
    // TODO: copy files
    grubInstall(cb);
  }
  function partion(cb) {
    if (e) return cb(e);
    p.getDev("/dev/"+dev,function(d,e) {
      if (e) return cb(e);
      if (d.type.startsWith("ext")||d.type.startsWith("fat")) {
        d.format(function(e) {
          if (e) return cb(e);
          copyFiles(cb);
        });
      }
    });
  }
  partion(cb);
}
module.exports=installOn;
