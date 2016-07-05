// TODO: add install / copy files / install bootloader / generate bootloader config

function installOn(d,cb) {
  var dev=d.DEVNAME;
  var g=new grub(dev);
  //var p=new parted();
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
    function goNextCopy() {
      script("copy-to",[dev],"Copy files to "+dev,function(e) {
        if (e) return cb(e); else grubInstall(cb);
      });
    }
    if (isos) {
      script("mount",[dev,d.ID_FS_TYPE],function(e) {
        if (e) return cb(e);
        goNextCopy();
      });
    } else {
      script("mount",[dev,d.ID_FS_TYPE],function(e) {
        if (e) return cb(e);
        script("mount-image",[],function(e) {
          if (e) return cb(e);
          goNextCopy();
        });
      });
    }
  }
  function partion(cb) {
    if (!d.format) return copyFiles(cb);
    script("format-ext4",[dev],"Formatting "+dev+" with ext4",function(e) {
      if (e) return cb(e); else copyFiles(cb);
    });
    //if (e) return cb(e);
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
