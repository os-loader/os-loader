if [ -f /tmp/os-loader-builddir/IMAGE/output/image.iso ]; then
  if [ "${TRAVIS_PULL_REQUEST}" = "false" ]; then
    md5=`md5sum /tmp/os-loader-builddir/IMAGE/output/image.iso | fold -w 32 | head -n 1`
    commit=`git rev-parse HEAD`
    ap="md5.$md5.commit.$commit.type.iso"
    doupload="curl -X POST -F 'iso=@/tmp/os-loader-builddir/IMAGE/output/image.iso' -F \"ap=$ap\" https://mkg20001.sytes.net/os-loader/iso.php --connect-timeout 60 -m 300"
    $doupload
    if [ $? -ne 0 ]; then
      echo "Upload FAIL! Retry..."
      $doupload
      if [ $? -ne 0 ]; then
        echo "Upload FAIL! Exit with 2"
        exit 2
      fi
    fi
    echo "Uploaded as image.iso.$ap"
  else
    echo "Sucess - Skip Pull Upload"
  fi
else
  echo "Build was NOT SUCESSFULL - not uploading!"
fi
