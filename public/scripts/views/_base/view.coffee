define ["libs/modelview","libs/util"],(ModelView, util)->
	class BaseView extends ModelView
		loadCSS:(url)->
			$dom = $("<link>",{href:url, rel:"stylesheet"}).appendTo($("head"))
			@on "destroy", -> $dom.remove()
		initialize:(options={})->
			@query = options.query
			@options = options
			super(arguments...)
		setQuery:(query, options={})->
			_.defaults(options, trigger:no)
			path = @options.path
			link = path+"?"+$.param(query)
			app.router.navigate(link, options)
		navigateWithQuery:(link, query)->
			if -1 is link.indexOf("?") then link += "?"
			else link += "&"
			link = link + $.param(query)
			app.router.navigate(link, {trigger:yes})
		navigate: (link)->
			app.router.navigate(link, {trigger:yes})
