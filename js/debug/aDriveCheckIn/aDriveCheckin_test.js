let $zqzess = nobyda()

let authorization = $zqzess.read("@ADrive.authorization")
let authUA = $zqzess.read("@ADrive.authUA")
let xua = $zqzess.read("@ADrive.xua")
let xcanary = $zqzess.read("@ADrive.xcanary")
let xumt = $zqzess.read("@ADrive.xumt")
let authUrl = $zqzess.read("@ADrive.authUrl")

let title = '🔔阿里云盘签到'

if ($zqzess.isRequest && $request.url === 'https://member.aliyundrive.com/v1/activity/sign_in_list') {
    console.log('🤖获取cookie')
    GetCookie()
} else {
    console.log('🤖签到操作')
    signCheckin()
}

function GetCookie() {
    let authorization = $request.headers["authorization"]
    let authUrl = $request.url
    let authUA = $request.headers["user-agent"]
    let xua = $request.headers["x-ua"]
    let xcanary = $request.headers["x-canary"]
    let xumt = $request.headers["x-umt"]
    if (authorization) {
        if ($zqzess.read("@ADrive.authorization") !== undefined) {
            if ($zqzess.read("@ADrive.authorization") !== authorization) {
                if (authorization.indexOf("Bearer") !== -1) {
                    let cookie = $zqzess.write(authorization, "@ADrive.authorization")
                    $zqzess.write(authUA, "@ADrive.authUA")
                    $zqzess.write(xua, "@ADrive.xua")
                    $zqzess.write(xcanary, "@ADrive.xcanary")
                    $zqzess.write(xumt, "@ADrive.xumt")
                    $zqzess.write(authUrl, "@ADrive.authUrl")
                    if (!cookie) {
                        $zqzess.notify("更新阿里网盘验证key失败‼️", "", "")
                    } else {
                        $zqzess.notify("更新阿里网盘验证key成功 🎉", "", "")
                    }
                }
            }
        } else {
            if (authorization.indexOf("Bearer") !== -1) {
                let cookie = $zqzess.write(authorization, "@ADrive.authorization")
                $zqzess.write(authUA, "@ADrive.authUA")
                $zqzess.write(xua, "@ADrive.xua")
                $zqzess.write(xcanary, "@ADrive.xcanary")
                $zqzess.write(xumt, "@ADrive.xumt")
                $zqzess.write(authUrl, "@ADrive.authUrl")
                if (!cookie) {
                    $zqzess.notify("首次阿里网盘验证key失败‼️", "", "")
                } else {
                    $zqzess.notify("首次阿里网盘验证key成功 🎉", "", "")
                }
            }
        }
        console.log(authorization)
        console.log('\n')
        console.log(authUrl)
        console.log('\n')
        console.log(authUA)
        console.log('\n')
        console.log(xua)
        console.log('\n')
        console.log(xcanary)
        console.log('\n')
        console.log(xumt)
        console.log('\n')
    }
    $zqzess.done()
}

function signCheckin() {
    if (!authorization) {
        $zqzess.notify(title, "❌签到失败", "请先获取authorization");
        return $zqzess.done()
    }
    let date = new Date()
    let timeStamp = Date.parse(date)
    let xumtArray = xumt.split("@@")
    xumt = xumtArray[0] + '@@' + xumtArray[1] + '@@' + timeStamp
    let xuaArray = xua.split("@@")
    xua = xuaArray[0] + '@@' + xuaArray[1] + '@@' + timeStamp
    let url_fetch_sign = {
        url: authUrl,
        headers: {
            ":authority": "member.aliyundrive.com",
            "accept": "application/json, text/plain, */*",
            "authorization": authorization,
            "x-canary": xcanary,
            "x-umt": xumt,
            "origin": "https://pages.aliyundrive.com",
            "x-ua": xua,
            "user-agent": authUA,
            "referer": "https://pages.aliyundrive.com/"
        },
        body: {}
    }
    $zqzess.post(url_fetch_sign, function (error, response, data) {
        if (error) {
            console.log('错误：' + error)
            $zqzess.notify(title, "❌签到失败", "无法签到，请手动签到");
            $zqzess.done()
        } else {
            let body = JSON.parse(data);
            let signInCount = Number(body.result.signInCount)
            let isReward = body.result.isReward
            let stitle = '🎉' + body.result.title + ' 签到成功'
            let signInLogs = body.result.signInLogs
            console.log('签到天数: ' + signInCount)
            let reward = ''
            signInLogs.forEach(function (i) {
                if(Number(i.day) === signInCount)
                {
                    if(i.notice === '8TB超级会员体验卡')
                    {
                        reward = ' 第' + signInCount + '天奖励，' + i.notice + i.reward.description.replace('体验卡','')
                    }else
                    {
                        reward = ' 第' + signInCount + '天奖励，' + i.notice
                    }
                }
            })
            console.log('签到奖励：' + reward)
            if(isReward)
            {
                $zqzess.notify(title, stitle, reward);
            }else
            {
                $zqzess.notify(title, '⚠️已经签到过了', reward);
            }
            // currentDay = body.data.dayList.currentDay;
            // console.log("签到天数:" + currentDay);
            // msg = GetReward(currentDay);
            // console.log("\n签到奖励:" + msg);
            // $zqzess.notify("🔔不挂科签到", "签到第" + currentDay + "天", msg);
            $zqzess.done()
        }
    })
}

