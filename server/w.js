function w(l,fnc) {
  var res=[];
  function run(done) {
    var i=l.pop();
    if (i) {
      fnc(i,function(e,r) {
        if (e) return done(e);
        if (r) res.push(r);
        return run(done);
      });
    } else {
      done(null,res);
    }
  }
  return run;
}
module.exports=w;
