#!/bin/bash

. $FNC

progmax 5
if [ -z $image ]; then
	state "Check for new ISO..."
	con=`curl 'https://os-loader.mkg20001.sytes.net/daily/?C=M;O=D' 2> /dev/null  | grep 'href="image.iso.[a-zA-Z0-9.-]*"' -o | head -n 1 | grep "image.iso.[a-zA-Z0-9.-]*" -o`
	name="$con"
else
	con="$image";
fi
prog 1

pt="/.cache/os-loader/images"
mkdir -p $pt
out=$1
if [ -z $out ]; then
	err "Usage: ./getlatest.sh <OUTPUT>" 2
fi

c=0

for f in `dir -w 1 $pt`; do
	if [ "$f" != "$name" ]; then
		let c=$c+1
		rm "$pt/$f"
	fi
done

if [ $c == "0" ]; then
	:
elif [ $c == "1" ]; then
	echo "Cleaned 1 old ISO"
else
	echo "Cleaned $c old ISOs"
fi

ipt="$pt/$name"

ifmd5() {
	prog +
	state "Verify ISO..."
	md5=$(md5sum $ipt | fold -w 32 | head -n 1)
	md5orig=$(echo $ipt | grep "md5.[a-zA-Z0-9]*" -o | grep "[a-zA-Z0-9]*" -o | tail -n 1)
	if [ $md5 == $md5orig ]; then
		$1 $3
	else
		err "ISO checksum is invalid - has the download finished?"
		$2 $3
	fi
}

download() {
	prog +
	state "Update ISO... (~5min)"
	wget https://os-loader.mkg20001.sytes.net/daily/$name -O $ipt --continue
	$1
}

link() {
	prog 4

	if [ -h $out ]; then
		rm $out
	fi
	ln -s $ipt $out

	finish
}

check() {
	if [ -f $ipt ]; then
		ifmd5 "link" "download" "check2"
	else
		download check
	fi
}

check2() {
	ifmd5 "link" "rm $ipt"
	#if we are still here it´s broken
	err 'ISO is broken - redownload'
	check
}

check
