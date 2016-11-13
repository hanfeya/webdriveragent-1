'use strict';

const fs = require('fs');
const _ = require('xutil');
const path = require('path');
const AdmZip = require('adm-zip');
const childProcess = require('child_process');

const distDirName = path.join(__dirname, '..');
const wdaZipPath = path.join(distDirName, 'WebDriverAgent.zip');
const scriptFile = path.join(distDirName, 'WebDriverAgent', 'Scripts', 'generate_modules.sh');

try {
  const zip = new AdmZip(wdaZipPath);
  zip.extractAllTo(distDirName, true);
} catch (e) {
  console.log(e);
}

if (!_.isExistedFile(scriptFile)) {
  childProcess.exec(`unzip ${wdaZipPath}`, {
    maxBuffer: 1024 * 512 * 10,
    wrapArgs: false,
    cwd: path.join(__dirname, '..')
  }, (err, stdout) => {
    if (err) {
      console.log(err);
    }
    console.log(stdout.trim());
    fs.chmodSync(scriptFile, '755');
  });
} else {
  fs.chmodSync(scriptFile, '755');
}
