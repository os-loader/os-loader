build:
	if ! [ -d node_modules ]; then npm i; fi
	if ! [ -d bower_components ]; then bower i; fi
	if ! [ -d bower_components/hackcss/dist ]; then cd bower_components/hackcss;npm i;npm run build; fi
install:
	dir
	export DESTDIR=$(DESTDIR)
	npm run build
	cd $(DESTDIR);npm i --production
	dir $(DESTDIR)
watch: build
	nodemon index.js -i config.json -i repo.json -i state.json | bunyan -l 0
snap:
	snapcraft clean
	snapcraft
	sudo snap install os-loader-server*.snap --devmode
reset:
	rm -f repo.json config.json state.json
	rm -rf data
	mongo osl-image-server --eval "db.dropDatabase()"
	@echo ""
	@echo "Reset Complete"
	@echo ""
