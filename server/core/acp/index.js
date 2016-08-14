//Admin Control Panel Part
/*jshint loopfunc: true */
System=require("models/system");
Channel=require("models/channel");
Release=require("models/release");

sysel=[
  {
    id:"name",
    type:"string"
  },
  {
    id:"desc",
    type:"long"
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
chel=[
  {
    id:"for",
    type:"hidden",
    name:"System ID - DO NOT CHANGE!"
  },
  {
    id:"name",
    type:"string"
  },
  {
    id:"desc",
    type:"long"
  },
  {
    id:"beta",
    type:"bool"
  },
  {
    id:"stable",
    type:"bool"
  },
  /*{
    id:"hooks.install",
    type:"object",
  },
  {
    id:"hooks.update",
    type:"object",
  },
  {
    id:"hooks.remove",
    type:"object",
  },*/
]
relel=[
  {
    id:"for",
    type:"hidden",
    name:"Channel ID - DO NOT CHANGE!"
  },
  {
    id:"version",
    name:"Version (X.X.X)",
    type:"string"
  },
  {
    id:"name",
    type:"string"
  },
  {
    id:"codename",
    type:"string"
  },
  {
    id:"upgradeNext",
    name:"Auto Upgrade",
    type:"bool"
  },
  {
    id:"upgradeTo",
    name:"...to",
    type:"string"
  },
  /*{
    id:"hooks.install",
    type:"object",
  },
  {
    id:"hooks.update",
    type:"object",
  },
  {
    id:"hooks.remove",
    type:"object",
  },
  {
    id:"hooks.patches",
    type:"object",
  },*/
];

const b=require("core/backend");
backend=new b(config);
//global.backend=backend;

function bparse(b,c) {
  var o={};
  c.map(function(e) {
    if (e.type=="bool"&&!b[e.id]) b[e.id]=false;
  });
  for (var p in b) {
    var t=c.filter(function(e) {
      return e.id==p?e:null;
    }).shift().type;
    var i;
    switch(t) {
      case "string":
      case "long":
      case "hidden":
      case "list":
        i=b[p];
        break;
      case "bool":
        i=(b[p]||"off")=="on";
        break;
      default:
        console.warn("skipping "+p+" with unkown type "+t);
    }
    if (p.indexOf(".")!=-1) {
      var s=p.split(".");
      var f=s.pop();
      var d=o;
      s.map(function(n) {
        d=d[n]||{};
      });
      d[f]=i;
      o[s.shift()]=d;
    } else {
      o[p]=i;
    }
  }
  c.map(function(e) {
    if (e.id.indexOf(".")!=-1) {
      var s=e.id.split(".");
      var d=o;
      s.map(function(n) {
        if (typeof d[n] == "undefined") throw new Error("Parameter "+e.id+" missing!");
        d=d[n];
      });
    } else {
      if (typeof o[e.id] == "undefined") throw new Error("Parameter "+e.id+" missing!");
    }
  });
  return o;
}
function cparse(b,c) {
  var o=c.map(function(e) {
    if (e.id.indexOf(".")!=-1) {
      var s=e.id.split(".");
      var d=b;
      s.map(function(n) {
        if (!d[n]) throw new Error("Parameter "+e.id+" missing!");
        d=d[n];
      });
      if (!d) throw new Error("Parameter "+e.id+" missing!");
      e.value=d;
      return e;
    } else {
      if (typeof b[e.id] == "undefined") throw new Error("Parameter "+e.id+" missing!");
      e.value=b[e.id];
      return e;
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

app.get("/repo",function(req,res) {
  res.render("repo",{title:"Repo Dashboard",config:backend.repocfg,s:backend.status.repo});
});

app.get("/repo/update",function(req,res) {
  res.flash("error","Use the 'Update' button");
  res.redirect("/admin/Repo");
});

app.post("/repo/update",function(req,res) {
  return (backend.repo.updateRepo()?res.flash("error","Update is already running!"):res.flash("success","Update queued!"))?res.redirect("/admin/Repo"):res.redirect("/admin/Repo");
});

app.get("/Systems",function(req,res) {
  System.find({},function(e,r) {
    if (e) return next(e);
    res.render("systems",{title:"Systems",systems:r});
  });
});
app.get("/Systems/new",function(req,res) {
  res.render("new",{url:req.originalUrl,n:true,el:sysel,name:"System",title:"New System"});
});
app.post("/Systems/new",function(req,res,next) {
  try {
    new System(bparse(req.body,sysel)).save(function(e,s) {
      if (e) return next(e);
      req.flash("success","Saved!");
      res.redirect(req.originalUrl.replace("new",s._id));
    });
  } catch(e) {
    req.flash("error",e.toString());
    res.redirect(req.originalUrl);
  }
});
function sysnav(r,a) {
  return a?[].concat(sysnav(r),a):[
    {name:"Back",icon:"arrow-left",url:"/admin/Systems"},
    {name:r.name,icon:"desktop",url:"/admin/sys/"+r._id},
    {name:"Edit",icon:"pencil",url:"/admin/Systems/"+r._id},
    {name:"Channels",icon:"hdd-o",url:"/admin/sys/"+r._id+"/Channels/"}
  ]
}
function chnav(r,a) {
  return a?[].concat(chnav(r),a):[
    {name:"Back",icon:"arrow-left",url:"/admin/sys/"+r.for},
    {name:r.name,icon:"hdd-o",url:"/admin/sys/"+r.for+"/Channels/"+r._id},
    {name:"Releases",icon:"tag",url:"/admin/sys/"+r.for+"/Channel/"+r._id+"/Releases"},
  ]
}
function relnav(r,r2,a) {
  return a?[].concat(chnav(r,r2),a):[
    {name:"Back",icon:"arrow-left",url:"/admin/sys/"+r2._id+"/Channel/"+r.for},
    {name:r.name,icon:"tag",url:"/admin/sys/"+r2._id+"/Channel/"+r.for+"/Release/"+r._id},
  ]
}
app.get("/Systems/:id",function(req,res,next) {
  System.findOne({_id:req.params.id},function(e,r) {
    if (e) return next(e);
    try {
      res.render("new",{url:req.originalUrl,n:false,el:cparse(r,sysel),name:r.name,title:r.name+" - Systems",nav:sysnav(r)});
    } catch(e) {
      req.flash("error",e.toString());
      res.redirect("/admin/Systems");
    }
  });
});
app.post("/Systems/:id",function(req,res,next) {
  System.findOne({_id:req.params.id},function(e,r) {
    if (e) return next(e);
    try {
      var o=bparse(req.body,sysel);
      for (var p in o) {
        r[p]=o[p];
      }
      r.save(function(e) {
        if (e) return next(e);
        req.flash("success","Saved!");
        res.redirect(req.originalUrl);
      });
    } catch(e) {
      req.flash("error",e.toString());
      res.redirect(req.originalUrl);
    }
  });
});

app.use("/sys/:sys",function(req,res,next) {
  System.findOne({_id:req.params.sys},function(e,r) {
    if (e) return next(e);
    req.sys=r;
    var o=res.render.bind(res);
    res.render=function(a,b,c) {
      b.nav=sysnav(r,b.nav);
      b.title=b.title?(b.title+" - "+r.name):r.name+" - Systems";
      return o(a,b,c);
    }
    return next();
  });
});

app.get("/sys/:sys",function(req,res) {
  res.render("sys",{s:req.sys});
});

app.get("/sys/:sys/Channels",function(req,res,next) {
  r=req.sys;
  Channel.find({for:r._id},function(e,c) {
    if (e) return next(e);
    res.render("channels",{title:"Channels",channels:c,sys:r});
  });
});

app.get("/sys/:sys/Channels/new",function(req,res) {
  r=req.sys;
  res.render("new",{url:req.originalUrl,n:true,f:r._id,el:chel,name:"Channel",title:"New Channel"});
});

app.post("/sys/:sys/Channels/new",function(req,res,next) {
  try {
    new Channel(bparse(req.body,chel)).save(function(e,s) {
      if (e) return next(e);
      req.flash("success","Saved!");
      res.redirect(req.originalUrl.replace("new",s._id));
    });
  } catch(e) {
    req.flash("error",e.toString());
    res.redirect(req.originalUrl);
  }
});

app.get("/sys/:sys/Channels/:id",function(req,res,next) {
  Channel.findOne({_id:req.params.id},function(e,r) {
    if (e) return next(e);
    try {
      res.render("new",{url:req.originalUrl,n:false,f:req.sys._id,el:cparse(r,chel),nav:chnav(r),name:r.name,title:r.name+" - Channels"});
    } catch(e) {
      req.flash("error",e.toString());
      res.redirect(req.originalUrl.split("/").slice(0,-1).join("/"));
    }
  });
});

app.post("/sys/:sys/Channels/:id",function(req,res,next) {
  Channel.findOne({_id:req.params.id},function(e,r) {
    if (e) return next(e);
    try {
      var o=bparse(req.body,chel);
      for (var p in o) {
        r[p]=o[p];
      }
      r.save(function(e) {
        if (e) return next(e);
        req.flash("success","Saved!");
        res.redirect(req.originalUrl);
      });
    } catch(e) {
      req.flash("error",e.toString());
      res.redirect(req.originalUrl);
    }
  });
});

app.use("/sys/:sys/Channel/:ch",function(req,res,next) {
  Channel.findOne({_id:req.params.ch},function(e,r) {
    if (e) return next(e);
    req.ch=r;
    var o=res.render.bind(res);
    res.render=function(a,b,c) {
      b.nav=chnav(r,b.nav);
      b.title=b.title?(b.title+" - "+r.name):r.name+" - Channels";
      return o(a,b,c);
    }
    return next();
  });
});

app.get("/sys/:sys/Channel/:ch/Releases",function(req,res) {
  r=req.ch;
  Release.find({for:r._id},function(e,c) {
    if (e) return next(e);
    res.render("releases",{title:"Releases",releases:c,sys:req.sys,ch:r});
  });
});

app.get("/sys/:sys/Channel/:ch/Releases/new",function(req,res) {
  r=req.ch;
  res.render("new",{url:req.originalUrl,n:true,f:r._id,el:relel,name:"Release",title:"New Release"});
});

app.post("/sys/:sys/Channel/:ch/Releases/new",function(req,res,next) {
  try {
    new Release(bparse(req.body,relel)).save(function(e,s) {
      if (e) return next(e);
      req.flash("success","Saved!");
      res.redirect(req.originalUrl.replace("new",s._id));
    });
  } catch(e) {
    req.flash("error",e.toString());
    res.redirect(req.originalUrl);
  }
});

app.get("/sys/:sys/Channel/:ch/Releases/:id",function(req,res,next) {
  Release.findOne({_id:req.params.id},function(e,r) {
    if (e) return next(e);
    try {
      res.render("new",{url:req.originalUrl,n:false,f:req.ch._id,el:cparse(r,relel),nav:relnav(r,req.sys),name:r.name,title:r.name+" - Releases"});
    } catch(e) {
      req.flash("error",e.toString());
      res.redirect(req.originalUrl.split("/").slice(0,-1).join("/"));
    }
  });
});

app.post("/sys/:sys/Channel/:ch/Releases/:id",function(req,res,next) {
  Release.findOne({_id:req.params.id},function(e,r) {
    if (e) return next(e);
    try {
      var o=bparse(req.body,relel);
      for (var p in o) {
        r[p]=o[p];
      }
      r.save(function(e) {
        if (e) return next(e);
        req.flash("success","Saved!");
        res.redirect(req.originalUrl);
      });
    } catch(e) {
      req.flash("error",e.toString());
      res.redirect(req.originalUrl);
    }
  });
});

module.exports=app;
