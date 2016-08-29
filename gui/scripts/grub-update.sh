. $FNC

dev=$1

progmax 3
state "Update GRUB on $dev"
prog 1
state "Generate Config Files..."
#script update-grub -o "$usb/boot/grub/grub.cfg"
chroot grub-mkdevicemap
chroot update-grub #-o "/usb/boot/grub.cfg"
echo "configfile /boot/grub.cfg
" > $usb/grub.cfg
finish
