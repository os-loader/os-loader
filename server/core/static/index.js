//Server static or cached content
var app=express.Router();
app.use("/repo",express.static(config.repo.out));
app.use("/",express.static(pth.join(__dirname,"..","..","bower_components")));
module.exports=app;
