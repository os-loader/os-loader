//Updating and Installing of the grub2 bootloader

function grub2(dev) {
  fs.lstatSync("/dev/"+dev);
  function installGrub(sure) {
    if (!sure) throw new Error("Grub Install canceled!");

  }
  function updateGrub() {

  }
  this.update=updateGrub;
  this.install=installGrub;
}

module.exports=grub2;
