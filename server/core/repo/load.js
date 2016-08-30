function repo(file,out,mcb) {
  const self=this;
  const tmpdir="/tmp/osl_repo_tar_gz.repo."+uuid();
  const Files=[];
  const crypto=require("crypto");
  newLogger("repo.load",self);
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
  function getJSON() {
    var a=[].slice.call(arguments,0);
    var cb=a.pop();
    a.unshift(tmpdir);
    jsonfile.readFile(pth.join.apply(pth.join,a),cb);
  }
  mkdirp.sync(tmpdir);
  exec("cd "+tmpdir+";tar xfz "+file,function(e) {
    if (e) return mcb(e);
    getJSON("main.json",function(e,main) {
      if (e) return mcb(e);
      getJSON("checksum.json",function(e,checksum) {
        if (e) return mcb(e);
        // TODO: verify checksums
        get("checksum.json.signed");
        require("recursive-readdir")(tmpdir, function (e,files) {
          if (e) return mcb(e);
          // Files is an array of filenames
          new w(files,function(f,done) {
            //TODO: checksum check
            fs.readFile(f,function(e,con) {
              if (e) return done(null,f);
              var fr=f.replace(tmpdir+"/","");
              if (fr=="checksum.json") return done();
              try {
                if (crypto.createHash('sha256').update(con).digest("hex")==checksum.files[fr].sha256) {
                  Files.push(fr);
                  done();
                } else {
                  self.error("Wrong or invalid checksum for "+fr);
                  done(null,fr);
                }
              } catch(e) {
                self.error("Wrong or invalid checksum for "+fr);
                done(null,fr);
              }
            });
          })(function(e,fail) {
            if (fail.length) self.error(fail,"Files skipped");
            if (e) return mcb(e);
            mcb(null,{files:Files,about:main,checksum:checksum});
          });
        });
      });
    });
  });
}
module.exports=repo;
