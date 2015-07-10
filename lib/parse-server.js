module.exports = function parseServer(server) {
  if (!server) {
    return;
  }

  var getFragment = fragments(server.split(':'));

  return {
    host : getFragment(0),
    port : getFragment(1)? parseInt(getFragment(1), 10):undefined
  };
};

function fragments(parts) {
  return function(idx) {
    return (parts.length > idx && parts[idx].length > 0)?parts[idx]:undefined;
  }
}