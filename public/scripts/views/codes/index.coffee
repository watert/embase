define ["views/_base/view","models/base", "tmpls/base","marked","highlightjs"
],(BaseView, BaseModel, tmpls, marked)->
    {Model, Collection} = BaseModel.generate(url: "/api/usercodes/")
    console.log "hljs",hljs
    class CodesIndexView extends BaseView
        initialize:()->
            super()
            @loadCSS("../bower_components/highlightjs/styles/default.css")
            # @setModel(markdown:@markdown)
            # # console.log "render markdown", @markdown
            # console.log "init", @model
        defaultModel:
            user:{}
        events:
            "click [data-href]":(e)->
                href = $(e.currentTarget).data("href")
                app.router.navigate(href,trigger:yes)
            "click .btn-expand-all": (e)->
                @$(".needs-readmore .btn-readmore").click()
            "click .btn-readmore": (e)->
                $(e.target).closest(".card").addClass("expand");
        template: tmpls.extend
            parse: (content)->
                arr = content.split("---")
                ret = _.map(arr, (text)-> marked(text))
                console.log ret
                return ret
                # arr.join("---")
            index: " <%=invoke(indexBody)%> "
            indexBody: """
                <div class="cards-title">
                    <div class="topbar">
                        <a data-href="codes/my/">My Codes</a>
                        <a data-href="codes/">Explore</a>
                    </div>
                    <div class="title-body"></div>
                    <div class="actions">
                        <div> @<%-user.name%> </div>
                        <% if(user_id == app.user._id){%>
                            <div class="btn-link" data-href="codes/edit/?id=<%-_id%>">
                                <i class="fa fa-edit"></i>Edit</div>
                        <%} %>
                        <div class="btn-expand-all"> Expand all <i class="fa fa-angle-down"></i> </div>
                    </div>
                </div>
                <div class="cards">
                    <% _.each(parse(content),function(html){ %>
                        <div class="card">
                            <div class="content"><%=html%></div>
                            <div class="btn-readmore"> Readmore </div>
                        </div>
                    <% });%>
                </div>
            """
            marked:marked
        render: ->
            query = app.util.deparamQuery(location.search.slice(1))
            if query.id
                @model = new Model(_id:query.id)
                @model.fetch().then =>
                    console.log "@model",@model
                    super()
                    @renderContent()
            else
                @model ?= content:"Not found\n=======", user:{}, user_id:null, _id:null
                super()
                @renderContent()
        renderContent:()->

            @$("code").each -> hljs.highlightBlock(@)
            $title = @$(".card").first().appendTo(@$(".cards-title .title-body"))
            $title.removeClass("card").find(".btn-readmore").remove()
            @renderCards()

        renderCards:()->
            @$(".card").each (i)->
                $card = $(@)
                console.log i,$card.html()
                $last = $card.children(".content");
                lastPosBottom = $last.height()+$last.position().top-$card.position().top
                if lastPosBottom > $card.height() and $card.height()>200
                    $card.addClass("needs-readmore")
