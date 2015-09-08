define ["views/modelview","tmpls/base"],(ModelView, baseTmpls)->
    {navbar, toolbar, templer} = baseTmpls
    class List extends ModelView
        tagName:"div"
        events:
            "click .btn-edit":()->
                @$(".list").toggleClass("editing")
            "click .editing .list-item": (e)->
                # return if not @$el.hasClass("editing")
                $item = $(e.currentTarget)
                $item.find("[type=checkbox]").click()
        render:()->
            $.get("/users/api/find").then (data)=>
                @setModel(users:data)
                console.log @template._context.onRender
                super()
        #     @$el.html(@tmpl(data:[1,2,3]))
        template: templer
            index: """
                <%=navbar()%>
                <ul class="list">
                    <%_.each(users, function(item){%>
                        <%=listItem({data:item})%>
                    <%})%>
                </ul>
                <%=toolbar()%>
            """
            onRender:()->
            toolbar: toolbar
            navbar: navbar.extend
                title:"Users"
                right:"""
                    <div class="btn btn-edit">Edit</div>
                """
            listItemBody: templer """
                <div class="item-body" data-id="<%=_id%>">
                <%=name%> <small> (<%=email%>) </small>
                </div>
            """
            listItem: templer """
                <li class="list-item">
                    <div class="list-check">
                        <input type="checkbox" name="check[<%=data._id%>]" id="" />
                    </div>
                    <%=listItemBody(data)%>
                    <div class="arrow"> <i class="fa fa-angle-right"></i> </div>
                </li>
            """
