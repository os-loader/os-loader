#!/bin/sh
if ! [ -z $isdev ]; then
  set -o xtrace
fi

sprefix="°"
pprefix="¯"

let pmax=0

set -e

log() {
  echo $(date +"%H:%M:%S") $*
}
state() {
  echo $sprefix$*
}
progmax() {
  let pmax=$1;
  prog 0
}
prog() {
  if [ "x$1" == "x0" ]; then
    p=0
  elif [ "x$1" == "x+" ]; then
    let p=($p+1)*100/$pmax
  else
    let p=($1*100/$pmax)
  fi
  echo $pprefix$p
}
err() {
  echo $(date +"%H:%M:%S") $1 1>&2
  if [ -z $2 ]; then
    e=0
  else
    e=$2
  fi
  if [ $e -ne 0 ]; then
    exit $e
  fi
}
finish() {
  prog $pmax
  state "Done"
  exit 0
}
script() {
  bash $(dirname $FNC)/$1.sh "$2" "$3" "$4" "$5"
}
errignore() {
  set +e
}
errcatch() {
  set -e
}
chroot() {
  if [ -z $isos ]; then
    /usr/sbin/chroot $imagedir /bin/bash -x <<ffff
export imagedir=""
export usb="/usb"
$*
ffff
    return $?
  else
    $*
  fi
}
