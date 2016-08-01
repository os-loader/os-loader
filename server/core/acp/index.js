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
      if (!b[e.id]) throw new Error("Parameter "+e.id+" missing!");
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
app.get("/Systems",function(req,res) {
  System.find({},function(e,r) {
    if (e) return next(e);
    res.render("systems",{title:"Systems",systems:r});
  });
});
app.get("/Systems/new",function(req,res) {
  res.render("new",{url:req.originalUrl,n:true,el:sysel,name:"System",titel:"New System"});
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
    {name:r.name,icon:"desktop",url:"/admin/Systems/"+r._id},
    {name:"Channels",icon:"tag",url:"/admin/sys/"+r._id+"/Channels/"}
  ]
}
app.get("/Systems/:id",function(req,res,next) {
  System.findOne({_id:req.params.id},function(e,r) {
    if (e) return next(e);
    try {
      res.render("new",{url:req.originalUrl,n:false,el:cparse(r,sysel),name:r.name,titel:r.name+" - Systems",nav:sysnav(r)});
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
      b.nav=b.nav||sysnav(r);
      return o(a,b,c);
    }
    return next();
  });
});

app.get("/sys/:sys/Channels",function(req,res,next) {
  r=req.sys;
  Channel.find({for:r._id},function(e,c) {
    if (e) return next(e);
    res.render("channels",{title:r.name+" - Channels",channels:c,sys:r});
  });
});

app.get("/sys/:sys/Channels/new",function(req,res) {
  r=req.sys;
  res.render("new",{url:req.originalUrl,n:true,f:r._id,el:chel,name:"Channel",titel:"New Channel"});
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
      res.render("new",{url:req.originalUrl,n:false,f:r._id,el:cparse(r,chel),name:r.name,titel:r.name+" - Channels"});
    } catch(e) {
      req.flash("error",e.toString());
      res.redirect(req.originalUrl.split("/").slice(0,-1).join("/"));
    }
  });
});

module.exports=app;
