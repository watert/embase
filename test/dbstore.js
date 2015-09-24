var DB, assert, fs, q;

DB = require("nedb");

assert = require("chai").assert;

q = require("q");

fs = require("fs");

describe("DBStore", function() {
  var store;
  store = new DB({
    filename: "./test.db"
  });
  it("should connect", function() {
    return q.ninvoke(store, "loadDatabase");
  });
  it("should insert", function() {
    return q.ninvoke(store, "insert", {
      name: "hello"
    });
  });
  return it("should find", function() {
    var act;
    act = store.find({}).sort({
      _id: -1
    });
    return q.ninvoke(act, "exec").then(function(data) {
      return console.log("find", data);
    });
  });
});

describe("nedb bug?", function() {
  return it("should crash", function() {
    var _, db;
    DB = require("nedb");
    _ = require("underscore");
    q = require("q");
    db = new DB({
      filename: "./testremove.db"
    });
    return q.ninvoke(db, "loadDatabase").then(function() {
      return q.ninvoke(db, "loadDatabase");
    }).then(function() {
      return q.ninvoke(db, "loadDatabase");
    });
  });
});
