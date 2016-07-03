. $FNC

from="$imagedir/boot"

progmax 4
prog 2
state "Copy Files to $dev"
cp -r -v $from $usb/boot
mkdir -p $usb/boot/grub
finish
