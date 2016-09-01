. $FNC

dev=$1

progmax 3
state "Update GRUB on $dev"
prog 1
state "Generate Config Files..."
#script update-grub -o "$usb/boot/grub/grub.cfg"
chroot grub-mkdevicemap
chroot update-grub #-o "/usb/boot/grub.cfg"
mkdir -p $usb/grub
echo "configfile /boot/grub/grub.cfg
" > $usb/grub.cfg
echo "configfile /boot/grub/grub.cfg
" > $usb/grub/grub.cfg
echo "configfile /boot/grub/grub.cfg
" > $usb/boot/grub.cfg
finish
