//Admin Control Panel Part

System=require("models/system");
Channel=require("models/channel");
Version=require("models/version");

sysel=[
  {
    id:"name",
    type:"string"
  },
  {
    id:"desc",
    type:"string"
  },
  {
    id:"icon",
    type:"string"
  },
  {
    id:"theme",
    type:"string"
  },
  {
    id:"type.live",
    type:"list",
    v:["other"],
  },
  {
    id:"type.system",
    type:"list",
    v:["arch", "debian", "android", "other"]
  }
];

const b=require("core/backend");
backend=new b(config);
//global.backend=backend;

function bparse(b,c) {
  var o={};
  for (var p in b) {
    if (p.indexOf(".")!=-1) {
      var s=p.split(".");
      var f=s.pop();
      var d=o;
      s.map(function(n) {
        d=d[n]||{};
      });
      d[f]=b[p];
      o[s.shift()]=d;
    } else {
      o[p]=b[p];
    }
  }
  c.map(function(e) {
    if (e.id.indexOf(".")!=-1) {
      var s=e.id.split(".");
      var d=o;
      s.map(function(n) {
        if (!d[n]) throw new Error("Parameter "+e.id+" missing!");
        d=d[n];
      });
    } else {
      if (!o[e.id]) throw new Error("Parameter "+e.id+" missing!");
    }
  });
  return o;
}

var app=express.Router();
app.use("/",function(req,res,next) {
  if (req.user) if (req.user.admin) return next(); else res.flash("error","Forbidden!").redirect("/"); else res.redirect("/Login");
});
app.use(function(req,res,next) {
  var o=res.render.bind(res);
  res.render=function(a,b,c) {
    b.flash=res.getFlash();
    b.user=req.user;
    b.nav=b.nav||[
      {name:"Back",icon:"arrow-left",url:"/"},
      {name:"Dashboard",icon:"home",url:"/admin/"},
      {name:"Systems",icon:"desktop",url:"/admin/Systems"},
      {name:"Repo",icon:"file-o",url:"/admin/Repo"},
      {name:"Settings",icon:"gear",url:"/admin/Settings"}
    ]
    b.status=backend.status;
    return o(a,b,c);
  }
  return next();
});
app.get("/",function(req,res) {
  res.render("admin",{title:"Admin Dashboard"});
});
app.get("/Systems",function(req,res) {
  res.render("systems",{title:"Systems",systems:[]});
});
app.get("/Systems/new",function(req,res) {
  res.render("new",{url:"/admin/Systems/new",n:true,el:sysel,name:"System"});
});
app.post("/Systems/new",function(req,res) {
  console.log(req.body);
  try {
    bparse(req.body,sysel);
  } catch(e) {
    req.flash("error",e.toString());
  }
  res.redirect(req.originalUrl);
});
module.exports=app;
