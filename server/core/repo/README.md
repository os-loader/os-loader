# How the static Repo will look like (examples)
Note: the different sources (ipfs,http,https) will be priorized by the values in the user´s config.

```
  - main.json
  {
    name:"Name", //name
    desc:"Description", //description
    os:["system1","system2"], //systems
    maintainer:"Maintainer <repo@exmaple.com>", //maintainer+email
    icon:"./path/to/icon.png", //relative icon path
    sources:{ //alternative sources
      "ipfs":"ipfs/hash/file",
      "http":"example.com/repo.tar.gz",
      "https":"example.com/repo.tar.gz"
    }
  }
  - checksum.json
  {
    files:{
      "file":{
        sha256:"", //sha256 checksum
        size:"", //file size
      }
    },
    signed:"KEYID" //keyid of signature - must match keyid in repourl
  }
  - checksum.json.signed
  # signed checksum.json with [checksum.json].signed key
  - [os].json
  {
    name:"OS Name", //name
    desc:"OS Description", //description
    theme:"#ffff00", //theme color
    icon:"./path/to/icon.png", //relative icon path
    channels:["stable","devel","unstable"], //channels
    type:{
      live:"", //live cd iso type
      system:"debian", //system type - arch, debian, android, other
    }
  }
  - [os]/[channel].json
  {
    name:"Beta Releases", //channel full name
    desc:"Might be unstable",
    stable:false, //if true shown also in production mode
    beta:true, //if set shown under beta releases
    //if neither the beta nor the stable flag is set the channel is shown as daily
    id:"channel", //the channel id/name
    hooks:{
      install:{
        "os:example":{ //hook name - script or os:*
          fail:false, //(boolean, default=false) if false cancel install on error, (string) hook to execute on failure
          arg:["{FOLDER}","{DEVICE}"], //arguments to run this hook with, supports variables
        }
        "os:example2":{
          fail:"os:example3",
        }
      },
      update:{

      },
      remove:{

      }
    }
    releases:[
      {
        date:0, //release date
        version:"0.0.1", //version N.N.N[-rc...]
        name:"Beta 1", //release name
        codename:"example-16", //release codename
        upgrade:"", //(string) release to upgrade to, (boolean) upgrade to next release
        files:{
          "image.iso": {
            sha256:"", //sha256 checksum
            type:"live.iso", //iso,squashfs,image,vdi | live.iso = use this as livecd image
            ipfs:"ipfs/hash/image.iso", //ipfs/ipns url or hash
            http:"example.com/image.iso", //http:// link
            https:"example.com/image.iso", //https:// link
          }
        },
        hooks:{
          install:{ //hooks on install (after default hooks)
            "os:example":false, //disable a hook with false
          },
          update:{ //hooks on update (after default hooks)

          },
          remove:{ //hooks on remove (before default hooks)

          },
          patches:{
            "./patch1":false, //remove patch
            "./patch2":{ //install patch
              arg:["{FOLDER}"],
              if:"!update8", //!patch or patch - execute only if true
            }
          }
        }
      }
    ]
  }
```

# Uploading
A repo should be a tar.gz

# Repo URL
The repo urls should look like this:
```
[fs,http,https]://path/to/repo.tar.gz?keyid=KEYID
```
Additionally you can create a ```repo.sha256``` with the checksum so the client downloads only updated versions.
