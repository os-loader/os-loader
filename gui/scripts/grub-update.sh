. $FNC

dev=$1

progmax 3
state "Update GRUB on $dev"
prog
state "Generate Config Files..."
script update-grub -o "$usb/boot/grub/grub.cfg"
