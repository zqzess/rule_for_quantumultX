/*
【南京工业大学校园网自动登录】@zqzess
【仓库地址】https://github.com/zqzess/rule_for_quantumultX（欢迎star🌟）
【仓库地址】https://github.com/zqzess/Njtech-AutoLogin（欢迎star🌟）
【BoxJs】https://raw.githubusercontent.com/zqzess/rule_for_quantumultX/master/js/Mine/boxjs.json
【更新时间】2022-7-1
【致谢】
感谢Peng-YM的OpenAPI.js！
⚠️【免责声明】
------------------------------------------
1、此脚本仅用于学习研究，不保证其合法性、准确性、有效性，请根据情况自行判断，本人对此不承担任何保证责任。
2、由于此脚本仅用于学习研究，您必须在下载后 24 小时内将所有内容从您的计算机或手机或任何存储设备中完全删除，若违反规定引起任何事件本人对此均不负责。
3、请勿将此脚本用于任何商业或非法目的，若违反规定请自行对此负责。
4、此脚本涉及应用与本人无关，本人对因此引起的任何隐私泄漏或其他后果不承担任何责任。
5、本人对任何脚本引发的问题概不负责，包括但不限于由脚本错误引起的任何损失和损害。
6、如果任何单位或个人认为此脚本可能涉嫌侵犯其权利，应及时通知并提供身份证明，所有权证明，我们将在收到认证文件确认后删除此脚本。
7、所有直接或间接使用、查看此脚本的人均应该仔细阅读此声明。本人保留随时更改或补充此声明的权利。一旦您使用或复制了此脚本，即视为您已接受此免责声明。
【使用说明】
南京工业大学宿舍网 Njtech-Home 无线网自动登录

【Surge】
-----------------

两种使用方法
- 可以在将脚本内容复制，在本地新建脚本，类型选择event或cron，然后禁用，ios捷径新增自动化，选择当加入Njetch-Home Wi-Fi时 执行surg脚本，填入脚本名称，完成。**缺点：此捷径会弹出通知，需要手动点击运行**
- 本地添加脚本(event类型，触发事件是network-changed)或者安装模块，每一次网络改变都会触发脚本，脚本内置Wi-Fi ssid识别,是Njtech-Home时会执行登录，其他忽略

**本地新建的脚本，可以之间把账户密码填写在脚本内**

**模块安装的脚本需要借助boxjs填写或者在surge $persistentStore内添加字段**
- > $persistentStore 添加字段njtechAutoLogin,填入 {"njtech_id":"学号","njtech_pwd":"密码","njtech_option":"@telecom"}
- > [BoxJs说明文档](https://github.com/chavyleung/boxjs-doc)
- > [BoxJs模块](https://raw.githubusercontent.com/chavyleung/scripts/master/box/rewrite/boxjs.rewrite.surge.sgmodule)
- > boxjs模块开启后访问`http://boxjs.com`,添加下面的链接订阅boxjs应用
- > [boxjs内订阅](https://raw.githubusercontent.com/zqzess/rule_for_quantumultX/master/js/Mine/boxjs.json)

[Script]
NjetchAutologin = type=event,script-path=https://raw.githubusercontent.com/zqzess/rule_for_quantumultX/master/js/Mine/NjtechAutoLogin/NjtechAutoLogin.js,event-name=network-changed,timeout=6

########################

【Quantumult X】
-----------------

需要配合捷径使用，捷径新增自动化，选择无线局域网，选取Njtech-Home，下一步搜索Quantumult X，运行js脚本，填入脚本路径(存在本地的脚本填入NjtechAutoLogin.js即可)

QuantumultX的好处就是可以不用启动QuantumultX就可以运行脚本，但是同样，捷径会弹窗需要手动点击运行

**本地存放脚本的可以把学号密码写死脚本内，远程的需要订阅boxjs配置文件填写账户密码**

- > [BoxJs说明文档](https://github.com/chavyleung/boxjs-doc)
- > [BoxJs重写订阅](https://raw.githubusercontent.com/chavyleung/scripts/master/box/rewrite/boxjs.rewrite.quanx.conf)
- > boxjs模块开启后访问`http://boxjs.com`,添加下面的链接订阅boxjs应用
- > [boxjs内订阅](https://raw.githubusercontent.com/zqzess/rule_for_quantumultX/master/js/Mine/boxjs.json)


QuantumultX配置文件`[task_local]`   添加以下链接

[task_local]
0 7 * * * https://raw.githubusercontent.com/zqzess/rule_for_quantumultX/master/js/Mine/NjtechAutoLogin/NjtechAutoLogin.js, tag=南京工业大学校园网自动登录

##########################

【NodeJs】
-----------------

需要把脚本内
```
$.userid = $.read("njtech_id");
$.userpwd = $.read("njtech_pwd");
$.optionitem = $.read("njtech_option");
```
改为
```
$.userid = '学号';
$.userpwd = '密码';
$.optionitem = '@telecom';
```
*/
const $ = new API("njtechAutoLogin", false);

