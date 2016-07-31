#!/bin/bash
# Downloads the latest OS-Loader image
# Usage: ./getlatest.sh <OUTPUT>
# Author: Maciej Krüger <mkg20001@gmail.com>

set -e

echo "Check for new ISO..."
list=`curl 'https://os-loader.mkg20001.sytes.net/?C=M;O=D' 2> /dev/null | grep 'href="image.iso.[a-zA-Z0-9.-]*"' -o | grep "image.iso.[a-zA-Z0-9.-]*" -o | xargs`
name=`echo $list | grep "image.iso.[a-zA-Z0-9.-]*" -o | head -n 1`
echo "Latest ISO is: $name"
pt="$HOME/.cache/os-loader/images"
mkdir -p $pt
out=$1
if [ -z $out ]; then
	echo "Usage: ./getlatest.sh <OUTPUT/cleanup/cleanold>"
	exit 2
fi

case "$1" in
	cleanup)
		rm -rfv $pt
		;;
	cleanold)
		for f in `dir -w 0 $pt`; do
			ff="n"
			for i in $list; do
				if [ "$f" == "$i" ]; then
					ff="y"
				fi
			done
			if [ "$ff" == "n" ]; then
				echo "Clean OLD image: $f"
				rm -rf "$pt/$f"
			fi
		done
		;;
	*)
		ipt="$pt/$name"
		if [ -f $ipt ]; then
			wget -qq https://os-loader.mkg20001.sytes.net/$name -O $ipt --continue
		else
			echo "Update... ( ~5min )"
			wget https://os-loader.mkg20001.sytes.net/$name -O $ipt --continue
		fi
		if [ -h $out ]; then
			echo "Clean old link $out..."
			rm $out
		fi
		ln -s $ipt $out
		echo "Successfull link from $ipt to $out"
		;;
esac
