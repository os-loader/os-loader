require("colors");
fs=global.electron?require("original-fs"):require("fs");
pth=require("path");
cp=require("child_process");
ee=require("events").EventEmitter;
spawn=cp.spawn;
exec=cp.exec;
execSync=cp.execSync;
grub=require("core/grub");
streams=require("stream");
udev=require("core/udev");
parted=require("core/parted");
script=require("core/script");
require("core/kernel");
Duplex=streams.Duplex;
bytes=require("bytes");
bytesTrim=function(str) {
  return str.trim().replace("G","gb").replace("M","mb").replace(",",".");
}
w=require("w");
uuid=require("node-uuid").v4;
iISVM=function() {
  //return (execSync("whoami")=="root")?!!execSync("virt-what").toString():false;
  return !!execSync("virt-what").toString();
}
