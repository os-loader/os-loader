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
newLogger=require("core/logger");
fs=global.electron?require("original-fs"):require("fs");
pth=require("path");
mkdirp=require("mkdirp");
cp=require("child_process");
ee=require("events").EventEmitter;
spawn=cp.spawn;
protocols=require("core/repo/protocols");
request=require("request");
exec=cp.exec;
execSync=cp.execSync;
grub=require("core/grub");
streams=require("stream");
udev=require("core/udev");
parted=require("core/parted");
script=require("core/script");
require("core/kernel");
jsonfile=require("jsonfile");
configFile=require("core/config");
config=require("core/config.main");
Duplex=streams.Duplex;
bytes=require("bytes");
bytesTrim=function(str) {
  return str.trim().replace("T","tb").replace("G","gb").replace("M","mb").replace(",",".");
}
w=require("w");
uuid=require("node-uuid").v4;
iISVM=function() {
  //return (execSync("whoami")=="root")?!!execSync("virt-what").toString():false;
  return !!execSync("virt-what").toString();
}
