# console.debug "app.coffeech"
$ = require("../node_modules/zepto/zepto.min.js")
_ = require("underscore")
Backbone = require("backbone")
class App extends Backbone.View
    constructor: -> console.log "app", _
module.exports = App
