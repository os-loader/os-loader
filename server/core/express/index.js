const app=global.app=express();

//const server=global.server=http.createServer();

var nav=[
  {name:"home",icon:"home",url:"/"},
  {name:"admin",icon:"shield",url:"/admin"}
];

app.engine('ejs', function (filePath, options, cb) { // define the template engine
  ejs.renderFile(filePath, options, {}, function(err, str){
    if (err) return cb(new Error(err));
    ejs.renderFile(pth.join(__dirname,"..","..","views","main.ejs"), {html:str,title:options.title,nav:options.nav||nav}, {}, function(err, str){
      if (err) return cb(new Error(err));
      cb(err,str);
    });
  });
});
app.set('views', pth.join(__dirname,"..","..","pages")); // specify the views directory
app.set('view engine', 'ejs'); // register the template engine

app.get("/",function(req,res) {
  res.render("home",{title:"Home"});
});
app.use("/admin",require("core/acp"));
