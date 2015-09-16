express = require('express')
_ = require("underscore")
User = require("../models/user")
api = require("../middlewares/api")
router = express.Router()
crypto = require("crypto")
rpcRouter = api.jsonrpc
    model: User
    events: "login": (req, res)->
        console.log "on login", res.data
        req.session.user = res.data


articleREST = api.restful
    model:User.UserDoc
    parseData:(data)->
        user = @req.session.user
        if not user then return {error:{message:"not logined", code:406}}
        if data.user_id and data.user_id != user.id
            return {error:{message:"not your doc", code:406}}
        _.extend({}, data, {user_id:user.id})


md5 = (_str)->
    crypto.createHash('md5').update(_str).digest('hex')
userRemove = (req,res)->
    User.remove({_id} = req.params).then(res.ret)
userInfo = (req,res)->
    if user = req.session.user
        user._data.emailHash = md5(user._data.email)
        res.ret(user)
    else
        res.retError(406, "not logined")
renderIndex = (req,res)->
    res.render("index")

router.use('/api/', rpcRouter)
router.delete('/api/:_id', userRemove)
router.get('/api/',userInfo)
router.get('/api/logout',(req,res)->

    )
router.use('/docs/article/', articleREST)
router.use('/*', renderIndex)

module.exports = router
