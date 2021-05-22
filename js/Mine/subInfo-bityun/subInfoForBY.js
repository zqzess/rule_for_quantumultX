/*
 * 本脚本旨在获取比特云机场流量使用详情，支持surge
 * 原作者 @Peng-YM
 * @author:zqzess
 * 由于surge订阅比特云不会有流量使用详情,Peng-YM脚本无法显示订阅有效期，故改写此脚本实现比特云显示浏览详情和订阅有效期
 * 仅仅适用于比特云！！！
 */

let subscriptions = [
    {
        link: "订阅地址1",
        name: "订阅名",
        icon: ""
    }, {
        link: "订阅地址2",
        name: "订阅名",
        icon: ""
    }
];
const $ = API("flowbit");
if ($.read("subscriptions") !== undefined) {
    subscriptions = JSON.parse($.read("subscriptions"));
}

var email = "zqzess@example.com";
var pwd = "pwd";
if ($.read("email") !== undefined) {
    email = $.read("email");
}
if ($.read("pwd") !== undefined) {
    pwd = $.read("pwd");
}

var timestr = "";

Promise.all(subscriptions.map(async sub => await fetchInfo(sub)))
    .catch(err => $.error(err))
    .finally(() => $.done());

async function fetchInfo(sub) {
    const headers = {
        "User-Agent":
            "Quantumult/1.0.13 (iPhone10,3; iOS 14.0)"
    };
    if (sub.link.match(/bityun/))
    {
        bitFetch(sub);

    } else
    {
        $.http.get({
            url: sub.link,
            headers
        }).then(resp => {
            const headers = resp.headers;
            const subkey = Object.keys(headers).filter(k => /SUBSCRIPTION-USERINFO/i.test(k))[0];
            const userinfo = headers[subkey];
            if (!userinfo) {
                $.notify("🚀 [机场流量]", `❌ 机场：${sub.name} 未提供流量信息！`);
            }
            const KEY_o_now = "o_now" + sub.name;
            const KEY_today_flow = "today_flow" + sub.name;
            $.log(userinfo);
            const upload_k = Number(userinfo.match(/upload=(\d+)/)[1]);
            const download_k = Number(userinfo.match(/download=(\d+)/)[1]);
            const total_k = Number(userinfo.match(/total=(\d+)/)[1]);
            const expire_time = userinfo.match(/expire=(\d+)/)
            let expires = "无信息"
            if (expire_time) {
                expires = formatTime(Number(expire_time[1] * 1000));
            }

            const residue_m =
                total_k / 1048576 - download_k / 1048576 - upload_k / 1048576;
            const residue = residue_m.toFixed(2).toString();
            const total_use = download_k / 1048576 + upload_k / 1048576;
            const dnow = new Date().getTime().toString();
            const utime = dnow - $.read(KEY_o_now);
            const todayflow = $.read(KEY_today_flow) - residue;
            $.write(residue, KEY_today_flow);
            $.write(dnow, KEY_o_now);
            const title = `🚀 [流量详情]\n${sub.name}：${(total_k / 1073741824).toFixed(2)}GB`;
            const hutime = parseInt(utime / 3600000);
            const mutime = (utime / 60000) % 60;
            const subtitle = `剩余：${(residue_m / 1024).toFixed(2)}GB, 已用：${(total_use / 1024).toFixed(2)}GB`;
            const details = `有效期：${expires}
📌 [使用情况]
${hutime == 0
                    ? "在过去的" +
                    mutime.toFixed(1) +
                    "分钟内使用了: " +
                    todayflow.toFixed(2) +
                    " M流量"
                    : "在过去的" +
                    hutime +
                    "时 " +
                    mutime.toFixed(1) +
                    "分钟内使用了: " +
                    todayflow.toFixed(2) +
                    " M流量"
                }
📝 [统计]
总上传: ${(upload_k / 1073741824).toFixed(2)} G
总下载: ${(download_k / 1073741824).toFixed(2)} G`;

            if (sub.icon) {
                $.notify(title, subtitle, details, { "media-url": sub.icon });
            } else {
                $.notify(title, subtitle, details);
            }
        });
    }
}

function formatTime(timestamp) {
    const date = new Date(timestamp);
    return `${date.getFullYear()}年${date.getMonth() +
        1}月${date.getDate()}日${date.getHours()}时`;
}


function bitFetch(sub) {
    login(sub);
}

