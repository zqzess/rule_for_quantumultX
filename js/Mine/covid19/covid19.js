/*
 * 本脚本旨在获取某个城市最新疫情信息，支持surge(panel,cron),QuantumultX,Loon,Nodejs
 * @author: zqzess
 * 仓库地址：https://github.com/zqzess/rule_for_quantumultX
 * 点击通知可以跳转最新新闻网页，通过boxjs切换城市
 * 感谢@Peng-YM提供的OpenAPI
 * 定时任务添加： 0 7,10 * * * https://raw.githubusercontent.com/zqzess/rule_for_quantumultX/master/js/Mine/covid19/covid19.js
 * surge panel面板添加详情见仓库
 * loon 插件添加详情见仓库
 */
const $ = API('covid19', true) // 打开debug环境，打开所有log输出
const {isQX, isLoon, isSurge, isScriptable, isNode} = ENV()
if(!isScriptable)
{
    $.city = $.read('covid19_city')
    $.isNotify = $.read('covid19_isNotify')
}
let cityyq = '南京疫情'
if ($.city !== "" && $.city !== null && $.city !== undefined)
    cityyq = $.city.replace('市', '') + '疫情'
if ($.isNotify === undefined)
    $.isNotify = 'true'
let cityencode = encodeURIComponent(cityyq)
let url = 'https://opendata.baidu.com/data/inner?resource_id=5653&query='
let info = []
let body = {}
$.log(cityyq)
$.log('通知开启: ' + $.isNotify)
$.http.get(url + cityencode + '&alr=1&is_opendata=1').then(resp => {
    let obj = resp.body
    let jsonObj = JSON.parse(obj)
    let notifyContent = ''
    if (jsonObj.Result.length !== 0) {
        let infoList = jsonObj.Result[0].DisplayData.resultData.tplData.data_list
        let newsList = jsonObj.Result[1].DisplayData.resultData.tplData.node_list
        $.log('信息数量：' + infoList.length)
        let t = 0
        infoList.forEach(function (i) {
            info.push({name: i.total_desc, value: i.total_num})
            if (t % 2 === 0)
                notifyContent += i.total_desc + ': ' + i.total_num + '  │  '
            else
                notifyContent += i.total_desc + ': ' + i.total_num + '\n'
            t += 1
        })
        let newsTimeNum = newsList[0].create_time
        let news = newsList[0].title
        let newsUrl = newsList[0].url
        let newsTime = new Date(parseInt(newsTimeNum + "000")).toLocaleString()
        // notifyContent += '🦠最新新闻: '+newsTime+'👇\n' + news
        notifyContent += '🦠新闻 '+newsTime+': 👇\n' + news
        $.log('\n' + newsTime)
        $.log('\n' + notifyContent)
        $.log('\n' + newsUrl)
        if ($.isNotify==='true')
            $.notify('📢COVID-19', '😷' + cityyq, notifyContent, {"open-url": newsUrl})
        body = {
            title: '😷' + cityyq,
            content: notifyContent,
            icon: 'cross.circle',
            'icon-color': '#ff0000'
        }
    } else {
        $.log('省份或城市错误，没有获取到信息')
        notifyContent = '省份或城市错误，没有获取到信息!'
        if ($.isNotify==='true')
            $.notify('📢COVID-19', '❌错误', notifyContent)
        body = {
            title: '😷' + cityyq,
            content: '❌错误\n' + notifyContent,
            icon: 'cross.circle',
            'icon-color': '#ff0000'
        }
    }
    if (isScriptable) {
        const w = new ListWidget()
        const bgColor = new LinearGradient()
        bgColor.colors = [new Color("#99CCFF"), new Color("#CCFFFF")]
        bgColor.locations = [0.0, 1.0]
        w.backgroundGradient = bgColor
        let firstLine = w.addText('😷' + cityyq)
        firstLine.font = Font.boldSystemFont(18)
        firstLine.textColor = Color.black()
        firstLine.textOpacity = 0.7
        w.addSpacer()
        w.spacing = 1
        let contentList = notifyContent.split('\n')
        let index = 1
        contentList.forEach(function (i) {
            const content = w.addText(i)
            content.textColor = new Color("#CC3300")
            content.font = Font.mediumSystemFont(12)
            if(index === contentList.length-2)
            {
                w.addSpacer()
                w.spacing = 1
            }
            if(index === contentList.length-1)
            {
                content.textColor = Color.black()
                content.font = Font.mediumSystemFont(13)
            }
            if(index === contentList.length)
            {
                content.textColor = Color.blue()
            }
            index ++
        })
        //w.presentSmall();
        w.presentMedium()
        Script.setWidget(w)
        Script.complete()
    }
    isSurge ? $.done(body) : $.done()
})


/*********************************
 * environment
 * ********************************
 */
