(function () {
  function extractFormFields() {
    const fields = {};
    const inputs = Array.from(document.querySelectorAll("input, textarea, select"));
    inputs.forEach((el) => {
      const name = el.name || el.id || el.getAttribute("aria-label") || el.placeholder || null;
      if (!name) return;
      const key = name.toLowerCase().trim();
      if (el.type === "checkbox" || el.type === "radio") {
        fields[key] = el.checked;
      } else {
        fields[key] = el.value || "";
      }
    });
    return fields;
  }

  function fillFromProfile(profile) {
    const inputs = Array.from(document.querySelectorAll("input, textarea, select"));
    const profileKeys = Object.keys(profile).map(k => k.toLowerCase());
    inputs.forEach((el) => {
      const candidates = [
        el.name || "",
        el.id || "",
        el.getAttribute("aria-label") || "",
        el.placeholder || "",
        el.labels && el.labels[0] && el.labels[0].innerText || ""
      ].join(" ").toLowerCase();
      const matched = profileKeys.find(pk => candidates.includes(pk) || candidates.includes(pk.replace(/_/g, " ")));
      if (matched) {
        try {
          if (el.type === "checkbox" || el.type === "radio") {
            el.checked = !!profile[matched];
            el.dispatchEvent(new Event("change", { bubbles: true }));
          } else {
            el.focus();
            el.value = profile[matched];
            el.dispatchEvent(new Event("input", { bubbles: true }));
            el.dispatchEvent(new Event("change", { bubbles: true }));
          }
        } catch (e) {
          console.warn("fill error", e);
        }
      }
    });
  }

  chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    if (msg?.action === "extractForm") {
      sendResponse({ fields: extractFormFields() });
    }
    if (msg?.action === "fillFromProfile" && msg.profile) {
      fillFromProfile(msg.profile);
      sendResponse({ ok: true });
    }
  });
})();