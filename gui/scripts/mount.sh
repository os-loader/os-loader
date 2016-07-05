. $FNC

dev=$1
fs=$2

progmax 2
state "Dismount $dev"
umount $dev -f
prog 1

state "Mount $dev"
mount -t $fs $dev $usb
prog 2
