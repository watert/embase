console.debug "app.coffeech"
$ = require("../node_modules/zepto/zepto.min.js")
_ = require("underscore")
module.exports = class App
    constructor: -> console.log "app", _
