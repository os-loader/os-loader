global.devmount=(process.env.devmount=="enabled"&&isdev);
try {
  fs.lstatSync(process.env.devmount);
  global.isofile=process.env.devmount;
} catch(e) {

}
global.devmountpoint=pth.join(__dirname,"..","..","..","image","data","copy");
global.devport=parseInt(process.env.devport,10);
function fakeConsole(t) {
  console[t+"_"]=console[t];
  console[t]=function() {
    var a=[].slice.call(arguments,0);
    console[t+"_"].apply(console,a);
    a.unshift("console",t);
    socket.emit.apply(socket,a);
  }
}
if (global.devport) {
  var client=require("socket.io-client");
  global.socket=client("http://localhost:"+global.devport,{reconnection:false,autoConnect:false});
  socket.connect(function() {
    console.log_("hi");
  });
  var connect=false;
  socket.connect(function() {
    connect=true;
    console.log("NN");
  });
  global.que=[];
  socket.on("connect",function() {
    connect=true;
    que.map(function(e) {
      console.log_("old que",e);
      socket.eemit.apply(socket,e);
    });
  });
  socket.on("disconnect",function() {
    window.onbeforeunload({});
  });
  socket.on("error",function(e) {
    console.log(e);
  });
  socket.eemit=socket.emit;
  socket.emit=function(t) {
    if (connect||t.startsWith("connect")||t.startsWith("disconnect")) {
      socket.eemit.apply(socket,arguments);
    } else {
      console.log_("que",arguments);
      que.push(arguments);
    }
  }
  Array("log","warn","info").map(fakeConsole);
  setTimeout(function() {
    script("socket",[],"...",function() {
      socket.emit("ready");
    });
  },1000);
}
