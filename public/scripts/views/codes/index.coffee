define ["views/_base/view","tmpls/base"],(BaseView, tmpls)->
    class CodesIndexView extends BaseView
        template: tmpls.extend
            indexBody:'codes'
