BDIR="/tmp/os-loader-builddir"
OUTDIR="os-loader-settings-linux-x64"
build:
	if ! [ -d node_modules ]; then npm i; fi
	if ! [ -d app/bower_components ]; then bower i; fi
	rm -rf os-loader-settings* buildtmp deb
	
	mkdir -p ./buildtmp
	#cp -r ./{core,dist,scripts,package.json,w.js,Makefile,minify-sh.sh,main.js} ./buildtmp/
	cp -r ./core ./buildtmp/
	cp -r ./dist ./buildtmp/
	cp -r ./scripts ./buildtmp/
	cp ./package.json ./buildtmp/
	cp ./w.js ./buildtmp/
	cp ./Makefile ./buildtmp/
	cp ./minify-sh.sh ./buildtmp/
	cp ./main.js ./buildtmp/

	rm ./buildtmp/core/repo
	cp -r ../server/core/repo ./buildtmp/core/repo
	make -C buildtmp distbuild BDIR=$(BDIR)
distbuild: # This is seperate because it deletes/changes some files
	npm run gulp
	rm -rf app deb-files node_modules Makefile test
	cd scripts;find -type f -iname "*.sh" | xargs "bash" "../minify-sh.sh"
	npm i --production
	npm i mkg20001/electron-packager#patch-1
	sed -i "s/dd='app'/dd='dist'/g" main.js
	npm run build
	mv $(OUTDIR) ../
watch:
	(sleep 10s;sudo chown $(USER):$(USER) -R $(HOME)/.config/configstore/)&
	sudo nodemon /usr/bin/npm run startdev --ext js,html,sh
deb: build
	cp -r deb-files $(BDIR)/gui/
	mv $(OUTDIR) $(BDIR)/gui/src
	make -C $(BDIR)/gui deb
sign-deb: build
	rm -rf ./deb
	mkdir -p ./deb/
	cp -r deb-files ./deb/gui/
	mv $(OUTDIR) ./deb/gui/src
	make -C ./deb/gui deb-signed KEYID=$(KEY) DPUT_TARGET=$(PPA) DAILY=$(DAILY)
