'use strict';

const fs = require('fs');
const _ = require('xutil');
const path = require('path');
const xcode = require('xcode');
const AdmZip = require('adm-zip');
const hostname = require('os').hostname();
const childProcess = require('child_process');

const distDirName = path.join(__dirname, '..');
const wdaZipPath = path.join(distDirName, 'WebDriverAgent.zip');
const scriptFile = path.join(distDirName, 'WebDriverAgent', 'Scripts', 'generate_modules.sh');
const DEVELOPMENT_TEAM = process.env.DEVELOPMENT_TEAM_ID || '';

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
    cwd: distDirName
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

try {
  const schemeName = 'WebDriverAgentRunner';
  const libName = 'WebDriverAgentLib';
  const projectPath = path.join(__dirname, '..', 'WebDriverAgent', 'WebDriverAgent.xcodeproj/project.pbxproj');
  const myProj = xcode.project(projectPath);
  myProj.parseSync();

  const update = function(schemeName, callback) {
    const myConfigKey = myProj.pbxTargetByName(schemeName).buildConfigurationList;
    const buildConfig = myProj.pbxXCConfigurationList()[myConfigKey];
    const configArray = buildConfig.buildConfigurations;
    const keys = configArray.map(item => item.value);
    const pbxXCBuildConfigurationSection = myProj.pbxXCBuildConfigurationSection();
    keys.forEach(key => {
      callback(pbxXCBuildConfigurationSection[key].buildSettings);
    });
  };

  update(schemeName, function(buildSettings) {
    const newBundleId = process.env.BUNDLE_ID || `com.facebook.WebDriverAgentRunner.${hostname}`;
    buildSettings.PRODUCT_BUNDLE_IDENTIFIER = newBundleId;
    if (DEVELOPMENT_TEAM) {
      buildSettings.DEVELOPMENT_TEAM = DEVELOPMENT_TEAM;
    }
  });

  update(libName, function(buildSettings) {
    if (DEVELOPMENT_TEAM) {
      buildSettings.DEVELOPMENT_TEAM = DEVELOPMENT_TEAM;
    }
  });

  const projSect = myProj.getFirstProject();
  const myRunnerTargetKey = myProj.findTargetKey(schemeName);
  const myLibTargetKey = myProj.findTargetKey(libName);
  const targetAttributes = projSect.firstProject.attributes.TargetAttributes;
  const runnerObj = targetAttributes[myRunnerTargetKey];
  const libObj = targetAttributes[myLibTargetKey];
  if (DEVELOPMENT_TEAM) {
    runnerObj.DevelopmentTeam = libObj.DevelopmentTeam = DEVELOPMENT_TEAM;
  }

  fs.writeFileSync(projectPath, myProj.writeSync());

  if (DEVELOPMENT_TEAM) {
    console.log('Successfully updated Bundle Id and Team Id.');
  } else {
    console.log(`Successfully updated Bundle Id, but no Team Id was provided. Please update your team id manually in ${projectPath}, or reinstall the module with DEVELOPMENT_TEAM_ID in environment variable.`);
  }
  process.exit(0);
} catch (e) {
  console.log('Failed to update Bundle Id and Team Id: ', e);
}