$.userid = $.read("njtech_id");
$.userpwd = $.read("njtech_pwd");
$.optionitem = $.read("njtech_option");
$.wifi2 = $.read("njtech_wifi2");

// $.userid = '学号';
// $.userpwd = '密码';
// $.optionitem = '@telecom';  //中国电信填写 @telecom ，中国移动填写 @cmcc

let flag = $.userid !== "" && $.userid !== null && $.userid !== undefined && $.userpwd !== "" && $.userpwd !== null && $.userpwd !== undefined && $.optionitem !== "" && $.optionitem !== null && $.optionitem !== undefined;


const getAddr = 'https://u.njtech.edu.cn/cas/login?service=https://u.njtech.edu.cn/oauth2/authorize?client_id=Oe7wtp9CAMW0FVygUasZ&response_type=code&state=njtech'
const postAddr = 'https://u.njtech.edu.cn/cas/login?service=https%3A%2F%2Fu.njtech.edu.cn%2Foauth2%2Fauthorize%3Fclient_id%3DOe7wtp9CAMW0FVygUasZ%26response_type%3Dcode%26state%3Dnjtech%26s%3Df682b396da8eb53db80bb072f5745232'
const headers = {
    'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.5 Mobile/15E148 Safari/604.1',
    'Accept': '*/*',
    'Accept-Language': 'zh-CN,zh;q=0.9',
    'Content-Type': 'application/x-www-form-urlencoded',
    'Connection': 'keep-alive',
};

const {isQX, isLoon, isSurge, isScriptable, isNode} = ENV();
let loginInfo = {};
let notifyTitle = "Njtech-Home"

!(async () => {
    let isStart = false;
    if (isSurge) {
        const network = $network.wifi.ssid;
        $.info(network);
        if (network === 'Njtech-Home') {
            isStart = true;
        }
        if ($.wifi2 !== "" && $.wifi2 !== null && $.wifi2 !== undefined) {
            if (network === $.wifi2) {
                isStart = true;
                notifyTitle = $.wifi2;
            }
        }
    }
    if (isStart) {
        if (flag) {
            await getLoginInfo();
            await startLogin();
        } else
            $.notify(notifyTitle, "", "❌ 请先填写登录信息");
    }
})()
    .catch((err) => {
        $.error(err);
    })
    .finally(() => $.done());


