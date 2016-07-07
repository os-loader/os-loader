. $FNC

dev=$1
fs=$2

if [ -z $isos ]; then
  script mount-image
fi

progmax 2
state "Dismount $dev"
errignore
umount $dev -f
errcatch
prog 1

state "Mount $dev"
mount -t $fs $dev $usb
prog 2
