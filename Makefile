#The final Makefile
BDIR="/tmp/os-loader-builddir"
image: builddir os-gui
	@echo "Soon..."
builddir:
	rm -rf $(BDIR)
	mkdir -p $(BDIR)
theme:
	make -C plymouth-theme BDIR=$(BDIR) cp
os-gui:
	make -C gui BDIR=$(BDIR) deb
