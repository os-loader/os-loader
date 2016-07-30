require("app-module-path").addPath(__dirname);
require("colors");
bunyan=require("bunyan");
init=bunyan.createLogger({name:"init"});
init.info("Starting Up...");

const configDefaults={
  repo:{
    ipfs:{
      bin:"./node_modules/.bin/ipfs",
      config:"./data/ipfs-repo"
    },
    out:"./data/repo"
  }
};

mongoose=require("mongoose");
mongoose.connect("mongodb://localhost:27017/osl-image-server");
pth=require("path");
ejs=require("ejs");
express=require("express");
passport=require("passport");
http=require("http");
https=require("https");
request=require("request");
jsonfile=require("jsonfile");
mkdirp=require("mkdirp");
gpg=require("gpg");
crypto=require("crypto");

newLogger=require("core/logger");
configFile=require("core/config");
config=new configFile("config.json",configDefaults);

require("core/express");

app.listen(8190)

init.info("Online @ *:8190...");
