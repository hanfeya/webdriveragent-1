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

const utils = require('macaca-utils');
const childProcess = require('child_process');

const _ = utils.merge({}, utils);

_.exec = function(cmd, opts) {
  return new Promise((resolve, reject) => {
    childProcess.exec(cmd, _.merge({
      maxBuffer: 1024 * 512,
      wrapArgs: false
    }, opts || {}), (err, stdout) => {
      if (err) {
        return reject(err);
      }
      resolve(_.trim(stdout));
    });
  });
};

module.exports = _;