function login(sub) {
    $.http.post({
        url: "https://bityun.org/api/v1/passport/auth/login",
        body: `{"email":"${email}","password":"${pwd}"}`,
        headers: {
            "Host": "bityun.org",
            "Accept": "application/json, text/plain, */*",
            "Accept-Encoding": "gzip, deflate, br",
            "Accept-Language": "zh-cn",
            "Content-Type": "application/json;charset=UTF-8",
            "Origin": "https://bityun.org",
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36 Edg/90.0.818.62",
            // "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_3) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.5 Safari/605.1.15",
            "Referer": "https://bityun.org/",
        }, // 设置请求头
    }).then(resp => {
        // do something
        if (resp.statusCode == 200) {
            console.log("🏆比特云登录成功");
            const result = resp.headers;
            const subkey = Object.keys(result).filter(k => /SET-COOKIE/i.test(k))[1];
            // const cookieinfo = result[subkey];
            const cookie = result[subkey];
            // console.log(cookieinfo);
            // const cookie = cookieinfo[3];
            console.log("cookie:" + cookie);
            !(async () => {
            await get_info(cookie);
            await bitFetcInfo(sub);
            })().then(() => $.done());
            // get_info(cookie);
            // bitFetcInfo(sub);
        } else {
            console.log("🏆比特云登录失败无法获取cookie");
            $.notify("🏆比特云", "登录失败无法获取cookie");
        }
    });
}

async function bitFetcInfo(sub)
{
    const headers = {
        "User-Agent":
            "Quantumult/1.0.13 (iPhone10,3; iOS 14.0)"
    };
    //获取流量信息
    await $.http.get({
        url: sub.link,
        headers
    }).then(resp => {
        const headers = resp.headers;
        const subkey = Object.keys(headers).filter(k => /SUBSCRIPTION-USERINFO/i.test(k))[0];
        const userinfo = headers[subkey];
        if (!userinfo) {
            $.notify("[🏆比特云]", `❌ 机场：${sub.name} 未提供流量信息！`);
        }
        const KEY_o_now = "o_now" + sub.name;
        const KEY_today_flow = "today_flow" + sub.name;
        $.log(userinfo);
        const upload_k = Number(userinfo.match(/upload=(\d+)/)[1]);
        const download_k = Number(userinfo.match(/download=(\d+)/)[1]);
        const total_k = Number(userinfo.match(/total=(\d+)/)[1]);
        let expires = "无信息"
        if (timestr) {
            expires = timestr;
        }

        const residue_m =
            total_k / 1048576 - download_k / 1048576 - upload_k / 1048576;
        const residue = residue_m.toFixed(2).toString();
        const total_use = download_k / 1048576 + upload_k / 1048576;
        const dnow = new Date().getTime().toString();
        const utime = dnow - $.read(KEY_o_now);
        const todayflow = $.read(KEY_today_flow) - residue;
        $.write(residue, KEY_today_flow);
        $.write(dnow, KEY_o_now);
        const title = `[🏆比特云]\n${sub.name}：${(total_k / 1073741824).toFixed(2)}GB`;
        const hutime = parseInt(utime / 3600000);
        const mutime = (utime / 60000) % 60;
        const subtitle = `剩余：${(residue_m / 1024).toFixed(2)}GB, 已用：${(total_use / 1024).toFixed(2)}GB`;
        const details = `${expires}
📌 [使用情况]
${hutime == 0
                ? "在过去的" +
                mutime.toFixed(1) +
                "分钟内使用了: " +
                todayflow.toFixed(2) +
                " M流量"
                : "在过去的" +
                hutime +
                "时 " +
                mutime.toFixed(1) +
                "分钟内使用了: " +
                todayflow.toFixed(2) +
                " M流量"
            }
📝 [统计]
总上传: ${(upload_k / 1073741824).toFixed(2)} G
总下载: ${(download_k / 1073741824).toFixed(2)} G`;

        if (sub.icon) {
            $.notify(title, subtitle, details);
        } else {
            $.notify(title, subtitle, details);
        }
    });
}
async function get_info(cookie) {
    await $.http.get({
        url: "https://bityun.org/api/v1/user/info",
        headers: {
            "Host": "bityun.org",
            "Accept": "application/json, text/plain, */*",
            "Accept-Encoding": "gzip, deflate, br",
            "Accept-Language": "zh-cn",
            "Content-Type": "application/json;charset=UTF-8",
            "Origin": "https://bityun.org",
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36 Edg/90.0.818.62",
            "Referer": "https://bityun.org/",
            "Cookie": cookie
        }// 设置请求头
    }).then(resp => {
        if (resp.statusCode == 200) {
            const result = resp.body;
            if (!result) {
                $.notify("[🏆比特云]", `❌ 未找到订阅信息！`);
            }
            const timenum = Number(result.match(/"expired_at":(\d+)/)[1]);
            console.log("expired_at:" + timenum);
            // const ExpireDate = getDateChange(timenum);
            // const days = dayCount(ExpireDate);
            // $.notify("🏆比特云", "有效期:" + datetime + ", 距离到期还有" + days + "天");
            // timestr = "有效期:" + ExpireDate + ", 距离到期还有" + days + "天";
            timestr=getDateChange(timenum);
        } else {
            console.log("用户信息获取失败");
            $.notify("🏆比特云", "用户信息获取失败");
        }
    });
}
// function getDateChange(days) {
//     var date = new Date();
//     console.log("当前时间:" + date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate());
//     var resultDate = new Date((date / 1000 + (86400 * days)) * 1000);//增加n天后的日期
//     var CurrentDate = resultDate.getFullYear() + "-" + (resultDate.getMonth() + 1) + "-" + (resultDate.getDate());//将日期转化为字符串格式
//     console.log("转换时间:" + CurrentDate);
//     return CurrentDate;
// }


