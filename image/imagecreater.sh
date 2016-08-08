#!/bin/bash
# Will Build the os-loader image
set -e

err() {
  echo "E: $1"
  exit $2
}

if [ $(id -u) -ne 0 ]; then
  err "Only root can run this" 5
fi

if [ -z "$VERBOSE" ]; then
  slient=true
fi

execp=$(readlink -f $0)
execd=$(dirname $execp)
data=$execd/data

if [ -z $1 ]; then
  cur=$PWD/IMAGE
  curroot=$PWD
  BDIR="/tmp/os-loader-builddir"
else
  cur=$1/IMAGE
  curroot=$1
  BDIR=$1
fi
mkdir -p $cur
cd $cur


#folders
cache=$cur/cache
img=$cur/img
out=$cur/output
chtmp=$cur/chroot.tmp
tmp=$cur/tmp
stage=$cur/stage

uall() {
  for f in `mount | grep "$cur[a-zA-Z0-9/]*" -o`; do
    umount -f $f 2> /dev/null
  done
}
uall
rm -rf $tmp
mkdir -p {$cache,$img,$out,$tmp,$stage}

#files
rzip=$cache/root.tar.gz
initrd=$cache/initrd.img

#settings
arch=amd64
dist=xenial
today=$(date)
host=$(hostname)
commit=$(cat $curroot/VERSION)
channel=$(cat $curroot/CHANNEL)
user=$SUDO_USER
mirror=http://archive.ubuntu.com/ubuntu  #http://10.0.3.1:8084
curch=""
ver=$(date +%s)

log() {
  echo "I: $*..."
}

log "Starting Image Creation in $cur"

if [ -f $rzip ]; then
  :
else
  log "Create base chroot"
  debootstrap --arch=$arch --components=main,universe,multiverse,restircted --variant=minbase $dist $chtmp $mirror
  log "Compress base chroot"
  cd $chtmp
  tar cfzp $rzip .
  cd $cur
  rm -rf $chtmp
fi

CMPsquashfs() {
  if [ -z "$VERBOSE" ]; then
    mksquashfs $1 $2 -no-progress
  else
    mksquashfs $1 $2
  fi
  return $?
}

CMPgzip() {
  gzip $1 $2
  return $?
}

CMPintrid() {
  cd $1
  find . | cpio --quiet --dereference -o -H newc | gzip -9 > $2
  local ee=$?
  cd $cur
  return $ee
}

deInitrd() {
  mkdir -p $2
  cd $2
  gzip -dc $1 | cpio -id
  cd $cur
}

comp() {
  if [ "x$1" == "xkeep" ]; then
    return 0;
  fi
  if [ "x$1" == "xremove" ]; then
    rm -rf $2
    return $?
  fi
  log "Compress $2 with $1 to $3"
  CMP$1 $2 $3 # 1=alg 2=input 3=output 4=remove?
  e=$?
  if [ $e -ne 0 ]; then
    err "Failed to compress, exit code $e" $e
  fi
  if [ "x$4" == "x" ]; then
    rm -rf $2
  fi
}

chroot() {
  if [ "x$curch" != "x" ]; then
    /usr/sbin/chroot $curch $*
    return $?
  else
    return 44;
  fi
}

chstd() {
  chroot /bin/bash -x <<ffff
$*
ffff
}

chinstall() {
  chstd "export DEBIAN_FRONTEND=noninteractive
apt-get install $* -y"
}
wch() { #wch "installtmp" installimage "parted" "squashfs" "install.img"
  local where=$tmp/$1
  local c=$4 # squashfs | gzip | intrid | keep
  local cout=$cache/$5
  local keep=$6
  if [ -f $cout ]; then
    log "Skip creating $cout, already exists"
    return 0;
  else
    log "Create $cout"
    rm -rf $where
    mkdir -p $where
    tar xfz $rzip -C $where
    curch=$where
    for dir in /dev/pts /proc /sys; do mount --bind $dir $where$dir; done
    $2 $where $3
    for dir in /dev/pts /proc /sys; do umount $where$dir; done
    uall
    curch=""
    comp $c $where $cout $keep
  fi
}
lch() { #wch "installtmp" installimage "parted" "install.img"
  local where=$tmp/$1
  local cout=$cache/$4
  if [ -f $cout ]; then
    log "Skip creating $cout, already exists"
    return 0;
  else
    log "Create $cout"
    rm -rf $where
    mkdir -p $where
    deInitrd $initrd $where
    curch=$where
    $2 $where $3
    curch=""
    comp intrid $where $cout
  fi
}

#ISO functions

