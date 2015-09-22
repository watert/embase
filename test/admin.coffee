{DBStore, assert, _, User, UserDoc} = require("./base")
# fs = require("fs")
# path = require("path")
# q = require("q")
# config = require("../app/config")
#
# dbStatus = ()->
#     dbPath = config.appPath("db/")
#     q.nfcall(fs.readdir, dbPath).then (data)->
#         dbs =_.filter(data, (path)-> path?.indexOf(".db") isnt -1)
#         dfds = _.map dbs, (fname)->
#             fpath = path.join(dbPath,fname)
#             q.nfcall(fs.stat, fpath).then (ret)->
#                 data = _.pick(ret,"mtime,ctime,size".split(","))
#                 data.path = fpath
#                 data.name = path.parse(fname).name
#                 return data
#         q.all(dfds)
describe "test admin special actions", ()->
    it "should get admin status", ->
        DBStore.dbStatus().then (data)->
            assert(data.length, "check has dbStatus")
    # res.ret(dbPath)
