global.mainapp=require("electron").remote.app;
global.isos=process.env.ISINOSMODE=="true";

require("app-module-path").addPath(require("path").join(__dirname,"..",".."));
require("core/tools");

var ee=require("events").EventEmitter;
var events=new ee();
var safeClose=false;

var isdev=process.env.ISDEVINTERNAL=="true";
window.rReload=false;
app.isDev=isdev;

function async() {
  events.emit("updateFound");
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
module.exports={ee:ee,events:events,osmode:isos,isos:isos,askExit:askExit,action:new actions(),mainapp:mainapp};
