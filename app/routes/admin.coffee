express = require('express')
_ = require('underscore')
User = require("../models/user")
Dispatcher = require("../../public/scripts/libs/action-dispatcher")
config = require("../config")

app = require("../app")
router = express.Router()

class AdminDocModel extends require("../models/db").BaseDoc
class UserArticle extends AdminDocModel
    @store: "userdocs"
class UserFile extends AdminDocModel
    @store: "userfiles"
{restful, jsonrpc} = require("../middlewares/api")
# router.use('/api/*', utilRouter())
router.use "/api/users/", restful(model:User, parseReturn:(data)-> _.omit(data,"password"))
router.use "/api/users/", jsonrpc(model:User)
router.use "/api/articles/", restful(model:UserArticle)

router.get '/*', (req, res, next)->
    res.render('index', { title: 'Express' })

module.exports = router
