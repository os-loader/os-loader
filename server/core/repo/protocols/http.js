function http() {
  //http downloads
  function parse(url) {
    return "http://"+url;
  }
  /*  .on('response', function(resp){
    var charset = extractCharsetFromStr(resp.headers['content-type']),
        encoding = resp.headers['content-encoding'],
        decodedRes;

    // unzip
    if(encoding == 'gzip' || encoding == 'deflate')
      decodedRes = resp.pipe(encoding == 'gzip' ? zlib.createGunzip() : zlib.createInflate())
    else
      decodedRes = resp

    // charset
    if(charset != 'utf-8' && iconv.encodingExists(charset)){
      return decodedRes.pipe(iconv.decodeStream(charset))
    }
  })*/
  function pipe(url) {
    //Returns a Pipe
    /*console.log("HTTP");
    require("http").get(url, (res) => {
      console.log("HTTP");
      console.log(`Got response: ${res.statusCode}`);
      // consume response body
      res.resume();
    }).on('error', (e) => {
      console.log(`Got error: ${e.message}`);
    });*/
    return request.get(url);// - broken (works only sometimes)
  }
  function plain(url,cb) {
    request(url, function (error, response, body) {
      cb(error,body);
    });
  }
  function verify(url) {
    if (url.startsWith("http://")&&url.indexOf(".")!=-1) return true; else return false;
  }
  this.pipe=pipe;
  this.plain=plain;
  this.parse=parse;
  this.verify=verify;
  this.options={
    preParse:true, //Pass parsed url to function e.g http://url
    verifyParsed:true, //Pass parsed url to verify()
    insecure:true //Will only use if necessary
  }
}
module.exports=http;
