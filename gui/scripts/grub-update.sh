. $FNC

dev=$1

progmax 3
state "Update GRUB on $dev"
prog 1
state "Generate Config Files..."
#script update-grub -o "$usb/boot/grub/grub.cfg"
chroot update-grub -o "/usb/boot/grub/grub.cfg"
finish
