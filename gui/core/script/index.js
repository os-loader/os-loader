const colors={
  "err":{
    "normal":"red",
    "state":"magenta"
  },
  "std":{
    "normal":"white",
    "state":"blue"
  }
}
const sprefix="°";
const pprefix="¯";
function epipe(s,e,ev) {
  var d=new Duplex();
  var col=colors[e?"err":"std"];

  var curline="";
  function parseLine(line) {
    if (line.startsWith(sprefix)) {
      line=line.substr(1);
      ev.emit("state",line);
      ev.emit("line",{l:line,c:col.state});
    } else if (line.startsWith(pprefix)) {
      line=line.substr(1);
      var p=parseInt(line,10);
      ev.emit("progress",p);
    } else {
      ev.emit("line",{l:line,c:col.normal});
    }
  }
  d._write=function(d,enc,next) {
    var a=d.toString().split("\n");
    if (a.length>1) {
      a[0]+=curline;
      curline=a.pop();
      a.map(function(l) {
        parseLine(l);
      });
    } else {
      curline+=a[0];
    }
    ev.emit("print",curline,col.normal);
    next();
  }
  s.pipe(d);
  return d;
}
function spipe(std,ste,ev2) {
  var ev=ev||new ee();
  return {std:new epipe(std,false,ev),ste:new epipe(ste,true,ev),ee:ev}
}

const pp=pth.join(__dirname,"..","..","scripts");

function script(sc,args,cb,ev2) {
  //Executes scripts
  var ev=ev2||global.cEV;
  args.unshift(pth.join(pp,sc+".sh"));
  var p=spawn("/bin/bash",args,{env:{FNC:pth.join(pp,"fnc.sh")}});
  var pipe=new spipe(p.stdout,p.stderr,ev);
  p.on("close",cb);
  return {p:p,pipe:pipe,ee:ev};
}
module.exports=script;
