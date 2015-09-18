define ["libs/modelview","libs/util","tmpls/base"],(ModelView, util, baseTmpl)->
	class BaseView extends ModelView
		loadCSS:(url)->
			$dom = $("<link>",{href:url, rel:"stylesheet"}).appendTo($("head"))
			@on "remove", -> $dom.remove()
		initialize:(options={})->
			@query = options.query
			@options = options
			super(arguments...)
		setQuery:(query, options={})->
			_.defaults(options, trigger:no)
			path = @options.path
			link = path+"?"+$.param(query)
			@query = query
			app.router.navigate(link, options)
			return @
		navigateWithQuery:(link, query)->
			if -1 is link.indexOf("?") then link += "?"
			else link += "&"
			link = link + $.param(query)
			app.router.navigate(link, {trigger:yes})
		navigate: (link)->
			app.router.navigate(link, {trigger:yes})
		template: baseTmpl.extend
			index: "Base View"
	splitViewTmpl = baseTmpl.extend
		detail:"Empty"
		master:""
		# detailNavbar:baseTmpl.navbar.extend
		# 	title:"Detail"
		# masterNavbar:baseTmpl.navbar.extend
		# 	title:"Master"
		index:"""
				<div class="view-master">
					<div class="body"><%=invoke(master)%></div>
				</div>
				<div class="view-detail">
					<div class="body"></div>
				</div>
		"""

	class SplitView extends BaseView
		className:"splitview"
		initialize:(options)->
			super(arguments...)
		render:()->
			super(arguments...)
			@renderDetail()
		showDetail:()->
			# @renderDetail(tmplName)
			@$el.addClass("show-detail")
		renderDetail:(tmplName="detail", data={})->
			tmpl = @template.invoke(@template[tmplName], data)
			@$(".view-detail .body:eq(0)").empty().append(tmpl)

		template: splitViewTmpl
	_.extend(BaseView, {SplitView, baseTmpl, splitViewTmpl})
	return BaseView
