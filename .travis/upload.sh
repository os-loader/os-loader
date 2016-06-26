if [ -f /tmp/os-loader-builddir/IMAGE/output/image.iso ]; then
  if [ "${TRAVIS_PULL_REQUEST}" = "false" ]; then
    md5=`md5sum /tmp/os-loader-builddir/IMAGE/output/image.iso | fold -w 32 | head -n 1`
    commit=`git rev-parse HEAD`
    ap="md5.$md5.commit.$commit.type.iso"
    curl -X POST -F 'iso=@/tmp/os-loader-builddir/IMAGE/output/image.iso' -F "ap=$ap" https://mkg20001.sytes.net/os-loader/iso.php
    echo "Uploaded as image.iso.$ap"
  else
    echo "Sucess - Skip Pull Upload"
  fi
else
  echo "Build was NOT SUCESSFULL - not uploading!"
fi
