// TODO: add parted and so on

function device(dev,cb) {
  const self=this;
  udev.getInfo(dev,function(e,i) {
    if (e) return cb(e);
    for (var p in i) {
      self[p]=i[p];
    }
    cb(null,self);
  });
}

function parted() {
  function getDev(dev,cb) {
    try {
      fs.lstatSync(dev);
    } catch(e) {
      return cb(e);
    }
    new device(dev,cb);
  }
  this.getDev=getDev;
}
module.exports=parted;
