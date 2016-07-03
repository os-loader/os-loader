. $FNC

progmax 4
state "Download Boot-Image..."
script download-image /tmp/bootimage.iso
prog 2

state "Mount ISO-Image"
mkdir -p /tmp/liveimage
mount -o loop -t iso9660 /tmp/bootimage.iso /tmp/liveimage
prog 3

state "Mount Boot-Image"
mkdir -p $imagedir
mount -o loop -t squashfs /tmp/liveimage/live/filesystem.squashfs $imagedir
finish
