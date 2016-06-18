all:
	@echo "Done..."
deb:
	rm -rf /tmp/os-loader-theme-build
	cp -r -v ./ /tmp/os-loader-theme-build
	make -C /tmp/os-loader-theme-build buildpkg
buildpkg:
	dpkg-buildpackage -us -uc
