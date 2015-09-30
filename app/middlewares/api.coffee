###
apis = require("middleware/api")
router.use "/api/restful/", restful(model:User)
router.use "/api/", jsonrpc(model:User)
###

_ = require("underscore")
express = require("express")
Dispatcher = require("../../public/scripts/libs/action-dispatcher")
q = require("q")
q.longStackSupport = yes

# utilRouter = require("./util")

retJSON = (options)->
    (req,res,next)->
        res.ret = (data)->
            result = data
            defaultAttr = (data, arr)->
                for key in arr
                    if not _.isUndefined(ret = data[key])
                        console.log "not isUndefined", ret
                        return ret
                return data
            result = defaultAttr(data, ["_data", "result"])
            id = data.id or data._id or null
            id = _.map(data, (item)-> item.id or item._id ) if _.isArray(data)
            res.json({result:result, id:id})
            return res
        res.retError = (code,msg,result=null)->
            json = {}
            console.trace(code) if code instanceof Error
            if msg?.error
                json = {error, result}
            else if code.error
                # res.code(code)
                json = code
            else
                json = error:{code:code, message:msg}
            res.status(json.error.code or 500).json(json)
            return res
        next()
getRequesetData = (req)->
    method = req.method
    if method is "GET" then return req.query
    else return req.body

apis =
    retJSON: retJSON,
    getRequesetData: getRequesetData
    jsonrpc: (options={})->
        options = _.extend({
            events:{}
            parseData:(data)-> data
        }, options)
        Model = options.model
        router = express.Router()
        router.use("/*", apis.retJSON())
        router.post "/:method?", (req,res,next)->
            method = req.params.method
            data = apis.getRequesetData(req) or {}
            data = options.parseData.bind({Model,data,method})(data)
            q.when(Model[method](data)).then (_data)->
                res.data = _data
                ctx = {data:_data, req, res, method}
                if eventMethod = options.events[method]
                    eventMethod.bind(ctx)(req,res)
                res.ret(_data)
            .fail (err)->
                res.retError(err)
        return router
    restful: (options={})->
        router = express.Router()
        Doc = options.model
        _.defaults options,
            "parseData":(data)-> data
            "parseReturn": (data)-> data
            "parseReturnArray": (data)-> data

            "GET":(id, data)-> # get list or item with id
                if not id then return Doc.find(data)
                else return Doc.findOne(_id:id)
            "POST":(id, data)-> #create (id will be null)
                data.lastModify = data.createAt = (new Date)
                (new Doc(data)).save()
            "PUT":(id,data)-> #update
                data.lastModify = (new Date)
                Doc.findOne(_id:id).then (doc)->
                    doc.save(data)
            "DELETE":(id)->
                Doc.findOne(_id:id).then (doc)->
                    doc.remove().then (num)-> {_id:id, deleted:yes}
        router.use(apis.retJSON())

        parseRequest = (req)->
            data = apis.getRequesetData(req)
            params = options.parseData.bind({req})(data)
            return {params, id:req.params.id, method:req.method}
        parseReturn = (data, ctx)->
            _parse = options.parseReturn.bind(ctx)
            if _.isArray(data)
                data = _.toArray(_.map(data, _parse))
                data = options.parseReturnArray.bind(ctx)(data)

            else data = _parse(data)

        router.get "/count", (req,res)->
            {params} = parseRequest(req)
            Doc.find(params).then (data)->
                {result:{count:data.length}, id:-1}
            .then(res.ret)
            .fail(res.retError)

        router.all "/:id?", (req,res,next)->
            {method, id, params} = parseRequest(req)
            ctx = {req,res,method,id,params}
            if params.error
                return res.retError(params)

            options[method].bind(ctx)(id,params).then (data)->
                data = data._data if data._data
                res.ret(parseReturn(data, ctx))
            .fail (err)->
                console.trace(err)
                data = {error:{code:500,message:err.toString()}} if not err.error
                res.retError(data)
        return router

# [_jsonrpc, restful] = [require("./jsonrpc"), require("./restful")]
module.exports = apis
