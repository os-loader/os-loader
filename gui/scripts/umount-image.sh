. $FNC

state "Umount image"
for dir in /dev/pts /proc /sys; do umount $imagedir$dir -f; done
umount $imagedir/usb -f
umount $imagedir.tmp/files/usb -f
umount $imagedir -f
umount $imagedir.overlay -f
umount $imagedir.tmp -f
state "Umount ISO"
umount $imagedir.live -f
state "Clean $imagedir"
rm -rf $imagedir*
