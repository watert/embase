factory = (_)->
    templer = (options)->
        throw("Empty tmpl") unless options
        options = {index:options} if _.isString(options)
        tmpl = _.template(options.index)
        ctx = _.extend({}, tmpl, options)
        tmplMethod = (data,args...)->
            data = _.extend({}, ctx, data)
            # console.log "method",data.require
            tmpl.bind(ctx)(data, args...)
        _.extend ctx,
            require:(name,args...)->
                mod = templer.require(name)
                # console.log "tmpl inline require", mod()
                return mod?(args...)
        _.extend tmplMethod,
            context: ctx
            get:(key)-> ctx[key]
            extend: (options)->
                opt2 = _.extend({}, ctx, options)
                return templer(opt2)

        return tmplMethod
    _.extend templer,
        modules: {}
        require:(name)->
            mod = @modules[name]
            throw("mod #{name} not defined") unless mod
            return mod
        define:(name, tmpl)->
            tmpl = templer(tmpl) unless _.isFunction(tmpl)
            @modules[name] = tmpl

if define?.amd then define(["underscore"],factory)
if exports and module?.exports
    exports = module.exports = factory(require("underscore"))
