/* eslint-env node */

module.exports = {
  'Is the formula editor visible': function (browser) {
    browser
      .useXpath()
      .url('http://localhost:8000')
      .waitForElementVisible('//*[@id="editor"]')
      .click('//button[@class="ql-formula"]')
      .waitForElementVisible('//div[@data-mode="formula"]')
  },
  'Is the formula editor using mathquill': function (browser) {
    browser
      .useXpath()
      .assert.attributeContains(
        '//div[@data-mode="formula"]/span',
        'class',
        'mq-editable-field mq-math-mode',
      )
  },
}
