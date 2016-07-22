. $FNC

dev=$1
fs=$2

if [ -z $isos ]; then
  script mount-image
fi

progmax 2
state "Umount $dev"
errignore
cat /proc/mounts | grep -o "^$dev" > /dev/null 2> /dev/null
e=$?
errcatch
if [ $e -eq 0 ]; then
  umount $dev -f
fi
prog 1

state "Mount $dev"
mount -t $fs $dev $usb
if [ -z $isinstall ]; then
  rm -rf $imagedir/boot
  ln -s ../usb/boot $imagedir/boot
  rm -rf $imagedir/home/osloader
  ln -s ../usb/os-loader $imagedir/home/osloader
  chroot chown osloader:osloader -R /usb/os-loader
fi
prog 2
