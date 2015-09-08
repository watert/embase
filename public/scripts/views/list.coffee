define ["backbone","libs/templer"],(Backbone, templer)->
    class List extends Backbone.View
        temper = require("../libs/temper")
        tagName:"div"
        tmpl: temper
            listItemBody: """
            """
            listItem: """
                <li class="item"> Item </li>
            """
            index: """
                <ul class="list">
                    <%_.each(data, function(item){%>
                        <%=listItem(item)%>
                    <%})%>
                </ul>
            """
