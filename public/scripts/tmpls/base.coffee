define ["libs/templer"],(templer)->

    baseTemplates =
        templer: templer
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
