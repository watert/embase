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
            # "model":Doc
            "next":(req,res,next)-> next()
            "parseData":(data)-> data
            "parseReturn": (data)-> data
            "GET":(id, data)-> # get list or item with id
                if not id then return Doc.find(data).then (_data)->
                    _data.result = _.toArray(_data)
                    return _data
                else return Doc.findOne(_id:id)
            "POST":(id, data)-> #create (id will be null)
                (new Doc(data)).save()
            "PUT":(id,data)-> #update
                Doc.findOne(_id:id).then (doc)->
                    doc.save(data)
            "DELETE":(id)->
                Doc.findOne(_id:id).then (doc)->
                    doc.remove().then (num)-> {_id:id, deleted:yes}
        router.use(apis.retJSON())
        router.get "/count", (req,res)->
            data = apis.getRequesetData(req)
            ctx = {req,res,data}
            data = options.parseData.bind(ctx)(data)
            Doc.find(data).then (data)->
                {result:{count:data.length}, id:-1}
            .then(res.ret)
            .fail(res.retError)

        router.all "/:id?", (req,res,next)->
            method = req.method
            id = req.params.id
            data = apis.getRequesetData(req)
            ctx = {req,res,method,id,data}
            data = options.parseData.bind(ctx)(data)
            if data.error
                return res.retError(data)
            options[method].bind(ctx)(id,data).then (data)->
                # res.data = data
                data = options.parseReturn.bind(ctx)(data)
                res.ret(data)
            .fail (err)->
                console.log "restful error",method, Doc.name, arguments
                console.trace(err)
                data = err
                data = {error:{code:500,message:err.toString()}} if not err.error
                res.retError(data)
                # options.next.bind(ctx)(req,res,next)
        return router

# [_jsonrpc, restful] = [require("./jsonrpc"), require("./restful")]
module.exports = apis
