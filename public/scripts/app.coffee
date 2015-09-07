# console.debug "app.coffeech"
# $ = require("../node_modules/zepto/zepto.min.js")
# _ = require("underscore")
# Backbone = require("backbone")
define [
    "jquery","backbone","libs/action-dispatcher","libs/templer"
],($, Backbone,Dispatcher,templer)->
    class Router extends Backbone.Router
        routes:
            "*path":(path)->
                @trigger("route-path",path)
    class App extends Backbone.View
        initialize: ->
            # super()
            @router = new Router
            @router.on "route-path",@loadViewPath.bind(@)
            _.extend(@, new Dispatcher)
            @render()
            Backbone.history.start(pushState:true,root:"/")
        render: ->
            console.log "app render"
            console.log @$el
            @$el.html(@tmpl())
        tmpl: templer """
            <div class="app">
                <div class="app-body">
                </div>
            </div>
        """
        loadViewPath:(path)->
            dfd = $.Deferred()
            path = path.slice(0,-1) if path.slice(-1) == "/"
            require ["views/#{path}"],(View)=>
                $body = @$(".app-body").empty()
                @view = view = new View(el: $body[0])
                view.render()

            return dfd
