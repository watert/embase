config = {
    appPath: function(path){
        path = path||"";
        if(path.indexOf("/")!=0){ path = "/"+path; }
        return __dirname+path;
    }


}
console.log("__dirname",__dirname);
module.exports = config;
