let $zqzess = zqzess()

let refresh_token_body = $zqzess.read('@ADrive.refresh_token_body')
if (refresh_token_body)
    refresh_token_body = JSON.parse(refresh_token_body)
let headers = $zqzess.read('@ADrive.headers')
if (headers)
    headers = JSON.parse(headers)
let refresh_token = $zqzess.read('@ADrive.refresh_token') // 备用
let authUrl = 'https://auth.aliyundrive.com/v2/account/token'
let checkInUrl = 'https://member.aliyundrive.com/v1/activity/sign_in_list'
let title = '🔔阿里云盘签到'

if ($zqzess.isRequest) {
    if ($request.method !== 'OPTIONS') {
        if ($request.url !== 'http://www.apple.com/') {
            console.log('🤖获取cookie')
            GetRefresh_token()
        } else {
            console.log('🤖签到操作')
            if (refresh_token_body && headers)
            {
                getAuthorizationKey()
            }
            else {
                $zqzess.notify(title, '❌请先获取token', '')
                $zqzess.done()
            }
        }
    }
} else {
    console.log('🤖签到操作')
    if (refresh_token_body && headers)
    {
        getAuthorizationKey()
    }
    else {
        $zqzess.notify(title, '❌请先获取token', '')
        $zqzess.done()
    }
}

function GetRefresh_token() {
    let body = JSON.parse($request.body)
    let xcanary = $request.headers['x-canary']
    let authUA = $request.headers['user-agent']
    let xdeviceid = $request.headers['x-device-id']
    let cookies = $request.headers['cookie']
    let headers = {'x-canary': xcanary, 'user-agent': authUA, 'x-device-id': xdeviceid, 'cookie': cookies}
    let refresh_token2 = body.refresh_token
    console.log('refresh_token: ' + refresh_token2)
    if (refresh_token2) {
        if ($zqzess.read('@ADrive.refresh_token')) {
            if ($zqzess.read('@ADrive.refresh_token') !== refresh_token2) {
                let t = $zqzess.write(JSON.stringify(body), '@ADrive.refresh_token_body')
                let t2 = $zqzess.write(refresh_token2, '@ADrive.refresh_token')
                let t3 = $zqzess.write(JSON.stringify(headers), '@ADrive.headers')
                if (t && t2 && t3) {
                    $zqzess.notify('更新阿里网盘refresh_token成功 🎉', '', '')
                } else {
                    $zqzess.notify('更新阿里网盘refresh_token失败‼️', '', '')
                }
            }
        } else {
            let t = $zqzess.write(JSON.stringify(body), '@ADrive.refresh_token_body')
            let t2 = $zqzess.write(refresh_token2, '@ADrive.refresh_token')
            let t3 = $zqzess.write(JSON.stringify(headers), '@ADrive.headers')
            if (t && t2 && t3) {
                $zqzess.notify('首次写入阿里网盘refresh_token成功 🎉', '', '')
            } else {
                $zqzess.notify('首次写入阿里网盘refresh_token失败‼️', '', '')
            }
        }
    }
    $zqzess.done()
}

function getAuthorizationKey() {
    let option = {
        url: authUrl,
        headers: {
            'content-type': 'application/json',
            'accept': '*/*',
            'accept-language': 'zh-CN,zh-Hansq=0.9',
            'x-canary': headers['x-canary'],
            'x-device-id': headers['x-device-id'],
            'cookie': headers['cookie'],
            'user-agent': headers['user-agent']
        },
        body: JSON.stringify(refresh_token_body)
    }
    console.log('获取authorization')
    $zqzess.post(option, function (error, response, data) {
        if (error) {
            console.log('错误原因：' + error)
            $zqzess.notify(title, '❌签到失败', '刷新authorization失败')
            return $zqzess.done()
        } else {
            let body = JSON.parse(data)
            let refresh_token2 = body.refresh_token
            let accessKey = 'Bearer ' + body.access_token
            if (refresh_token2) {
                refresh_token_body.refresh_token = refresh_token2
                let t = $zqzess.write(JSON.stringify(refresh_token_body), '@ADrive.refresh_token_body')
                let t2 = $zqzess.write(refresh_token2, '@ADrive.refresh_token')
                if (t && t2) {
                    // $zqzess.notify('刷新阿里网盘refresh_token成功 🎉', '', '')
                    console.log('刷新阿里网盘refresh_token成功 🎉')
                } else {
                    $zqzess.notify('刷新阿里网盘refresh_token失败‼️', '', '')
                }
            }
            signCheckin(accessKey)
        }
    })
}

