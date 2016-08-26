function stat(reg) {
  const self=this;
  /* COPY STATIC FILES TO REPO */
  reg(this);
  this.config({});
  this.hook("repo.files",function(repo,done) {
    recursive(self.dir("files"),function(e,l) {
      if (e) return done(e);
      self.debug({dir:self.dir("files")},self.fancy("Found "+l.length+" file"+(l.length!=1?"s":"")));
      w(l,function(file,cb) {
        var rel=file.replace(self.dir("files")+"/","");
        self.trace("Copy",rel);
        fs.readFile(file,function(e,c){
          if (e) {
            e.file=file;
            self.error(e,"Error loding "+rel);
            return cb();
          }
          repo.addFile(rel,c);
          return cb();
        });
      })(done);
    });
  });
  this.mkdir("files")
  recursive(self.dir("files"),function(e,l) {
    if (!l) return self.error("ERROR - no permisions for files directory");
    if (!l.length) return self.info({dir:self.dir("files")},self.fancy("Put files to be copied into the repo into the static directory"))
    return self.info({dir:self.dir("files")},self.fancy("Found "+l.length+" file"+(l.length!=1?"s":"")));
  });
}
module.exports=stat;
