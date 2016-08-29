const list=["http","https","ipfs"];
function protocols() {
  newLogger("protocols",this);
  const self=this;
  var proto={};
  var map=[];
  function load(p) {
    try {
      var pr=require("./"+p);
      pr.rating=0;
      pr.options=pr.options||{};
      var o=pr.options;
      if (o.insecure) pr.rating=-1; else if (o.p2p) pr.rating=1;
      proto[p]=pr;
      map.push(pr);
    } catch(e) {
      self.error(e,"Error loading "+p);
    }
  }
  list.map(load);
  function verify(p,url) {
    if (!proto[p]) throw new Error("Protocol Not Found: "+p);
    if (!proto[p].verify(proto[p].options.verifyParsed?proto[p].parse(url):url)) throw new Error("URL "+url+" not supported by Protocol "+p);
  }
  function pipe(p,url) {
    verify(p,url);
    return proto[p].pipe(proto[p].options.preParse?proto[p].parse(url):url);
  }
  function plain(p,url,cb) {
    try {
      verify(p,url);
    } catch(e) {
      return cb(e);
    }
    proto[p].plain(proto[p].options.preParse?proto[p].parse(url):url,cb);
  }
  this.pipe=pipe;
  this.plain=plain;
}
module.exports=new protocols();
