/* eslint-env node */

const chromedriver = require('chromedriver')

module.exports = {
  test_settings: {
    chrome: {
      webdriver: {
        start_process: true,
        server_path: chromedriver.path,
        port: 9515,
      },
      desiredCapabilities: {
        browserName: 'chrome',
        chromeOptions: {
          args: ['headless', 'acceptInsecureCerts'],
        },
      },
    },
  },
}
