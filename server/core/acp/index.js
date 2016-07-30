//Admin Control Panel Part

const b=require("core/backend");
backend=new b(config);
//global.backend=backend;

var app=express.Router();
app.use("/",function(req,res,next) {
  if (req.user) if (req.user.admin) return next(); else res.flash("error","Forbidden!").redirect("/"); else res.redirect("/Login");
});
app.use(function(req,res,next) {
  var o=res.render.bind(res);
  res.render=function(a,b,c) {
    b.flash=res.getFlash();
    b.user=req.user;
    b.nav=[
      {name:"Back",icon:"arrow-left",url:"/"},
      {name:"Systems",icon:"desktop",url:"/admin/Systems"},
      {name:"Repo",icon:"file-o",url:"/admin/Repo"},
      {name:"Settings",icon:"gear",url:"/admin/Settings"},
    ]
    b.status=backend.status;
    return o(a,b,c);
  }
  return next();
});
app.get("/",function(req,res) {
  res.render("admin",{title:"Admin Home"});
});
module.exports=app;
