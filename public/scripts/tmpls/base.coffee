define ["libs/templer"],(templer)->

    base =
        templer: templer
        toolbar: templer
            items: ["Delete","Mark"]
            itemTmpl: templer """
                <div class="toolbar-item">
                    <div class="btn"><%=name%></div>
                </div>
            """
            index:"""
                <div class="toolbar">
                    <div class="toolbar-inner">
                    <% _.each(items, function(item){ %>
                        <%=itemTmpl({name:item})%>
                    <% });%>
                    </div>
                </div>
            """

        navbar: templer
            left: ""
            right: "Right"
            title: "Navbar"
            index: """
                <div class="navbar">
                    <div class="navbar-inner">
                        <div class="navbar-left">
                            <%=left%>
                        </div>
                        <div class="navbar-title">
                            <%=title%>
                        </div>
                        <div class="navbar-right">
                            <%=right%>
                        </div>
                    </div>
                </div>
            """
