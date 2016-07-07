global.electron=require("electron");
global.mainapp=electron.remote.app;
global.appwindow=electron;
global.isos=process.env.ISINOSMODE=="true";
global.isdev=window.location.href.split("/").reverse()[1]=="app";
global.electron=true;
var isdev=global.isdev;

require("app-module-path").addPath(require("path").join(__dirname,"..",".."));
require("core/tools");

try {
  global.isvm=iISVM();
  global.needsroot=false;
} catch(e) {
  global.isvm=false;
  console.error("%cRUN AS ROOT!","color:red; font-size:30px;");
  module.exports={};
  global.needsroot=true;
  swal({
      title:"Needs Admin Permissions",
      text:"Run this application again with admin permissions",
      showConfirmButton: false,
      type:"error"
    });
  setTimeout(mainapp.quit,5000);
  return module;
}

global.install=false;

if (isos) {
  try {
    install=!fs.lstatSync("/home/osloader").isSymbolicLink();
  } catch(e) {
    if (isdev) install=true;
  }
} else {
  // TODO: add real check
  install=true;
}

global.install=install;
global.active=!install;

console.warn("%cWARNING!%cAny code you paste here has access to your data and network!","color:orange; font-size:25px;","color:red; font-size:15px;");

var ee=require("events").EventEmitter;
var events=new ee();
var safeClose=false;

window.rReload=false;
app.isDev=isdev;

if (isos) {
  global.imagedir="/lib/live/mount/rootfs/filesystem.squashfs";
  global.imagepath="/lib/live/mount/medium/filesystem.squashfs"
  global.mountdir="/usb"
} else {
  global.imagedir="/tmp/os-loader.image"
  global.imagepath=global.imagedir+".live/live/filesystem.squashfs"
  global.mountdir=global.imagedir+"/usb";
}

function scriptout() {
  var e=new ee();
  const self=this;
  this.lines=[];
  global.cEV=e;
  e.on("line",function(l) {
    if (isdev) console.log("%c"+l.l,"color:"+((l.c=="white")?"black":l.c));
    if (l.l.startsWith("+ ")||l.l.startsWith("++ ")) return; //do not spam the stack traces
    self.lines=self.lines.concat([l]).slice(-25);
    app.scriptlines=self.lines;
  });
  e.on("print",function(l,c) {
    app.scriptlines=self.lines.concat([{l:l,c:c}]);
  });
  e.on("progress",function(p) {
    app.scriptprogress=p;
  });
  e.on("state",function(s) {
    app.scriptstate=s;
  });
  e.emit("line",{c:"white",l:"> OS Loader"});
  this.clear=function() {
    self.lines=[];
    app.scriptlines=[];
  }
}

function asyncOk() {
  page.redirect(app.baseUrl);
}

function async() {
  if (isdev) events.emit("updateFound");
  if (active) {
    udev.info(dev,function(e,d) {
      if (e) return swal(e.toString(),e.toString(),"error");
        script("mount",[dev,d.ID_FS_TYPE],function(e) {
          if (e) return swal(e.toString(),e.toString(),"error");
          asyncOk();
        });
    });
  }
}
setTimeout(async,5);

function actions() {
  function tutorial() {
    $(".tutorial").fadeOut("fast");
  }
  this.tutorial=tutorial;
}
function doExit(isConfirm){
  if (isConfirm) {
    global.cEV.on("state",function(s) {
      swal({
        title:"Shutdown...",
        text:s+"...",
        showConfirmButton: false
      });
    });
    script("shutdown",[],"Shutdown the App",function() {
      swal({
        title:"Shutdown...",
        text:isos?"Rebooting into BootLoader...":"Closing the App...",
        showConfirmButton: false
      });
      app.$.mainContent.hidden=true;
      safeClose=true;
      if (isos) {
        spawn("reboot",["-f"]);
      } else {
        setTimeout(mainapp.quit,10);
      }
    });
  }
}
function askExit() {
  swal({
    title: "Are you sure?",
    text: isos?"This will reboot into the BootLoader!":"This will close the app!",
    showCancelButton: true,
    confirmButtonColor: "#DD6B55",
    confirmButtonText: "Yes",
    cancelButtonText: "No",
    closeOnConfirm: false
  },
    doExit);
}
window.onbeforeunload = (e) => {
  if (!window.rReload) if (!safeClose) { e.returnValue = false;return isos?askExit():doExit(true);}
};
module.exports={ee:ee,scriptout:new scriptout(),install:install,active:active,events:events,osmode:isos,isos:isos,askExit:askExit,action:new actions(),mainapp:mainapp};
