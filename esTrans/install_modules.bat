set NODE_PATH=.\node;
set path=.\node;.\node_modules;
node install_modules.js

cd ..
copy .\esTrans\package.json .\package.json
set NODE_PATH=.\esTrans\node;
set path=.\esTrans\node;.\esTrans\node_modules;
node .\esTrans\install_modules.js
pause