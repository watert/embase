q = require('q')
express = require('express')
_ = require('underscore')
router = express.Router()



router.get '/', (req, res, next)->
    res.render('index', { title: 'Express' })
router.get '/codes/*', (req,res)->
    res.render("index")

# Single user actions
# router.get '/user/*', (req, res, next)->
#     if req.session.user then next()
#     else
ret = (res, data)->
    result = data._data or data
    id = data.id or data._id or _.map(data, (item)-> item.id or item._id )
    res.json({result:result, id:id})

User = require("../models/user")
router.get '/user/api/*', (req, res, next)->
    res.ret = (data)=>
        console.log this
        result = data._data or data
        id = data.id or data._id or _.map(data, (item)-> item.id or item._id )
        res.json({result:result, id:id})
        return res
    res.retError = (code,msg,data=null)=>
        # console.log @
        err = code:code, message:msg
        res.status(code).json(result:data, error:err)
        return res
    console.log "set res.ret"
    next()
router.get '/user/api', (req, res)->
    if req.session.user then res.json(req.session.user)
    else res.status(406).retError(406, "not logined")
router.post '/user/api/:action', (req,res)->
    act = req.params.action
    dfd = User[act](req.body)
    # console.log "action",act,User[act]
    if not User[act] then res.retError(500, "method #{act} not exists")
    q.when(dfd).then (data)->
        res.ret(data)
    .fail (data)->
        # console.log "fail data",data
        res.retError(400, "fail")
        # res.json(data)

router.get '/user/', (req, res, next)->
    res.render("index")


module.exports = router
