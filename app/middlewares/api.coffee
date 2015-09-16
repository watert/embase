_ = require("underscore")
express = require("express")
Dispatcher = require("../../public/scripts/libs/action-dispatcher")
q = require("q")
# utilRouter = require("./util")
apis =
    retJSON: (options)->
        (req,res,next)->
            res.ret = (data)->
                result = data._data or data.result or data
                # console.log "ret data", JSON.stringify(result), _.isObject(result)
                id = data.id or data._id or _.map(data, (item)-> item.id or item._id )
                if not _.isArray(result) then result = _.omit(result, "password")
                res.json({result:result, id:id})
                return res
            res.retError = (code,msg,result=null)->
                if msg?.error
                    {error, result} = msg
                else if code.error
                    error = code.error
                else error =
                    code:code, message:msg
                res.status(error.code).json(result:result, error:error)
                return res
            next()
    getRequesetData: (req)->
        method = req.method
        if method is "GET" then return req.query
        else return req.body
    jsonrpc: (options={})->
        options = _.extend({on:{}}, options)
        Model = options.model
        router = express.Router()
        router.use("/*", apis.retJSON())
        router.post "/:method?", (req,res,next)->
            method = req.params.method
            data = apis.getRequesetData(req) or {}
            q.when(Model[method](data)).then (_data)->
                res.data = _data
                ctx = {data:_data, req, res, method}
                if eventMethod = options.events[method]
                    eventMethod.bind(ctx)(req,res)
                # options.next ?= ()-> res.ret(_data)
                # options.next({data:_data, req, res, method})
                res.ret(_data)
                # next()
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
            "GET":(id, data)-> # get list or item with id
                if not id then return Doc.find(data).then (data)->
                    data.result = _.toArray(data)
                    return data
                else return Doc.findOne(_id:id)
            "POST":(id, data)-> #create (id will be null)

                (new Doc(data)).save()
            "PUT":(id,data)-> #update

                Doc.findOne(_id:id).then (doc)->
                    console.log "restful put", Doc, data
                    doc.save(data)
            "DELETE":(id)->
                Doc.findOne(_id:id).then (doc)->
                    doc.remove().then (num)-> {_id:id, deleted:yes}
        router.use(apis.retJSON())
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
                res.ret(data)
            .catch (err)->
                res.retError(err)
                # options.next.bind(ctx)(req,res,next)
        return router

# [_jsonrpc, restful] = [require("./jsonrpc"), require("./restful")]
module.exports = apis
