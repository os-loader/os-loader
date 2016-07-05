. $FNC

progmax 3
state "Umount USB"
umount $usb -f
prog 1

if [ -z $isos ]; then
  script umount-image
  prog 2
else
  prog 2
fi

state "Stop internal services"
#currently nothing

sleep .5s
finish
