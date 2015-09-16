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

router.all('/api/logout',(req,res)->
    req.session.destroy()
    res.json({message:"Logout successfully"})
    )
router.use('/api/', rpcRouter)
router.delete('/api/:_id', userRemove)
router.get('/api/',userInfo)
router.use('/docs/article/', articleREST)

multipart = require("connect-multiparty")(uploadDir:__dirname+"/../tmpfiles/")
router.use "/files/",multipart, api.restful
    model:User.UserFile
    parseData:(data)->
        user = @req.session.user
        # console.log "upload user", user
        data.user_id = user.id
        if files = @req.files then _.extend(data, files)
        # console.log "upload data",data
        return data
# router.post '/files/', multipart , (req,res)->
#
#     console.log "req.files",req.files, req.body
#     res.json("1")
router.use('/*', renderIndex)

module.exports = router
