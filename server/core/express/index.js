const app=global.app=express();

//const server=global.server=http.createServer();

User=require("core/user");

passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

var logger = require('morgan');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var bodyParser = require('body-parser');

var MongoStore = require('connect-mongodb-session')(session);
var store = new MongoStore(
  {
    uri: "mongodb://localhost:27017/osl-image-server",
    collection: 'sessions'
  });

app.use(require("core/static"));

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
app.use(session({
  secret:"rgkhresnfk",
  name:"osl-image-server",
  store:store,
  resave: true,
  saveUninitialized: true
}));

var nav=[
  {name:"Home",icon:"home",url:"/"},
  {name:"Admin",icon:"shield",url:"/admin"}
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
