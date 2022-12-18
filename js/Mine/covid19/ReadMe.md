# 疫情信息监控
```ruby
点击通知会跳转新闻详情页，surge选择Panel面板使用的用户，可以在BoxJs里面关闭通知
```
【Surge】
-----------------
两种使用方法
- Panel面板展示
- Cron定时执行提醒

**需要BoxJs配合修改城市或省份**

- > [BoxJs说明文档](https://github.com/chavyleung/boxjs-doc)
- > [BoxJs模块](https://raw.githubusercontent.com/chavyleung/scripts/master/box/rewrite/boxjs.rewrite.surge.sgmodule)
- > boxjs模块开启后访问`http://boxjs.com`,添加下面的链接订阅boxjs应用
- > [boxjs内订阅](https://raw.githubusercontent.com/zqzess/rule_for_quantumultX/master/js/Mine/boxjs.json)

[covid19模块订阅 -->](https://raw.githubusercontent.com/zqzess/rule_for_quantumultX/master/Surge/Module/COVID19.sgmodule)

### 配置文件手动添加
- Panel面板
```ini
[Script]
covid19 = type = generic,script-path=https://raw.githubusercontent.com/zqzess/rule_for_quantumultX/master/js/Mine/covid19/covid19.js,timeout=10
[Panel]
COVID-19 = script-name=covid19,title=疫情信息,content=请刷新,style=info,update-interval=7200
```
- Cron定时任务
```ini
[Script]
covid19 = type = cron, cronexp=0 7,10 * * *, script-path=https://raw.githubusercontent.com/zqzess/rule_for_quantumultX/master/js/Mine/covid19/covid19.js,timeout=10
```
-----------------
【NodeJs】
---------
直接运行既可，可能需要`npm install request`安装缺失的模块

---------
【Quantumult X】
---------
只能用定时任务

**需要BoxJs配合修改城市或省份**
 
- > [BoxJs说明文档](https://github.com/chavyleung/boxjs-doc)
- > [BoxJs重写订阅](https://raw.githubusercontent.com/chavyleung/scripts/master/box/rewrite/boxjs.rewrite.quanx.conf)
- > boxjs模块开启后访问`http://boxjs.com`,添加下面的链接订阅boxjs应用
- > [boxjs内订阅](https://raw.githubusercontent.com/zqzess/rule_for_quantumultX/master/js/Mine/boxjs.json)

### 配置文件手动添加
QuantumultX配置文件`[task_local]`   添加以下链接
```editorconfig
0 7,10 * * * https://raw.githubusercontent.com/zqzess/rule_for_quantumultX/master/js/Mine/covid19/covid19.js, tag=疫情信息监控
```
---------
【Loon】
---------
只能用定时任务

**需要BoxJs配合修改城市或省份**
- > [BoxJs说明文档](https://github.com/chavyleung/boxjs-doc)
- > [BoxJs插件](https://raw.githubusercontent.com/chavyleung/scripts/master/box/rewrite/boxjs.rewrite.loon.plugin)
- > boxjs插件开启后访问`http://boxjs.com`,添加下面的链接订阅boxjs应用
- > [boxjs内订阅](https://raw.githubusercontent.com/zqzess/rule_for_quantumultX/master/js/Mine/boxjs.json)

只支持定时任务，通知推送信息

[covid19插件订阅 -->](https://raw.githubusercontent.com/zqzess/rule_for_quantumultX/master/Loon/Plugin/COVID19.plugin)
### 配置文件手动添加
```ini
cron "0 7,10 * * *" script-path=https://raw.githubusercontent.com/zqzess/rule_for_quantumultX/master/js/Mine/covid19/covid19.js, tag=疫情信息监控, img-url=https://raw.githubusercontent.com/zqzess/pichouse/master/pic/covid-19.jpg
enable = true
```
---------
【Scriptable】
-------

使用方法，倒入脚本至app，修改脚本内的城市名称

[点击倒入模块](https://raw.githubusercontent.com/zqzess/rule_for_quantumultX/master/Scriptable/covid19/Covid-19.scriptable)

[点击倒入脚本](https://raw.githubusercontent.com/zqzess/rule_for_quantumultX/master/js/Mine/covid19/covid19.js)

---------

【Stash】
---

**需要BoxJs配合修改城市或省份**

- > [BoxJs说明文档](https://github.com/chavyleung/boxjs-doc)
- > [BoxJs复写](https://github.com/chavyleung/scripts/raw/master/box/rewrite/boxjs.rewrite.stash.stoverride)
- > boxjs模块开启后访问`http://boxjs.com`,添加下面的链接订阅boxjs应用
- > [boxjs内订阅](https://raw.githubusercontent.com/zqzess/rule_for_quantumultX/master/js/Mine/boxjs.json)


支持Tiles(Stash 2.0+)

[复制链接倒入复写](https://raw.githubusercontent.com/zqzess/rule_for_quantumultX/master/Stash/override/COVID19.stoverride)

-----

【Shadowrocket】
---

**需要BoxJs配合修改城市或省份**

- > [BoxJs说明文档](https://github.com/chavyleung/boxjs-doc)
- > [BoxJs复写](https://github.com/chavyleung/scripts/raw/master/box/rewrite/boxjs.rewrite.surge.sgmodule)
- > boxjs模块开启后访问`http://boxjs.com`,添加下面的链接订阅boxjs应用
- > [boxjs内订阅](https://raw.githubusercontent.com/zqzess/rule_for_quantumultX/master/js/Mine/boxjs.json)

只支持定时任务，通知推送信息

[covid19模块 -->](https://raw.githubusercontent.com/zqzess/rule_for_quantumultX/master/Shadowrocket/module/COVID19.module)