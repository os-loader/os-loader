#!/bin/bash
#Allows you to edit an OS-Loader ISO

set -e

file=$2
if [ -z $file ]; then
  echo "No file given - using default image.iso"
  file="image.iso"
fi
file=$(readlink -f $file)
main=$PWD
tmp="$PWD/remaster"
isotmp="$tmp/iso.mount"
isostore="$tmp/iso"
data="$tmp/system"

exec() {
  case $1 in
    edit)
      if [ -e $tmp ]; then
        echo "Seems like there is already an unpacked ISO"
        echo "Execute '$0 clear' to cleanup"
        exit 2
      fi
      if ! [ -e $file ]; then
        echo "Input file $file dosen't exist"
        exit 3
      fi
      mkdir -p $isotmp
      mount -o loop -t iso9660 $file $isotmp
      mkdir -p $isostore
      cp -r -v $isotmp/* $isostore
      umount -f $isotmp
      rmdir $isotmp
      cd $tmp
      unsquashfs $isostore/live/filesystem.squashfs
      rm $isostore/live/filesystem.squashfs
      mv $tmp/squashfs-root $data
      echo "===[!]==="
      echo "READY to remaster"
      echo "===[!]==="
      ;;
    from-code)
      if ! [ -e $tmp ]; then
        echo "No image to remaster"
        exit 1
      fi
      echo "Recreate from newest code"
      cp -r -v $main/data/copy/* $tmp/system/
      exec "save"
      ;;
    dev)
      echo "Will recreate based on the latest ISO - with changes from $pwd/data/copy"
      exec "clear"
      bash ../getlatest.sh $tmp.iso
      file=$tmp.iso
      exec "edit"
      rm $tmp.iso
      file=$main/remaster.out.iso
      exec "from-code"
      ;;
    save)
      if ! [ -e $tmp ]; then
        echo "No image to remaster"
        exit 1
      fi
      if [ -e $isostore/live/filesystem.squashfs ]; then
        rm $isostore/live/filesystem.squashfs
      fi
      mksquashfs $data $isostore/live/filesystem.squashfs
      cd $isostore
      find -type f \( ! -name "md5sum.txt" -and ! -name "isolinux.bin" \) -print -exec md5sum "{}" + > md5sum.txt
      genisoimage -quiet -o $file -b isolinux/isolinux.bin -c isolinux/boot.cat -input-charset utf8 -no-emul-boot -boot-load-size 4 \
      -boot-info-table -r -V "OS-Loader" -cache-inodes -J -l $isostore
      echo "===[!]==="
      echo "DONE! File is available at $file"
      echo "===[!]==="
      ;;
    clear)
      rm -rf $tmp
      echo "===[!]==="
      echo "DONE!"
      echo "===[!]==="
      ;;
    *)
      echo "Usage: sudo $0 {edit|save|clear} *.iso"
    esac
}

exec $1
