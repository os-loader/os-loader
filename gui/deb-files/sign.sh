#!/bin/bash

###
#1: --utf8-strings
#2: --textmode
#3: --armor
#4: --local-user
#5: DEBFULLNAME
#6: --clearsign
#7: --output
#8: FILE.dsc.asc
#9: FILE.dsc
###

gpg2 $1 $3 $6 $9
