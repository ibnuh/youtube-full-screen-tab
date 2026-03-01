(function () {
  "use strict";

  const checkbox = document.getElementById("interceptDoubleClick");

  chrome.storage.local.get({ interceptDoubleClick: true }, (result) => {
    checkbox.checked = result.interceptDoubleClick;
  });

  checkbox.addEventListener("change", () => {
    chrome.storage.local.set({ interceptDoubleClick: checkbox.checked });
  });
})();
