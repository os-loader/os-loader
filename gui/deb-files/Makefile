all:
	@echo "Use deb or deb-signed KEYID=000000"
deb:
	dpkg-buildpackage -us -uc
deb-signed:
	if ! [ -z $(DAILY) ]; then export EDITOR=$(shell pwd)/dch.sh; dch -v 0.0.1-$(shell git rev-list --all --count) -b --force-distribution -D xenial; fi
	dpkg-buildpackage -sa -S -k$(KEYID) -p$(shell pwd)/sign.sh
	if ! [ -z $(DPUT_TARGET) ]; then dput $(DPUT_TARGET) ../*.changes; fi
