. $FNC

progmax 5
state "Umount - to get sure"
script umount-image

state "Download Boot-Image..."
script download-image $imagedir.iso
prog 2

state "Mount ISO-Image"
mkdir -p $imagedir.live
mount -o loop -t iso9660 $imagedir.iso $imagedir.live
prog 3

state "Mount Boot-Image"
mkdir -p $imagedir $imagedir.overlay $imagedir.tmp
mount -o loop -t squashfs $imagedir.live/live/filesystem.squashfs $imagedir.overlay
fs="overlay";
mount -t tmpfs -o size=1G tmpfs $imagedir.tmp
mkdir -p $imagedir.tmp/work
mkdir -p $imagedir.tmp/files
mount -t $fs -o lowerdir=$imagedir.overlay,upperdir=$imagedir.tmp/files,workdir=$imagedir.tmp/work $fs $imagedir
prog 4

state "Prepare chroot"
for dir in /dev/pts /proc /sys; do mount --bind $dir $imagedir$dir; done
finish
