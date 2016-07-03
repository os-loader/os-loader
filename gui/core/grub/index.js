//Updating and Installing of the grub2 bootloader

function grub2(dev) {
  fs.lstatSync(dev);
  dir=global.mountdir;
  function installGrub(sure,cb) {
    if (!sure) throw new Error("Grub Install canceled!");
    script("grub-install",[dev],"Install GRUB on "+dev,function(e) {
      cb(e);
    });
  }
  function updateGrub(cb) {
    script("grub-update",[dev],"Update GRUB on "+dev,function(e) {
      cb(e);
    });
  }
  this.update=updateGrub;
  this.install=installGrub;
}

module.exports=grub2;
