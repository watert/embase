define ["libs/modelview","libs/util"],(ModelView, util)->
	class BaseView extends ModelView
		initialize:(options={})->
			@query = options.query
			super(arguments...)
		navigateWithQuery:(link, query)->
			if -1 is link.indexOf("?") then link += "?"
			else link += "&"
			link = link + $.param(query)
			app.router.navigate(link, {trigger:yes})
		navigate: (link)->
			app.router.navigate(link, {trigger:yes})
