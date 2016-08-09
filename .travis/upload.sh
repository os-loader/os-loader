#!/bin/bash

isalive() {
  sleep 300s
  echo "Uploading..."
  isalive
}

isalive &

main=$PWD

cd $main

if [ -f /tmp/os-loader-builddir/IMAGE/output/image.iso ]; then
  if [ "${TRAVIS_PULL_REQUEST}" = "false" ]; then
    md5=`md5sum /tmp/os-loader-builddir/IMAGE/output/image.iso | fold -w 32 | head -n 1`
    commit=`git rev-parse HEAD`
    ap="md5.$md5.commit.$commit.type.iso"
    doupload="curl -X POST -F iso=@/tmp/os-loader-builddir/IMAGE/output/image.iso -F key=$UPLOADKEY -F ap=$ap https://mkg20001.sytes.net/os-loader/iso.php --connect-timeout 10 -m 300"
    i=0;
    doupload_exec() {
      $doupload
      if [ $? -ne 0 ]; then
        let i=$i+1;
        echo "Upload FAIL! Retry $i..."
        doupload_exec
      fi
    }
    doupload_exec
    echo "Uploaded as image.iso.$ap"
  else
    echo "Sucess - Skip Pull Upload"
  fi
else
  echo "Build was NOT SUCESSFULL - not uploading!"
fi
