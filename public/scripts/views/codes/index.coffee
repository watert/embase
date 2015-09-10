define ["views/_base/view","tmpls/base","highlightjs"],(BaseView, tmpls)->
    console.log "hljs",hljs
    class CodesIndexView extends BaseView
        initialize:()->
            @loadCSS("../bower_components/highlightjs/styles/default.css")
        template: tmpls.extend
            indexBody:"""
                <pre><code class="coffeescript">
                a = -> 123
                </code></pre>
            """
        render: ->
            super()
            @$("code").each -> hljs.highlightBlock(@)
