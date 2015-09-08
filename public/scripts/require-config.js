require.config({
    baseUrl: "scripts",
    paths: {
        jquery:"../bower_components/jquery/dist/jquery.min",
        underscore:"../bower_components/underscore/underscore-min",
        backbone:"../bower_components/backbone/backbone-min",
        fastclick:"../bower_components/fastclick/lib/fastclick"
    },
    shim:{
        backbone: ["underscore","jquery"]
    }
});
