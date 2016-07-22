global.kernelcmd={};
global.kernelcmdlist=[];

fs.readFileSync("/proc/cmdline").toString().replace(/\n/g,"").split(" ").map(function(i) {
  var a=i.split("=");
  var b=a.shift();
  kernelcmd[b]=a.join("=")?a.join("="):true;
  kernelcmdlist.push(b);
});

global.isos=(process.env.ISINOSMODE=="true"&&isdev)||kernelcmd.osloader;
global.isdebug=!!kernelcmd.osloaderdebug;
