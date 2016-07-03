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
Duplex=streams.Duplex;
w=require("w");
uuid=require("node-uuid").v4;
iISVM=function() {
  return !!execSync("virt-what").toString();
}
