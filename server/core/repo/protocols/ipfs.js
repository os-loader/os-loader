function ipfs() {
  //ipfs downloads
  function parse(url) {
    return protocol+"://"+url;
  }
  function pipe(url) {
    //Returns a Pipe
    var p=spawn("ipfs",["cat",url],{});
    var e="";
    p.stderr.on("data",function(d) {
      e+=d.toString();
    });
    p.on("exit",function() {
      if (e) {
        var err=new Error(e);
        err.url=url;
        p.stdout.emit("error",err);
        p.emit(err);
      }
    });
    return p.stdout;
  }
  function plain(url,cb) {
    exec("ipfs cat "+url,function(e,out,err) {
      if (e) return cb(e);
      if (err.toString()) return cb(new Error(err.toString()));
      return cb(null,out.toString());
    });
  }
  function verify(url) {
    return url.split("/")[0].length==46;
    // TODO: use ipfs address verify method
  }
  this.pipe=pipe;
  this.plain=plain;
  this.parse=parse;
  this.verify=verify;
  this.options={
    p2p:true //p2p protocols will be used before centralized to reduce server load
  }
}
module.exports=ipfs;
