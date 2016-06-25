global.mainapp=require("electron").remote.app;
global.isos=process.env.ISINOSMODE=="true";
global.isdev=window.location.href.split("/").reverse()[1]=="app";
global.electron=true;

require("app-module-path").addPath(require("path").join(__dirname,"..",".."));
require("core/tools");

try {
  global.isvm=iISVM();
} catch(e) {
  global.isvm=false;
  console.error("%cRUN AS SUDO!","color:red; font-size:30px;");
}

console.warn("%cWARNING!%cDo not paste anything you don´t know what it is for here!","color:orange; font-size:25px;","color:red; font-size:15px;");

var ee=require("events").EventEmitter;
var events=new ee();
var safeClose=false;

var isdev=global.isdev;
window.rReload=false;
app.isDev=isdev;
var install=true;

function async() {
  if (isdev) events.emit("updateFound");
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
module.exports={ee:ee,install:install,events:events,osmode:isos,isos:isos,askExit:askExit,action:new actions(),mainapp:mainapp};
