function repo(file,mcb) {
  const self=this;
  const tmpdir="/tmp/"+uuid()+"/"+uuid();
  function get() {
    var a=[].slice.call(arguments,0);
    a.unshift(tmpdir);
    return pth.join.apply(pth.join,a);
  }
  function getJSON(cb) {
    var a=[].slice.call(arguments,0);
    a.pop();
    a.unshift(tmpdir);
    jsonfile.readFile(pth.join.apply(pth.join,a),cb);
  }
  mkdirp.sync(tmpdir);
  execSync("cd "+tmpdir+";tar xfz "+file);
  getJSON("main.json",function(main,e) {
    if (e) return mcb(e);
    getJSON("checksum.json",function(checksum,e) {
      if (e) return mcb(e);
      // TODO: verify checksums
      get("checksum.json.signed");
      tree(tmpdir, function (e, files) {
        if (e) return mcb(e);
        // Files is an array of filenames
        files.map(function() {
          //TODO: checksum check
        });
      });
    });
  });
}
module.exports=repo;
