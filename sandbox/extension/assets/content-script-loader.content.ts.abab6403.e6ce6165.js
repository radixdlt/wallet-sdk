(function () {
  'use strict';

  (async () => {
    await import(
      /* @vite-ignore */
      chrome.runtime.getURL("assets/content.ts.abab6403.js")
    );
  })().catch(console.error);

})();
