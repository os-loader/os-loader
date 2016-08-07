all:
	@echo "Use deb or deb-signed KEYID=000000"
deb:
	dpkg-buildpackage -us -uc
deb-signed:
	dpkg-buildpackage -sa -S -k$(KEYID) -pgpg2
