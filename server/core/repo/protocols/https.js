function https() {
  //https downloads
  function parse(url) {
    return protocol+"://"+url;
  }
  function pipe(url) {
    //Returns a Pipe
    return request.get(url);
  }
  function plain(url,cb) {
    request(url, function (error, response, body) {
      cb(error,body);
    });
  }
  function verify(url) {
    if (url.startsWith("https://")&&url.indexOf(".")!=-1) return true; else return false;
  }
  this.pipe=pipe;
  this.plain=plain;
  this.parse=parse;
  this.verify=verify;
  this.options={
    preParse:true, //Pass parsed url to function e.g https://url
    verifyParsed:true //Pass parsed url to verify()
  }
}
module.exports=https;
