build:
	if ! [ -d node_modules ]; then npm i; fi
	if ! [ -d bower_components ]; then bower i; fi
	if ! [ -d bower_components/hackcss/dist ]; then cd bower_components/hackcss;npm i;npm run build; fi
install:
	export DESTDIR=$(DESTDIR)
	npm run build
	cd $(DESTDIR);npm i --production
watch: build
	nodemon index.js -i config.json | bunyan
