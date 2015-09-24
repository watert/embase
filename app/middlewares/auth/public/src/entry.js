'use strict';

let $ = require("jquery")
let Backbone = require('backbone')
let _ = require('underscore')
let tmpls = require("./tmpls.js")

class AuthView extends Backbone.View {
    constructor(args) {
        super(...args)
    }
    initialize(){
        this.tmpl = tmpls
        this.name = "title"
    }
    // className: "view-user-index"
    get className() { return "view-user-index"}
    render(name="login", data={}) {
        let html = _.template(tmpls[name])(data)
        this.$el.html(html)
    }
}

$(()=> {
    let view = new AuthView()
    view.render()
    console.log("classname",view.className)
    $("body").empty().append(view.el)
})
