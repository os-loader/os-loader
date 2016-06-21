if [ -f /tmp/os-loader-builddir/IMAGE/output/image.iso ]; then
  md5=`md5sum /tmp/os-loader-builddir/IMAGE/output/image.iso | fold -w 32 | head -n 1`
  curl -X POST -F 'iso=@/tmp/os-loader-builddir/IMAGE/output/image.iso' -F "ap=$md5" https://mkg20001.sytes.net/os-loader/iso.php
  echo "Uploaded as image.iso.$md5"
else
  echo "Build was NOT SUCESSFULL - not uploading!"
fi