preiso() {
  #Prepare iso
  rm -rf $stage
  mkdir -p $stage
  log "Copy/Assemble files into $stage"
  cp -r $data/boot $stage/isolinux
  cp -r $data/com32/* $stage/isolinux/
  about=`cat $data/about.txt`
  about=${about//"{DATE}"/$today};
  about=${about//"{VER}"/$commit};
  about=${about//"{HOST}"/$host};
  about=${about//"{CHANNEL}"/$channel};
  echo "$about" > $stage/isolinux/f1.txt

  mkdir -p $stage/live
  #for f in system.img; do
  #  log "Copy $f to stage"
  #  cp $cache/$f $stage/live/$f
  #done
  log "Copy system.img to filesystem.squashfs"
  cp $cache/system.img $stage/live/filesystem.squashfs

  ln -s ./ $stage/live/live

  mkdir -p $stage/boot
  cp $cache/memtest86+.bin $stage/boot
  cp $cache/initrd.* $stage/boot
  cp $cache/vmlinuz $stage/boot

  mkdir -p $stage/init

  cd $stage
  log "Create md5sum"
  find -type f \( ! -name "md5sum.txt" -and ! -name "isolinux.bin" \) -exec md5sum "{}" + > md5sum.txt
  cd $cur

  touch $stage.ready
}

geniso() {
  log "Generate $out/image.iso"
  genisoimage -quiet -o $out/image.iso -b isolinux/isolinux.bin -c isolinux/boot.cat -input-charset utf8 -no-emul-boot -boot-load-size 4 \
  -boot-info-table -r -V "OS-Loader" -cache-inodes -J -l $stage
}

#Main Functions

initscript() {
  echo $(cat $2/init) >> $curch/init
}

systemimage() {
  #Install Software
  export DEBIAN_FRONTEND=noninteractive
  mkdir -p $curch/meta
  cp $curroot/VERSION $curch/meta
  cp $curroot/CHANNEL $curch/meta
  echo 'Dpkg::Progress-Fancy "0";
APT::Color "0";' > $curch/etc/apt/apt.conf.d/99progressbar
  mkdir -p $curch/etc/dpkg/dpkg.conf.d/
  echo '
# /etc/dpkg/dpkg.conf.d/01_minimize

# Delete man pages
path-exclude=/usr/share/man/*

# Delete docs
path-exclude=/usr/share/doc/*
path-include=/usr/share/doc/*/copyright
' > $curch/etc/dpkg/dpkg.conf.d/01_minimize

  chstd "apt-get update"

  kernelandboot="memtest86+ grub2 linux-base linux-generic" # linux kernel and bootloader
  liveboot="live-boot live-boot-initramfs-tools casper squashfs-tools" # live boot
  uitools="plymouth plymouth-label openbox xorg lightdm dmz-cursor-theme feh" # display manager, window manager, etc.
  othertools="bash sudo menu curl wget apt-transport-https" # others
  chinstall $kernelandboot $liveboot $uitools $othertools
  
  chstd "echo $commit > /version"
  chstd 'curl --silent https://deb.nodesource.com/gpgkey/nodesource.gpg.key | apt-key add -
  VERSION=node_6.x
  DISTRO='$dist'
  echo "deb https://deb.nodesource.com/$VERSION $DISTRO main" | tee /etc/apt/sources.list.d/nodesource.list
  echo "deb-src https://deb.nodesource.com/$VERSION $DISTRO main" | tee -a /etc/apt/sources.list.d/nodesource.list
  apt-get update'
  chinstall nodejs

  #Set up user
  chstd "useradd osloader --uid=987 -m --password='"$(echo "osloader" | openssl passwd -1 -stdin)"'
  addgroup osloader root
  addgroup osloader sudo"
  for f in `find $data/copy/ -type f`; do
    r=${f/"$data/copy/"/""}
    log "Copy file /$r"
  done
  cp -r --preserve=timestamps,mode $data/copy/* $curch
  chmod +x $curch/home/osloader/.config/openbox/autostart
  chown root:root $curch/etc/sudoers.d/os-loader
  chmod 440 $curch/etc/sudoers.d/os-loader
  chstd "chown osloader:osloader -R /home/osloader"
  mkdir -p $curch/usb

  #Install internal .debs
  cp -r -v $BDIR/deb $curch/deb
  chstd "export DEBIAN_FRONTEND=noninteractive
apt install /deb/*.deb -y"
  rm -rf $curch/deb

  #Clean
  chstd "apt-get clean"

  for d in /usr/share/man/ /var/cache/apt/ /var/cache/man/; do #/var/lib/apt/ /var/lib/dpkg/; do
    log "Delete dir: $(du -hs $curch$d)"
    rm -rf $curch$d
  done
  log "Clear Cache..."

  #Copy everything
  cp $1/boot/vmlinuz* $2/vmlinuz
  cp $1/boot/initrd.img* $2/initrd.img
  cp $1/boot/memtest86+.bin $2/memtest86+.bin
}

#Execute Everything

#wch "installtmp" installimage "parted" "squashfs" "install.img"
wch "installtmp" systemimage "$cache" "squashfs" "system.img"
#lch "inittmp" initscript "$data/installinit" "initrd.install"

if [ -f $stage.ready ]; then
  log "ISO is already prepared"
else
  log "Prepare ISO"
  preiso
fi

if [ -f $out/image.iso ]; then
  log "$out/image.iso already exists, delete it to re-create"
else
  geniso
fi

uall
rm -rf $tmp

log "Final md5sum"
cd $out
find -type f \( ! -name "md5sum.txt" \) -exec md5sum "{}" + > md5sum.txt
cd $cur

log "The image has been created sucessfully in $out/image.iso"
log "The system-image has been created sucessfully in $out/system.img"
exit 0