function ENV(){const e="function"==typeof require&&"undefined"!=typeof $jsbox;return{isQX:"undefined"!=typeof $task,isLoon:"undefined"!=typeof $loon,isSurge:"undefined"!=typeof $httpClient&&"undefined"!=typeof $utils,isBrowser:"undefined"!=typeof document,isNode:"function"==typeof require&&!e,isJSBox:e,isRequest:"undefined"!=typeof $request,isScriptable:"undefined"!=typeof importModule}}function HTTP(e={baseURL:""}){const{isQX:t,isLoon:s,isSurge:o,isScriptable:n,isNode:i,isBrowser:r}=ENV(),u=/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/;const a={};return["GET","POST","PUT","DELETE","HEAD","OPTIONS","PATCH"].forEach(h=>a[h.toLowerCase()]=(a=>(function(a,h){h="string"==typeof h?{url:h}:h;const d=e.baseURL;d&&!u.test(h.url||"")&&(h.url=d?d+h.url:h.url),h.body&&h.headers&&!h.headers["Content-Type"]&&(h.headers["Content-Type"]="application/x-www-form-urlencoded");const l=(h={...e,...h}).timeout,c={onRequest:()=>{},onResponse:e=>e,onTimeout:()=>{},...h.events};let f,p;if(c.onRequest(a,h),t)f=$task.fetch({method:a,...h});else if(s||o||i)f=new Promise((e,t)=>{(i?require("request"):$httpClient)[a.toLowerCase()](h,(s,o,n)=>{s?t(s):e({statusCode:o.status||o.statusCode,headers:o.headers,body:n})})});else if(n){const e=new Request(h.url);e.method=a,e.headers=h.headers,e.body=h.body,f=new Promise((t,s)=>{e.loadString().then(s=>{t({statusCode:e.response.statusCode,headers:e.response.headers,body:s})}).catch(e=>s(e))})}else r&&(f=new Promise((e,t)=>{fetch(h.url,{method:a,headers:h.headers,body:h.body}).then(e=>e.json()).then(t=>e({statusCode:t.status,headers:t.headers,body:t.data})).catch(t)}));const y=l?new Promise((e,t)=>{p=setTimeout(()=>(c.onTimeout(),t(`${a} URL: ${h.url} exceeds the timeout ${l} ms`)),l)}):null;return(y?Promise.race([y,f]).then(e=>(clearTimeout(p),e)):f).then(e=>c.onResponse(e))})(h,a))),a}function API(e="untitled",t=!1){const{isQX:s,isLoon:o,isSurge:n,isNode:i,isJSBox:r,isScriptable:u}=ENV();return new class{constructor(e,t){this.name=e,this.debug=t,this.http=HTTP(),this.env=ENV(),this.node=(()=>{if(i){return{fs:require("fs")}}return null})(),this.initCache();Promise.prototype.delay=function(e){return this.then(function(t){return((e,t)=>new Promise(function(s){setTimeout(s.bind(null,t),e)}))(e,t)})}}initCache(){if(s&&(this.cache=JSON.parse($prefs.valueForKey(this.name)||"{}")),(o||n)&&(this.cache=JSON.parse($persistentStore.read(this.name)||"{}")),i){let e="root.json";this.node.fs.existsSync(e)||this.node.fs.writeFileSync(e,JSON.stringify({}),{flag:"wx"},e=>console.log(e)),this.root={},e=`${this.name}.json`,this.node.fs.existsSync(e)?this.cache=JSON.parse(this.node.fs.readFileSync(`${this.name}.json`)):(this.node.fs.writeFileSync(e,JSON.stringify({}),{flag:"wx"},e=>console.log(e)),this.cache={})}}persistCache(){const e=JSON.stringify(this.cache,null,2);s&&$prefs.setValueForKey(e,this.name),(o||n)&&$persistentStore.write(e,this.name),i&&(this.node.fs.writeFileSync(`${this.name}.json`,e,{flag:"w"},e=>console.log(e)),this.node.fs.writeFileSync("root.json",JSON.stringify(this.root,null,2),{flag:"w"},e=>console.log(e)))}write(e,t){if(this.log(`SET ${t}`),-1!==t.indexOf("#")){if(t=t.substr(1),n||o)return $persistentStore.write(e,t);if(s)return $prefs.setValueForKey(e,t);i&&(this.root[t]=e)}else this.cache[t]=e;this.persistCache()}read(e){return this.log(`READ ${e}`),-1===e.indexOf("#")?this.cache[e]:(e=e.substr(1),n||o?$persistentStore.read(e):s?$prefs.valueForKey(e):i?this.root[e]:void 0)}delete(e){if(this.log(`DELETE ${e}`),-1!==e.indexOf("#")){if(e=e.substr(1),n||o)return $persistentStore.write(null,e);if(s)return $prefs.removeValueForKey(e);i&&delete this.root[e]}else delete this.cache[e];this.persistCache()}notify(e,t="",a="",h={}){const d=h["open-url"],l=h["media-url"];if(s&&$notify(e,t,a,h),n&&$notification.post(e,t,a+`${l?"\n多媒体:"+l:""}`,{url:d}),o){let s={};d&&(s.openUrl=d),l&&(s.mediaUrl=l),"{}"===JSON.stringify(s)?$notification.post(e,t,a):$notification.post(e,t,a,s)}if(i||u){const s=a+(d?`\n点击跳转: ${d}`:"")+(l?`\n多媒体: ${l}`:"");if(r){require("push").schedule({title:e,body:(t?t+"\n":"")+s})}else console.log(`${e}\n${t}\n${s}\n\n`)}}log(e){this.debug&&console.log(`[${this.name}] LOG: ${this.stringify(e)}`)}info(e){console.log(`[${this.name}] INFO: ${this.stringify(e)}`)}error(e){console.log(`[${this.name}] ERROR: ${this.stringify(e)}`)}wait(e){return new Promise(t=>setTimeout(t,e))}done(e={}){s||o||n?$done(e):i&&!r&&"undefined"!=typeof $context&&($context.headers=e.headers,$context.statusCode=e.statusCode,$context.body=e.body)}stringify(e){if("string"==typeof e||e instanceof String)return e;try{return JSON.stringify(e,null,2)}catch(e){return"[object Object]"}}}(e,t)}

