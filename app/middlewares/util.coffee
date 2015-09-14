_ = require("underscore")
# express = require("express")
# router = express.Router()
util = (options)->
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
util.getRequesetData = (req)->
    method = req.method
    if method is "GET" then return req.query
    else return req.body
module.exports = util
