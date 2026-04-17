# Gemini Autofill Extension

This Chrome extension reads the `#prompt=` hash from a Gemini URL and inserts that text into Gemini's input box.

## Load it in Chrome

1. Open `chrome://extensions`
2. Turn on `Developer mode`
3. Click `Load unpacked`
4. Select this folder:

```text
extensions/gemini-autofill
```

## How it works

1. In the Prompt Library app, click the `Gemini` button on any card.
2. The app opens a URL like `https://gemini.google.com/app#prompt=...`
3. This extension detects the hash and fills Gemini's input box automatically.

## Notes

- Gemini's DOM can change, so the selector may need updates later.
- The extension fills the prompt, but it does not auto-submit.
