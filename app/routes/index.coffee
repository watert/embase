q = require('q')
express = require('express')
_ = require('underscore')
router = express.Router()

Init = (options)->
    {app} = options
    UserDoc = require("../models/user.coffee").UserDoc
    findUsers = (ids)->
        app.User.find({_id:{$in:ids}}).then (docs)->
            return _.map docs,(user)-> _.omit(user,"password")

    {restful, jsonrpc, retJSON} = require("../middlewares/api.coffee")
    class UserCodes extends UserDoc
        @store: "usercodes"
    restfulCodes = restful
        model:UserCodes
        parseReturn:(docs)->
            console.log "parseReturn",docs
            if uid = docs.user_id #single
                return findUsers([uid]).then (users)->
                    docs.user = users?[0]
                    return docs
            return docs
    # console.log "app.User",app.User
        # parse: (data)-> _.omit(data,"password")
    injectUser = (req,res,next)->
        if req.method isnt "GET"
            req.body.user_id = req.user?.id
        next()
    router.use("/api/usercodes/",injectUser, restfulCodes)

    crypto = require("crypto")
    md5 = (_str)->
        crypto.createHash('md5').update(_str).digest('hex')
    getPageData = (req)->
        user = req.user?._data or null
        if email = user?.email then user.emailHash = md5(email)
        data = user: req.user?._data or null
        return data
    router.use (req,res,next)-> # for user info in pageData
        user = req.user?._data or null
        if email = user?.email
            user.emailHash = md5(email)
            user.avatar = "http://www.gravatar.com/avatar/#{user.emailHash}?s=80"
        data = user: req.user?._data or null
        req.pageData = data
        next()
    router.get '/*', (req, res)->
        res.render('index', { title: 'Express', data:req.pageData})

    _.extend router, {getPageData}
    return router

module.exports = Init
