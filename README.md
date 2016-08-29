# OS-Loader
[![Build Status](https://travis-ci.org/os-loader/os-loader.svg?branch=master)](https://travis-ci.org/os-loader/os-loader)
[![TODOs](https://todofy.org/b/os-loader/os-loader)](https://todofy.org/r/os-loader/os-loader)

Install Operating Systems just like Software

![Screenshot](/OS-Loader.png?raw=true)

More in Idea.md and FAQ.md

# Images
Images built by Travis are available [here](https://os-loader.mkg20001.sytes.net/daily/?C=M;O=D) (last recent=newest)

# Build Environment
Currently Ubuntu 16.04 is the recommended Build Environment

# Dependencies
You need the following installed to Build the Image:
 - nodeJS (v6+)
 - make
 - squashfs-tools
 - genisoimage
 - debootstrap
 - schroot
 - cpio
 - gzip
 - tar
 - isolinux
 - debhelper
 - coreutils

nodeJS apt repository: ```curl -sL https://deb.nodesource.com/setup_6.x | sudo -E bash -```

Install dependencies: ```sudo apt install make squashfs-tools genisoimage debootstrap schroot cpio gzip tar isolinux debhelper coreutils nodejs```

# Build
Simply use ```make image``` or ```make server```

The default Build-Dir is ```/tmp/os-loader-builddir```, but you can change it using ```make image BDIR=/customdir``` (include the full path)
