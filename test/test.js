module.exports = {
  'Demo test Google' : function (browser) {
    browser
    .url('https://localhost:8080')
    .waitForElementVisible('body')
    .end();
  }
};