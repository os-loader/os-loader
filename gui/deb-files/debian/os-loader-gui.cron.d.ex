#
# Regular cron jobs for the os-loader-gui package
#
0 4	* * *	root	[ -x /usr/bin/os-loader-gui_maintenance ] && /usr/bin/os-loader-gui_maintenance
