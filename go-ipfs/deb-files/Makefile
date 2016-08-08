ipfs_ver=0.4.2
all:
	@echo "Use deb or deb-signed KEYID=000000"
ver:
	export EDITOR=$(shell pwd)/dch.sh; dch -v $(ipfs_ver)-osl-$(shell git rev-list --all --count) -b --force-distribution -D xenial
deb: ver
	dpkg-buildpackage -us -uc
deb-signed: ver
	dpkg-buildpackage -sa -S -k$(KEYID) -p$(shell pwd)/sign.sh
	if ! [ -z $(DPUT_TARGET) ]; then dput $(DPUT_TARGET) ../*.changes; fi
