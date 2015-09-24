_ = require("underscore")
express = require("express")
q = require("q")
User = require("./models/user")

renderPage = (req,res)->
    res.json("render login page")

Auth = (options)->
    router = express.Router()
    router.get "/user",(req,res)->

    router.get("/", renderPage)
    router.get("/page", renderPage)
    return router

module.exports = Auth

### run directly, run as root router ###
if require.main is module
    app = express()
    app.use(Auth())
    server = app.listen 3000, ->
        console.log "Auth runs at 3000"
