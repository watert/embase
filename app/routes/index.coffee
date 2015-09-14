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

# Single user actions
# router.get '/user/*', (req, res, next)->
#     if req.session.user then next()
#     else
# ret = (res, data)->
#     result = data._data or data
#     id = data.id or data._id or _.map(data, (item)-> item.id or item._id )
#     res.json({result:result, id:id})

User = require("../models/user")
{retJSON} = require("../middlewares/util")
router.use('/user/api/*', retJSON())

router.delete '/user/api/:_id', (req, res)-> #注销
    User.remove({_id} = req.params).then (ret)=> res.ret(ret)
router.get '/user/api/', (req, res)->
    if req.session.user then res.ret(req.session.user)
    else res.status(406).retError(406, "not logined")
router.post '/user/api/:action', (req,res)->
    act = req.params.action
    dfd = User[act](req.body)
    if not User[act] then res.retError(500, "method #{act} not exists")
    q.when(dfd).then (data)->
        console.log act,"then data",data
        req.session.user = data
        res.ret(data)
    .fail (data)->
        res.retError(400, data)

# UserDoc

module.exports = router
