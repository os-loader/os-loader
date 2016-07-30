//Admin Control Panel Part
var app=express.Router();
app.use("/",function(req,res,next) {
  if (req.user) if (req.user.admin) return next(); else res.flash("error","Forbidden!").redirect("/"); else res.redirect("/Login");
});
module.exports=app;
