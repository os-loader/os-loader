console.log("%c> App Starting","color:black;");
if (config.firstRun) {
  swal("Welcome to OS Loader","OS Loader\nInstall Operating Systems just like software");
}
if (!config.currentImage) {
// TODO: save current image - to not redownload on every launch
}
