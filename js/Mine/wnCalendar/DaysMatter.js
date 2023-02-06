/*
 * 本脚本是假日倒计时，支持Surge(Panel,Cron),Stash(Tile,Cron),Loon,QuantumultX,Shadowrocket
 * @author: zqzess
 * 仓库地址：https://github.com/zqzess/rule_for_quantumultX
 * 感谢@chavyleung提供的Env
 * 定时任务添加： 0 9 * * * https://raw.githubusercontent.com/zqzess/rule_for_quantumultX/master/js/Mine/wnCalendar/DaysMatter.js
 * 申明：部分函数方法来源于TimeCard.js，其原始作者@smartmimi
 */
const $ = new Env('DaysMatter', true)
let title = '📅 倒数日'
let url = 'https://raw.githubusercontent.com/zqzess/openApiData/main/calendar/cnholiday2.json'
let option = {
    url: url,
    headers: {}
}
let nowDate = new Date().toLocaleDateString()
let year = nowDate.split('/')[0]
// 各日期区分开方便日后区分放假通知与倒数日通知
let holidayData = $.getjson('holidayData', null) // 法定节假日，放假的那种
let daysData = [] // 节日集合，包含法定节假日，内置假日，用户假日（固定+浮动）
let userDays = $.getdata('userDays') // 用户固定假日
let userDaysName = $.getdata('userDaysName')
let userDays2 = $.getdata('userDays2') // 用户浮动假日
let userDaysName2 = $.getdata('userDaysName2')
let userDaysData = $.getjson('userDaysData', {'list': []}) // 备用变量
let defaultDaysData =
    [{'date': '2023-2-05', 'name': '元宵'},
    {'date': '2023-5-14', 'name': '母亲节'},
    {'date': '2023-6-18', 'name': '父亲节'}] // 内置假日

let tnow = new Date()
let tnowf = tnow.getFullYear() + "-" + (tnow.getMonth() + 1) + "-" + tnow.getDate()
// let tnowf = '2023-2-5'

let dateDiffArray = []

startWork()

async function startWork() {
    await setHoliDayData()
    let nowlist = now();
    $.log('距离最近的节日：' + holidayData.list[nowlist].name)
    let notifyContent = dateDiffArray[0].name + ":" + today(tnumcount(0)) + "," + dateDiffArray[Number(0) + Number(1)].name + ":" + tnumcount(Number(0) + Number(1)) + "天," + dateDiffArray[Number(0) + Number(2)].name + ":" + tnumcount(Number(0) + Number(2)) + "天"
    $.isSurge() ? body = {
        title: title,
        content: notifyContent,
        icon: icon_now(tnumcount(Number(0))),
        'icon-color': '#339900'
    } : body = {title: title, content: notifyContent, icon: icon_now(tnumcount(Number(0))), backgroundColor: '#339900'}
    $.log('\n面板显示内容：\n' + notifyContent)
    // $.msg(title, '', notifyContent)
    $.isSurge || $.isStash ? $.done(body) : $.done()
}

