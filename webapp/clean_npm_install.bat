rd /s /q "node_modules"
del package-lock.json
del -f yarn.lock

npm cache clean --force

nvm install latest

nvm use latest

npm install

pause
