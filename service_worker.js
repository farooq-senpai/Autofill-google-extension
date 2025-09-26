chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.get(["profiles", "siteMap", "autoFillOnLoad"], (res) => {
    if (!res.profiles) chrome.storage.local.set({ profiles: [] });
    if (!res.siteMap) chrome.storage.local.set({ siteMap: {} });
    if (typeof res.autoFillOnLoad === "undefined") chrome.storage.local.set({ autoFillOnLoad: false });
  });
});

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg?.action === "getActiveTabUrl") {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const url = tabs[0]?.url || "";
      sendResponse({ url });
    });
    return true;
  }
});