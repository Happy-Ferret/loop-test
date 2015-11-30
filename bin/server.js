/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

/* eslint-env node */

/* XXX We should enable these and fix the warnings, but at the time of this
 * writing, we're just bootstrapping the linting infrastructure.
 */
/* eslint-disable no-path-concat,no-process-exit */

var express = require("express");
var app = express();

// make dev-server performance more similar to the production server by using
// gzip compression
var compression = require("compression");
app.use(compression());

/* global __dirname */
var path = require("path");
// TODO audit for all uses which use __dirname instead of topDir and see if
// they can be gotten rid of
// XXX the reason for .. here is because we're depending on the current
// reality of server.js being started from ./bin in the repo.
var topDir = path.join(__dirname, "..");

var port = process.env.PORT || 3000;
var feedbackApiUrl = process.env.LOOP_FEEDBACK_API_URL ||
                     "https://input.allizom.org/api/v1/feedback";
var feedbackProductName = process.env.LOOP_FEEDBACK_PRODUCT_NAME || "Loop";
var loopServerUrl = process.env.LOOP_SERVER_URL || "http://localhost:5000";

// This is typically overridden with "dist" so that it's possible to test the
// optimized version, once it's been built to the "dist" directory
var standaloneContentDir = process.env.LOOP_CONTENT_DIR ||
  path.join(topDir, "built", "standalone", "content");

// Remove trailing slashes as double slashes in the url can confuse the server
// responses.
if (loopServerUrl[loopServerUrl.length - 1] === "/") {
  loopServerUrl = loopServerUrl.slice(0, -1);
}

function getConfigFile(req, res) {
  "use strict";

  res.set("Content-Type", "text/javascript");
  res.send([
    "var loop = loop || {};",
    "loop.config = loop.config || {};",
    "loop.config.serverUrl = '" + loopServerUrl + "/v0';",
    "loop.config.feedbackApiUrl = '" + feedbackApiUrl + "';",
    "loop.config.feedbackProductName = '" + feedbackProductName + "';",
    "loop.config.downloadFirefoxUrl = 'https://www.mozilla.org/firefox/new/?scene=2&utm_source=hello.firefox.com&utm_medium=referral&utm_campaign=non-webrtc-browser#download-fx';",
    "loop.config.privacyWebsiteUrl = 'https://www.mozilla.org/privacy/firefox-hello/';",
    "loop.config.learnMoreUrl = 'https://www.mozilla.org/hello/';",
    "loop.config.legalWebsiteUrl = 'https://www.mozilla.org/about/legal/terms/firefox-hello/';",
    "loop.config.roomsSupportUrl = 'https://support.mozilla.org/kb/group-conversations-firefox-hello-webrtc';",
    "loop.config.tilesIframeUrl = 'https://tiles.cdn.mozilla.net/iframe.html';",
    "loop.config.tilesSupportUrl = 'https://support.mozilla.org/tiles-firefox-hello';",
    "loop.config.guestSupportUrl = 'https://support.mozilla.org/kb/respond-firefox-hello-invitation-guest-mode';",
    "loop.config.generalSupportUrl = 'https://support.mozilla.org/kb/respond-firefox-hello-invitation-guest-mode';",
    "loop.config.unsupportedPlatformUrl = 'https://support.mozilla.org/en-US/kb/which-browsers-will-work-firefox-hello-video-chat'"
  ].join("\n"));
}

app.get("/content/config.js", getConfigFile);
app.get("/content/c/config.js", getConfigFile);

// Various mappings to let us end up with:
// /test - for the test files
// /ui - for the ui showcase
// /content - for the standalone files.

app.use("/ui", express.static(path.join(topDir, "built", "ui")));
app.use("/add-on", express.static(
  path.join(topDir, "built", "add-on", "chrome", "content")));

// Punch a few holes to stuff in the source.  XXX Not sure if this is a great
// idea or not.

// We want to make the top-level test directory available...
app.use("/test", express.static(path.join(topDir, "test")));
// ...and it points to stuff we want for testing.  Note that the shared unit
// tests get all their resources from /standalone/shared in the
// built directory.  The tests themselves, however, come out of the source
// tree:r
app.use("/shared/test", express.static(path.join(topDir, "shared", "test")));
app.use("/standalone/test", express.static(path.join(topDir, "standalone",
  "test")));
app.use("/add-on/panels/test", express.static(path.join(topDir, "add-on",
  "panels", "test")));

// As we don't have hashes on the urls, the best way to serve the index files
// appears to be to be to closely filter the url and match appropriately.
function serveIndex(req, res) {
  "use strict";

  return res.sendFile(path.join(standaloneContentDir, "index.html"));
}

app.get(/^\/content\/[\w\-]+$/, serveIndex);
app.get(/^\/content\/c\/[\w\-]+$/, serveIndex);

// XXX This / entry is only currently mostly necessary for some test stuff.
// I suspect we want to adjust the paths and get rid of this.
app.use("/", express.static(standaloneContentDir));

app.use("/content", express.static(standaloneContentDir));

var server = app.listen(port);

var baseUrl = "http://localhost:" + port + "/";

console.log("Static contents are available at " + baseUrl + "content/");
console.log("Tests are viewable at " + baseUrl + "test/");
console.log("Use this for development only.");

// Handle SIGTERM signal.
function shutdown(cb) {
  "use strict";

  try {
    server.close(function() {
      process.exit(0);
      if (cb !== undefined) {
        cb();
      }
    });

  } catch (ex) {
    console.log(ex + " while calling server.close)");
  }
}

process.on("SIGTERM", shutdown);
