function repo(file,mcb) {
  const self=this;
  const tmpdir="/tmp/osl_repo_tar_gz.repo."+uuid();
  const Files=[];
  function get() {
    var a=[].slice.call(arguments,0);
    a.unshift(tmpdir);
    return pth.join.apply(pth.join,a);
  }
  function getFile(cb) {
    var a=[].slice.call(arguments,0);
    a.pop();
    a.unshift(tmpdir);
    fs.readFile(pth.join.apply(pth.join,a),cb);
  }
  function getJSON(cb) {
    var a=[].slice.call(arguments,0);
    a.pop();
    a.unshift(tmpdir);
    jsonfile.readFile(pth.join.apply(pth.join,a),cb);
  }
  mkdirp.sync(tmpdir);
  exec("cd "+tmpdir+";tar xfz "+file,function(e) {
    if (e) return mcb(e);
    getJSON("main.json",function(main,e) {
      if (e) return mcb(e);
      getJSON("checksum.json",function(checksum,e) {
        if (e) return mcb(e);
        // TODO: verify checksums
        get("checksum.json.signed");
        tree(tmpdir, function (e, files) {
          if (e) return mcb(e);
          // Files is an array of filenames
          new w(files,function(f,done) {
            //TODO: checksum check
            Files.push(f); // TODO: verify checksum - then add to files list
            done();
          })(function(e) {
            if (e) return mcb(e);
            mcb(null,{});
          });
        });
      });
    });
  });
}
module.exports=repo;
