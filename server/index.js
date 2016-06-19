require("app-module-path").addPath(__dirname);
require("colors");
bunyan=require("bunyan");
init=bunyan.createLogger({name:"init"});
init.info("Starting Up...");

mongoose=require("mongoose");
mongoose.connect("mongodb://localhost:27017/osl-image-server");
express=require("express");
http=require("http");
https=require("https");
request=require("request");

require("core/express");
require("core/static");
require("core/auth");
require("core/acp");

app.listen(8190)

init.info("Online @ *:8190...");
