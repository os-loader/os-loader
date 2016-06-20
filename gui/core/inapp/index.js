global.app=require("electron").remote.app;
global.isos=process.env.ISINOSMODE=="true";


function async() {
  var isdev=true; //anyway indev
  if (isdev) $("#devReload").show();
}
setTimeout(async,5);

function nav(to) {

}
function actions() {
  function tutorial() {
    $(".tutorial").fadeOut("fast");
  }
  this.tutorial=tutorial;
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
    function(isConfirm){
      if (isConfirm) {
        swal({
          title:"Shutdown...",
          text:isos?"Rebooting into BootLoader...":"Closing the App...",
          showConfirmButton: false
        });
        if (isos) {
          spawn("reboot");
        } else {
          setTimeout(app.quit,250);
        }
      }
    });
}
module.exports={nav:nav,askExit:askExit,action:new actions()};
