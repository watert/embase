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
getRequesetData = (req)->
    method = req.method
    if method is "GET" then return req.query
    else return req.body
router.all "/api/restful/:id?", (req, res)->
    method = req.method
    id = req.params.id

    data = getRequesetData(req)
    ret = retWithResponse(res)

    if not id # collection op
        if method is "GET" then User.find(data).then(ret)
        if method is "POST" # Create
            (new User(data)).save().then(ret)
    else
        User.findOne(_id:id).then (user)->
            if method is "GET" then return user # Update
            if method is "PUT" then return user.save(data) # Update
            if method is "DELETE" # Delete
                user.remove().then (num)-> {_id: id, deleted:yes}
        .then(ret)

api = Dispatcher.createAPI(User, ["find","findOne","register"])
router.all '/api/:method', (req, res)->
    method = req.params.method
    # params = req.query or {}
    ret = retWithResponse(res)
    data = getRequesetData(req) or {}
    # data = req.body or req.query
    # console.log "params",params
    api.call(method,data).then (data)->
        console.log "method #{method} then"
        ret(data)
    .fail (err)->
        console.log "method #{method} fail",err
        res.status(400).json(err)
router.get '/*', (req, res, next)->
    res.render('index', { title: 'Express' })

module.exports = router
