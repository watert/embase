require.config({
    baseUrl: "scripts",
    paths: {
        jquery:"../bower_components/jquery/dist/jquery.min",
        underscore:"../bower_components/underscore/underscore-min",
        backbone:"../bower_components/backbone/backbone-min",
        chai:"../bower_components/chai/chai",
        fastclick:"../bower_components/fastclick/lib/fastclick",
        "iscroll":"../bower_components/iscroll/build/iscroll",
        "iscroll-lite":"../bower_components/iscroll/build/iscroll-lite",
        "highlightjs":"../bower_components/highlightjs/highlight.pack.min"
    },
    shim:{
        backbone: ["underscore","jquery"],
        iscroll:{
            exports:"IScroll"
        }
    }
});
