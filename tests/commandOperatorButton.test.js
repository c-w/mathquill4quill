/* eslint-env node */

module.exports = {
  "Is the formula editor visible": function(browser) {
    browser
      .useXpath()
      .url("http://localhost:8000/?&operators=true")
      .waitForElementVisible('//*[@id="editor"]')
      .click('//button[@class="ql-formula"]')
      .waitForElementVisible('//div[@data-mode="formula"]');
  },
  "Is command operator button working": function(browser) {
    browser
      .useXpath()
      .click('//button[@data-value="\\sqrt"]')
      .waitForElementVisible('//span[@class="mq-scaled mq-sqrt-prefix"]')
      .click('//a[@class="ql-action"]')
      .waitForElementVisible('//span[@class="ql-formula"]')
      .assert.attributeContains(
        '//span[@class="ql-formula"]',
        "data-value",
        "\\sqrt"
      )
      .end();
  }
};
