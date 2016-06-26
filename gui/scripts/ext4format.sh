. $FNC
dev=$1
if [ -z "$dev" ]; then
  err "Usage: $0 <sd?>" 2
fi
progmax 3
state "Unmounting $dev..."
umount /dev/$dev*

prog 1
state "Formating $dev with ext4..."
mkfs.ext4 /dev/$dev -F -L "OS-Loader"
finish
