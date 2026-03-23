// Get tab count on load
document.addEventListener('DOMContentLoaded', async () => {
  await updateTabCount();
});

// Update the tab count display
async function updateTabCount() {
  try {
    const tabs = await chrome.tabs.query({});
    document.getElementById('tabCount').textContent = tabs.length;
  } catch (error) {
    console.error('Error getting tab count:', error);
    document.getElementById('tabCount').textContent = 'Error';
  }
}

// Save button click handler
document.getElementById('saveButton').addEventListener('click', async () => {
  const button = document.getElementById('saveButton');
  const status = document.getElementById('status');
  
  // Disable button while processing
  button.disabled = true;
  button.textContent = '⏳ Collecting tabs...';
  
  try {
    // Get all tabs
    const tabs = await chrome.tabs.query({});
    
    if (tabs.length === 0) {
      showStatus('No tabs found!', 'error');
      return;
    }
    
    // Format the tab data
    const content = formatTabsAsText(tabs);
    
    // Create and download the file
    downloadTextFile(content);
    
    // Show success message
    showStatus(`✓ Successfully saved ${tabs.length} tab links!`, 'success');
    
  } catch (error) {
    console.error('Error saving tabs:', error);
    showStatus('Error saving tabs. Please try again.', 'error');
  } finally {
    // Re-enable button
    button.disabled = false;
    button.textContent = '💾 Save All Tab Links';
  }
});

// Format tabs as neat text
function formatTabsAsText(tabs) {
  const now = new Date();
  const dateStr = now.toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  });
  
  let content = `Browser Tabs - Saved on ${dateStr}\n`;
  content += '='.repeat(50) + '\n\n';
  content += `Total Tabs: ${tabs.length}\n\n`;
  content += '='.repeat(50) + '\n\n';
  
  tabs.forEach((tab, index) => {
    const title = tab.title || 'Untitled';
    const url = tab.url || 'No URL';
    
    content += `[${index + 1}] ${title}\n`;
    content += `${url}\n\n`;
  });
  
  content += '='.repeat(50) + '\n';
  content += `End of file - ${tabs.length} tabs saved\n`;
  
  return content;
}

// Download text file
function downloadTextFile(content) {
  const now = new Date();
  const timestamp = now.toISOString()
    .replace(/:/g, '-')
    .replace(/\..+/, '')
    .replace('T', '-');
  
  const filename = `tab-links-${timestamp}.txt`;
  
  // Create blob and download
  const blob = new Blob([content], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  
  chrome.downloads.download({
    url: url,
    filename: filename,
    saveAs: false
  }, (downloadId) => {
    // Clean up the blob URL after download starts
    if (downloadId) {
      URL.revokeObjectURL(url);
    }
  });
}

// Show status message
function showStatus(message, type) {
  const status = document.getElementById('status');
  status.textContent = message;
  status.className = `status ${type}`;
  
  // Auto-hide after 3 seconds
  setTimeout(() => {
    status.className = 'status hidden';
  }, 3000);
}

// Extract all http/https URLs from text content
function extractUrls(text) {
  // Exclude characters that are never valid unencoded in URLs
  const urlRegex = /https?:\/\/[^\s<>"{}|\\^`[\]]+/g;
  const matches = text.match(urlRegex) || [];
  return matches.map(url => {
    // Strip trailing sentence punctuation unlikely to be part of a URL
    url = url.replace(/[.,;:!?]+$/, '');
    // Strip trailing ) only when there is no matching ( inside the URL
    // (preserves Wikipedia-style URLs like /wiki/Python_(programming_language))
    while (url.endsWith(')') && !url.includes('(')) {
      url = url.slice(0, -1);
    }
    return url;
  });
}

// Open Links from File button triggers file picker
document.getElementById('openFileButton').addEventListener('click', () => {
  document.getElementById('fileInput').click();
});

// Handle file selection
document.getElementById('fileInput').addEventListener('change', async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  // Reset file input so the same file can be selected again
  event.target.value = '';

  const openFileButton = document.getElementById('openFileButton');
  openFileButton.disabled = true;
  openFileButton.textContent = '⏳ Opening links...';

  try {
    const text = await file.text();
    const urls = extractUrls(text);

    if (urls.length === 0) {
      showStatus('No links found in file.', 'error');
      return;
    }

    await Promise.all(urls.map(url => chrome.tabs.create({ url, active: false })));

    await updateTabCount();
    showStatus(`✓ Opened ${urls.length} link${urls.length === 1 ? '' : 's'} from file!`, 'success');
  } catch (error) {
    console.error('Error opening links from file:', error);
    showStatus('Error reading file. Please try again.', 'error');
  } finally {
    openFileButton.disabled = false;
    openFileButton.textContent = '📂 Open Links from File';
  }
});