async function setHoliDayData() {
    if (holidayData === null || holidayData.year !== year) {
        await $.http.get(option).then(function (response) {
            let jsonObj = JSON.parse(response.body)
            let result = jsonObj.data[0].holiday
            result.forEach(function (i) {
                if (i.year === year) {
                    holidayData = i
                    $.setjson(i, 'holidayData')
                }
            })
        })
    }
    daysData = daysData.concat(holidayData.list) // 法定节假日并入假日集合
    let clearFlag = false
    // 如果用户填写了固定日期，就解析并入节日集合，如公历生日，每年都是一样的，所以填入月和日即可，3-1。会自动解析并加入当前年份
    if (userDays !== '' && userDays !== undefined && userDays !== null && userDaysName !== '' && userDaysName !== undefined && userDaysName !== null) {
        userDays = userDays.replace('，', ',')
        userDaysName = userDaysName.replace('，', ',')
        let userDaysArray = userDays.split(',')
        let userDaysNameArray = userDaysName.split(',')
        if (userDaysArray.length !== userDaysNameArray.length) {
            $.msg(title, '❌错误', '用户填写的固定日期和名称没有对应')
        } else {
            userDaysData = []
            for (let i in userDaysArray) {
                // 如果用户填写的是浮动日期，此处与下面的重复了，目前设计是浮动日期和固定日期分开填写，后期可视情况合并（删除下面）
                if (userDaysArray[i].split('-').length > 2) {
                    daysData.push({'date': userDaysArray[i], 'name': userDaysNameArray[i]})
                    userDaysData.push({'date': userDaysArray[i], 'name': userDaysNameArray[i]}) // 此变量备用
                } else if (userDaysArray[i].split('-').length === 2) { // 用户填写的是固定日期
                    daysData.push({'date': year + '-' + userDaysArray[i], 'name': userDaysNameArray[i]})
                    userDaysData.push({'date': year + '-' + userDaysArray[i], 'name': userDaysNameArray[i]}) // 此变量备用
                }
            }
            $.setjson(userDaysData, 'userDaysData')
            clearFlag = true
        }
    }

    // 如果用户填写了浮动日期，如母亲节每年5月第二个星期日这种，需要填入年份2024-5-4
    if (userDays2 !== '' && userDays2 !== undefined && userDays2 !== null && userDaysName2 !== '' && userDaysName2 !== undefined && userDaysName2 !== null) {
        userDays2 = userDays2.replace('，', ',')
        userDaysName2 = userDaysName2.replace('，', ',')
        let userDaysArray = userDays2.split(',')
        let userDaysNameArray = userDaysName2.split(',')
        if (userDaysArray.length !== userDaysNameArray.length) {
            $.msg(title, '❌错误', '用户填写的浮动日期和名称没有对应')
        } else {
            if (!clearFlag) {
                userDaysData = []
            }
            for (let i in userDaysArray) {
                // 如果用户填写的是固定日期
                if (userDaysArray[i].split('-').length > 2) {
                    daysData.push({'date': userDaysArray[i], 'name': userDaysNameArray[i]})
                    userDaysData.push({'date': userDaysArray[i], 'name': userDaysNameArray[i]}) // 此变量备用
                }
            }
            $.setjson(userDaysData, 'userDaysData')
        }
    }
    if (defaultDaysData.length > 0) {
        daysData = daysData.concat(defaultDaysData)
    }
    console.log('节日集合: ')
    console.log(daysData)
}

/* 计算2个日期相差的天数，不包含今天，如：2016-12-13到2016-12-15，相差2天
 * @param startDateString
 * @param endDateString
 * @returns
 */
function dateDiff(startDateString, endDateString) {
    var separator = "-"; //日期分隔符
    var startDates = startDateString.split(separator);
    var endDates = endDateString.split(separator);
    var startDate = new Date(startDates[0], startDates[1] - 1, startDates[2]);
    var endDate = new Date(endDates[0], endDates[1] - 1, endDates[2]);
    return parseInt(
        (endDate - startDate) / 1000 / 60 / 60 / 24
    ).toString();
}

//计算输入序号对应的时间与现在的天数间隔
function tnumcount(num) {
    return dateDiff(tnowf, dateDiffArray[num].date);
}

//获取最接近的日期
function now() {
    let tmp = 400
    let res = 0
    for (let i = 0; i < daysData.length; i++) {
        let key = Number(dateDiff(tnowf, daysData[i].date))
        if (key >= 0) {
            dateDiffArray.push({'date': daysData[i].date, 'name': daysData[i].name, 'key': key})
        }
        if (key >= 0 && tmp > key) {
            // 上面的思路是对差值数组排序，选出最小值，即日期差最小
            tmp = key
            res = i
        }
    }
    dateDiffArray = mergeSort(dateDiffArray) // 对集合排序
    return res
}

// 冒泡排序
function BubbleSort(array) {
    let tmp = {}
    for (let i = 0; i < array.length - 1; i++) {
        for (let j = 0; j < array.length - 1 - i; j++) {
            if (array[j].key > array[j + 1].key) {
                tmp = array[j + 1]
                array[j + 1] = array[j]
                array[j] = tmp
            }
        }
    }
    return array
}

