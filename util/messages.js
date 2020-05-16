const moment=require("moment");
function formatMessgae(username,text){
return{
    username,
    text,
    time:moment().format('h:m a')
}
}


module.exports=formatMessgae;