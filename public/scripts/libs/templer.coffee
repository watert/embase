###

# sample with

# sample with sub templer
tmpl = templer
    outsider: " world "
    useInIndex: templer "hello <%=outsider%> "
    index:" <%=useInIndex()%> "
assert tmpl() == "hello world"

# sample with this._super
tmpl = templer({index: "hello world"}).extend
    index: -> "before #{@_super.index} after"
tmpl() == "before hello world after"
###

factory = (_)->
    templer = (options)->
        throw("Empty tmpl") unless options
        options = {index:options} if _.isString(options)
        if _.isString(tmpl = options.index)
            tmpl = _.template(options.index)
        ctx = _.extend({}, tmpl, options)
        tmplMethod = (data,args...)->
            data = _.extend({}, ctx, data)
            # console.log "method",data.require
            _.each ctx, (_tmpl, key)->
                # sub templer should have parent's context and data as default
                if _tmpl.type is "templer"
                    data[key] = _tmpl
                    _.defaults(_tmpl.context, ctx)
                    _.defaults(_tmpl.context, data)
            tmpl.bind(ctx)(data, args...)
        _.extend tmplMethod,
            type:"templer"
            context: ctx
            get:(key)-> ctx[key]
            extend: (options)->
                # console.log "extending", ctx.index, options.index
                opt2 = _.extend({}, ctx, options)
                opt2._super = ctx
                return templer(opt2)

        return tmplMethod

if define?.amd
    # console.log "define"
    define(["underscore"],factory)
if exports and module?.exports
    exports = module.exports = factory(require("underscore"))
