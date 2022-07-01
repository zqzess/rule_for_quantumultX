# 南京工业大学校园网 Njtech-Home 自动登录
```ruby
目前在surge和nodejs环境下可用，其他未做测试
```

【Surge】
-----------------
两种使用方法
- 可以在将脚本内容复制，在本地新建脚本，类型选择event或cron，然后禁用，ios捷径新增自动化，选择当加入Njetch-Home Wi-Fi时 执行surg脚本，填入脚本名称，完成。**缺点：此捷径会弹出通知，需要手动点击运行**
- 本地添加脚本(event类型，触发事件是network-changed)或者安装模块，每一次网络改变都会触发脚本，脚本内置Wi-Fi ssid识别,是Njtech-Home时会执行登录，其他忽略

**本地新建的脚本，可以之间把账户密码填写在脚本内，boxjs模块开启后访问`http://boxjs.com`**

- [BoxJs模块](https://raw.githubusercontent.com/chavyleung/scripts/master/box/rewrite/boxjs.rewrite.surge.sgmodule)
- [boxjs内订阅](https://raw.githubusercontent.com/zqzess/rule_for_quantumultX/master/js/Mine/boxjs.json)


**模块安装的脚本需要借助boxjs填写或者在surge $persistentStore内添加字段**

```ini
[Script]
NjetchAutologin = type = event,script-path=https://raw.githubusercontent.com/zqzess/rule_for_quantumultX/master/js/Mine/NjtechAutoLogin/NjtechAutoLogin.js,event-name=network-changed,timeout=6
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