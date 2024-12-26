// JavaScript file (popup.js)
const addTabButton = document.getElementById('addTab');
const tabsContainer = document.getElementById('tabs');
const tabNumbersContainer = document.getElementById('tabNumbers');
let tabCount = 0;

// Load tabs from storage
chrome.storage.local.get(['tabs', 'tabCount'], (result) => {
  const storedTabs = result.tabs || [];
  tabCount = result.tabCount || 0;
  storedTabs.forEach((tabContent, index) => {
    createTab(index + 1, tabContent);
  });
});

addTabButton.addEventListener('click', () => {
  tabCount++;
  createTab(tabCount, '');
  saveTabsToStorage();
});

function createTab(tabId, content) {
  // Hide all existing tabs
  const existingTabs = document.querySelectorAll('.tab');
  existingTabs.forEach(tab => {
    tab.style.display = 'none';
    tab.classList.remove('active');
  });

  const existingButtons = document.querySelectorAll('.tab-button');
  existingButtons.forEach(button => button.classList.remove('active'));

  // Create a new tab
  const newTab = document.createElement('div');
  newTab.className = 'tab active';
  newTab.id = `${tabId}`;
  newTab.style.display = 'block';
  const textarea = document.createElement('textarea');
  textarea.placeholder = 'Paste your content here...';
  textarea.value = content;
  textarea.addEventListener('input', saveTabsToStorage);
  newTab.appendChild(textarea);

  // Add the new tab to the container
  tabsContainer.appendChild(newTab);

  // Create a button for the new tab
  const tabButton = document.createElement('div');
  tabButton.className = 'tab-button active';
  tabButton.innerText = `${tabId}`;
  tabButton.addEventListener('click', () => {
    // Hide all tabs and deactivate buttons
    existingTabs.forEach(tab => {
      tab.style.display = 'none';
      tab.classList.remove('active');
    });
    existingButtons.forEach(button => button.classList.remove('active'));

    // Show the clicked tab and activate the button
    newTab.style.display = 'block';
    newTab.classList.add('active');
    tabButton.classList.add('active');
  });

  // Add the tab button to the tab numbers container
  tabNumbersContainer.appendChild(tabButton);
}

function saveTabsToStorage() {
  const tabs = Array.from(document.querySelectorAll('.tab textarea')).map(textarea => textarea.value);
  chrome.storage.local.set({ tabs, tabCount });
}
