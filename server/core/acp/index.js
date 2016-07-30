//Admin Control Panel Part
var app=express.Router();
app.use("/",function(req,res,next) {
  if (req.user) if (req.user.admin) return next();
  res.redirect("/Login");
});
module.exports=app;
