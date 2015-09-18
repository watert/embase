define [],()->

    require.loadExport = (arr, ctx=window)->
        if _.isString(arr) then arr = [arr]
        require arr, ()->
            for i,idx in arr
                i = i.replace(/\//g,"_")
                ctx[i] = arguments[idx]
    util =
        promiseFCall:(method, args...)->
            dfd = $.Deferred()
            method args..., ()->
                dfd.resolve(arguments...)
            return dfd
        deparamQuery:(string)->
            string ?= location.search.slice(1)
            if string.length is 0 then return {}
            pairs = _.map string.replace(/\+/g, ' ').split('&'), (pair)->
                kv = pair.split("=")
                return [kv[0], decodeURIComponent(kv[1])]
            return _.object(pairs)
        parseUrl:(url)->
            el = $("<a>", {href:url})[0]
            ret = _.pick(el, ["host","origin","pathname","search","hash"])
            if ret.search
                ret.query = @deparamQuery(ret.search.slice(1))
            else ret.query = {}
            ret.getUrl = ()->
                return ret.origin+ret.pathname + "?" + $.param(ret.query)
            return ret
    return util
