. $FNC

progmax 3
state "Umount USB"
umount $usb -f
prog 1

if [ -z $isos ]; then
  state "Umount image"
  umount $imagedir -f
  state "Umount ISO"
  umount /tmp/liveimage -f
  prog 2
else
  prog 2
fi

state "Stop internal services"
#currently nothing

sleep .5s
finish
