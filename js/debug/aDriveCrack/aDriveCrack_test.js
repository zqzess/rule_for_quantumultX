/*

 阿里云盘虚假vip，解锁60fps，4倍速播放等vip功能，空间容量增加到40Tb(能否正常使用暂未测试)
 目前仅测试surge
 作者@zqzess
 本脚本仅供学习，请下载后24小时内删除

 hostname = api.aliyundrive.com , member.aliyundrive.com
 正则表达式: ^https:\/\/(api|member)\.aliyundrive\.com\/(adrive|v1|v2|business|databox)\/.+\/(me|vip|feature|info|get_personal_info|driveCapacityDetails)
 脚本：https://raw.githubusercontent.com/zqzess/rule_for_quantumultX/master/js/debug/aDriveCrack/aDriveCrack_test.js

 */
let $zqzess = zqzess(true)
let Premium = $response.body
if(!Premium) $zqzess.done()
let modified = Premium
if(isJsonString(Premium))
{
    modified = JSON.parse(Premium)
}
if(modified.rightButtonText)
{
    // body2
    console.log('修改会员有效期')
    modified = {
        "rightButtonText": "立即续费",
        "identity": "svip",
        "level": "8t",
        "titleNotice": null,
        "titleImage": "https:\/\/gw.alicdn.com\/imgextra\/i1\/O1CN01Z2Yv4u1jrJ5S5TYpo_!!6000000004601-2-tps-216-60.png",
        "description": "有效期至2024-01-30"
    }
} else if(modified.dayDiscPrice)
{
    // body6
    console.log('修改会员功能')
    modified.identity = 'svip'
    let features = modified.features
    features.forEach(function (i){
        i.name === '限免' ? i.name = 'VIP' : i.name
        if(i.intercept) i.intercept = false
        i.name === '会员' ? i.name = 'VIP' : i.name
        if(i.backgroundImage) i.backgroundImage = 'https:\/\/gw.alicdn.com\/imgextra\/i3\/O1CN01E7Gm7E1ZHRsDrNlLa_!!6000000003169-2-tps-84-42.png'
        if(i.features)
        {
            i.features.forEach(function (m){
                m.intercept = false
            })
        }
    })
}
else if(modified.personal_rights_info)
{
    // body4
    console.log('修改用户账户信息和限制权限')
    modified.personal_rights_info.spu_id = 'vip'
    modified.personal_rights_info.name = 'SVIP'
    modified.personal_space_info.total_size = 43980465111040 // 40Tb
}
else if(modified.drive_total_size && modified.default_drive_used_size)
{
    // body5
    console.log('修改容量管理总容量')
    modified.drive_total_size = 43980465111040 // 40Tb
}else if(modified.membershipIdentity && modified.userId)
{
    // body7
    console.log('修改用户基础信息')
    modified.membershipIdentity = 'svip'
    modified.membershipIcon = 'https://gw.alicdn.com//imgextra//i3//O1CN01iPKCuZ1urjDgiry5c_!!6000000006091-2-tps-60-60.png'
}
else
{
    // body1
    console.log('修改会员状态')
    modified = {
        "identity": "svip",
        "level": "8t",
        "icon": "https://gw.alicdn.com/imgextra/i3/O1CN01iPKCuZ1urjDgiry5c_!!6000000006091-2-tps-60-60.png",
        "mediumIcon": "https://gw.alicdn.com/imgextra/i4/O1CN01Mk916Y1c99aVBrgxM_!!6000000003557-2-tps-222-60.png",
        "status": "normal",
        "vipList": [{
            "name": "8TB超级会员",
            "code": "svip.8t",
            "promotedAt": 1675599847,
            "expire": 1706600189
        }]
    }
}
function isJsonString(str) {
    // 判断是否是json字符串
    try {
        if (typeof JSON.parse(str) == "object") {
            // 解析后是object说明未解析前是字符串，需要解析
            return true;
        }
    } catch(e) {}
    return false;
}
$zqzess.done({body: JSON.stringify(modified)})

/*********************************
 * environment
 * ********************************
 */
// Modified from yichahucha
function zqzess(isTrue) {
    const start = Date.now()
    const isRequest = typeof $request != 'undefined'
    const isSurge = typeof $httpClient != 'undefined'
    const isQuanX = typeof $task != 'undefined'
    const isLoon = typeof $loon != 'undefined'
    const isJSBox = typeof $app != 'undefined' && typeof $http != 'undefined'
    const isNode = typeof require == 'function' && !isJSBox
    const NodeSet = 'CookieSet.json'
    let isDoneBody = isTrue
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
        if (isSurge) isRequest ? $done(value) : $done()}
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