for f in $*; do
  sed -i '/^[#;].*$/d;/^$/d' $f
  sed -i 's/[[:space:]]*#.*//;/^[[:space:]]*$/d' $f
  sed -i '1i#!/bin/sh' $f
  chmod +x $f
done
