_ = require("underscore")
express = require("express")
Dispatcher = require("../../public/scripts/libs/action-dispatcher")
# utilRouter = require("./util")
apis =
    retJSON: (options)->
        (req,res,next)->
            res.ret = (data)->
                result = data._data or data
                id = data.id or data._id or _.map(data, (item)-> item.id or item._id )
                result = _.omit(result, "password")
                res.json({result:result, id:id})
                return res
            res.retError = (code,msg,result=null)->
                if msg.error then {error, result} = msg
                else error = code:code, message:msg
                res.status(code).json(result:result, error:error)
                return res
            next()
    getRequesetData: (req)->
        method = req.method
        if method is "GET" then return req.query
        else return req.body
    jsonrpc: (options={})->
        Model = options.model
        router = express.Router()
        api = Dispatcher.createAPI(Model, options.methods)
        router.use(apis.retJSON())
        router.post "/:method?", (req,res)->
            method = req.params.method
            data = apis.getRequesetData(req) or {}
            api.call(method,data).then (data)->
                res.ret(data)
            .fail (err)->
                res.status(400).retError(err)
        return router
    restful: (options={})->
        router = express.Router()

        Doc = options.model
        _.defaults options,
            # "model":Doc
            "next":(req,res,next)-> next()
            "parseData":(data)-> data
            "GET":(id, data)-> # get list or item with id
                if not id then return Doc.find(data)
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
        router.all "/:id?", (req,res,next)->
            method = req.method
            id = req.params.id
            data = apis.getRequesetData(req)
            ctx = {req,res,method,id,data}
            data = options.parseData.bind(ctx)(data)
            options[method].bind(ctx)(id,data).then (data)->
                res.restData = data
                options.next.bind(ctx)(req,res,next)
        return router

# [_jsonrpc, restful] = [require("./jsonrpc"), require("./restful")]
module.exports = apis
