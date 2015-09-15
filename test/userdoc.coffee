{DBStore, assert, _, User, UserDoc} = require("./base")


fs = require('fs')
path = require('path')
q = require("q")
class UserFile extends UserDoc
    @store: "userfiles"

    save:(data=null)->
        data ?= @_data
        source = data.file
        fname = path.basename(source)
        extname = path.extname(fname)
        target = (id)->"#{__dirname}/../public/uploads/#{id}.#{extname}"
        q.when()
        .then ()->
            q.nfcall(fs.stat, source)
        .then (info)=>
            fdoc = {fname:fname, extname:extname, path:target}
            stat = _.pick(info, "mtime", "size", "ctime")
            fdoc = _.extend(fdoc, data, stat)
            delete data.file
            super(fdoc)
        .then (doc)->
            console.log "save doc",doc
            q.nfcall(fs.rename, source, target(doc.id, extname))

describe "Other Doc with User", ->
    user_data = name:"test_user_doc", email:"test_user_doc@x.com", password:"testuserdoc"
    user = null
    before "Create User", ->
        User.register(user_data).then (_user)-> user = _user
    describe "User Doc Base", ->
        it "should fail create a doc without user", ->
            doc = new UserDoc(title:"hello")
            doc.save().fail (data)->
                assert(data.error.code is 400, "check must have user with userdoc")

        it "should create a doc with user owns it", ->
            # console.log UserDoc
            doc = new UserDoc(user:user, title:"hello")
            doc.save().then (data)->
                assert.equal(doc.get("title"), "hello")
        it "should fetch by user", ->
            UserDoc.find(user_id:user.id).then (data)->
                assert(data[0].user_id is user.id,"check find user doc only")
                # assert(data.length, "should find userdocs")
    describe "User Files ", ->
        it "should upload file", ->


            source = "#{__dirname}/testfile.txt"
            fs.writeFileSync(source, "hello "+(new Date).getTime())

            ufile = new UserFile(file: source,user:user)
            ufile.save().then (fdoc)->
                console.log fdoc
            # fdoc = {fname:fname}
            # q.nfcall(fs.stat, source).then (info)->
            #     fdoc = {fname:fname, ext:path.extname(fname)}
            #     stat = _.pick(info, "mtime", "size", "ctime")
            #     return _.extend(fdoc, stat)
            # .then (fdoc)->
            #     q.nfcall(fs.rename, source, target)
            # .then ->
            #     q.nfcall(fs.stat, target)
        it "should list file"
        it "should list images file"
        it "should delete file"
    after "Remove User", -> user.remove()
