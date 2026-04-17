# Prompt Library

Prompt Library is a Vite + React app for browsing curated prompts and copying them into AI tools quickly.

## Run locally

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Gemini Autofill Extension

The web app can open Gemini directly, but Gemini does not reliably support prompt prefills from normal website URLs on its own.

To make the `Gemini` button open Gemini and fill the prompt box automatically:

1. Open `chrome://extensions`
2. Turn on `Developer mode`
3. Click `Load unpacked`
4. Select:

```text
extensions/gemini-autofill
```

After that, clicking `Gemini` in the app opens `gemini.google.com` and the extension injects the selected prompt into Gemini's input field.
