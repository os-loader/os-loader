// TODO: add install / copy files / install bootloader / generate bootloader config

function installOn(core,usb,cb) {
  var dev=usb.devname;
  var g=new grub(core.devname);
  function grubInstall(cb) {
    g.install(true,function(e) {
      if (e) return cb(e);
      g.update(function(e) {
        if (e) return cb(e);
        cb();
      });
    });
  }
  function copyFiles(cb) {
    script("mount",[dev,usb.ID_FS_TYPE],function(e) {
      if (e) return cb(e);
      script("copy-to",[dev],"Copy files to "+dev,function(e) {
        if (e) return cb(e); else grubInstall(cb);
      });
    });
  }
  function partion(cb) {
    if (!usb.format) return copyFiles(cb);
    script("format-ext4",[dev],"Formatting "+dev+" with ext4",function(e) {
      if (e) return cb(e); else copyFiles(cb);
    });
    /*p.getDev("/dev/"+dev,function(d,e) {
      if (e) return cb(e);
      if (d.type.startsWith("ext")||d.type.startsWith("fat")) {
        d.format(function(e) {
          if (e) return cb(e);
          copyFiles(cb);
        });
      }
    });*/
  }
  partion(cb);
}
module.exports=installOn;
