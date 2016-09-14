/* ================================================================
 * webdriveragent by xdf(xudafeng[at]126.com)
 *
 * first created at : Tue Mar 01 2016 15:59:46 GMT+0800 (CST)
 *
 * ================================================================
 * Copyright  xdf
 *
 * Licensed under the MIT License
 * You may not use this file except in compliance with the License.
 *
 * ================================================================ */

'use strict';

const WebDriverAgent = require('..');
const Simulator = require('ios-simulator');

const _ = require('./common/utils');

describe('test', function() {
  it('should be ok', function() {
    WebDriverAgent.should.be.ok;
  });

  it('should build success', function *(done) {
    var deviceId;

    const devices = yield Simulator.getDevices();
    const availableDevices = devices.filter(device => device.available);
    const deviceString = 'iPhone 5s';

    _.each(availableDevices, device => {
      if (device.name === deviceString) {
        deviceId = device.udid;
      }
    });

    const cmd = `xcodebuild build -project ${WebDriverAgent.projectPath} -scheme ${WebDriverAgent.schemeName} -destination id=${deviceId}`;

    console.log(cmd);
    _.exec(cmd, {
      maxBuffer: 1024 * 10 * 512
    }).then(stdout => {
      console.log(stdout);
      done();
    });
  });
});
