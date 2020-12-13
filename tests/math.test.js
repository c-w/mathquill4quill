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
  'Can an equation be inserted': function (browser) {
    browser
      .useXpath()
      .keys(['x', '^', '2'])
      .click('//a[@class="ql-action"]')
      .waitForElementVisible('//span[@class="ql-formula"]')
      .assert.attributeContains(
        '//span[@class="ql-formula"]',
        'data-value',
        'x^2',
      )
      .end()
  },
}
