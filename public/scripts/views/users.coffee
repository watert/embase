define ["backbone","libs/templer"],(Backbone, templer)->
    class List extends Backbone.View
        tagName:"div"
        render:()->
            @$el.html(@tmpl(data:[1,2,3]))
        tmpl: templer
            listItemBody: """
            """
            listItem: templer """
                <li class="item"> Item </li>
            """
            index: """
                <ul class="list">
                    <%_.each(data, function(item){%>
                        <%=listItem(item)%>
                    <%})%>
                </ul>
            """
