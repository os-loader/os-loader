. $FNC

progmax 1
state "Install GRUB on $1"
grub-install $1 --root-directory=$imagedir
finish
