#!/bin/bash
sed -i "${1//"+"/""}s/.*/  * IPFS Release/" -i $2
