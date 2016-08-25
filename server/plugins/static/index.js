function stat(reg) {
  /* COPY STATIC FILES TO REPO */
  reg(this);
  this.config({});
  this.hook("repo.files",function(repo,done) {

  });
}
module.exports=stat;
