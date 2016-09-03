var inapp=require("../core/inapp");
if (needsroot) throw new Error("Requires Admin Permissions to run");
for (var p in inapp) {
  this[p]=inapp[p];
  app[p]=inapp[p];
}
function httpGetAsync(theUrl, callback)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            callback(xmlHttp.responseText);
    }
    xmlHttp.open("GET", theUrl, true); // true for asynchronous
    xmlHttp.send(null);
}
function getandcheck(file,line,col,cb) {
  httpGetAsync(file,function(c) {
    cb(c.split("\n")[line-1]+"\n"+Array(col).join(" ")+"^");
  });
}
window.onerror = function(message, source, lineno, colno, error) {
  if (isdev) {
    swal(message,error,"error");
    getandcheck(source,lineno,colno,function(msg) {
      console.log(msg+"\n"+source+":"+lineno+":"+colno+"\n"+error.stack);
    });
  } else {
    swal(message,error,"error")
  }
};

app.db={
  os:[]
};

(function(document) {
  'use strict';

  // Grab a reference to our auto-binding template
  // and give it some initial binding values
  // Learn more about auto-binding templates at http://goo.gl/Dx1u2g
  var app = document.querySelector('#app');

  // Sets app default base URL
  app.baseUrl = "/";
  app.pth=window.location.pathname;
  app.base = "file://"+window.location.pathname;

  app.displayInstalledToast = function() {
    // Check to make sure caching is actually enabled—it won't be in the dev environment.
    if (!Polymer.dom(document).querySelector('platinum-sw-cache').disabled) {
      Polymer.dom(document).querySelector('#caching-complete').show();
    }
  };
  app.reloadPage=function() {
    document.getElementsByTagName("body")[0].style.display="none";
    window.rReload=true; //will be reset after reload
    window.location.href=app.base;
  };
  app.navPage=function(el) {
    page.redirect(app.baseUrl+app.findData(el,"page"));
  };
  app.toast=function(text) {
    app.$.toast.text = text;
    app.$.toast.show();
  };

  // Listen for template bound event to know when bindings
  // have resolved and content has been stamped to the page
  app.addEventListener('dom-change', function() {
    console.info('App is ready');
  });

  // See https://github.com/Polymer/polymer/issues/1381
  window.addEventListener('WebComponentsReady', function() {
    // imports are loaded and elements have been registered
  });

  // Scroll page to top and expand header
  app.scrollPageToTop = function() {
    app.$.headerPanelMain.scrollToTop(true);
  };
  app.navbar=[
    {ico:"home",name:"OS Loader",page:"home"},
    {ico:"settings",name:"OSes",page:"os"},
    {ico:"fa:dot-circle-o",name:"Live CDs",page:"live"},
    {ico:"image:palette",name:"Apperance",page:"design"},
    {ico:"dns",name:"Repo",page:"repo"}
  ];
  app.addNav=function(i,d,p) {
    app.navbar=app.navbar.concat([{ico:i,page:p,name:d}]);
  }
  app.findData=function(el,p) {
    var f;
    el.path.map(function(e) {
      if (e.dataset) if (e.dataset[p]&&!f) {f=e.dataset[p];}
    });
    return f;
  }
  if (app.isDev) app.addNav("fa:refresh","Dev Reload","reload");
  events.on("updateFound",function() {
    app.addNav("arrow-downward","Update Available","update");
  });

  app.closeDrawer = function() {
    app.$.paperDrawerPanel.closeDrawer();
  };

})(document);
