# OS-Loader

![Screenshot](/OS-Loader.png?raw=true)

Goal: Multiple Portable and Live Operating Systems isolated from each other on a single HDD/USB

More in idea.md

# Build Environment
Currently Ubuntu 16.04 is the recommended Build Environment

# Dependencies
You need the following installed to Build the Image:
 - nodeJS (6+)
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
