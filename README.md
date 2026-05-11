# Chrome Tab Saver Pro

A sleek, lightweight Chrome extension designed to help you declutter your browser and save your computer's memory by saving entire window sessions to be restored whenever you need them.

## 🚀 Features

- **Save Full Windows:** Captures all tabs in your current window with a single click.
- **Custom Naming:** Name your sessions (e.g., "Research Project", "Taxes", "Weekend Planning") so you know exactly what they contain.
- **Visual Glances:** See a row of favicons for the tabs inside each saved session to quickly identify its contents.
- **Pinned Tab Support:** Remembers which tabs were pinned and restores them accurately.
- **Restore Instantly:** Reopens all your saved tabs in a brand new, organized window.
- **Premium Design:** Features a modern, dark-mode popup built with highly optimized vanilla CSS.
- **Privacy First:** All data is saved strictly to your local machine using Chrome's `storage.local` API. No data is sent to external servers.

## 🛠️ How to Install

Since this extension is in development, you can load it as an "unpacked" extension in Chrome:

1. Download or clone this repository to your local machine.
2. Open Chrome and navigate to `chrome://extensions/`.
3. Toggle **Developer mode** to ON in the top right corner.
4. Click **Load unpacked** in the top left.
5. Select the `chrome-tabs-saver` folder.
6. The extension is now installed! Don't forget to **pin** it to your toolbar for easy access.

## 💻 Tech Stack

- **HTML5 & Vanilla CSS3:** For a lightweight, fast, and modern interface without any heavy frameworks.
- **Vanilla JavaScript:** For logic and interaction with the Chrome Extensions API.
- **Chrome Manifest V3:** Compliant with the latest Chrome extension standards.

## 📝 Usage Note on "Memory Saver"

Chrome Extensions cannot save the live "RAM state" (like unsaved form data or execution variables) of a tab to disk after the tab is fully closed. 
When you restore a session with this extension, Chrome will reopen the URLs, leveraging its built-in HTTP disk cache to load them extremely fast, effectively acting as a fresh reload of the pages.

## 📄 License

MIT License