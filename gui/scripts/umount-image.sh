. $FNC

state "Umount image/iso"
for dir in /dev/pts /proc /sys; do
  sysmounts="$sysmounts $imagedir$dir"
  #umount $imagedir$dir -f
done
for f in $sysmounts $imagedir/usb $imagedir.tmp/files/usb $imagedir $imagedir.overlay $imagedir.tmp $imagedir.live; do
  errignore
  mountpoint $f > /dev/null 2> /dev/null
  e=$?
  errcatch
  if [ $e == "0" ]; then
    umount $f -f
  fi
done
state "Clean $imagedir"
rm -rfd $imagedir*
if [ -d $imagedir* ]; then
  err "Panic: some files are still in the directory, missing perm or umount err!" 2
fi
