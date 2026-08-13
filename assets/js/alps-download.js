// Download tutorial scripts without navigating away from the page.
//
// The scripts live in ALPSim/ALPS, so the links are cross-origin and the HTML
// `download` attribute is ignored. raw.githubusercontent.com sends
// `access-control-allow-origin: *`, so we can fetch the file and hand the
// browser a same-origin blob to save instead.
//
// If the fetch fails (offline, rate limited, file moved) we fall back to
// opening the raw URL in a new tab, so the link is never a dead end.
(function () {
  "use strict";

  document.addEventListener("click", function (event) {
    if (event.defaultPrevented || event.button !== 0) return;
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

    var link = event.target.closest("a.alps-download");
    if (!link) return;

    event.preventDefault();

    var url = link.href;
    var filename = link.dataset.filename || url.split("/").pop();

    fetch(url)
      .then(function (response) {
        if (!response.ok) throw new Error("HTTP " + response.status);
        return response.blob();
      })
      .then(function (blob) {
        var objectURL = URL.createObjectURL(blob);
        var temp = document.createElement("a");
        temp.href = objectURL;
        temp.download = filename;
        document.body.appendChild(temp);
        temp.click();
        temp.remove();
        URL.revokeObjectURL(objectURL);
      })
      .catch(function () {
        window.open(url, "_blank", "noopener");
      });
  });
})();
