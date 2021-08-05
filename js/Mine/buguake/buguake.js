/*

******************
* @author:zqzess
*******************

不挂科签到拿爱奇艺vip脚本
兼容: 理论上兼容QuantumultX, Surge4, Loon，但是目前只在surge4上做过测试


*********重要说明********

使用脚本有黑号风险，本脚本仅供娱乐

***********************

获取Cookie说明：
打开不挂科App后(AppStore中国区, 非内部版)，点击"我的->签到福利"或者点击"首页"搜索框右上角鸟图标, 如通知成功获取cookie和url, 则可以使用此签到脚本.
获取Cookie后, 请将Cookie脚本重写禁用并移除主机名，以免产生不必要的MITM.
脚本将在每天上午9:00执行, 您可以修改执行时间。
************************
Surge 4.2.0+ 脚本配置:
************************
[Script]
不挂科签到 = type=cron,cronexp=0 9 * * *,script-path=https://raw.githubusercontent.com/zqzess/rule_for_quantumultX/master/js/Mine/buguake/buguake.js
不挂科获取Cookie = type=http-request,pattern=https:\/\/appwk\.baidu\.com\/naapi\/stsign\/activity\?bid,script-path=https://raw.githubusercontent.com/zqzess/rule_for_quantumultX/master/js/Mine/buguake/buguake.js
[MITM] 
hostname= appwk.baidu.com
************************
QuantumultX 远程脚本配置:
************************
[task_local]
# 不挂科签到
0 9 * * * https://raw.githubusercontent.com/zqzess/rule_for_quantumultX/master/js/Mine/buguake/buguake.js
[rewrite_local]
# 获取Cookie
https:\/\/appwk\.baidu\.com\/naapi\/stsign\/activity\?bid url script-request-header https://raw.githubusercontent.com/zqzess/rule_for_quantumultX/master/js/Mine/buguake/buguake.js
[mitm] 
hostname= appwk.baidu.com
************************
Loon 2.1.0+ 脚本配置:
************************
[Script]
# 不挂科签到
cron "0 9 * * *" script-path=https://raw.githubusercontent.com/zqzess/rule_for_quantumultX/master/js/Mine/buguake/buguake.js,tag=不挂科签到
# 获取Cookie
http-request https:\/\/appwk\.baidu\.com\/naapi\/stsign\/activity\?bid script-path=https://raw.githubusercontent.com/zqzess/rule_for_quantumultX/master/js/Mine/buguake/buguake.js, tag=不挂科cookie
[Mitm] 
hostname= appwk.baidu.com
*/
var $zqzess = zqzess();
var cookieVal = $zqzess.read("CookieBGK");
var urlVal = $zqzess.read("UrlBGK");
var uaVal = $zqzess.read("UABGK");
var url_fetch_sign = {
    url: urlVal,
    headers: {
        Host: "appwk.baidu.com",
        Accept: "*/*",
        Cookie: cookieVal,
        "User-Agent": uaVal,
        "Accept-Language": "zh-cn",
        "Connection": "keep-alive"
    }
};
if ($zqzess.isRequest) {
    GetCookie()
} else {
    signBGK()
}


function signBGK() {
    if (!cookieVal) {
        $zqzess.notify("🔔不挂科签到", "签到失败", "未获取到cookie");
        return $zqzess.done()
    }
    if (!urlVal) {
        $zqzess.notify("🔔不挂科签到", "签到失败", "未获取到url");
        return $zqzess.done()
    }
    if (!uaVal) {
        $zqzess.notify("🔔不挂科签到", "未获取到UA", "使用内置UA");
        urlVal = "%E4%B8%8D%E6%8C%82%E7%A7%91/2.0.2.69 CFNetwork/1240.0.4 Darwin/20.5.0"
    }
    $zqzess.get(url_fetch_sign, function(error, response, data) {
        if (error) {
            $zqzess.notify("🔔不挂科签到", "签到失败", "无法签到，请手动签到");
            $zqzess.done()
        } else {
            var body = JSON.parse(data);
            var isSuccessResponse = body && body.status.code == 0 && body.status.msg == "";
            if (!isSuccessResponse) {
                $zqzess.notify("🔔不挂科签到", "签到失败", body.status.msg);
                return $zqzess.done()
            }
            currentDay = body.data.dayList.currentDay;
            console.log("签到天数:" + currentDay);
            msg = GetReward(currentDay);
            console.log("\n签到奖励:" + msg);
            $zqzess.notify("🔔不挂科签到", "签到第" + currentDay + "天", msg);
            $zqzess.done()
        }
    })
}

