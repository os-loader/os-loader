fs=global.electron?require("original-fs"):require("fs");
pth=require("path");
cp=require("child_process");
spawn=cp.spawn;
exec=cp.exec;
streams=require("stream");
udev=require("core/udev");
duplex=streams.Duplex;
w=require("w");
