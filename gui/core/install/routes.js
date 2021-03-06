app.usbpath="";
app.usbpartition="";
app.selectUSB=function(el) {
  app.usbpath=app.findData(el,"uuid");
  var r=app.usbsel=app.usbdev.filter(function(e) {
    if (e.ID_PATH==app.usbpath) return e;
  })[0];
  if (r.ok) {
    app.step="Will be installed here - "+r.desc;
    app.next=true;
  } else {
    app.step=r.desc;
    app.next=false;
  }
}
app.selectUSBPart=function(el) {
  app.usbpartpath=app.findData(el,"uuid");
  var r=app.usbpartsel=app.usbparts.filter(function(e) {
    if (e.ID_PATH==app.usbpartpath) return e;
  })[0];
  app.step=(r.ok?"Will be installed here - ":"")+r.desc;
  app.next=r.ok;
}
function getUSB() {
  if (!app.tempB.usb) return;
  udev.query(function(e,l) {
    if (e) return swal("An Error happend while loading the USB Devices...",e.toString(),"error");
    //lsblk -o SIZE /dev/sdf | head -n 2 | tail -n 1
    w(l,function(e,cb) {
      exec("lsblk -o SIZE "+e.devname+" | head -n 2 | tail -n 1",function(er,std) {
        if (er) return cb(er);
        var size=std.toString().trim();
        if (global.isvm||(e.ID_BUS=="usb"&&e.DEVNAME&&(e.part_table_type||e.fs_type))) {
          switch(e.ID_BUS) {
            case "ata": //=sata
              e.img="hdd";
              e.deg=0;
              break;
            case "usb":
              e.img="usb";
              e.deg=90;
              break;
            default:
              e.img="unkown";
              e.deg=-90;
          }
          e.ID_FS_TYPE=e.ID_FS_TYPE||"unkown";
          e.ID_VENDOR=e.ID_VENDOR||"";
          e.ID_MODEL=e.ID_MODEL||"";
          e.name=e.ID_VENDOR.trim()+" "+e.ID_MODEL.trim();
          if (!e.part_table_type) {
            e.desc="Has no Partition-Table, can not install here!";
          } else if (bytes(bytesTrim(size))<bytes("2gb")) {
            e.desc="Not enough space! Required: 2gb, Available: "+std.toString();
          } else {
            e.ok=true;
            e.desc="Size "+size;
          }
          cb(null,e);
        } else {
          cb();
        }
      });
    })(function(e,r) {
      if (e) return swal("An Error happend while loading the USB Devices...",e.toString(),"error");
      if (!app.tempB.usb) return;
      app.usbdev=r;
      if (app.usbdev.length) if (app.step=="Plug-in some USB Devices..."||app.step=="Looking for USB Devices...") app.step="Select an USB";
      if (!app.usbdev.length) {app.step="Plug-in some USB Devices...";app.next=false;}
      setTimeout(getUSB,1000);
    });
  });
}
function getUSBPartitions() {
  udev.part(app.usbmain.devname.replace("/dev/",""),function(e,l) {
    if (e) return swal("An Error happend while loading the USB Devices...",e.toString(),"error");
    w(l,function(e,cb) {
      exec("lsblk -o SIZE "+e.devname+" | tail -n 1",function(er,std) {
        if (er) return cb(er);
        var size=std.toString().trim();
        e.ID_FS_TYPE=e.ID_FS_TYPE||"unkown";
        e.ID_VENDOR=e.ID_VENDOR||"";
        e.ID_MODEL=e.ID_MODEL||"";
        if (e.ID_FS_LABEL) {
          e.name=e.ID_FS_LABEL+" ("+size+")";
        } else {
          e.name=size+" Partition";
        }

        e.ID_FS_LABEL=e.ID_FS_LABEL||"Unnamed";
        if (bytes(bytesTrim(size))<bytes("2gb")) {
          e.desc="Not enough space! Required: 2gb, Available: "+size;
        } else if (e.ID_FS_TYPE.startsWith("iso")) {
          e.desc="Contains a live disc - Must be formated";
          e.ok=true;
          e.format=true;
        } else if (e.ID_FS_TYPE.startsWith("fat")||e.ID_FS_TYPE.startsWith("vfat")) {
          e.desc="Data will be kept";
          e.ok=true;
          e.keep=true;
        } else if (e.ID_FS_TYPE.startsWith("ext")) {
          e.desc="Data will be kept";
          e.ok=true;
          e.keep=true;
        } else {
          e.desc="Unkown filesystem - Is it formatted?"
          e.ok=false;
        }
        e.ok=true;
        cb(null,e);
      });
    })(function(e,l) {
      if (e) return swal("An Error happend while loading the USB Devices...",e.toString(),"error");
      app.step="Select Partition";
      app.usbparts=l;
    });
  });
}
app.installNext=function() {
  var u=app.usbdev.filter(function(u) {return (u.ID_PATH==app.usbpath)?u:null;})[0];
  if (!u) return;
  if (!u.DEVNAME) return swal("ERROR","Has no storage","error");
  if (!u.ID_PART_TABLE_TYPE) return swal("Has no partition-table","You can´t install here - please format this drive and create a partition table!");
  app.usbmain=u;
  page.redirect("/install-partition/"+u.ID_PATH);
}
app.installNextFinal=function() {
  var u=app.usbparts.filter(function(u) {return (u.ID_PATH==app.usbpartpath)?u:null;})[0];
  if (!u) return;
  if (u.format) return swal("Not Implented","You can´t format drives, yet!");
  app.scriptout.clear();
  app.route="console";
  app.hideMenu=true;
  require("core/install")(app.usbmain,u,function(e) {
    app.hideMenu=false;
    if (e) {
      if (isdev) {
        throw e;
      } else {
        return swal("Installation Error!",e.toString(),"error");
      }
    }
    app.route="install-success";
  });
}
page("/install-partition/:path",function() {
  app.usbdev=[];
  app.usbparts=[];
  app.route="install-partition";
  app.step="Loading Partitions...";
  setFocus(app.route);
  getUSBPartitions();
});
page("/install-select",function() {
  app.usbdev=[];
  app.route="install-select";
  app.step="Looking for USB Devices..."
  setFocus(app.route);
  app.tempB.usb=true;
  getUSB();
});
