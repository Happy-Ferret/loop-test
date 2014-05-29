/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

/* global loop, sinon */

var expect = chai.expect;

describe("loop.shared.Client", function() {
  "use strict";

  var sandbox, fakeXHR, requests = [], callback;

  beforeEach(function() {
    sandbox = sinon.sandbox.create();
    fakeXHR = sandbox.useFakeXMLHttpRequest();
    requests = [];
    // https://github.com/cjohansen/Sinon.JS/issues/393
    fakeXHR.xhr.onCreate = function (xhr) {
      requests.push(xhr);
    };
    callback = sinon.spy();
  });

  afterEach(function() {
    sandbox.restore();
  });

  describe("loop.shared.Client", function() {
    describe("#constructor", function() {
      it("should require a baseServerUrl setting", function() {
        expect(function() {
          new loop.shared.Client();
        }).to.Throw(Error, /required/);
      });
    });

    describe("#requestCallUrl", function() {
      var client;

      beforeEach(function() {
        client = new loop.shared.Client({baseServerUrl: "http://fake.api"});
      });

      it("should post to /call-url/", function() {
        client.requestCallUrl("foo", callback);

        expect(requests).to.have.length.of(1);
        expect(requests[0].method).to.be.equal("POST");
        expect(requests[0].url).to.be.equal("http://fake.api/call-url/");
        expect(requests[0].requestBody).to.be.equal('callerId=foo');

      });

      it("should request a call url", function() {
        client.requestCallUrl("foo", callback);

        expect(requests).to.have.length.of(1);

        requests[0].respond(200, {"Content-Type": "application/json"},
                            '{"call_url": "fakeCallUrl"}');
        sinon.assert.calledWithExactly(callback, null, "fakeCallUrl");
      });

      it("should send an error when the request fails", function() {
        client.requestCallUrl("foo", callback);

        expect(requests).to.have.length.of(1);

        requests[0].respond(400, {"Content-Type": "application/json"},
                            '{"error": "my error"}');
        sinon.assert.calledWithMatch(callback, sinon.match(function(err) {
          return /400.*my error/.test(err.message);
        }));
      });

      it("should send an error if the data is not valid", function() {
        client.requestCallUrl("foo", callback);

        requests[0].respond(200, {"Content-Type": "application/json"},
                            '{"bad": {}}');
        sinon.assert.calledWithMatch(callback, sinon.match(function(err) {
          return /Invalid data received/.test(err.message);
        }));
      });
    });

    describe("#requestCallsInfo", function() {
      var client;

      beforeEach(function() {
        client = new loop.shared.Client({baseServerUrl: "http://fake.api"});
      });

      it("should prevent launching a conversation when version is missing",
        function() {
          expect(function() {
            client.requestCallsInfo();
          }).to.Throw(Error, /missing required parameter version/);
        });

      it("should request data for all calls", function() {
        client.requestCallsInfo(42, callback);

        expect(requests).to.have.length.of(1);
        expect(requests[0].url).to.be.equal("http://fake.api/calls?version=42");
        expect(requests[0].method).to.be.equal("GET");

        requests[0].respond(200, {"Content-Type": "application/json"},
                                 '{"calls": [{"apiKey": "fake"}]}');
        sinon.assert.calledWithExactly(callback, null, [{apiKey: "fake"}]);
      });

      it("should send an error when the request fails", function() {
        client.requestCallsInfo(42, callback);

        requests[0].respond(400, {"Content-Type": "application/json"},
                                 '{"error": "my error"}');
        sinon.assert.calledWithMatch(callback, sinon.match(function(err) {
          return /400.*my error/.test(err.message);
        }));
      });

      it("should send an error if the data is not valid", function() {
        client.requestCallsInfo(42, callback);

        requests[0].respond(200, {"Content-Type": "application/json"},
                                 '{"bad": {}}');
        sinon.assert.calledWithMatch(callback, sinon.match(function(err) {
          return /Invalid data received/.test(err.message);
        }));
      });
    });

    describe("requestCallInfo", function() {
      var client;

      beforeEach(function() {
        client = new loop.shared.Client({baseServerUrl: "http://fake.api"});
      });

      it("should prevent launching a conversation when token is missing",
        function() {
          expect(function() {
            client.requestCallInfo();
          }).to.Throw(Error, /missing.*[Tt]oken/);
        });

      it("should post data for the given call", function() {
        client.requestCallInfo("fake", callback);

        expect(requests).to.have.length.of(1);
        expect(requests[0].url).to.be.equal("http://fake.api/calls/fake");
        expect(requests[0].method).to.be.equal("POST");
      });

      it("should receive call data for the given call", function() {
        client.requestCallInfo("fake", callback);

        var sessionData = {
          sessionId: "one",
          sessionToken: "two",
          apiKey: "three"
        };

        requests[0].respond(200, {"Content-Type": "application/json"},
                            JSON.stringify(sessionData));
        sinon.assert.calledWithExactly(callback, null, sessionData);
      });

      it("should send an error when the request fails", function() {
        client.requestCallInfo("fake", callback);

        requests[0].respond(400, {"Content-Type": "application/json"},
                            '{"error": "my error"}');
        sinon.assert.calledWithMatch(callback, sinon.match(function(err) {
          return /400.*my error/.test(err.message);
        }));
      });

      it("should send an error if the data is not valid", function() {
        client.requestCallsInfo("fake", callback);

        requests[0].respond(200, {"Content-Type": "application/json"},
                            '{"bad": "one"}');
        sinon.assert.calledWithMatch(callback, sinon.match(function(err) {
          return /Invalid data received/.test(err.message);
        }));
      });
    });
  });
});