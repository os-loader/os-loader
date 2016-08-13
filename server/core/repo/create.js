//Generate a static repository
function repo(tmpdir,outdir,conf) {
  mkdirp.sync(tmpdir);
  mkdirp.sync(outdir);
  var data={
  }
  function generate() {
    var checksum={
      "signed":conf.key,
      "files":{},
    }
    for (var p in data) {
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
      checksum.files[p]={sha256:crypto.createHash('sha256').update(data[p]).digest("hex")};
      fs.writeFileSync(pth.join(tmpdir,p),data[p]);
    }
    // TODO: sign checksum.json
    fs.writeFileSync(pth.join(tmpdir,"checksum.json"),new Buffer(JSON.stringify(checksum)));
    execSync("cd "+tmpdir+";tar cvfz "+maindir+"/"+outdir+"/repo.tar.gz .");
    return pth.join(outdir,"repo.tar.gz");
  }
  function add(name,content) {
    data[name]=content;
  }
  this.addFile=add;
  this.generate=generate;
}
module.exports=repo;
