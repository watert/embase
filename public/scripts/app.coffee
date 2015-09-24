# $ = require("../node_modules/zepto/zepto.min.js")
# _ = require("underscore")
# Backbone = require("backbone")
define [
    "jquery","backbone","libs/action-dispatcher","libs/templer", "libs/util"
],($, Backbone,Dispatcher,templer, util)->
    class Router extends Backbone.Router
        routes:
            ":section/*path":(section, path)->
                path ?= "index"
                path = section+"/"+path
                @currentPath = path
                @trigger("route-path",path)

            # "*path":(path="users")->
            #     @trigger("route-path",path)
    class App extends Backbone.View
        util:util
        templer: templer
        initialize: ->
            # super()
            @router = new Router
            @router.on "route-path",@loadViewPath.bind(@)
            _.extend(@, new Dispatcher)
            @render()
            Backbone.history.start(pushState:true,root:"/")
        render: ->
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
            @view?.trigger("remove").remove()
            dfd = $.Deferred()
            path = path.slice(0,-1) if path.slice(-1) == "/"

            require ["views/#{path}"],(View)=>
                $body = @$(".view-container").empty()
                    .removeClass().addClass("view-container view-#{path.replace("/","-")}")
                query = util.deparamQuery()
                @view = view = new View( query:query, path:path)
                view.$el.appendTo($body)
                # @view.path = path
                $.when(view.render()).then =>
                    # new IScroll(view.el)
                dfd.resolve(view)

            return dfd
