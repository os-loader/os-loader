ipfs_ver=0.4.2
deb: dl cp
	make -C ./buildtmp/ipfs deb
cp:
	rm -rf buildtmp
	mkdir -p buildtmp
	cp -r deb-files ./buildtmp/ipfs
	mv ipfs buildtmp/ipfs
	chmod +x buildtmp/ipfs/*.sh
sign-deb: dl cp
	make -C ./buildtmp/ipfs deb-signed KEYID=$(KEY) DPUT_TARGET=$(PPA)
distbuild: deb
	mv buildtmp/* $(BDIR)
dl:
	rm -rf ./go-ipfs* ./ipfs
	wget https://dist.ipfs.io/go-ipfs/v$(ipfs_ver)/go-ipfs_v$(ipfs_ver)_linux-amd64.tar.gz -O './go-ipfs.tar.gz'
	tar xvfz ./go-ipfs.tar.gz
	mv ./go-ipfs/ipfs ./
	rm -rf ./go-ipfs*
