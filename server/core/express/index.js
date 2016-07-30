const app=global.app=express();

//const server=global.server=http.createServer();

var log={};
newLogger("express",log);

User=require("core/user");

var nextadmin=false;

User.find({},function(e,u) {
  if (e) return log.error(e,"Cannot load users");
  nextadmin=!u.length;
  if (nextadmin) log.info("Register to Complete Setup!");
});

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

app.use(passport.initialize());
app.use(passport.session());

app.use(require('flash')());

app.use(function(req,res,next) {
  res.getFlash=function() {
    var f=res.locals.flash;
    req.session.flash=[];
    return f;
  }
  return next();
});

var nav=[
  {name:"Home",icon:"home",url:"/"},
  {name:"Admin",icon:"shield",url:"/admin"}
];

app.engine('ejs', function (filePath, options, cb) { // define the template engine
  ejs.renderFile(filePath, options, {}, function(err, str){
    if (err) return cb(new Error(err));
    ejs.renderFile(pth.join(__dirname,"..","..","views","main.ejs"), {html:str,title:options.title,nav:options.nav||nav,flash:options.flash}, {}, function(err, str){
      if (err) return cb(new Error(err));
      cb(err,str);
    });
  });
});
app.set('views', pth.join(__dirname,"..","..","pages")); // specify the views directory
app.set('view engine', 'ejs'); // register the template engine

app.get("/",function(req,res) {
  res.render("home",{title:"Home",status:backend.status,flash:res.getFlash()});
});

app.post('/Register', function(req, res) {
  log.log('registering user');
  User.register(new User({username: req.body.username,admin:nextadmin}), req.body.password, function(err) {
    if (nextadmin&&!err) {nextadmin=false;req.flash("success","This is now the Admin Account");}
    if (err) {
      log.error(err,'error while user register!');
      req.flash("error","Failed to register! "+err.toString());
      return res.redirect("/Register");
    }

    log.log('user registered!');
    req.flash("info","Sucessfully Registered! Please log in now!");

    res.redirect('/Login');
  });
});

app.post('/Login', passport.authenticate('local'), function(req, res) {
  req.flash("info","Welcome back!");
  res.redirect('/');
});

app.get("/Login",function(req,res) {
  if (req.isAuthenticated()) return res.redirect("/");
  res.render("login",{title:"Login",flash:res.getFlash(),nav:[{name:"Login",icon:"sign-in",url:"/Login"},{name:"Register",icon:"user-plus",url:"/Register"}]});
});

app.get("/Register",function(req,res) {
  if (req.isAuthenticated()) return res.redirect("/");
  res.render("register",{title:"Register",flash:res.getFlash(),nav:[{name:"Login",icon:"sign-in",url:"/Login"},{name:"Register",icon:"user-plus",url:"/Register"}]});
});

app.use("/admin",require("core/acp"));


app.use(function(req,res) {
  res.status(404).render("404",{title:"404 - Page Not Found"});
});