// 归并排序，速度更快
function mergeSort(list) {
    const rec = arr => {
        if (arr.length === 1) return arr
        const mid = arr.length >> 1
        const left = arr.slice(0, mid)
        const right = arr.slice(mid)
        const arr1 = rec(left)
        const arr2 = rec(right)
        let i = 0, j = 0
        let res = []
        while (i < arr1.length && j < arr2.length) {
            if (arr1[i].key < arr2[j].key) {
                res.push(arr1[i++])
            } else {
                res.push(arr2[j++])
            }
        }
        if (i < arr1.length) res = res.concat(arr1.slice(i))
        if (j < arr2.length) res = res.concat(arr2.slice(j))
        return res
    }
    return rec(list)
}


function today(day) {
    let daythis = day;
    if (daythis === "0") {
        datenotice();
        return "🎉";
    } else {
        return daythis + "天";
    }
}

function datenotice() {
    if ($.getdata("DaysMatterPushed") !== dateDiffArray[0].date && tnow.getHours() >= 6) {
        $.setdata(dateDiffArray[0].date, "DaysMatterPushed");
        $.msg("假日祝福", "", "今天是" + dateDiffArray[0].date + "日 " + dateDiffArray[0].name + "   🎉")
    } else if ($.getdata("DaysMatterPushed") === dateDiffArray[0].date) {
        //console.log("当日已通知");
    }
}

//>图标依次切换乌龟、兔子、闹钟、礼品盒
function icon_now(num) {
    if (num <= 7 && num > 3) {
        return "hare"
    } else if (num <= 3 && num > 0) {
        return "timer"
    } else if (num === 0) {
        return "gift"
    } else {
        return "tortoise"
    }
}

function title_random(num) {
    let r = Math.floor((Math.random() * 10) + 1);
    let dic = {
        1: "距离放假，还要摸鱼多少天？",
        2: "坚持住，就快放假啦！",
        3: "上班好累呀，下顿吃啥？",
        4: "努力，我还能加班24小时！",
        5: "今日宜：吃饭饭  忌：减肥",
        6: "躺平中，等放假",
        7: "只有摸鱼才是赚老板的钱",
        8: "一起摸鱼吧",
        9: "摸鱼中，期待下一个假日",
        10: "小乌龟慢慢爬"
    };
    return num === 0 ? "节日快乐，万事大吉" : dic[r]
}


/*********************************
 * environment
 * ********************************
 */
