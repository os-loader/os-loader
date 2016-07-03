. $FNC

dev="$1"
from="$imagedir"
to="$usb"

progmax 4
state "Copy Files to $dev"
cp -r $from/boot $to/boot
mkdir -p $to/boot/grub $to/os-loader/config
prog 1
cp -r $imagepath $to/os-loader/system.img
finish
