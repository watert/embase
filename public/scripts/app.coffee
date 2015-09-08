# console.debug "app.coffeech"
# $ = require("../node_modules/zepto/zepto.min.js")
# _ = require("underscore")
# Backbone = require("backbone")
define [
    "jquery","backbone","libs/action-dispatcher","libs/templer", "iscroll"
],($, Backbone,Dispatcher,templer, IScroll)->
    class Router extends Backbone.Router
        routes:
            "*path":(path="users")->
                console.log path
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
            # console.log "app render"
            # console.log @$el
            @$el.html(@tmpl())
        tmpl: templer """
            <div class="app">
                <div class="app-body">
                    <div class="view-container">
                    </div>
                </div>
            </div>
        """
        loadViewPath:(path)->
            console.log "loadViewPath",path
            dfd = $.Deferred()
            path = path.slice(0,-1) if path.slice(-1) == "/"
            console.log "views/#{path}"
            require ["views/#{path}"],(View)=>
                # console.log "View",View
                $body = @$(".view-container").empty()
                @view = view = new View(el: $body.parent()[0])
                view.render().then =>
                    # new IScroll(view.el)
                dfd.resolve(view)

            return dfd
