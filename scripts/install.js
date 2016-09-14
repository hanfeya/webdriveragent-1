'use strict';

const fs = require('fs');
const path = require('path');
const AdmZip = require('adm-zip');

const distDirName = path.join(__dirname, '..');
const wdaZipPath = path.join(distDirName, 'WebDriverAgent.zip');
const zip = new AdmZip(wdaZipPath);
zip.extractAllTo(distDirName, true);

const scriptFile = path.join(distDirName, 'WebDriverAgent', 'Scripts', 'generate_modules.sh');
fs.chmodSync(scriptFile, '755');
