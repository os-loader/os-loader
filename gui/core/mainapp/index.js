console.log("%c> App Starting","color:black;");
if (config.firstRun) {
  swal("Welcome to OS Loader","OS Loader\nInstall Operating Systems just like software");
}
if (!config.currentImage) {
// TODO: save current image path - to not redownload on every new image
}

var client=require("core/repo/client");

var repo=new client({
  sources:{
    "http":"localhost:8190/repo/repo.tar.gz",
  }
});
setTimeout(function() {
  repo.update(function(e,d) {
    console.log("updated",e,d);
  });
},500);
