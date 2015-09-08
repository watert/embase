###
promise based action dispatcher center,
use it like basic client side jssdk for apis
###

factory = ($, _)->

    # compatible for Q promise library for node usage
    Deferred = $.Deferred or $.defer
    $when = $.when
    $reject = ->
        dfd = new Deferred()
        dfd.reject(arguments...)
        return dfd.promise

    class ActionDispatcher

        @createAPI = (Model, methods)->
            actions = for name in methods
                method = Model[name].bind(Model)
                [name, method]
            api = new this(actions: _.object(actions))

        constructor: (options={})->
            @addActions(options.actions or {})
            return this
        # isShowingRequestDebug: yes
        dfdDebug:(dfd, method, req)->
            alertWithStatus = (status, res)->
                info = """
                    [#{status}] #{method}:
                    req: #{JSON.stringify(req)};
                    res: #{JSON.stringify(res)};
                """
                alert(info)
            dfd.then (res)-> alertWithStatus("success", res)
            dfd.fail (res)-> alertWithStatus("fail", res)

        call:(method, data, callback)->
            if @actions[method]
                dfd = $when @actions[method].bind(this)(data)
                if @isShowingRequestDebug
                    @dfdDebug(dfd, method, data)
                dfd.then(callback) if _.isFunction(callback) and dfd.then

                return dfd.then (data)->
                    if data.error?
                        return (new Deferred).reject(data)
                    return data
            else
                msg = "Dispatcher Err: Action '#{method}' not exists"
                console.log "reject msg",msg
                return $reject(msg)
                # $.when(yes).reject("not exists")

        requireActions:(paths, callback)->
            # for amd loading actions
            paths = [paths] if _.isString(paths)
            require paths,()->
                _.each arguments, (ActionsHandler)->
                    ActionsHandler.initialize()
                callback?()
        actions:{}
        addActions:(map)->
            _(map).each (actionMethod,name)=>
                oldMethod = @actions[name]
                if not oldMethod
                    @actions[name] = actionMethod.bind(this)
                else #拥有同名action报错
                    throw("Action exists: #{name}")


    # return new ActionDispatcher()
if define?.amd then define(["jquery","underscore"],factory)
if exports and module?.exports
    exports = module.exports = factory(require("q"), require("underscore"))
