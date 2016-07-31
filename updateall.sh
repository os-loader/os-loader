cd gui
  ncu -u -a
  npm update
  ncu --packageManager bower -u -a
  bower update
cd ..
cd server
  ncu -u -a
  npm update
  ncu --packageManager bower -u -a
  bower update
cd ..