function Env(t,e){class s{constructor(t){this.env=t}send(t,e="GET"){t="string"==typeof t?{url:t}:t;let s=this.get;return"POST"===e&&(s=this.post),new Promise((e,i)=>{s.call(this,t,(t,s,r)=>{t?i(t):e(s)})})}get(t){return this.send.call(this.env,t)}post(t){return this.send.call(this.env,t,"POST")}}return new class{constructor(t,e){this.name=t,this.http=new s(this),this.data=null,this.dataFile="box.dat",this.logs=[],this.isMute=!1,this.isNeedRewrite=!1,this.logSeparator="\n",this.encoding="utf-8",this.startTime=(new Date).getTime(),Object.assign(this,e),this.log("",`🔔${this.name}, 开始!`)}isNode(){return"undefined"!=typeof module&&!!module.exports}isQuanX(){return"undefined"!=typeof $task}isSurge(){return"undefined"!=typeof $httpClient&&"undefined"==typeof $loon}isLoon(){return"undefined"!=typeof $loon}isShadowrocket(){return"undefined"!=typeof $rocket}isStash(){return"undefined"!=typeof $environment&&$environment["stash-version"]}toObj(t,e=null){try{return JSON.parse(t)}catch{return e}}toStr(t,e=null){try{return JSON.stringify(t)}catch{return e}}getjson(t,e){let s=e;const i=this.getdata(t);if(i)try{s=JSON.parse(this.getdata(t))}catch{}return s}setjson(t,e){try{return this.setdata(JSON.stringify(t),e)}catch{return!1}}getScript(t){return new Promise(e=>{this.get({url:t},(t,s,i)=>e(i))})}runScript(t,e){return new Promise(s=>{let i=this.getdata("@chavy_boxjs_userCfgs.httpapi");i=i?i.replace(/\n/g,"").trim():i;let r=this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout");r=r?1*r:20,r=e&&e.timeout?e.timeout:r;const[o,n]=i.split("@"),a={url:`http://${n}/v1/scripting/evaluate`,body:{script_text:t,mock_type:"cron",timeout:r},headers:{"X-Key":o,Accept:"*/*"}};this.post(a,(t,e,i)=>s(i))}).catch(t=>this.logErr(t))}loaddata(){if(!this.isNode())return{};{this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e);if(!s&&!i)return{};{const i=s?t:e;try{return JSON.parse(this.fs.readFileSync(i))}catch(t){return{}}}}}writedata(){if(this.isNode()){this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e),r=JSON.stringify(this.data);s?this.fs.writeFileSync(t,r):i?this.fs.writeFileSync(e,r):this.fs.writeFileSync(t,r)}}lodash_get(t,e,s){const i=e.replace(/\[(\d+)\]/g,".$1").split(".");let r=t;for(const t of i)if(r=Object(r)[t],void 0===r)return s;return r}lodash_set(t,e,s){return Object(t)!==t?t:(Array.isArray(e)||(e=e.toString().match(/[^.[\]]+/g)||[]),e.slice(0,-1).reduce((t,s,i)=>Object(t[s])===t[s]?t[s]:t[s]=Math.abs(e[i+1])>>0==+e[i+1]?[]:{},t)[e[e.length-1]]=s,t)}getdata(t){let e=this.getval(t);if(/^@/.test(t)){const[,s,i]=/^@(.*?)\.(.*?)$/.exec(t),r=s?this.getval(s):"";if(r)try{const t=JSON.parse(r);e=t?this.lodash_get(t,i,""):e}catch(t){e=""}}return e}setdata(t,e){let s=!1;if(/^@/.test(e)){const[,i,r]=/^@(.*?)\.(.*?)$/.exec(e),o=this.getval(i),n=i?"null"===o?null:o||"{}":"{}";try{const e=JSON.parse(n);this.lodash_set(e,r,t),s=this.setval(JSON.stringify(e),i)}catch(e){const o={};this.lodash_set(o,r,t),s=this.setval(JSON.stringify(o),i)}}else s=this.setval(t,e);return s}getval(t){return this.isSurge()||this.isLoon()?$persistentStore.read(t):this.isQuanX()?$prefs.valueForKey(t):this.isNode()?(this.data=this.loaddata(),this.data[t]):this.data&&this.data[t]||null}setval(t,e){return this.isSurge()||this.isLoon()?$persistentStore.write(t,e):this.isQuanX()?$prefs.setValueForKey(t,e):this.isNode()?(this.data=this.loaddata(),this.data[e]=t,this.writedata(),!0):this.data&&this.data[e]||null}initGotEnv(t){this.got=this.got?this.got:require("got"),this.cktough=this.cktough?this.cktough:require("tough-cookie"),this.ckjar=this.ckjar?this.ckjar:new this.cktough.CookieJar,t&&(t.headers=t.headers?t.headers:{},void 0===t.headers.Cookie&&void 0===t.cookieJar&&(t.cookieJar=this.ckjar))}get(t,e=(()=>{})){if(t.headers&&(delete t.headers["Content-Type"],delete t.headers["Content-Length"]),this.isSurge()||this.isLoon())this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.get(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status?s.status:s.statusCode,s.status=s.statusCode),e(t,s,i)});else if(this.isQuanX())this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t&&t.error||"UndefinedError"));else if(this.isNode()){let s=require("iconv-lite");this.initGotEnv(t),this.got(t).on("redirect",(t,e)=>{try{if(t.headers["set-cookie"]){const s=t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString();s&&this.ckjar.setCookieSync(s,null),e.cookieJar=this.ckjar}}catch(t){this.logErr(t)}}).then(t=>{const{statusCode:i,statusCode:r,headers:o,rawBody:n}=t,a=s.decode(n,this.encoding);e(null,{status:i,statusCode:r,headers:o,rawBody:n,body:a},a)},t=>{const{message:i,response:r}=t;e(i,r,r&&s.decode(r.rawBody,this.encoding))})}}post(t,e=(()=>{})){const s=t.method?t.method.toLocaleLowerCase():"post";if(t.body&&t.headers&&!t.headers["Content-Type"]&&(t.headers["Content-Type"]="application/x-www-form-urlencoded"),t.headers&&delete t.headers["Content-Length"],this.isSurge()||this.isLoon())this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient[s](t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status?s.status:s.statusCode,s.status=s.statusCode),e(t,s,i)});else if(this.isQuanX())t.method=s,this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t&&t.error||"UndefinedError"));else if(this.isNode()){let i=require("iconv-lite");this.initGotEnv(t);const{url:r,...o}=t;this.got[s](r,o).then(t=>{const{statusCode:s,statusCode:r,headers:o,rawBody:n}=t,a=i.decode(n,this.encoding);e(null,{status:s,statusCode:r,headers:o,rawBody:n,body:a},a)},t=>{const{message:s,response:r}=t;e(s,r,r&&i.decode(r.rawBody,this.encoding))})}}time(t,e=null){const s=e?new Date(e):new Date;let i={"M+":s.getMonth()+1,"d+":s.getDate(),"H+":s.getHours(),"m+":s.getMinutes(),"s+":s.getSeconds(),"q+":Math.floor((s.getMonth()+3)/3),S:s.getMilliseconds()};/(y+)/.test(t)&&(t=t.replace(RegExp.$1,(s.getFullYear()+"").substr(4-RegExp.$1.length)));for(let e in i)new RegExp("("+e+")").test(t)&&(t=t.replace(RegExp.$1,1==RegExp.$1.length?i[e]:("00"+i[e]).substr((""+i[e]).length)));return t}queryStr(t){let e="";for(const s in t){let i=t[s];null!=i&&""!==i&&("object"==typeof i&&(i=JSON.stringify(i)),e+=`${s}=${i}&`)}return e=e.substring(0,e.length-1),e}msg(e=t,s="",i="",r){const o=t=>{if(!t)return t;if("string"==typeof t)return this.isLoon()?t:this.isQuanX()?{"open-url":t}:this.isSurge()?{url:t}:void 0;if("object"==typeof t){if(this.isLoon()){let e=t.openUrl||t.url||t["open-url"],s=t.mediaUrl||t["media-url"];return{openUrl:e,mediaUrl:s}}if(this.isQuanX()){let e=t["open-url"]||t.url||t.openUrl,s=t["media-url"]||t.mediaUrl,i=t["update-pasteboard"]||t.updatePasteboard;return{"open-url":e,"media-url":s,"update-pasteboard":i}}if(this.isSurge()){let e=t.url||t.openUrl||t["open-url"];return{url:e}}}};if(this.isMute||(this.isSurge()||this.isLoon()?$notification.post(e,s,i,o(r)):this.isQuanX()&&$notify(e,s,i,o(r))),!this.isMuteLog){let t=["","==============📣系统通知📣=============="];t.push(e),s&&t.push(s),i&&t.push(i),console.log(t.join("\n")),this.logs=this.logs.concat(t)}}log(...t){t.length>0&&(this.logs=[...this.logs,...t]),console.log(t.join(this.logSeparator))}logErr(t,e){const s=!this.isSurge()&&!this.isQuanX()&&!this.isLoon();s?this.log("",`❗️${this.name}, 错误!`,t.stack):this.log("",`❗️${this.name}, 错误!`,t)}wait(t){return new Promise(e=>setTimeout(e,t))}done(t={}){const e=(new Date).getTime(),s=(e-this.startTime)/1e3;this.log("",`🔔${this.name}, 结束! 🕛 ${s} 秒`),this.log(),this.isSurge()||this.isQuanX()||this.isLoon()?$done(t):this.isNode()&&process.exit(1)}}(t,e)}
