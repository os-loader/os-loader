BDIR="/tmp/os-loader-builddir"
OUTDIR="os-loader-settings-linux-x64"
build:
	if ! [ -d node_modules ]; then npm i; fi
	if ! [ -d app/bower_components ]; then bower i; fi
	rm -rf os-loader-settings* buildtmp
	cp -r ./ ../gui.cp
	mv ../gui.cp ./buildtmp
	make -C buildtmp distbuild BDIR=$(BDIR)
distbuild: # This is seperate because it deletes/changes some files
	npm run gulp
	rm -rf app deb-files node_modules Makefile test
	cd scripts;find -type f -iname "*.sh" | xargs "bash" "../minify-sh.sh"
	npm i --production
	npm i electron-packager
	sed -i "s/dd='app'/dd='dist'/g" main.js
	npm run build
	mv $(OUTDIR) ../
watch:
	(sleep 10s;sudo chown $(USER):$(USER) -R $(HOME)/.config/configstore/)&
	sudo nodemon /usr/bin/npm run startdev --ext js,html,sh
deb: build
	cp -r deb-files $(BDIR)/gui/
	cp -r $(OUTDIR) $(BDIR)/gui/src
	make -C $(BDIR)/gui deb
