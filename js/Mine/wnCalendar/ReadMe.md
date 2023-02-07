# 今日黄历与倒数日
```ruby
surge和stash支持面板和通知双显示，其他仅支持通知显示(定时任务)
```
## 导航
--> [surge](#surge)

--> [nodejs](#nodejs)

--> [quantumultx](#quantumult-x)

--> [loon](#loon)

--> [scriptable](#scriptable)

--> [stash](#stash)

--> [shadowrocket](#shadowrocket)

【Surge】
-----------------
两种使用方法
- Panel面板展示
- Cron定时执行提醒

**需要BoxJs配合填写自定义日期**

- > [BoxJs说明文档](https://github.com/chavyleung/boxjs-doc)
- > [BoxJs模块](https://raw.githubusercontent.com/chavyleung/scripts/master/box/rewrite/boxjs.rewrite.surge.sgmodule)
- > boxjs模块开启后访问`http://boxjs.com`,添加下面的链接订阅boxjs应用
- > [boxjs内订阅](https://raw.githubusercontent.com/zqzess/rule_for_quantumultX/master/js/Mine/boxjs.json)

[今日黄历模块订阅 -->](https://raw.githubusercontent.com/zqzess/rule_for_quantumultX/master/Surge/Module/wnCalendar.sgmodule)

[倒数日](https://raw.githubusercontent.com/zqzess/rule_for_quantumultX/master/Surge/Module/DaysMatter.sgmodule)

### 配置文件手动添加
- Panel面板
```ini
[Script]
wnCalendar = type = generic,script-path=https://raw.githubusercontent.com/zqzess/rule_for_quantumultX/master/js/Mine/wnCalendar/wnCalendar.js,timeout=10
[Panel]
wnCalendar = script-name=wnCalendar,title=今日黄历,content=请刷新,style=info,update-interval=28800
```
**倒数日**
```ini
[Script]
DaysMatter = type = generic,script-path=https://raw.githubusercontent.com/zqzess/rule_for_quantumultX/master/js/Mine/wnCalendar/DaysMatter.js,timeout=10
[Panel]
DaysMatter = script-name=DaysMatter,title=倒数日,content=请刷新,style=info,update-interval=28800
```
- Cron定时任务
```ini
[Script]
wnCalendar = type = cron, cronexp=0 9 * * *, script-path=https://raw.githubusercontent.com/zqzess/rule_for_quantumultX/master/js/Mine/wnCalendar/wnCalendar.js,timeout=10
```
**倒数日**
```ini
[Script]
DaysMatter = type = cron, cronexp=30 8 * * *, script-path=https://raw.githubusercontent.com/zqzess/rule_for_quantumultX/master/js/Mine/wnCalendar/DaysMatter.js,timeout=10
```
-----------------
【NodeJs】
---------
直接运行既可，可能需要`npm install request`安装缺失的模块

---------
【Quantumult X】
---------
只能用定时任务

**需要BoxJs配合填写自定义日期**
 
- > [BoxJs说明文档](https://github.com/chavyleung/boxjs-doc)
- > [BoxJs重写订阅](https://raw.githubusercontent.com/chavyleung/scripts/master/box/rewrite/boxjs.rewrite.quanx.conf)
- > boxjs模块开启后访问`http://boxjs.com`,添加下面的链接订阅boxjs应用
- > [boxjs内订阅](https://raw.githubusercontent.com/zqzess/rule_for_quantumultX/master/js/Mine/boxjs.json)

### 配置文件手动添加
QuantumultX配置文件`[task_local]`   添加以下链接
```editorconfig
0 9 * * * https://raw.githubusercontent.com/zqzess/rule_for_quantumultX/master/js/Mine/wnCalendar/wnCalendar.js, tag=今日黄历
```
**倒数日**
```editorconfig
30 8 * * * https://raw.githubusercontent.com/zqzess/rule_for_quantumultX/master/js/Mine/wnCalendar/DaysMatter.js, tag=倒数日
```
---------
【Loon】
---------
只能用定时任务

**需要BoxJs配合填写自定义日期**
- > [BoxJs说明文档](https://github.com/chavyleung/boxjs-doc)
- > [BoxJs插件](https://raw.githubusercontent.com/chavyleung/scripts/master/box/rewrite/boxjs.rewrite.loon.plugin)
- > boxjs插件开启后访问`http://boxjs.com`,添加下面的链接订阅boxjs应用
- > [boxjs内订阅](https://raw.githubusercontent.com/zqzess/rule_for_quantumultX/master/js/Mine/boxjs.json)

只支持定时任务，通知推送信息

[今日黄历插件订阅 -->](https://raw.githubusercontent.com/zqzess/rule_for_quantumultX/master/Loon/Plugin/wnCalendar.plugin)

[倒数日-->](https://raw.githubusercontent.com/zqzess/rule_for_quantumultX/master/Loon/Plugin/DaysMatter.plugin)
### 配置文件手动添加
```ini
cron "0 9 * * *" script-path=https://raw.githubusercontent.com/zqzess/rule_for_quantumultX/master/js/Mine/wnCalendar/wnCalendar.js, tag=今日黄历, img-url=https://raw.githubusercontent.com/walkxcode/dashboard-icons/main/png/synology-calendar.png
enable = true
```
**倒数日**
```ini
cron "30 8 * * *" script-path=https://raw.githubusercontent.com/zqzess/rule_for_quantumultX/master/js/Mine/wnCalendar/DaysMatter.js, tag=倒数日, img-url=https://cdn.jsdelivr.net/gh/zqzess/pichouse@master/pic/202302061207406.jpg
enable = true
```
---------
【Scriptable】
-------

---------

【Stash】
---

**需要BoxJs配合填写自定义日期**

- > [BoxJs说明文档](https://github.com/chavyleung/boxjs-doc)
- > [BoxJs复写](https://github.com/chavyleung/scripts/raw/master/box/rewrite/boxjs.rewrite.stash.stoverride)
- > boxjs模块开启后访问`http://boxjs.com`,添加下面的链接订阅boxjs应用
- > [boxjs内订阅](https://raw.githubusercontent.com/zqzess/rule_for_quantumultX/master/js/Mine/boxjs.json)


支持Tiles(Stash 2.0+)

[今日黄历复写](https://raw.githubusercontent.com/zqzess/rule_for_quantumultX/master/Stash/override/wnCalendar.stoverride)

[倒数日复写](https://raw.githubusercontent.com/zqzess/rule_for_quantumultX/master/Stash/override/DaysMatter.stoverride)

-----

【Shadowrocket】
---

**需要BoxJs配合填写自定义日期**

- > [BoxJs说明文档](https://github.com/chavyleung/boxjs-doc)
- > [BoxJs复写](https://github.com/chavyleung/scripts/raw/master/box/rewrite/boxjs.rewrite.surge.sgmodule)
- > boxjs模块开启后访问`http://boxjs.com`,添加下面的链接订阅boxjs应用
- > [boxjs内订阅](https://raw.githubusercontent.com/zqzess/rule_for_quantumultX/master/js/Mine/boxjs.json)

只支持定时任务，通知推送信息

[今日黄历模块 -->](https://raw.githubusercontent.com/zqzess/rule_for_quantumultX/master/Shadowrocket/module/wnCalendar.module)

[倒数日模块](https://raw.githubusercontent.com/zqzess/rule_for_quantumultX/master/Shadowrocket/module/DaysMatter.module)