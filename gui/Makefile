BDIR="/tmp/os-loader-builddir"
OUTDIR="os-loader-gui-linux-x64"
build:
	npm i
	rm -rf os-loader-gui*
	npm run build
deb: build
	cp -r deb-files $(BDIR)/gui/
	cp -r $(OUTDIR) $(BDIR)/gui/src
	make -C $(BDIR)/gui deb
