. $FNC

log "Testing..."
progmax 10
state "Doing state tests"
prog 2
echo -n "test"
sleep .5s
prog 5
if [ -z "$1" ]; then
  err "Arg1 is empty"
  err "Usage: $0 <random>" 2
else
  finish
fi
