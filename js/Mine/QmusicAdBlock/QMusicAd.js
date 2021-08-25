/*
 * 原作者：app2smile
 * QQ音乐开屏广告
 * ^https\:\/\/us\.l\.qq\.com\/exapp
 * 仅surge
 */
let url = $request.url;
let method = $request.method;
let body = JSON.parse($response.body);

let notifiTitle = "qq音乐去广告脚本错误";
let getMethod = "GET";
let postMethod = "POST";

if (url.indexOf('us.l.qq.com/exapp?') != -1 && method == getMethod) {
    console.log('qq音乐-开屏页');
    if (body.data === undefined) {
        console.log("body:" + $response.body);
        $notification.post(notifiTitle, "qq音乐-开屏页", "data字段错误");
    } else {
        let dataObj = body.data;
        console.log("body:" + dataObj)
        let count = 0;
        for (const k in dataObj) {
            let listObj = dataObj[k].list;
            console.log("dataobj:" + dataObj[k].list)
            for (let i = 0; i < listObj.length; i++) {
                if (listObj[i].is_empty === undefined) {
                    console.log("body:" + $response.body);
                    $notification.post(notifiTitle, "qq音乐-开屏", "is_empty字段错误");
                    break;
                }
                if (listObj[i].is_empty === 0) {
                    listObj[i].is_empty = 1;
                    count++;
                }
            }
        }
        // 冷启动有一条广告 热启动有多条
        console.log('成功count:' + count);
    }
} else {
    $notification.post(notifiTitle, "路径/请求方法匹配错误:", method + "," + url);
}

body = JSON.stringify(body);

$done({
    body
});