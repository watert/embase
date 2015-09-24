_ = require("underscore")
express = require("express")
q = require("q")
User = require("./models/user")
ejs = require("ejs")
path = require("path")
fs = require('fs')

renderTemplate = (filename, data)->
    filePath = path.join(__dirname,filename)
    file = fs.readFileSync(filePath, 'utf8')
    tmpl = ejs.compile(file, cache:yes, filename:"indexview")
    return tmpl(data)
renderPage = (req,res)->
    html = renderTemplate("indexview.ejs",{title:"Common Auth"})
    res.type("html").send(html)

Auth = (options)->
    router = express.Router()
    router.get "/user",(req,res)->
        res.json "/user"
    router.use("/public",express.static(path.join(__dirname, './public')));
    router.get("/", renderPage)
    router.get("/page", renderPage)
    return router


### run directly, run as root router ###
if require.main is module
    app = express()
    server = app.listen(3000)
    module.exports = server
    app.use(require('body-parser').json())
    app.use(require('compression')());

    app.use(Auth())

else
    module.exports = Auth
