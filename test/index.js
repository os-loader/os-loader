assert = require('chai').assert;
pth=require("path");

http=require("http");
https=require("https");
socketio=require("socket.io");
cp=require("child_process");

function getPath() {
  var a=[].slice.call(arguments,0);
  a.unshift(__dirname,"..");
  return pth.join.apply(pth.join,a);
}

describe("gui",function() {
  require(getPath("gui","test"));
});

describe("image",function() {
  require(getPath("image","test"));
});

describe("server",function() {
  require(getPath("server","test"));
});
