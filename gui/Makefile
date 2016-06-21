BDIR="/tmp/os-loader-builddir"
OUTDIR="os-loader-gui-linux-x64"
build:
	npm i
	rm -rf os-loader-gui* buildtmp
	cp -r ./ ./buildtmp
	make -C buildtmp distbuild BDIR=$(BDIR)
distbuild: # This is seperate because it deletes/changes some files
	npm run gulp
	rm -rf app
	sed -i "s/dd='app'/dd='dist'/g" main.js
	npm run build
	mv $(OUTDIR) ../
deb: build
	cp -r deb-files $(BDIR)/gui/
	cp -r $(OUTDIR) $(BDIR)/gui/src
	make -C $(BDIR)/gui deb
