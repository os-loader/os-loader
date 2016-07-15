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
mount -t tmpfs -o size=1G tmpfs $imagedir.tmp
if [ -z $devmount ]; then
  mount -o loop -t squashfs $imagedir.live/live/filesystem.squashfs $imagedir.overlay
else
  mkdir -p $imagedir.overlay.real $devmountpoint.dev
  mount -o loop -t squashfs $imagedir.live/live/filesystem.squashfs $imagedir.overlay.real
  mount -t overlay -o lowerdir=$imagedir.overlay.real,upperdir=$devmountpoint,workdir=$devmountpoint.dev overlay $imagedir.overlay
fi
mkdir -p $imagedir.tmp/{work,files}
mount -t overlay -o lowerdir=$imagedir.overlay,upperdir=$imagedir.tmp/files,workdir=$imagedir.tmp/work overlay $imagedir
prog 4

state "Prepare chroot"
#for dir in /dev/pts /proc /sys; do mount --bind $dir $imagedir$dir; done
mount -t proc -o rw,nosuid,noexec null $imagedir/proc
mount -t sysfs -o rw,nosuid null $imagedir/sys
mount -t devpts -o rw,nosuid,noexec null $imagedir/dev/pts
finish
