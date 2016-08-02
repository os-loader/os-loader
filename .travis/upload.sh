#!/bin/bash

isalive() {
  sleep 300s
  echo "Uploading..."
  isalive
}

isalive &

main=$PWD

mv $main/.travis/dput $HOME/.dput.cf

ver=0.0.1-$(git rev-list --all --count)

gpg2 --keyserver keyserver.ubuntu.com --recv-keys 4DE177C6
gpg2 --allow-secret-key-import --import $main/.travis/upload.key
cd /tmp/os-loader-builddir/gui
export EDITOR=$main/.travis/dch.sh
chmod +x $EDITOR
dch -v $ver -b --force-distribution -D xenial
dpkg-buildpackage -sa -S -k4DE177C6
dput daily *.changes

cd $main

if [ -f /tmp/os-loader-builddir/IMAGE/output/image.iso ]; then
  if [ "${TRAVIS_PULL_REQUEST}" = "false" ]; then
    md5=`md5sum /tmp/os-loader-builddir/IMAGE/output/image.iso | fold -w 32 | head -n 1`
    commit=`git rev-parse HEAD`
    ap="md5.$md5.commit.$commit.type.iso"
    doupload="curl -X POST -F iso=@/tmp/os-loader-builddir/IMAGE/output/image.iso -F key=$UPLOADKEY -F ap=$ap https://mkg20001.sytes.net/os-loader/iso.php --connect-timeout 60 -m 1200"
    $doupload
    if [ $? -ne 0 ]; then
      echo "Upload FAIL! Retry (1 of 3)..."
      $doupload
      if [ $? -ne 0 ]; then
        echo "Upload FAIL! Retry (2 of 3)..."
        $doupload
        if [ $? -ne 0 ]; then
          echo "Upload FAIL! Retry (3 of 3)..."
          $doupload
          if [ $? -ne 0 ]; then
            echo "Upload FAIL! Exit with 2"
            exit 2
          fi
        fi
      fi
    fi
    echo "Uploaded as image.iso.$ap"
  else
    echo "Sucess - Skip Pull Upload"
  fi
else
  echo "Build was NOT SUCESSFULL - not uploading!"
fi
