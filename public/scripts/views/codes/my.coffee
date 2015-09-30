define ["views/_base/view","views/codes/tmpls", "models/base", "marked"
],(BaseView, tmpls, BaseModel, marked)->
    console.log BaseModel
    {Model, Collection} = BaseModel.generate(url: "/api/usercodes/")
    class MyCodesView extends BaseView
        initialize:()->
            if not DATA.user?._id
                redirect = encodeURIComponent(location.href)
                loginUrl = "usercenter/?redirect=#{redirect}"
                location.href = loginUrl

        model:{}
        render:()->
            @collection = new Collection
            @collection.fetch().then =>
                list = @collection.toJSON()
                console.log @collection
                _.each list,(row)->
                    row.link = "codes/?id="+row._id
                    row.digest = marked.parse(row.content.split("---")[0]).replace(/h1/g,"h2")
                @model.list= list
                super(arguments...)
        events:
            "click [data-href]":(e)->
                href = $(e.currentTarget).data("href")
                app.router.navigate(href,trigger:yes)

            "click .btn-edit":(e)->
                $row = $(e.target).closest(".row")
                id = $row.data("id")
                url = "codes/edit/?id=#{id}"
                app.router.navigate(url, trigger:yes)
                # model = @collection.findWhere({_id: $row.data("id")})


            "click .btn-delete":(e)->
                if not confirm("sure to delete?") then return
                $row = $(e.target).closest(".row")
                model = @collection.findWhere({_id: $row.data("id")})
                model.destroy().then ->
                    $row.fadeOut 300,-> $row.remove()

            "click .btn-add":()->
                app.router.navigate("codes/edit",trigger:yes)
        template: tmpls.extend
            codeRow: """
                <div class="row" data-id="<%-row._id%>">
                    <div class="digest" data-href="<%-row.link%>">
                        <%=row.digest %>
                    </div>
                    <div class="actions">
                        <a data-href="<%-row.link%>" class="btn-link btn-view"> <i class="fa fa-eye"></i>View </a>
                        <span class="btn-link btn-edit"> <i class="fa fa-edit"></i>Edit </span>
                        <span class="btn-link btn-delete"> <i class="fa fa-trash"></i>Delete </span>
                    </div>
                </div>
            """
            index: """
                <%=invoke(pageTopbar, {title:"My Codes"})%>
                <div class="codes">
                    <% _.each(list, function(row){ %>
                        <%=invoke(codeRow, {row:row})%>
                    <% })%>
                </div>
            """
