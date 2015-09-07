require ["app","jquery"],(App, $)-> $ ->
    console.log $("body")
    window.app = app = new App({
        el:$("body")[0]
    });

    console.log('Application is loaded!!');
