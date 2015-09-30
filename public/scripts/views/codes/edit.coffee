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
            super()
        events:
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
                    @model = title:"Edit"
                    doc = new Model(_id:query.id)
                    return doc.fetch().then =>
                        @model.doc = doc.toJSON()
                else return @model =
                    title: "Add Content"
                    doc: defaultDoc
            .then =>
                console.log "render",@model
                super(arguments...)
                CodeMirror.loadMode("markdown").then =>
                    CodeMirror.fromTextArea(@$("textarea")[0], mode:"markdown")
            # if query.id
            # else
            #
            # @model ?= {}
            # if not @model.id
            # else
            #     @model.title = "Edit"
            # console.log @model

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
                <%=invoke(editor,{doc:doc})%>
            """
