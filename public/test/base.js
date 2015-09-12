define(["chai", "jquery", "backbone"], function(chai) {
  var assert, retFail;
  assert = chai.assert;
  retFail = function(xhr) {
    var code, message, ref;
    ref = xhr.responseJSON.error, code = ref.code, message = ref.message;
    return assert(false, code + ": " + message);
  };
  return {
    assert: assert,
    retFail: retFail,
    chai: chai
  };
});
