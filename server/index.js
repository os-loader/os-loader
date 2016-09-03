require("app-module-path").addPath(__dirname);
require("colors");
extend=function(target) {
    var sources = [].slice.call(arguments, 1);
    sources.forEach(function (source) {
        for (var prop in source) {
            target[prop] = source[prop];
        }
    });
    return target;
};
bunyan=require("bunyan");
init=bunyan.createLogger({name:"init"});
init.info("Starting Up...");

var i_shall_quit=true;

process.on('uncaughtException', (err) => {
  if (i_shall_quit) {
    init.fatal(err,"FATAL".red.bold);
    process.exit(2);
  }
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

util=require("util");
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
recursive = require('recursive-readdir');
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
humanFileSize=function(bytes, si) {
    var thresh = si ? 1000 : 1024;
    if(Math.abs(bytes) < thresh) {
        return bytes + ' B';
    }
    var units = si ? ['KB','MB','GB','TB','PB','EB','ZB','YB']
                   : ['KiB','MiB','GiB','TiB','PiB','EiB','ZiB','YiB'];
    var u = -1;
    do {
        bytes /= thresh;
        ++u;
    } while(Math.abs(bytes) >= thresh && u < units.length - 1);
    return bytes.toFixed(1)+' '+units[u];
}

newLogger=require("core/logger");
configFile=require("core/config");
config=new configFile("config.json",configDefaults);

require("core/express");

plugins=require("core/plugins");

server=app.listen(8190);

init.info("Online @ *:8190...");
i_shall_quit=false;

function shutdown(sig) {
  i_shall_quit=true;
  init.warn("Caught "+sig);
  init.warn("Shutdown...");
  plugins.hook("shutdown",sig,function() {
    server.close(function() {
      init.warn("...exit with 0");
      process.exit(0);
    });
  });
}
process.on('SIGTERM', function() {
  shutdown("SIGTERM")
});
process.on('SIGINT', function() {
  shutdown("SIGINT")
});
