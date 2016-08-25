require("app-module-path").addPath(__dirname);
require("colors");
bunyan=require("bunyan");
init=bunyan.createLogger({name:"init"});
init.info("Starting Up...");

process.on('uncaughtException', (err) => {
  init.error(err,"(╯°□°）╯︵ ┻━┻".red.bold);
});

maindir=__dirname;
w=require("w.js");

const configDefaults={
  repo:{
    ipfs:{
      bin:"node_modules/.bin/ipfs",
      config:"data/ipfs-repo"
    },
    out:"data/repo"
  },
  about:{
    maintainer:"Example Maintainer <maintainer@example.com>",
    name:"Example Repo",
    desc:"with example content!",
  }
};

mongoose=require("mongoose");
mongoose.connect("mongodb://localhost:27017/osl-image-server");
uuid=require("node-uuid").v4;
fs=require("fs");
pth=require("path");
ejs=require("ejs");
ee=require("events").EventEmitter;
cp=require("child_process");
exec=cp.exec;
execSync=cp.execSync;
spawn=cp.spawn;
express=require("express");
passport=require("passport");
http=require("http");
https=require("https");
request=require("request");
jsonfile=require("jsonfile");
mkdirp=require("mkdirp");
gpg=require("gpg");
crypto=require("crypto");
hashFile=function(algo,file,cb) {
  var shasum = crypto.createHash(algo);
  try {
    var s = fs.ReadStream(file);
    s.on('data', function(d) { shasum.update(d); });
    s.on('end', function() {
        var d = shasum.digest('hex');
        cb(null,d);
    });
  } catch(e) {
    cb(e);
  }
}

newLogger=require("core/logger");
configFile=require("core/config");
config=new configFile("config.json",configDefaults);

require("core/express");

app.listen(8190);

init.info("Online @ *:8190...");
