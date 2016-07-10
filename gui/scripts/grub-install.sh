. $FNC

progmax 1
state "Install GRUB on $1"
if [ -z $isos ]; then
  rd="--root-directory=$imagedir"
else
  rd=""
fi
grub-install $1 $rd --boot-directory=$usb/boot/grub
finish
