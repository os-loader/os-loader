console.log("%c> App Starting","color:black;");
if (config.firstRun) {
  swal("Welcome to OS Loader","OS Loader\nInstall Operating Systems just like software");
}
if (!config.currentImage) {
// TODO: save current image path - to not redownload on every new image
}

var r=require("core/repo/repos");
repos=new r();

app.updateAll=function() {
  repos.update(function() {
  });
}

if (!config.sources.length) {
  repos.add(repos.newRepo({
    sources:{
      "http":"localhost:8190/repo/repo.tar.gz",
    }
  }));
}
