/* eslint-disable no-undef */
/* eslint-env node */

module.exports = {
  "Is the formula editor visible": function(browser) {
    browser
      .useXpath()
      .url("http://localhost:8000/?&operators=true&displayHistory=true&displayDeleteButtonOnHistory=true")
      .waitForElementVisible('//*[@id="editor"]')
      .click('//button[@class="ql-formula"]')
      .waitForElementVisible('//div[@data-mode="formula"]');
  },
  "Is delete button working": function(browser) {
    browser
      .useXpath()
      .click('//button[@data-value="\\sqrt"]')
      .waitForElementVisible('//span[@class="mq-scaled mq-sqrt-prefix"]')
      .click('//a[@class="ql-action"]')
      .waitForElementVisible('//span[@class="ql-formula"]')
      .click('//button[@class="ql-formula"]')
      .useCss()
      .waitForElementVisible(".mathquill4quill-history-container")
      .execute(
        function() {
          document
            .querySelector(".mathquill4quill-history-delete-button")
            .click();
          return document.querySelector(".mathquill4quill-history-button");
        },
        [],
        function(result) {
          this.assert.equal(result.value, null);
        }
      )
      .end();
  }
};
