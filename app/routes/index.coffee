q = require('q')
express = require('express')
_ = require('underscore')
router = express.Router()



# Front ends
router.get '/', (req, res, next)->
    res.render('index', { title: 'Express' })
router.get '/codes/*', (req,res)->
    res.render("index")
router.get '/user/', (req, res, next)->
    res.render("index")

# User APIs
User = require("../models/user")
api = require("../middlewares/api")

router.use('/user/api/*', api.retJSON())
rpcRouter = api.jsonrpc
    model: User
    events: "login": (req, res)->
        console.log "on login", res.data
        req.session.user = res.data

router.use '/user/api/', rpcRouter
    # res.ret(res.data or {})
router.delete '/user/api/:_id', (req, res)-> #注销
    User.remove({_id} = req.params).then (ret)=> res.ret(ret)
router.get '/user/api/', (req, res)->
    if user = req.session.user
        res.ret(user)
    else res.retError(406, "not logined")

articleAPI = api.restful(model:User.UserDoc)
router.use '/user/docs/article/', articleAPI


# router.post '/user/api/:action', (req,res)->
#     act = req.params.action
#     dfd = User[act](req.body)
#     if not User[act] then res.retError(500, "method #{act} not exists")
#     q.when(dfd).then (data)->
#         console.log act,"then data",data
#         req.session.user = data
#         res.ret(data)
#     .fail (data)->
#         res.retError(400, data)

# UserDoc

module.exports = router
