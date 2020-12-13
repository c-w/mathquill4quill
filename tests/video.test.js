/* eslint-env node */

module.exports = {
  'Is the video input visible after opening the formula': function (browser) {
    browser
      .useXpath()
      .url('http://localhost:8000')
      .waitForElementVisible('//*[@id="editor"]')
      .click('//button[@class="ql-formula"]')
      .waitForElementVisible('//div[@data-mode="formula"]')
      .click('//button[@class="ql-video"]')
      .waitForElementVisible('//div[@data-mode="video"]')
      .assert.visible('//div[@data-mode="video"]/input')
  },
}
