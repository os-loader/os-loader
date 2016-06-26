#!/bin/sh

sprefix="°"
pprefix="¯"

let pmax=0

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
  let p=($1*100/pmax)
  echo $pprefix$p
}
err() {
  echo $(date +"%H:%M:%S") $1 1>&2
  let e=0$2
  if [ $e -ne 0 ]; then
    exit $e
  fi
}
finish() {
  prog $pmax
  state "Done"
  exit 0
}
