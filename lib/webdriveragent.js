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

var path = require('path');

exports.AGENT_URL_REG = /ServerURLHere->(.*)<-ServerURLHere/;
exports.schemeName = 'WebDriverAgentRunner';
exports.projectPath = process.env.WEBDRIVER_AGENT_PATH || path.join(__dirname, '..', 'WebDriverAgent', 'WebDriverAgent.xcodeproj');
exports.version = require('../package').version;
