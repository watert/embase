define ["views/_base/view","views/codes/tmpls", "models/base","codemirror"
],(BaseView, tmpls, BaseModel, CodeMirror)->
    console.log CodeMirror
    window.CodeMirror = CodeMirror
    CodeMirror.loadMode = (modes...)->
        dfd = $.Deferred()
        modes = _.map modes, (mode)->
            url = "libs/codemirror/mode/#{mode}/#{mode}"
        console.log "modes", modes
        require modes,->
            dfd.resolve()
        return dfd
    {Model, Collection} = BaseModel.generate(url: "/api/usercodes/")


    defaultDoc =
        _id:null
        content: """
            Title
            =====
            Basic Description\n
            ---\n
            ## First Card

            Content
        """
    class MyCodesView extends BaseView
        initialize:()->
            console.log "initialize"
            @loadCSS("bower_components/codemirror/lib/codemirror.css")
            @loadCSS("//cdn.jsdelivr.net/font-hack/2.015/css/hack.min.css")
            super()
        events:
            "click [data-href]":(e)->
                href = $(e.currentTarget).data("href")
                app.router.navigate(href,trigger:yes)
            "submit":(e)->
                e.preventDefault()
                formData = app.util.deparamQuery(@$("form").serialize())
                formData._id = @model.id
                model = new Model(formData)
                model.save().then ->
                    console.log model.toJSON()

                console.log formData

                # app.router.navigate("codes/edit",trigger:yes)
        render:()->
            query = app.util.deparamQuery(location.search.slice(1))
            $.when do ()=>
                if query.id
                    @model = title:"Edit", id: query.id, error:null
                    doc = new Model(_id:query.id)
                    return doc.fetch().then =>
                        @model.doc = doc.toJSON()
                else return @model =
                    title: "Add Content"
                    error:null
                    doc: defaultDoc
            .then =>
                console.log "render",@model
                super(arguments...)
                CodeMirror.loadMode("markdown").then =>
                    CodeMirror.fromTextArea(@$("textarea")[0], mode:"markdown")
            .fail (err)=>
                console.log "fail",err
                @model = title:"Error", error:"not found"
                super(arguments...)
        template: tmpls.extend
            editor: """
                <form action="">
                    <div data-id="<%-doc.id%>">
                        <textarea name="content" cols="30" rows="10"><%=doc.content%></textarea>
                        <div class="actions container">
                            <button class="btn btn-save">Save</button>
                        </div>
                    </div>
                </form>
            """
            index: """
                <%=invoke(pageTopbar,{title:title})%>
                <% if(error){%>
                    <div class="container"><br /><%-error%></div>

                <%}else {%>
                    <%=invoke(editor,{doc:doc})%>
                <%}%>
            """