function getLoginInfo() {
    if (isSurge || isQX)
        headers['Cookie'] = 'JSESSIONID=6E065A716A506E060241DBBBE7A60C6E.TomcatB;';
    $.log(headers)
    return $.http.get({
        url: getAddr,
        headers
    }).then(resp => {
        const headers = resp.headers;
        $.log(headers);
        let cookie1 = ''
        let cookie2 = ''
        let cookie = ''
        if (isNode) {
            cookie1 = headers["set-cookie"][0];
            cookie1 = cookie1.replace(' Path=/cas; HttpOnly', '');
            cookie2 = headers["set-cookie"][1];
            cookie2 = cookie2.replace('; path=/', '');
            cookie = cookie1 + ' ' + cookie2;
        } else if (isSurge || isQX) {
            cookie1 = headers["Set-Cookie"];
            cookie1 = cookie1.replace(' Path=/cas; HttpOnly,', '');
            cookie = cookie1.replace('; path=/', '');
        }
        $.log(cookie);
        let obj = resp.body;
        // let tmp = obj.match('input type="hidden" name="lt" value=\".+\" \/> <input');
        let lt_new = obj.match(/input type="hidden" name="lt" value=\"(\S*)\" \/>/)[1];
        $.log(lt_new);
        let execution_new = obj.match(/type="hidden" name="execution" value=\"(\S*)\" \/>/)[1];
        $.log(execution_new);
        loginInfo = {"cookie": cookie, "lt": lt_new, "execution": execution_new};
    })
}

function startLogin() {
    $.info(loginInfo);
    $.log("自动登录数据填充")
    let optionitem = '中国电信';
    if ($.optionitem === '@cmcc')
        optionitem = '中国移动';
    else if ($.optionitem === 'default')
        optionitem = '校园内网';
    let post_data = '';   //最终要提交的数据
    let pre_data = `username=${$.userid}&password=${$.userpwd}&channelshow=${optionitem}&channel=${$.optionitem}&lt=${loginInfo["lt"]}&execution=${loginInfo["execution"]}&_eventId=submit&submit=登录`
    let pre_data2 = {
        "username": $.userid,
        "password": $.userpwd,
        "channelshow": optionitem,
        "channel": $.optionitem,
        "lt": loginInfo["lt"],
        "execution": loginInfo["execution"],
        "_eventId": "submit",
        "submit": "登录"
    }
    headers['Cookie'] = loginInfo["cookie"];
    if (isNode)
        post_data = pre_data;
    if (isSurge || isQX)
        post_data = pre_data;
    $.info(post_data);
    $.info(headers);
    return $.http.post({
        url: postAddr,
        body: post_data,
        headers: headers,
    }).then(async resp => {
        if (isNode) {
            if (resp.statusCode === 302) {
                await $.http.get({
                    url: "https://www.baidu.com",
                    timeout: 5000,
                    headers,
                    events: {
                        onTimeout: () => {
                            $.error("登录失败")
                            $.notify(
                                notifyTitle,
                                "❌ 登录失败",
                                "请尝试手动登录！"
                            );
                        }
                    }
                }).then(resp => {
                    if (resp.statusCode === 200)
                        $.notify(
                            notifyTitle,
                            "✅️ 成功",
                            "自动登录成功！"
                        );
                }).catch((error) => {
                    $.log(error);
                });
            } else {
                $.notify(
                    notifyTitle,
                    "❌ 登录失败",
                    "请尝试手动登录！"
                );
            }
        } else {
            if (resp.statusCode === 200) {
                await $.http.get({
                    url: "https://www.baidu.com",
                    headers
                }).then(resp => {
                    if (resp.statusCode === 200) {
                        $.notify(
                            notifyTitle,
                            "✅️ 成功",
                            "自动登录成功！"
                        );
                    } else {
                        $.notify(
                            notifyTitle,
                            "❌ 登录失败",
                            "请尝试手动登录！"
                        );
                    }
                }).catch((error) => {
                    $.log(error);
                });
            }
        }
    })
}

/**
 * OpenAPI
 * @author: Peng-YM
 * https://github.com/Peng-YM/QuanX/blob/master/Tools/OpenAPI/README.md
 */
function ENV() {
    const isQX = typeof $task !== "undefined";
    const isLoon = typeof $loon !== "undefined";
    const isSurge = typeof $httpClient !== "undefined" && !isLoon;
    const isJSBox = typeof require == "function" && typeof $jsbox != "undefined";
    const isNode = typeof require == "function" && !isJSBox;
    const isRequest = typeof $request !== "undefined";
    const isScriptable = typeof importModule !== "undefined";
    return {
        isQX,
        isLoon,
        isSurge,
        isNode,
        isJSBox,
        isRequest,
        isScriptable,
    };
}

function HTTP(
    defaultOptions = {
        baseURL: "",
    }
) {
    const {isQX, isLoon, isSurge, isScriptable, isNode} = ENV();
    const methods = ["GET", "POST", "PUT", "DELETE", "HEAD", "OPTIONS", "PATCH"];
    const URL_REGEX =
        /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/;

    function send(method, options) {
        options =
            typeof options === "string"
                ? {
                    url: options,
                }
                : options;
        const baseURL = defaultOptions.baseURL;
        if (baseURL && !URL_REGEX.test(options.url || "")) {
            options.url = baseURL ? baseURL + options.url : options.url;
        }
        if (options.body && options.headers && !options.headers["Content-Type"]) {
            options.headers["Content-Type"] = "application/x-www-form-urlencoded";
        }
        options = {
            ...defaultOptions,
            ...options,
        };
        const timeout = options.timeout;
        const events = {
            ...{
                onRequest: () => {
                },
                onResponse: (resp) => resp,
                onTimeout: () => {
                },
            },
            ...options.events,
        };

        events.onRequest(method, options);

        let worker;
        if (isQX) {
            worker = $task.fetch({
                method,
                ...options,
            });
        } else if (isLoon || isSurge || isNode) {
            worker = new Promise((resolve, reject) => {
                const request = isNode ? require("request") : $httpClient;
                request[method.toLowerCase()](options, (err, response, body) => {
                    if (err) reject(err);
                    else
                        resolve({
                            statusCode: response.status || response.statusCode,
                            headers: response.headers,
                            body,
                        });
                });
            });
        } else if (isScriptable) {
            const request = new Request(options.url);
            request.method = method;
            request.headers = options.headers;
            request.body = options.body;
            worker = new Promise((resolve, reject) => {
                request
                    .loadString()
                    .then((body) => {
                        resolve({
                            statusCode: request.response.statusCode,
                            headers: request.response.headers,
                            body,
                        });
                    })
                    .catch((err) => reject(err));
            });
        }

        let timeoutid;
        const timer = timeout
            ? new Promise((_, reject) => {
                timeoutid = setTimeout(() => {
                    events.onTimeout();
                    return reject(
                        `${method} URL: ${options.url} exceeds the timeout ${timeout} ms`
                    );
                }, timeout);
            })
            : null;

        return (
            timer
                ? Promise.race([timer, worker]).then((res) => {
                    clearTimeout(timeoutid);
                    return res;
                })
                : worker
        ).then((resp) => events.onResponse(resp));
    }

    const http = {};
    methods.forEach(
        (method) =>
            (http[method.toLowerCase()] = (options) => send(method, options))
    );
    return http;
}

function API(name = "untitled", debug = false) {
    const {isQX, isLoon, isSurge, isNode, isJSBox, isScriptable} = ENV();
    return new (class {
        constructor(name, debug) {
            this.name = name;
            this.debug = debug;

            this.http = HTTP();
            this.env = ENV();

            this.node = (() => {
                if (isNode) {
                    const fs = require("fs");

                    return {
                        fs,
                    };
                } else {
                    return null;
                }
            })();
            this.initCache();

            const delay = (t, v) =>
                new Promise(function (resolve) {
                    setTimeout(resolve.bind(null, v), t);
                });

            Promise.prototype.delay = function (t) {
                return this.then(function (v) {
                    return delay(t, v);
                });
            };
        }

        // persistence
        // initialize cache
        initCache() {
            if (isQX) this.cache = JSON.parse($prefs.valueForKey(this.name) || "{}");
            if (isLoon || isSurge)
                this.cache = JSON.parse($persistentStore.read(this.name) || "{}");

            if (isNode) {
                // create a json for root cache
                let fpath = "root.json";
                if (!this.node.fs.existsSync(fpath)) {
                    this.node.fs.writeFileSync(
                        fpath,
                        JSON.stringify({}),
                        {
                            flag: "wx",
                        },
                        (err) => console.log(err)
                    );
                }
                this.root = {};

                // create a json file with the given name if not exists
                fpath = `${this.name}.json`;
                if (!this.node.fs.existsSync(fpath)) {
                    this.node.fs.writeFileSync(
                        fpath,
                        JSON.stringify({}),
                        {
                            flag: "wx",
                        },
                        (err) => console.log(err)
                    );
                    this.cache = {};
                } else {
                    this.cache = JSON.parse(
                        this.node.fs.readFileSync(`${this.name}.json`)
                    );
                }
            }
        }

        // store cache
        persistCache() {
            const data = JSON.stringify(this.cache, null, 2);
            if (isQX) $prefs.setValueForKey(data, this.name);
            if (isLoon || isSurge) $persistentStore.write(data, this.name);
            if (isNode) {
                this.node.fs.writeFileSync(
                    `${this.name}.json`,
                    data,
                    {
                        flag: "w",
                    },
                    (err) => console.log(err)
                );
                this.node.fs.writeFileSync(
                    "root.json",
                    JSON.stringify(this.root, null, 2),
                    {
                        flag: "w",
                    },
                    (err) => console.log(err)
                );
            }
        }

        write(data, key) {
            this.log(`SET ${key}`);
            if (key.indexOf("#") !== -1) {
                key = key.substr(1);
                if (isSurge || isLoon) {
                    return $persistentStore.write(data, key);
                }
                if (isQX) {
                    return $prefs.setValueForKey(data, key);
                }
                if (isNode) {
                    this.root[key] = data;
                }
            } else {
                this.cache[key] = data;
            }
            this.persistCache();
        }

        read(key) {
            this.log(`READ ${key}`);
            if (key.indexOf("#") !== -1) {
                key = key.substr(1);
                if (isSurge || isLoon) {
                    return $persistentStore.read(key);
                }
                if (isQX) {
                    return $prefs.valueForKey(key);
                }
                if (isNode) {
                    return this.root[key];
                }
            } else {
                return this.cache[key];
            }
        }

        delete(key) {
            this.log(`DELETE ${key}`);
            if (key.indexOf("#") !== -1) {
                key = key.substr(1);
                if (isSurge || isLoon) {
                    return $persistentStore.write(null, key);
                }
                if (isQX) {
                    return $prefs.removeValueForKey(key);
                }
                if (isNode) {
                    delete this.root[key];
                }
            } else {
                delete this.cache[key];
            }
            this.persistCache();
        }

        // notification
        notify(title, subtitle = "", content = "", options = {}) {
            const openURL = options["open-url"];
            const mediaURL = options["media-url"];

            if (isQX) $notify(title, subtitle, content, options);
            if (isSurge) {
                $notification.post(
                    title,
                    subtitle,
                    content + `${mediaURL ? "\n多媒体:" + mediaURL : ""}`,
                    {
                        url: openURL,
                    }
                );
            }
            if (isLoon) {
                let opts = {};
                if (openURL) opts["openUrl"] = openURL;
                if (mediaURL) opts["mediaUrl"] = mediaURL;
                if (JSON.stringify(opts) === "{}") {
                    $notification.post(title, subtitle, content);
                } else {
                    $notification.post(title, subtitle, content, opts);
                }
            }
            if (isNode || isScriptable) {
                const content_ =
                    content +
                    (openURL ? `\n点击跳转: ${openURL}` : "") +
                    (mediaURL ? `\n多媒体: ${mediaURL}` : "");
                if (isJSBox) {
                    const push = require("push");
                    push.schedule({
                        title: title,
                        body: (subtitle ? subtitle + "\n" : "") + content_,
                    });
                } else {
                    console.log(`${title}\n${subtitle}\n${content_}\n\n`);
                }
            }
        }

        // other helper functions
        log(msg) {
            if (this.debug) console.log(`[${this.name}] LOG: ${this.stringify(msg)}`);
        }

        info(msg) {
            console.log(`[${this.name}] INFO: ${this.stringify(msg)}`);
        }

        error(msg) {
            console.log(`[${this.name}] ERROR: ${this.stringify(msg)}`);
        }

        wait(millisec) {
            return new Promise((resolve) => setTimeout(resolve, millisec));
        }

        done(value = {}) {
            if (isQX || isLoon || isSurge) {
                $done(value);
            } else if (isNode && !isJSBox) {
                if (typeof $context !== "undefined") {
                    $context.headers = value.headers;
                    $context.statusCode = value.statusCode;
                    $context.body = value.body;
                }
            }
        }

        stringify(obj_or_str) {
            if (typeof obj_or_str === "string" || obj_or_str instanceof String)
                return obj_or_str;
            else
                try {
                    return JSON.stringify(obj_or_str, null, 2);
                } catch (err) {
                    return "[object Object]";
                }
        }
    })(name, debug);
}
