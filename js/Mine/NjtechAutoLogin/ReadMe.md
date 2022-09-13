# 南京工业大学校园网 Njtech-Home 自动登录
```ruby
目前在surge、Quantumult、nodejs环境下可用，其他未做测试
```

【Surge】
-----------------
两种使用方法
- 可以在将脚本内容复制，在本地新建脚本，类型选择event或cron，然后禁用，ios捷径新增自动化，选择当加入Njetch-Home Wi-Fi时 执行surg脚本，填入脚本名称，完成。**缺点：此捷径会弹出通知，需要手动点击运行，而且需要保持surge处于开启状态**
- 本地添加脚本(event类型，触发事件是network-changed)或者安装模块，每一次网络改变都会触发脚本，脚本内置Wi-Fi ssid识别,是Njtech-Home时会执行登录，其他忽略

**本地新建的脚本，可以之间把账户密码填写在脚本内**

**模块安装的脚本需要借助boxjs填写或者在surge $persistentStore内添加字段**
- > $persistentStore 添加字段njtechAutoLogin,填入 {"njtech_id":"学号","njtech_pwd":"密码","njtech_option":"@telecom"}
- > [BoxJs说明文档](https://github.com/chavyleung/boxjs-doc)
- > [BoxJs模块](https://raw.githubusercontent.com/chavyleung/scripts/master/box/rewrite/boxjs.rewrite.surge.sgmodule)
- > boxjs模块开启后访问`http://boxjs.com`,添加下面的链接订阅boxjs应用
- > [boxjs内订阅](https://raw.githubusercontent.com/zqzess/rule_for_quantumultX/master/js/Mine/boxjs.json)

[自动登录模块订阅 -->](https://raw.githubusercontent.com/zqzess/rule_for_quantumultX/master/Surge/Module/NjtechAutoLogin.sgmodule)

```ini
[Script]
NjetchAutologin = type = event,script-path=https://raw.githubusercontent.com/zqzess/rule_for_quantumultX/master/js/Mine/NjtechAutoLogin/NjtechAutoLogin.js,event-name=network-changed,timeout=10
```
-----------------
【NodeJs】
---------
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
---------
【Quantumult X】
---------
需要配合捷径使用，捷径新增自动化，选择无线局域网，选取Njtech-Home，下一步搜索Quantumult X，运行js脚本，填入脚本路径(存在本地的脚本填入NjtechAutoLogin.js即可)

QuantumultX的好处就是可以不用启动QuantumultX就可以运行脚本，但是同样，捷径会弹窗需要手动点击运行

**本地存放脚本的可以把学号密码写死脚本内，远程的需要订阅boxjs配置文件填写账户密码**
 
- > [BoxJs说明文档](https://github.com/chavyleung/boxjs-doc)
- > [BoxJs重写订阅](https://raw.githubusercontent.com/chavyleung/scripts/master/box/rewrite/boxjs.rewrite.quanx.conf)
- > boxjs模块开启后访问`http://boxjs.com`,添加下面的链接订阅boxjs应用
- > [boxjs内订阅](https://raw.githubusercontent.com/zqzess/rule_for_quantumultX/master/js/Mine/boxjs.json)

QuantumultX配置文件`[task_local]`   添加以下链接
```
0 7 * * * https://raw.githubusercontent.com/zqzess/rule_for_quantumultX/master/js/Mine/NjtechAutoLogin/NjtechAutoLogin.js, tag=南京工业大学校园网自动登录

```
---------
