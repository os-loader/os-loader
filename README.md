# OS-Loader
[![Build Status](https://travis-ci.org/os-loader/os-loader.svg?branch=master)](https://travis-ci.org/os-loader/os-loader)

Multiple Portable and Live Operating Systems isolated from each other on a single HDD/USB

![Screenshot](/OS-Loader.png?raw=true)

More in Idea.md and FAQ.md

# Images
Images built by Travis are available [here](https://os-loader.mkg20001.sytes.net/?C=M;O=D) (last recent=newest)

# Build Environment
Currently Ubuntu 16.04 is the recommended Build Environment

# Dependencies
You need the following installed to Build the Image:
 - nodeJS (v6+)
 - make
 - squashfs-tools
 - genisoimage
 - debootstrap
 - chroot
 - cpio, gzip, tar
 - isolinux

# Build
Simply use ```make image``` or ```make server```

The Default Build-dir is ```/tmp/os-loader-builddir```, but you can change it using ```make image BDIR=/customdir``` (include full path)
