(function () {
  const HASH_PREFIX = "#prompt=";
  const MAX_ATTEMPTS = 40;
  const RETRY_MS = 400;

  function readPromptFromHash() {
    if (!window.location.hash.startsWith(HASH_PREFIX)) {
      return "";
    }

    const raw = window.location.hash.slice(HASH_PREFIX.length);
    try {
      return decodeURIComponent(raw);
    } catch {
      return raw;
    }
  }

  function clearPromptHash() {
    const url = new URL(window.location.href);
    url.hash = "";
    window.history.replaceState({}, document.title, url.toString());
  }

  function dispatchInput(element, text) {
    if (element.tagName === "TEXTAREA") {
      element.value = text;
      element.dispatchEvent(new Event("input", { bubbles: true }));
      element.dispatchEvent(new Event("change", { bubbles: true }));
      return true;
    }

    if (element.isContentEditable) {
      element.focus();

      const selection = window.getSelection();
      const range = document.createRange();
      range.selectNodeContents(element);
      selection.removeAllRanges();
      selection.addRange(range);

      document.execCommand("selectAll", false, null);
      document.execCommand("insertText", false, text);

      element.dispatchEvent(
        new InputEvent("input", {
          bubbles: true,
          inputType: "insertText",
          data: text,
        })
      );
      return true;
    }

    return false;
  }

  function findPromptField() {
    const selectors = [
      'div[contenteditable="true"][role="textbox"]',
      'div[contenteditable="true"]',
      'textarea',
    ];

    for (const selector of selectors) {
      const element = document.querySelector(selector);
      if (element) {
        return element;
      }
    }

    return null;
  }

  function tryAutofill(text) {
    const field = findPromptField();
    if (!field) {
      return false;
    }

    const success = dispatchInput(field, text);
    if (success) {
      field.focus();
    }
    return success;
  }

  function startAutofill() {
    const prompt = readPromptFromHash();
    if (!prompt) {
      return;
    }

    let attempts = 0;
    const timer = window.setInterval(() => {
      attempts += 1;
      if (tryAutofill(prompt) || attempts >= MAX_ATTEMPTS) {
        window.clearInterval(timer);
        clearPromptHash();
      }
    }, RETRY_MS);
  }

  startAutofill();
})();
