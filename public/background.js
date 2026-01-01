// Background Service Worker for Play Tab Extension

chrome.runtime.onInstalled.addListener(() => {
  console.log('Play Tab Extension installed');
});

// 點擊擴充功能圖示時，在新分頁開啟
chrome.action.onClicked.addListener(() => {
  chrome.tabs.create({ url: chrome.runtime.getURL('index.html') });
});

// Listen for tab changes
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete') {
    console.log('Tab updated:', tab.title);
  }
});

// Listen for messages from the popup/content scripts
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getTabs') {
    chrome.tabs.query({ currentWindow: true }, (tabs) => {
      sendResponse({ tabs });
    });
    return true; // Keep the message channel open for async response
  }
});
