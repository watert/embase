express = require('express')
_ = require('underscore')
User = require("../models/user")
Dispatcher = require("../../public/scripts/libs/action-dispatcher")
config = require("../config")

app = require("../app")
router = express.Router()
# actions = for method in ["find", "findOne"]
#     [method, User[method]]

# console.log config.appPath("db/user.db")
retWithResponse = (res)->
    (data)->
        ret = data._data or data
        id = data.id or data._id or _.map(data, (item)-> item.id or item._id )
        res.json({result:ret, id:id})

utilRouter = require("../middlewares/util")
{getRequesetData} = utilRouter

restful = require("../middlewares/restful")
router.use('/api/*', utilRouter())
router.use "/api/restful/", restful(model:User),
    (req,res,next)-> res.ret(res.restData)

jsonrpc = require("../middlewares/jsonrpc")
router.use "/api/", jsonrpc(model:User, methods:["find","findOne","register"])
#
#
# api = Dispatcher.createAPI(User, ["find","findOne","register"])
# router.post '/api/:method', (req, res)->
#     method = req.params.method
#     # params = req.query or {}
#     # res.ret(res)
#     data = getRequesetData(req) or {}
#     # data = req.body or req.query
#     # console.log "params",params
#     api.call(method,data).then (data)->
#         # console.log "method #{method} then"
#         res.ret(data)
#     .fail (err)->
#         # console.log "method #{method} fail",err
#         res.status(400).retError(err)
router.get '/*', (req, res, next)->
    res.render('index', { title: 'Express' })

module.exports = router
