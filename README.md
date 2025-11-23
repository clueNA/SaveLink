# Tab Link Saver Browser Extension

A simple browser extension that saves all your currently open tab URLs to a downloadable text file.

## Features
- Click the extension icon to instantly collect all open tab URLs
- Neatly formatted with tab titles and URLs
- Downloads as a `.txt` file with timestamp
- Works on Chrome, Edge, and other Chromium-based browsers

## Installation

### Chrome/Edge/Brave

1. Download or clone this repository
2. Open your browser and navigate to:
   - Chrome: `chrome://extensions/`
   - Edge: `edge://extensions/`
   - Brave: `brave://extensions/`
3. Enable "Developer mode" (toggle in top-right corner)
4. Click "Load unpacked"
5. Select the folder containing these extension files
6. The extension icon should now appear in your toolbar!

## Usage

1. Click the extension icon in your browser toolbar
2. Click the "Save All Tab Links" button
3. A `.txt` file will automatically download with all your open tabs

## File Format

The downloaded file will be named: `tab-links-YYYY-MM-DD-HHMMSS.txt`

Format:
```
Browser Tabs - Saved on [Date and Time]
==========================================

[1] Tab Title
https://example.com/page1

[2] Another Tab Title
https://example.com/page2
```

## Files Included
- `manifest.json` - Extension configuration
- `popup.html` - Extension popup interface
- `popup.js` - Logic for collecting and downloading tabs
- `styles.css` - Styling for the popup
- `icon.png` - Extension icon (you can replace with your own 128x128 PNG)

## Permissions

This extension requires:
- **tabs**: To read URLs and titles of open tabs

## Privacy

This extension does NOT:
- Send any data to external servers
- Store any browsing history
- Track your activity

All processing happens locally in your browser.