function GetReward(currentDay) {
    var msg = "未获得签到奖励"
    if (currentDay == 2) {
        return msg = "获得百度文库vip一天,请前往app手动领取"
    } else if (currentDay == 4) {
        return msg = "获得京东阅读vip月卡,请前往app手动领取"
    } else if (currentDay == 7) {
        return msg = "获得屈臣氏vip月卡,请前往app手动领取"
    } else if (currentDay == 10) {
        return msg = "获得论文查重券一张,请前往app手动领取"
    } else if (currentDay == 14) {
        return msg = "获得酷我畅听vip季卡,请前往app手动领取"
    } else if (currentDay == 17) {
        return msg = "获乔布简历年卡,请前往app手动领取"
    } else if (currentDay == 21) {
        return msg = "获得爱奇艺vip月卡,请前往app手动领取\n签到完成，请关闭脚本"
    }
    return msg
}

function GetCookie() {
    var headerCookie = $request.headers["Cookie"];
    var authurl = $request.url;
    var authUA = $request.headers["User-Agent"];
    if (headerCookie) {
        if ($zqzess.read("CookieBGK") != undefined) {
            if ($zqzess.read("CookieBGK") != headerCookie) {
                if (headerCookie.indexOf("BDUSS") != -1) {
                    var cookie = $zqzess.write(headerCookie, "CookieBGK");
                    if (!cookie) {
                        $zqzess.notify("更新不挂科Cookie失败‼️", "", "");
                    } else {
                        $zqzess.notify("更新不挂科Cookie成功 🎉", "", "");
                    }
                }
            }
        } else {
            if (headerCookie.indexOf("BDUSS") != -1) {
                var cookie = $zqzess.write(headerCookie, "CookieBGK");
                if (!cookie) {
                    $zqzess.notify("首次写不挂科Cookie失败‼️", "", "");
                } else {
                    $zqzess.notify("首次写不挂科Cookie成功 🎉", "", "");
                }
            }
        }
    }

    if (authurl) {
        if ($zqzess.read("UrlBGK") != undefined) {
            if ($zqzess.read("UrlBGK") != authurl) {
                if (authurl.indexOf("https") != -1) {
                    var url = $zqzess.write(authurl, "UrlBGK");
                    if (!url) {
                        $zqzess.notify("更新不挂科url失败‼️", "", "");
                    } else {
                        $zqzess.notify("更新不挂科url成功 🎉", "", "");
                    }
                }

            }
        } else {
            if (authurl.indexOf("https") != -1) {
                var url = $zqzess.write(authurl, "UrlBGK");
                if (!url) {
                    $zqzess.notify("首次写不挂科url失败‼️", "", "");
                } else {
                    $zqzess.notify("首次写入不挂科url成功 🎉", "", "");
                }
            }
        }
    }
    if (authUA) {
        if ($zqzess.read("UABGK") != undefined) {
            if ($zqzess.read("UABGK") != authUA) {
                var ua = $zqzess.write(authUA, "UABGK");
                if (!ua) {
                    $zqzess.notify("更新不挂科UA失败‼️", "", "");
                }
            }
        } else {
            var ua = $zqzess.write(authUA, "UABGK");
            if (!ua) {
                $zqzess.notify("首次写入不挂科UA失败‼️", "", "");
            }
        }
    }
    $zqzess.done()
}

function zqzess() {
    const isRequest = typeof $request != "undefined"
    const isSurge = typeof $httpClient != "undefined"
    const isQuanX = typeof $task != "undefined"
    const notify = (title, subtitle, message) => {
        if (isQuanX) $notify(title, subtitle, message)
        if (isSurge) $notification.post(title, subtitle, message)
        console.log(`${title}\n${subtitle}\n${message}`)
    }
    const log = (message) => console.log(message)
    const write = (value, key) => {
        if (isQuanX) return $prefs.setValueForKey(value, key)
        if (isSurge) return $persistentStore.write(value, key)
    }
    const read = (key) => {
        if (isQuanX) return $prefs.valueForKey(key)
        if (isSurge) return $persistentStore.read(key)
    }
    const adapterStatus = (response) => {
        if (response) {
            if (response.status) {
                response["statusCode"] = response.status
            } else if (response.statusCode) {
                response["status"] = response.statusCode
            }
        }
        return response
    }
    const get = (options, callback) => {
        if (isQuanX) {
            if (typeof options == "string") options = {
                url: options
            }
            options["method"] = "GET"
            $task.fetch(options).then(response => {
                callback(null, adapterStatus(response), response.body)
            }, reason => callback(reason.error, null, null))
        }
        if (isSurge) $httpClient.get(options, (error, response, body) => {
            callback(error, adapterStatus(response), body)
        })
    }
    const post = (options, callback) => {
        if (isQuanX) {
            if (typeof options == "string") options = {
                url: options
            }
            options["method"] = "POST"
            $task.fetch(options).then(response => {
                callback(null, adapterStatus(response), response.body)
            }, reason => callback(reason.error, null, null))
        }
        if (isSurge) {
            $httpClient.post(options, (error, response, body) => {
                callback(error, adapterStatus(response), body)
            })
        }
    }
    const done = (value = {}) => {
        if (isQuanX) return $done(value)
        if (isSurge) isRequest ? $done(value) : $done()
    }
    return {
        isRequest,
        notify,
        log,
        write,
        read,
        get,
        post,
        done
    }
};