/*********************************
 * environment
 * ********************************
 */
// Modified from yichahucha
function nobyda() {
    const start = Date.now()
    const isRequest = typeof $request != "undefined"
    const isSurge = typeof $httpClient != "undefined"
    const isQuanX = typeof $task != "undefined"
    const isLoon = typeof $loon != "undefined"
    const isJSBox = typeof $app != "undefined" && typeof $http != "undefined"
    const isNode = typeof require == "function" && !isJSBox
    const NodeSet = 'CookieSet.json'
    const node = (() => {
        if (isNode) {
            const request = require('request')
            const fs = require("fs")
            const path = require("path")
            return ({
                request,
                fs,
                path
            })
        } else {
            return (null)
        }
    })()
    const notify = (title, subtitle, message, rawopts) => {
        const Opts = (rawopts) => { //Modified from https://github.com/chavyleung/scripts/blob/master/Env.js
            if (!rawopts) return rawopts
            if (typeof rawopts === 'string') {
                if (isLoon) return rawopts
                else if (isQuanX) return {
                    'open-url': rawopts
                }
                else if (isSurge) return {
                    url: rawopts
                }
                else return undefined
            } else if (typeof rawopts === 'object') {
                if (isLoon) {
                    let openUrl = rawopts.openUrl || rawopts.url || rawopts['open-url']
                    let mediaUrl = rawopts.mediaUrl || rawopts['media-url']
                    return {
                        openUrl,
                        mediaUrl
                    }
                } else if (isQuanX) {
                    let openUrl = rawopts['open-url'] || rawopts.url || rawopts.openUrl
                    let mediaUrl = rawopts['media-url'] || rawopts.mediaUrl
                    return {
                        'open-url': openUrl,
                        'media-url': mediaUrl
                    }
                } else if (isSurge) {
                    let openUrl = rawopts.url || rawopts.openUrl || rawopts['open-url']
                    return {
                        url: openUrl
                    }
                }
            } else {
                return undefined
            }
        }
        console.log(`${title}\n${subtitle}\n${message}`)
        if (isQuanX) $notify(title, subtitle, message, Opts(rawopts))
        if (isSurge) $notification.post(title, subtitle, message, Opts(rawopts))
        if (isJSBox) $push.schedule({
            title: title,
            body: subtitle ? subtitle + "\n" + message : message
        })
    }
    const write = (value, key) => {
        if (isQuanX) return $prefs.setValueForKey(value, key)
        if (isSurge) return $persistentStore.write(value, key)
        if (isNode) {
            try {
                if (!node.fs.existsSync(node.path.resolve(__dirname, NodeSet)))
                    node.fs.writeFileSync(node.path.resolve(__dirname, NodeSet), JSON.stringify({}))
                const dataValue = JSON.parse(node.fs.readFileSync(node.path.resolve(__dirname, NodeSet)))
                if (value) dataValue[key] = value
                if (!value) delete dataValue[key]
                return node.fs.writeFileSync(node.path.resolve(__dirname, NodeSet), JSON.stringify(dataValue))
            } catch (er) {
                return AnError('Node.js持久化写入', null, er)
            }
        }
        if (isJSBox) {
            if (!value) return $file.delete(`shared://${key}.txt`)
            return $file.write({
                data: $data({
                    string: value
                }),
                path: `shared://${key}.txt`
            })
        }
    }
    const read = (key) => {
        if (isQuanX) return $prefs.valueForKey(key)
        if (isSurge) return $persistentStore.read(key)
        if (isNode) {
            try {
                if (!node.fs.existsSync(node.path.resolve(__dirname, NodeSet))) return null
                const dataValue = JSON.parse(node.fs.readFileSync(node.path.resolve(__dirname, NodeSet)))
                return dataValue[key]
            } catch (er) {
                return AnError('Node.js持久化读取', null, er)
            }
        }
        if (isJSBox) {
            if (!$file.exists(`shared://${key}.txt`)) return null
            return $file.read(`shared://${key}.txt`).string
        }
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
        options.headers['User-Agent'] = 'JD4iPhone/167169 (iPhone iOS 13.4.1 Scale/3.00)'
        if (isQuanX) {
            if (typeof options == "string") options = {
                url: options
            }
            options["method"] = "GET"
            //options["opts"] = {
            //  "hints": false
            //}
            $task.fetch(options).then(response => {
                callback(null, adapterStatus(response), response.body)
            }, reason => callback(reason.error, null, null))
        }
        if (isSurge) {
            options.headers['X-Surge-Skip-Scripting'] = false
            $httpClient.get(options, (error, response, body) => {
                callback(error, adapterStatus(response), body)
            })
        }
        if (isNode) {
            node.request(options, (error, response, body) => {
                callback(error, adapterStatus(response), body)
            })
        }
        if (isJSBox) {
            if (typeof options == "string") options = {
                url: options
            }
            options["header"] = options["headers"]
            options["handler"] = function (resp) {
                let error = resp.error
                if (error) error = JSON.stringify(resp.error)
                let body = resp.data
                if (typeof body == "object") body = JSON.stringify(resp.data)
                callback(error, adapterStatus(resp.response), body)
            }
            $http.get(options)
        }
    }
    const post = (options, callback) => {
        options.headers['User-Agent'] = 'JD4iPhone/167169 (iPhone iOS 13.4.1 Scale/3.00)'
        if (options.body) options.headers['Content-Type'] = 'application/x-www-form-urlencoded'
        if (isQuanX) {
            if (typeof options == "string") options = {
                url: options
            }
            options["method"] = "POST"
            //options["opts"] = {
            //  "hints": false
            //}
            $task.fetch(options).then(response => {
                callback(null, adapterStatus(response), response.body)
            }, reason => callback(reason.error, null, null))
        }
        if (isSurge) {
            options.headers['X-Surge-Skip-Scripting'] = false
            $httpClient.post(options, (error, response, body) => {
                callback(error, adapterStatus(response), body)
            })
        }
        if (isNode) {
            node.request.post(options, (error, response, body) => {
                callback(error, adapterStatus(response), body)
            })
        }
        if (isJSBox) {
            if (typeof options == "string") options = {
                url: options
            }
            options["header"] = options["headers"]
            options["handler"] = function (resp) {
                let error = resp.error
                if (error) error = JSON.stringify(resp.error)
                let body = resp.data
                if (typeof body == "object") body = JSON.stringify(resp.data)
                callback(error, adapterStatus(resp.response), body)
            }
            $http.post(options)
        }
    }
    const AnError = (name, keyname, er, resp, body) => {
        if (typeof (merge) != "undefined" && keyname) {
            if (!merge[keyname].notify) {
                merge[keyname].notify = `${name}: 异常, 已输出日志 ‼️`
            } else {
                merge[keyname].notify += `\n${name}: 异常, 已输出日志 ‼️ (2)`
            }
            merge[keyname].error = 1
        }
        return console.log(`\n‼️${name}发生错误\n‼️名称: ${er.name}\n‼️描述: ${er.message}${JSON.stringify(er).match(/\"line\"/) ? `\n‼️行列: ${JSON.stringify(er)}` : ``}${resp && resp.status ? `\n‼️状态: ${resp.status}` : ``}${body ? `\n‼️响应: ${resp && resp.status != 503 ? body : `Omit.`}` : ``}`)
    }
    const time = () => {
        const end = ((Date.now() - start) / 1000).toFixed(2)
        return console.log('\n签到用时: ' + end + ' 秒')
    }
    const done = (value = {}) => {
        if (isQuanX) return $done(value)
        if (isSurge) isRequest ? $done(value) : $done()
    }
    return {
        AnError,
        isRequest,
        isJSBox,
        isSurge,
        isQuanX,
        isLoon,
        isNode,
        notify,
        write,
        read,
        get,
        post,
        time,
        done
    }
}
