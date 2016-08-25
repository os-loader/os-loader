//Generate a static repository
function repo(tmpdir,outdir,conf) {
  mkdirp.sync(tmpdir);
  mkdirp.sync(outdir);
  var data={
  }
  function generate(cb) {
    var checksum={
      "signed":conf.key,
      "files":{},
    }
    var tasks=new w.lazy();
    function lazy(p,done) {
      switch(typeof data[p]) {
        case "string":
          data[p]=new Buffer(p);
          break;
        case "number":
          throw new Error("Cannot add a Number as a file");
        case "buffer":
          break;
        case "object":
          data[p]=new Buffer(JSON.stringify(data[p]));
          break;
      }
      function mkd(cb) {
        if (p.indexOf("/")!=-1) {
          var a=p.split("/");
          a.pop();
          mkdirp(pth.join(tmpdir,a.join("/")),cb);
        } else cb();
      }
      mkd(function(e) {
        if (e) return done(e);
        checksum.files[p]={sha256:crypto.createHash('sha256').update(data[p]).digest("hex")};
        fs.writeFile(pth.join(tmpdir,p),data[p],function(e) {
          done(e);
        });
      });
    }
    for (var p in data) tasks.push(p,lazy);
    // TODO: sign checksum.json
    tasks.wait(function(e) {
      if (e) return cb(e);
      fs.writeFile(pth.join(tmpdir,"checksum.json"),new Buffer(JSON.stringify(checksum)),function(e) {
        if (e) return cb(e);
        var tar=spawn("/bin/bash",["-x"]);
        tar.stdin.write("cd "+tmpdir+"\ntar cvfz "+maindir+"/"+outdir+"/repo.tar.gz *\nexit\n");
        tar.on("exit",function(e,s) {
          if (e||s) return cb(new Error("Process Exited with: "+(e||s)));
          return cb(null,pth.join(outdir,"repo.tar.gz"));
        });
      });
    });
  }
  function add(name,content) {
    data[name]=content;
  }
  this.addFile=add;
  this.generate=generate;
}
module.exports=repo;
