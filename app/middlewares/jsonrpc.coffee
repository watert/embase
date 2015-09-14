_ = require("underscore")
express = require("express")
Dispatcher = require("../../public/scripts/libs/action-dispatcher")

{getRequesetData} = require("./util")

module.exports = (options={})->
    Model = options.model

    router = express.Router()
    api = Dispatcher.createAPI(Model, options.methods)

    router.post "/:method?", (req,res)->
        method = req.params.method
        data = getRequesetData(req) or {}
        api.call(method,data).then (data)->
            res.ret(data)
        .fail (err)->
            res.status(400).retError(err)
    return router
