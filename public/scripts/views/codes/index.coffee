define ["views/_base/view","tmpls/base","marked","highlightjs"
],(BaseView, tmpls,marked)->
    console.log "hljs",hljs
    class CodesIndexView extends BaseView
        initialize:()->
            super()
            @loadCSS("../bower_components/highlightjs/styles/default.css")
            @setModel(markdown:@markdown)

            console.log "init", @model
        markdown: """
            <h1> Frontend Cheatsheet</h1>

            Things about frontend coding
            ---
            ### HTML5 Viewport
            ```html
            <meta name="viewport" content="width=device-width,
                user-scalable=no, initial-scale=1.0,
                maximum-scale=1.0, minimum-scale=1.0" />
            ```
            ---
            ### CSS3 Media
            ```css
            // print version
            @media print {}
            // screen and size
            // comment: iphone 6p width 414px, iphone 6 375px
            @media only screen and (max-width: 414px){}
            @media only screen and (min-width: 421px)
                and (max-width: 800px){}
            // orientation
            @media only screen and (orientation: portrait){}
            @media only screen and (orientation: landscape){}
            ```
        """
        template: tmpls.extend
            parse: (content)->
                arr = content.split("---")
                _.map(arr, (text)-> marked(text))
                # arr.join("---")
            index:" <%=invoke(indexBody)%> "

            indexBody:"""
                <div class="cards-title">
                    <div class="title-body"></div>
                </div>
                <div class="cards">
                    <% _.each(parse(markdown),(html)=>{ %>
                        <div class="card">
                            <%=html%>
                        </div>
                    <% });%>
                </div>
            """
            marked:marked
        render: ->
            super()
            @$("code").each -> hljs.highlightBlock(@)
            @$(".card").first().appendTo(@$(".cards-title .title-body")).removeClass("card")
