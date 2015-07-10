var expect = require('chai').expect;
var parseServer = require('../lib/parse-server');

describe('parseServer', function() {
  it('should parse server as host name', function() {
    var server = parseServer('irc.freenode.net');

    expect(server.host).to.equal('irc.freenode.net');
  });

  it('should return nullish value if null or undefined passed as argument', function() {
    var server = parseServer();

    expect(server).to.not.exist;
  });

  it('should parse port as integer', function() {
    var server = parseServer('server1:5000');

    expect(server.host).to.equal('server1');
    expect(server.port).to.equal(5000);
  });
});