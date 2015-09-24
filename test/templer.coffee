{DBStore, assert, _, User, UserDoc} = require("./base")

class Templer
    constructor:(tmpls)->
        if _.isString(tmpls) then tmpls = {index:tmpls}
        # if _.isObject(tmpls) then tmpls = {index:tmpls}
        @tmpls = tmpls
        return @makeMethod()
    makeInvoke:(tmpls)->
        invoke = (method, args...)->
            if _.isString(method)
                method = _.template(method)
            data = _.extend({},tmpls,args...)
            method(data)
    makeMethod:()->
        tmpls = _.extend({ invoke:@makeInvoke(tmpls) },@tmpls)
        mainTmpl = _.template(tmpls.index) if _.isString(tmpls.index)
        tmplMethod = (args...)=>
            # if tmplMethod._super
            #     console.log "has super", mainTmpl
            data = _.extend({args:args or []},tmpls,args...)
            mainTmpl(data)
        _.extend tmplMethod, tmpls,
            extend:(newTmpls)=>
                @extend(tmplMethod, newTmpls)
    extend:(tmplMethod, newTmpls)->
        newTmpls = _.extend({}, @tmpls, newTmpls)

        # make super
        _.each newTmpls, (tmpl, k)=>
            newTmpl = newTmpls[k]
            if superTmpl = @tmpls[k]
                newTmpl._super = (args...)=> @tmpls.invoke(superTmpl, args...)
        newTmpls._parent = @tmpls
        return new Templer(newTmpls)
templer = (tmpls)->
    return new Templer(arguments...)
templer.extend = (tmpls)->
    return templer(tmpls)
# templer.extend = ()->

describe "Templer", ->
    it "should work", ->
        tmpl = templer(index:"hello <%=world%>", world:"world")
        assert.equal(tmpl(), "hello world")
        newTmpl = tmpl.extend(world:tmpl.world+"2")
        assert.equal(newTmpl(), "hello world2")
    it "should context deliver to sub templer", ->
        tmpl = templer
            outsider: " [Outsider] "
            useInIndex: templer " <%=outsider%> "
            index:" <%=useInIndex({outsider:outsider})%> "
        assert(tmpl().indexOf("[Outsider]"), "should pass ctx to sub tmpl")
    it "should extend with super method", ->
        tmpl = templer({index: "hello world"}).extend
            index: "before <%=_parent.index%> after"
        assert.equal(tmpl(), "before hello world after", "should wrap with super")
    it "should invoke", ->
        tmpl = templer({index: "hello <%=invoke(name, {msg:'invokename'})%>", name:"<%=msg%>"})
        assert.equal(tmpl(), "hello invokename")
    it "should use args", ->
        tmpl = templer("<%=args.join('')%>")
        assert.equal(tmpl(1,2,3),"123","check use args")
    it "should use _super ", ->
        tmpl = templer({index: "hello <%=world%>"}).extend({index:"before <%=_super()%>"})
        assert.equal(tmpl(), "before hello")
