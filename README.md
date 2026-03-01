# YouTube Tab Fullscreen

Chrome extension that makes YouTube videos fullscreen within the browser tab, without triggering the OS-level fullscreen that takes over your entire screen.

Useful if you want the video to fill the tab but still see your tabs, bookmarks bar, and switch between windows normally.

## Install

1. Go to `chrome://extensions/`
2. Enable **Developer mode**
3. Click **Load unpacked** and select this folder

## Usage

- **Double-click** the video to toggle tab fullscreen (instead of native fullscreen)
- Press `` ` `` (backtick) to toggle tab fullscreen
- Press `Esc` to exit
- Or click the tab fullscreen icon next to YouTube's native fullscreen button

The shortcut won't fire when you're typing in a comment box or search field.

## Settings

Click the extension icon in the toolbar to open the settings popup.

- **Intercept double-click on video** (enabled by default): When enabled, double-clicking the video triggers tab fullscreen instead of YouTube's native OS-level fullscreen. Disable this to restore the default YouTube double-click behavior.

## How it works

The extension injects a content script on YouTube pages that:

- Adds a button to the player controls (right side, next to the fullscreen button)
- Intercepts double-click on the video to trigger tab fullscreen instead of native fullscreen
- When activated, uses CSS to expand `#movie_player` to fill the viewport (`position: fixed`, `100vw` x `100vh`) and hides the rest of the page
- No `requestFullscreen()` API is called, so the browser stays in its normal windowed state

## License

MIT
