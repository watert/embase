config = {
    appPath: function(path){
        path = path||"";
        if(path.indexOf("/")!=0){ path = "/"+path; }
        return __dirname+path;
    }


}
module.exports = config;
