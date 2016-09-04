page("/os",function() {
  app.route="os";
  setFocus(app.route);
});

page("/os-select",function() {
  app.route="os-select";
  setFocus(app.route);
});

page("/os-install/:id/:step",function(d) {
  app.os=repos.db.os.filter(function(o) {
    return d.params.id==o.id
  })[0];
  if (!app.os) throw new Error("Invalid ID");
  switch(d.params.step) {
    case "main":
      app.oschannel="";
      app.route="os-install";
      app.step="Select a channel to install from";
      app.installNext=function() {
        page.redirect("/os-install/"+d.params.id+"/version");
      };
      app.select=function(el) {
        app.oschannel=app.findData(el,"id");
        app.channel=repos.db.ch.filter(function(c) {
          return c.id==app.oschannel;
        })[0];
        if (!app.channel) {
          app.step="Invalid Channel";
          app.next=false;
        } else {
          app.step=app.channel.name+(app.channel.stable?"":" ("+app.channel.typename+")");
          app.next=true;
        }
      }
      break;
/*    case "data":
      app.route="os-data";
      break;*/
    case "version":
      app.osversion="";
      app.route="os-version";
      app.step="Select a version to install";
      app.installNext=function() {
        page.redirect("/os-install/"+d.params.id+"/settings");
      };
      app.select=function(el) {
        app.osversion=app.findData(el,"id");
        app.version=repos.db.rel.filter(function(c) {
          return c.id==app.osversion;
        })[0];
        if (!app.version) {
          app.step="Invalid Version";
          app.next=false;
        } else {
          app.step=app.version.version+"from Channel "+app.channel.name+(app?"":" ("+app.channel.typename+")");
          app.next=true;
        }
      }
      break;
    default:
      throw new Error("Invalid Step");
  }
  setFocus(app.route);
});

page("/live",function() {
  app.route="live";
  setFocus(app.route);
});

page("/design",function() {
  app.route="design";
  setFocus(app.route);
});

page("/update",function() {
  app.route="update";
  //setFocus(app.route);
});

page("/repo",function() {
  app.route="repo";
  setFocus(app.route)
});
