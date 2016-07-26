var server,io,socket;
require("colors");
const colortable={
  crimson:"red",
  magenta:"red",
  royalblue:"blue",
  orange:"yellow"
};
before(function(done) {
  this.timeout(10000);

  server=http.createServer();
  io=socketio.listen(server);
  var isfirst=true;

  function colorparse(t,i) {
    if (!t[i]) return t;
    var tmp=t[i].split("%c");
    if (tmp.length == 1) {i++;return colorparse(t,i);}
    if (t[i].startsWith("%c")) tmp=tmp.slice(1);
    var ii=i,c;
    tmp=tmp.map(function(tt) {
      ii++;
      c=t[ii].split(";").filter(function(c) {
        return c.startsWith("color")?c.trim()/*.replace(/ /g,"").replace("color","").replace(":","")*/:null;
      })[0].replace("color:","");
      delete t[ii];
      if (!colortable[c]&&!tt[c]) {console.log("Unkown color "+c);c="grey";}
      if (colortable[c]) c=colortable[c];
      return tt[c]; //apply the color
    });
    t[i]=tmp.join("");
    i++;
    return colorparse(t.filter(function() {return t;}),i);
  }

  io.on("connection",function(ssocket) {
    if (isfirst) {
      socket=ssocket;
      isfirst=false;
      var mute=true;
      console.log("[app]".bold,"connected".blue.bold);
      socket.once("disconnect",function() {
        console.log("[app]".bold,"disconnected".red.bold);
      });
      socket.on("console",function(t) {
        if (t=="log"&&mute) return;
        var a=[].slice.call(arguments,1);
        a.unshift(("[app/"+t+"]").bold,"\t");
        console[t].apply(console[t],colorparse(a,0));
      });
      socket.emit("eval",function() {
        global.cEV=new ee();
        global.cEV.on("line",function(l) {
          console.log("[script]".blue+" "+l.l[l.c.replace("crimson","red").replace("royalblue","blue").replace("magenta","red")]);
        });
        global.cEV.emit("line",{c:"white",l:"> OS Loader"});
      });
      socket.once("ready",function() {
        mute=false;
        done();
      });
    } else {
      socket.disconnect();
    }
  });

  server.on('listening',function(){
      cp.spawn("npm",["run","starttest"],{stdio:"inherit",cwd:pth.join(__dirname,"..")});
  });
  server.listen(5566);
});

it("wait",function(done) {
  this.timeout(10000);
  setTimeout(done,9000);
});

after(function(done) {
  server.close();
  socket.once("disconnect",function() {
    done();
  });
  socket.disconnect();
});
