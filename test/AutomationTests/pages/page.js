class Page {
  constructor() {}

  open(path) {
    browser.url(`/${path}`)
  }

  static getTitle() {
    return browser.getTitle();
  }

  static hitEnter() {
    return browser.keys('\uE007');
  }

  static expectH3(header) {
    $(`h3*=${header}`).waitForVisible();
  }

  static elementByDataTestId(testId) {
    return $(`[data-test-id="${testId}"]`);
  }

  static elementByInputType(inputType) {
    return $(`input[type="${inputType}"]`);
  }

  static elementByLinkText(linkText) {
    return $(`a=${linkText}`);
  }

  static elementByButtonText(buttonText) {
    return $(`button=${buttonText}`);
  }
}
module.exports = Page;
