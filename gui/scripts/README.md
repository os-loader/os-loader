# Script Format

There is a ```fnc.sh```, it contains all functions required

```log S       ``` - Logging with time prefix

```state S     ``` - Set the state

```progmax N   ``` - Set the max. progress

```prog N     ```  - Set the progress in percent

```err S       ``` - Print an error - with time prefix

```err S N     ``` - Print an error and exit with N

```finish      ``` - Set progress to max,set state to "Done", exit with 0

```script S    ``` - Execute a script inside the scripts directory

```chroot      ``` - Execute a command in the os-loader chroot (or if on live-iso without chroot)

```S=String``` ```N=Integer```
