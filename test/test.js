module.exports = {
  'Demo test Google' : function (browser) {
    browser
    .useXpath()
    .url('http://localhost:8080')
    .waitForElementVisible('//*[@id="editor"]')
    .click('//button[@class="ql-formula"]')
    .waitForElementVisible('//div[@data-mode="formula"]')
    .end();
  }
};