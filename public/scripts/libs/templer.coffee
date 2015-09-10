###

# sample with

# sample with sub templer
tmpl = templer
    outsider: " world "
    useInIndex: templer "hello <%=outsider%> "
    index:" <%=useInIndex()%> "
console.assert tmpl() == "hello world"

# sample with this._super
tmpl = templer({index: "hello world"}).extend
    index: -> "before #{@_super.index} after"
console.assert tmpl() == "before hello world after"
###

factory = (_)->
    templer = (options)->
        throw("Empty tmpl") unless options
        options = {index:options} if _.isString(options)
        events = options.events ?= {}
        if _.isString(tmpl = options.index)
            tmpl = _.template(options.index)

        #main part: return a generated tmpl method
        ctx = _.extend({}, tmpl, options)

        events.prepare?.bind(ctx)?(ctx)
        tmplMethod = (data,args...)->
            data = _.extend({}, ctx, data)
            # console.log "method",data.require
            _.each ctx, (_tmpl, key)->
                # sub templer should have parent's context and data as default
                if _tmpl.type is "templer"
                    data[key] = _tmpl
                    _.defaults(_tmpl._context, ctx)
                    _.defaults(_tmpl._context, data)
            tmpl.bind(ctx)(data, args...)

        # add extend feature
        # events.extend?(ctx)
        _.extend tmplMethod, ctx,
            type:"templer"
            _context: ctx
            # get:(key)-> ctx[key]
            extend: (options)->
                # console.log "extending", ctx.index, options.index
                opt2 = _.extend({}, ctx, options)
                opt2._super = ctx
                return templer(opt2)

        return tmplMethod

# bind to module loaders
if define?.amd
    define(["underscore"],factory)
else if exports and module?.exports
    exports = module.exports = factory(require("underscore"))
else _.templer = factory(_)
