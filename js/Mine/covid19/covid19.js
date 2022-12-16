/*
 * 本脚本旨在获取某个城市最新疫情信息，支持surge(panel,cron),QuantumultX,Loon,Nodejs,,Scriptable
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
if (!isScriptable) {
    $.city = $.read('covid19_city')
    $.isNotify = $.read('covid19_isNotify')
    $.isShowInfo = $.read('covid19_isShowInfo')
}
//
// 修改城市👇
let city = '南京'
// 是否开启百度搜索数据显示，true开启，false关闭，关闭后可显示更多疫情新闻👇
if ($.isShowInfo === undefined)
    $.isShowInfo = 'true'
// 搜索词拼接
if ($.city !== "" && $.city !== null && $.city !== undefined)
    city = $.city + '疫情'
// 是否开启通知，scriptable无效
if ($.isNotify === undefined)
    $.isNotify = 'true'
// 无boxjs环境，判断是否需要搜索词拼接
city = city.match('疫情') ? city : city + '疫情'
let cityencode = encodeURIComponent(city)
let url = 'https://opendata.baidu.com/data/inner?resource_id=5653&query='
let info = []
let body = {}
let newsUrl = '' // 最新新闻链接
$.log(city)
$.log('通知开启: ' + $.isNotify)
$.log('疫情指数显示开启：'+ $.isShowInfo)
$.http.get(url + cityencode + '&alr=1&is_opendata=1').then(resp => {
    let obj = resp.body
    let jsonObj = JSON.parse(obj)
    let notifyContent = ''
    if (jsonObj.Result.length !== 0) {
        if($.isShowInfo === 'true')
        {
            let infoList = jsonObj.Result[0].DisplayData.resultData.tplData.data_list
            $.log('信息数量：' + infoList.length)
            $.log('\n信息内容: \n' + JSON.stringify(infoList))
            infoList.forEach(function (i) {
                info.push({name: i.total_desc, value: i.total_num, changeName: i.change_desc, changeValue: i.change_num})
                notifyContent += i.total_desc + ': ' + i.total_num + '  │  ' + i.change_desc + ': ' + i.change_num + '\n'
            })
        }
        if (jsonObj.Result.length > 0) {
            // 新闻列表
            let newsList = jsonObj.Result[4].DisplayData.resultData.tplData.node_list
            let news = ''
            let forNum = 0 // 循环次数
            $.isShowInfo === 'true'?forNum=1:forNum=4
            if(forNum===4)
                newsList.length>=4?forNum=4:forNum=newsList.length
            // $.isShowInfo === 'true'?news=newsList[0].title:news=newsList[0].title+'\n📰历史新闻：\n'
            forNum === 1?news=newsList[0].title:news=newsList[0].title+'\n📰历史新闻：\n'
            try {
                for(let i =1;i<forNum;i++)
                {
                    let newOne = newsList[i].title
                    let newsOneTimeNum = newsList[i].create_time
                    let newsOneTime = new Date(parseInt(newsOneTimeNum + "000")).toLocaleString().replace(':00','')
                    if(i===forNum-1)
                        news += newsOneTime+' '+newOne
                    else
                        news += newsOneTime+' '+newOne + '\n'
                }
                $.log(news)
                let newsTimeNum = newsList[0].create_time
                // let newsUrl = newsList[0].url // 最新新闻链接
                newsUrl = newsList[0].url
                let newsTime = new Date(parseInt(newsTimeNum + "000")).toLocaleString()
                // notifyContent += '🦠最新新闻: '+newsTime+'👇\n' + news
                notifyContent += '🦠最新新闻 ' + newsTime + ': 👇\n' + news
                // notifyContent = notifyContent.substring(0, notifyContent.lastIndexOf('\n')) // 去掉末尾换行符
                if ($.isNotify === 'true')
                    $.notify('📢COVID-19', '😷' + city, notifyContent, {"open-url": newsUrl})
            } catch (e) {
                $.notify('📢COVID-19', '出错了')
            }
        } else {
            if ($.isNotify === 'true')
                $.notify('📢COVID-19', '😷' + city, notifyContent)
        }
        body = {
            title: '😷' + city,
            content: notifyContent,
            icon: 'cross.circle',
            'icon-color': '#ff0000'
        }
    } else {
        $.log('省份或城市错误，没有获取到信息')
        notifyContent = '省份或城市错误，没有获取到信息!'
        if ($.isNotify === 'true')
            $.notify('📢COVID-19', '❌错误', notifyContent)
        body = {
            title: '😷' + city,
            content: '❌错误\n' + notifyContent,
            icon: 'cross.circle',
            'icon-color': '#ff0000'
        }
    }
    if (isScriptable) {
        let isDark = Device.isUsingDarkAppearance()
        const w = new ListWidget()
        const bgColor = new LinearGradient()
        bgColor.colors = [new Color("#99CCFF"), new Color("#CCFFFF")]
        if (isDark) {
            bgColor.colors = [new Color("#1c1c1c"), new Color("#29323c")]
        }
        bgColor.locations = [0.0, 1.0]
        w.backgroundGradient = bgColor
        let firstLine = w.addText('😷' + city)
        firstLine.font = Font.boldSystemFont(18)
        firstLine.textColor = Color.black()
        if (isDark) {
            firstLine.textColor = Color.white()
            firstLine.textOpacity = 0.8
        }
        w.addSpacer()
        w.spacing = 1
        let contentList = notifyContent.split('\n')
        let index = 1
        contentList.forEach(function (i) {
            const content = w.addText(i)
            content.textColor = new Color("#CC3300")
            content.minimumScaleFactor = 0.5 // 自适应缩放
            if($.isShowInfo === 'true')
            {
                content.font = Font.mediumSystemFont(12)
                if (index === contentList.length - 2) {
                    w.addSpacer()
                    w.spacing = 1
                }
                if (index === contentList.length - 1) {
                    content.textColor = Color.black()
                    if (isDark) {
                        content.textColor = Color.white()
                        content.textOpacity = 0.8
                    }
                    content.font = Font.regularSystemFont(14)
                }
                if (index === contentList.length) {
                    content.textColor = Color.blue()
                }
            }else
            {
                content.font = Font.mediumSystemFont(10)
                if(index === 1 || index === 3)
                {
                    content.textColor = Color.black()
                    if (isDark) {
                        content.textColor = Color.white()
                        content.textOpacity = 0.8
                    }
                    content.font = Font.regularSystemFont(12)
                }
                else if(index === 2) {
                    w.addSpacer()
                    w.spacing = 1
                }else
                {
                    content.textColor = Color.blue()
                    content.font = Font.mediumSystemFont(9)
                }
            }
            index++
        })
        w.url = newsUrl
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


