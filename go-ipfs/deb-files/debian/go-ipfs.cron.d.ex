#
# Regular cron jobs for the os-loader-gui package
#
0 4	* * *	root	[ -x /usr/bin/ipfs_maintenance ] && /usr/bin/ipfs_maintenance
