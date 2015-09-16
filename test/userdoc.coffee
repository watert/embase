{DBStore, assert, _, User, UserDoc} = require("./base")

console.log "# userdoc tests"

fs = require('fs')
path = require('path')
q = require("q")
class UserFile extends UserDoc
    @store: "userfiles"
    remove:()->
        q.nfcall(fs.unlink, @get("path")).then =>
            super()
    save:(data=null)->
        data ?= @_data
        source = data.file
        if data.path and not source
            @set(data)
            return super()
        fname = path.basename(source)
        extname = path.extname(fname).slice(1)
        getUrl = (id)-> "uploads/#{id}.#{extname}"
        getTarget = (id)-> "#{__dirname}/../public/#{getUrl(id)}"
        q.nfcall(fs.stat, source)
        .then (info)=>
            fdoc = {fname:fname, extname:extname}
            stat = _.pick(info, "mtime", "size", "ctime")
            fdoc = _.extend(fdoc, data, stat)
            @set(fdoc)
            @omit("file")
            super()
        .then (doc)=>
            id = doc.id
            assert.isString(id, "has id")
            target = getTarget(id)
            url = getUrl(id)
            # console.log "shit"
            @set(path:target, url:url)
            super()
        .then (doc)->
            q.nfcall(fs.rename, source, getTarget(doc.id))

describe "Other Doc with User", ->
    user_data = name:"user_doc2", email:"user_doc2@x.com", password:"testuserdoc"
    user = null
    before "Create User", ->
        User.remove({}, multi:yes).then ->
            User.register(user_data).then (_user)->
                user = _user

    describe "User Doc Base", ->
        it "should fail create a doc without user", ->
            doc = new UserDoc(title:"hello")
            doc.save().fail (data)->
                assert(data.error.code is 400, "check must have user with userdoc")

        it "should create a doc with user owns it", ->
            doc = new UserDoc(user:user, title:"hello")
            doc.save().then (data)->
                assert.equal(doc.get("title"), "hello")
        it "should fetch by user", ->
            UserDoc.find(user_id:user.id).then (data)->
                assert(data[0].user_id is user.id,"check find user doc only")
                # assert(data.length, "should find userdocs")
        it "should update", ->
            doc = new UserDoc(user:user, title:"hello")
            doc.save().then (data)->
                doc.set({"title":"helloxx"}).save()
            .then ->
                assert.equal(doc.get("title"),"helloxx","check update userdoc")

    describe "User Files ", ->
        createFile = (ext="txt")->
            source = "#{__dirname}/testfile.#{ext}"
            fs.writeFileSync(source, "hello "+(new Date).getTime())
            return source
        it "should upload file", ->
            source = createFile()
            ufile = new UserFile(file: source,user:user)
            ufile.save()
        it "should list file", ->
            source = createFile("md")
            ufile = new UserFile(file: source,user:user)
            ufile.save().then ->
                UserFile.find(user_id:user.id).then (data)->
                    assert(data.length)
        it "should list with ext filter", ->
            UserFile.find(user_id:user.id, extname:"md").then (data)->
                assert(data.length)
        it "should update file", ->
            source = createFile("md")
            ufile = new UserFile(file: source, user:user)
            ufile.save().then ()->
                ufile.set({"title":"hello world"}).save()
            .then ->
                assert.equal(ufile.get("title"), "hello world")
        it "should delete file", ->
            ufile = new UserFile(file: createFile("md"),user:user)
            ufile.save().then ()->
                ufile.remove()
        after "Remove User", ->
            UserFile.find(user_id:user.id).then (data)->
                # return yes
                dfd = q.when()
                q.when _.map data, (item)->
                    dfd = dfd.then -> (new UserFile(item)).remove()
                return dfd
            .then ->
                user.remove()
    return q.when(1)
