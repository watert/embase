_ = require("underscore")
express = require("express")
{getRequesetData} = require("./util")

restful = (options={})->
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
    router.all "/:id?", (req,res,next)->
        method = req.method
        id = req.params.id
        data = getRequesetData(req)
        ctx = {req,res,method,id,data}
        data = options.parseData.bind(ctx)(data)
        options[method].bind(ctx)(id,data).then (data)->
            res.restData = data
            options.next.bind(ctx)(req,res,next)
    return router
module.exports = restful
