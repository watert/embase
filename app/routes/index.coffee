q = require('q')
express = require('express')
_ = require('underscore')
router = express.Router()


User = require("../models/user")
{restful, jsonrpc, retJSON} = require("../middlewares/api")
class UserCodes extends User.UserDoc
    @store: "usercodes"
restfulCodes = restful
    model:UserCodes
    # parseReturn: (data)-> _.omit(data,"password")
router.use("/api/usercodes/", restfulCodes)



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

module.exports = router