function signCheckin(authorization) {
    let date = new Date()
    let timeStamp = Date.parse(date)
    let xumt = 'defaultFY1_fyjs_not_loaded@@https://pages.aliyundrive.com/mobile-page/web/dailycheck.html@@' + timeStamp
    let url_fetch_sign = {
        url: checkInUrl,
        headers: {
            ':authority': 'member.aliyundrive.com',
            'content-type': 'application/json',
            'accept': 'application/json, text/plain, */*',
            'authorization': authorization,
            'x-canary': headers['x-canary'],
            'x-umt': xumt,
            'origin': 'https://pages.aliyundrive.com',
            'x-ua': xumt,
            'user-agent': headers['user-agent'],
            'referer': 'https://pages.aliyundrive.com/'
        },
        body: JSON.stringify({})
    }
    console.log('签到开始')
    $zqzess.post(url_fetch_sign, function (error, response, data) {
        if (error) {
            console.log('错误：' + error)
            $zqzess.notify(title, '❌签到失败', '无法签到，请手动签到')
            $zqzess.done()
        } else {
            let body = JSON.parse(data)
            if(body.message!==null)
                $zqzess.done()
            let signInCount = Number(body.result.signInCount)
            let isReward = body.result.isReward
            let stitle = '🎉' + body.result.title + ' 签到成功'
            let signInLogs = body.result.signInLogs
            console.log('签到天数: ' + signInCount)
            let reward = ''
            signInLogs.forEach(function (i) {
                if (Number(i.day) === signInCount) {
                    if (i.notice === '8TB超级会员体验卡') {
                        reward = ' 第' + signInCount + '天奖励，' + i.notice + i.reward.description.replace('体验卡', '')
                    } else {
                        reward = ' 第' + signInCount + '天奖励，' + i.notice
                    }
                }
            })
            console.log('签到奖励：' + reward)
            if (isReward) {
                $zqzess.notify(title, stitle, reward)
            } else {
                $zqzess.notify(title, '⚠️已经签到过了', reward)
            }
            console.log('签到完成')
            $zqzess.done()
        }
    })
}

/*********************************
 * environment
 * ********************************
 */
// Modified from yichahucha
function zqzess() {
    const start = Date.now()
    const isRequest = typeof $request != 'undefined'
    const isSurge = typeof $httpClient != 'undefined'
    const isQuanX = typeof $task != 'undefined'
    const isLoon = typeof $loon != 'undefined'
    const isJSBox = typeof $app != 'undefined' && typeof $http != 'undefined'
    const isNode = typeof require == 'function' && !isJSBox
    const NodeSet = 'CookieSet.json'
    const node = (() => {
        if (isNode) {
            const request = require('request')
            const fs = require('fs')
            const path = require('path')
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
            body: subtitle ? subtitle + '\n' + message : message
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
                response['statusCode'] = response.status
            } else if (response.statusCode) {
                response['status'] = response.statusCode
            }
        }
        return response
    }
    const get = (options, callback) => {
        options.headers['User-Agent'] = 'JD4iPhone/167169 (iPhone iOS 13.4.1 Scale/3.00)'
        if (isQuanX) {
            if (typeof options == 'string') options = {
                url: options
            }
            options['method'] = 'GET'
            //options['opts'] = {
            //  'hints': false
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
            if (typeof options == 'string') options = {
                url: options
            }
            options['header'] = options['headers']
            options['handler'] = function (resp) {
                let error = resp.error
                if (error) error = JSON.stringify(resp.error)
                let body = resp.data
                if (typeof body == 'object') body = JSON.stringify(resp.data)
                callback(error, adapterStatus(resp.response), body)
            }
            $http.get(options)
        }
    }
    // Modified by zqzess
    const post = (options, callback) => {
        if (!options.headers['User-Agent'] && !options.headers['user-agent']) {
            options.headers['User-Agent'] = 'JD4iPhone/167169 (iPhone iOS 13.4.1 Scale/3.00)'
        }
        if (options.body) {
            if (!options.headers['Content-Type'] && !options.headers['content-type']) {
                options.headers['Content-Type'] = 'application/x-www-form-urlencoded'
            }
        }
        if (isQuanX) {
            if (typeof options == 'string') options = {
                url: options
            }
            options['method'] = 'POST'
            //options['opts'] = {
            //  'hints': false
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
            if (typeof options == 'string') options = {
                url: options
            }
            options['header'] = options['headers']
            options['handler'] = function (resp) {
                let error = resp.error
                if (error) error = JSON.stringify(resp.error)
                let body = resp.data
                if (typeof body == 'object') body = JSON.stringify(resp.data)
                callback(error, adapterStatus(resp.response), body)
            }
            $http.post(options)
        }
    }
    const AnError = (name, keyname, er, resp, body) => {
        if (typeof (merge) != 'undefined' && keyname) {
            if (!merge[keyname].notify) {
                merge[keyname].notify = `${name}: 异常, 已输出日志 ‼️`
            } else {
                merge[keyname].notify += `\n${name}: 异常, 已输出日志 ‼️ (2)`
            }
            merge[keyname].error = 1
        }
        return console.log(`\n‼️${name}发生错误\n‼️名称: ${er.name}\n‼️描述: ${er.message}${JSON.stringify(er).match(/\'line\'/) ? `\n‼️行列: ${JSON.stringify(er)}` : ``}${resp && resp.status ? `\n‼️状态: ${resp.status}` : ``}${body ? `\n‼️响应: ${resp && resp.status != 503 ? body : `Omit.`}` : ``}`)
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
