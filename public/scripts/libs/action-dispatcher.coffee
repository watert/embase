###
promise based action dispatcher center,
use it like basic client side jssdk for apis
###

factory = ($, _)->

    # compatible for Q promise library for node usage
    Deferred = $.Deferred or $.defer
    $when = $.when

    class ActionDispatcher
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
                    if data.base_rsp and data.base_rsp.ret < 0
                        return (new Deferred).reject(data)
                    return data
            else
                throw("Dispatcher Err: Action '#{method}' not exists")
                # $.when(yes).reject("not exists")

        requireActions:(paths, callback)->
            # for amd loading actions
            paths = [paths] if _.isString(paths)
            require paths,()->
                _.each arguments, (ActionsHandler)->
                    ActionsHandler.initialize()
                callback?()
        actions:{}
        fakeRequest:(path, data)-> # 假数据请求
            dfd = new Deferred()
            require ["models/_fake-data"],(data)->
                if data[path] then dfd.resolve(data[path])
                else dfd.reject({ret:-1, msg:"no fake data: #{path}"})
            return dfd
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
