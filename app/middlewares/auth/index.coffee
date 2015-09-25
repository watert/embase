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
    # return res.json(req.url)
    data = _.pick(req,"baseUrl")
    _.extend(data, {title:"Common Auth"})
    html = renderTemplate("indexview.ejs",data)
    res.type("html").send(html)

Auth = (options)->
    router = express.Router()


    router.get "/user",(req,res)->
        res.json "/user"
    router.use("/public",express.static(path.join(__dirname, './public')));
    router.get "/test", (req,res)->
        html = renderTemplate("views/index.ejs",{baseUrl:req.baseUrl})
        res.type("html").send(html)
    router.get("/page", renderPage)

    # APIs
    router.use "/api", (req,res,next)->
        res.retFail = (err)->
            res.status(err.error.code).json(err)
        res.ret = (ret)->
            delete ret._data["password"]
            res.json(data:ret._data)
        res.retPromise = (promise)->
            promise.then(res.ret).fail(res.retFail)
        next()
    sessionAuth = (req,res,next)->
        uid = req.session.user?.id
        console.log "sessionAuth", uid
        if not uid
            res.retFail(error:{code:401, msg:"unauthorized"})
        else
            User.findByID(uid).then (user)->
                req.user = user
                next()
    router.delete "/api/", sessionAuth, (req,res)->
        req.user.remove().then((ret)-> {_data:ret})
            .then(res.ret)
    router.get "/api/", sessionAuth, (req,res)->
        res.ret(req.user)
    router.put "/api/", sessionAuth, (req,res)->
        res.retPromise req.user.set(_.omit(req.body, "_id")).save()

    # Actions
    router.post "/api/profile", sessionAuth, (req,res)->
        res.ret(req.user)
    router.post "/api/login", (req,res)->
        res.retPromise User.login(req.body).then (ret)->
            req.session.user = ret
            return ret
    router.post "/api/register", (req,res)->
        res.retPromise User.register(req.body)
    return router


### run directly, run as root router ###
if require.main is module
    app = express()
    server = app.listen(3000)
    console.log("listen 3000")
    module.exports = server
    app.use(require('body-parser').json())
    app.use(require('body-parser').urlencoded({ extended: false }))
    app.use(require('cookie-parser')());
    app.use(require('compression')());
    session = require('express-session')
    app.use(session({secret:"embase",resave:true, saveUninitialized:false}));
    logger = require('morgan')
    app.use(logger('dev'));
    app.use("/auth",Auth())

else
    module.exports = Auth