function getDateChange(timenum) {
    const date = new Date(timenum * 1000);
    let Y = date.getFullYear() + '-';
    let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
    let D = date.getDate() + ' ';
    const ExpireDate = Y + M + D;
    console.log("到期时间:" + ExpireDate);
    const dateStart = new Date();
    let dateEnd = new Date();
    dateEnd.setDate(date.getDate());
    dateEnd.setMonth(date.getMonth());
    dateEnd.setFullYear(date.getFullYear());
    var difValue = ((dateEnd - dateStart) / (1000 * 60 * 60 * 24)).toFixed(0);
    var str="有效期:" + ExpireDate + ", 距离到期还有" + difValue + "天";
    return str;
}

// function dayCount(expire_date)
// {
//     var date = new Date();
//     var now = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate()
// //     console.log("当前时间:" + now);
//     var dateStart = new Date(now);
//     var dateEnd = new Date(expire_date);
//     var difValue = ((dateEnd - dateStart) / (1000 * 60 * 60 * 24)).toFixed(0);
//     console.log("🏆比特云距到期还有:" + difValue);
//     return difValue;
// }



// prettier-ignore
/*********************************** API *************************************/
function ENV() { const e = "undefined" != typeof $task, t = "undefined" != typeof $loon, s = "undefined" != typeof $httpClient && !t, i = "function" == typeof require && "undefined" != typeof $jsbox; return { isQX: e, isLoon: t, isSurge: s, isNode: "function" == typeof require && !i, isJSBox: i, isRequest: "undefined" != typeof $request, isScriptable: "undefined" != typeof importModule } } function HTTP(e = { baseURL: "" }) { const { isQX: t, isLoon: s, isSurge: i, isScriptable: n, isNode: o } = ENV(), r = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&\/\/=]*)/; const u = {}; return ["GET", "POST", "PUT", "DELETE", "HEAD", "OPTIONS", "PATCH"].forEach(l => u[l.toLowerCase()] = (u => (function (u, l) { l = "string" == typeof l ? { url: l } : l; const h = e.baseURL; h && !r.test(l.url || "") && (l.url = h ? h + l.url : l.url); const a = (l = { ...e, ...l }).timeout, c = { onRequest: () => { }, onResponse: e => e, onTimeout: () => { }, ...l.events }; let f, d; if (c.onRequest(u, l), t) f = $task.fetch({ method: u, ...l }); else if (s || i || o) f = new Promise((e, t) => { (o ? require("request") : $httpClient)[u.toLowerCase()](l, (s, i, n) => { s ? t(s) : e({ statusCode: i.status || i.statusCode, headers: i.headers, body: n }) }) }); else if (n) { const e = new Request(l.url); e.method = u, e.headers = l.headers, e.body = l.body, f = new Promise((t, s) => { e.loadString().then(s => { t({ statusCode: e.response.statusCode, headers: e.response.headers, body: s }) }).catch(e => s(e)) }) } const p = a ? new Promise((e, t) => { d = setTimeout(() => (c.onTimeout(), t(`${u} URL: ${l.url} exceeds the timeout ${a} ms`)), a) }) : null; return (p ? Promise.race([p, f]).then(e => (clearTimeout(d), e)) : f).then(e => c.onResponse(e)) })(l, u))), u } function API(e = "untitled", t = !1) { const { isQX: s, isLoon: i, isSurge: n, isNode: o, isJSBox: r, isScriptable: u } = ENV(); return new class { constructor(e, t) { this.name = e, this.debug = t, this.http = HTTP(), this.env = ENV(), this.node = (() => { if (o) { return { fs: require("fs") } } return null })(), this.initCache(); Promise.prototype.delay = function (e) { return this.then(function (t) { return ((e, t) => new Promise(function (s) { setTimeout(s.bind(null, t), e) }))(e, t) }) } } initCache() { if (s && (this.cache = JSON.parse($prefs.valueForKey(this.name) || "{}")), (i || n) && (this.cache = JSON.parse($persistentStore.read(this.name) || "{}")), o) { let e = "root.json"; this.node.fs.existsSync(e) || this.node.fs.writeFileSync(e, JSON.stringify({}), { flag: "wx" }, e => console.log(e)), this.root = {}, e = `${this.name}.json`, this.node.fs.existsSync(e) ? this.cache = JSON.parse(this.node.fs.readFileSync(`${this.name}.json`)) : (this.node.fs.writeFileSync(e, JSON.stringify({}), { flag: "wx" }, e => console.log(e)), this.cache = {}) } } persistCache() { const e = JSON.stringify(this.cache, null, 2); s && $prefs.setValueForKey(e, this.name), (i || n) && $persistentStore.write(e, this.name), o && (this.node.fs.writeFileSync(`${this.name}.json`, e, { flag: "w" }, e => console.log(e)), this.node.fs.writeFileSync("root.json", JSON.stringify(this.root, null, 2), { flag: "w" }, e => console.log(e))) } write(e, t) { if (this.log(`SET ${t}`), -1 !== t.indexOf("#")) { if (t = t.substr(1), n || i) return $persistentStore.write(e, t); if (s) return $prefs.setValueForKey(e, t); o && (this.root[t] = e) } else this.cache[t] = e; this.persistCache() } read(e) { return this.log(`READ ${e}`), -1 === e.indexOf("#") ? this.cache[e] : (e = e.substr(1), n || i ? $persistentStore.read(e) : s ? $prefs.valueForKey(e) : o ? this.root[e] : void 0) } delete(e) { if (this.log(`DELETE ${e}`), -1 !== e.indexOf("#")) { if (e = e.substr(1), n || i) return $persistentStore.write(null, e); if (s) return $prefs.removeValueForKey(e); o && delete this.root[e] } else delete this.cache[e]; this.persistCache() } notify(e, t = "", l = "", h = {}) { const a = h["open-url"], c = h["media-url"]; if (s && $notify(e, t, l, h), n && $notification.post(e, t, l + `${c ? "\n多媒体:" + c : ""}`, { url: a }), i) { let s = {}; a && (s.openUrl = a), c && (s.mediaUrl = c), "{}" === JSON.stringify(s) ? $notification.post(e, t, l) : $notification.post(e, t, l, s) } if (o || u) { const s = l + (a ? `\n点击跳转: ${a}` : "") + (c ? `\n多媒体: ${c}` : ""); if (r) { require("push").schedule({ title: e, body: (t ? t + "\n" : "") + s }) } else console.log(`${e}\n${t}\n${s}\n\n`) } } log(e) { this.debug && console.log(`[${this.name}] LOG: ${this.stringify(e)}`) } info(e) { console.log(`[${this.name}] INFO: ${this.stringify(e)}`) } error(e) { console.log(`[${this.name}] ERROR: ${this.stringify(e)}`) } wait(e) { return new Promise(t => setTimeout(t, e)) } done(e = {}) { s || i || n ? $done(e) : o && !r && "undefined" != typeof $context && ($context.headers = e.headers, $context.statusCode = e.statusCode, $context.body = e.body) } stringify(e) { if ("string" == typeof e || e instanceof String) return e; try { return JSON.stringify(e, null, 2) } catch (e) { return "[object Object]" } } }(e, t) }
/*****************************************************************************/





