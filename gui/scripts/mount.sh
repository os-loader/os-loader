. $FNC

dev=$1
fs=$2

progmax 2
state "Dismount $dev"
umount $dev
prog 1

state "Mount $dev"
mkdir -p $usb
mount -t $fs $dev $usb
prog 2