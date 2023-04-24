# 阿里网盘签到
```ruby
打开阿里云盘等待token获取通知，已实现token自刷新，只需要首次写入token，以后无需手动刷新，boxjs选择是否关闭自动领取奖励，默认自动领取
```
## 导航
--> [surge](#surge)

--> [quantumultx](#quantumult-x)

--> [loon](#loon)

--> [stash](#stash)

--> [Shadowrocket](#shadowrocket)

【Surge】
-----------------

**BoxJs可查看refresh_token**

- > [BoxJs说明文档](https://github.com/chavyleung/boxjs-doc)
- > [BoxJs模块](https://raw.githubusercontent.com/chavyleung/scripts/master/box/rewrite/boxjs.rewrite.surge.sgmodule)
- > boxjs模块开启后访问`http://boxjs.com`,添加下面的链接订阅boxjs应用
- > [boxjs内订阅](https://raw.githubusercontent.com/zqzess/rule_for_quantumultX/master/js/Mine/boxjs.json)

[token获取模块](https://raw.githubusercontent.com/zqzess/rule_for_quantumultX/master/js/Mine/aDriveCheckIn/aDriveCheckIn_token.sgmodule)

[定时任务模块](https://raw.githubusercontent.com/zqzess/rule_for_quantumultX/master/js/Mine/aDriveCheckIn/aDriveCheckIn.sgmodule)

### 配置文件手动添加
- token获取
```ini
[Script]
阿里网盘token获取 = type=http-request,pattern=^https:\/\/auth\.aliyundrive\.com\/v2\/account\/token,requires-body=1,script-path=https://raw.githubusercontent.com/zqzess/rule_for_quantumultX/master/js/Mine/aDriveCheckIn/aDriveCheckIn.js

[MITM]
hostname = %APPEND% auth.aliyundrive.com
```
- Cron定时任务
```ini
[Script]
阿里网盘签到 = type=cron,cronexp=10 7 * * *,script-path=https://raw.githubusercontent.com/zqzess/rule_for_quantumultX/master/js/Mine/aDriveCheckIn/aDriveCheckIn.js
```

---------
【Quantumult X】
---------
**BoxJs可查看refresh_token**
 
- > [BoxJs说明文档](https://github.com/chavyleung/boxjs-doc)
- > [BoxJs重写订阅](https://raw.githubusercontent.com/chavyleung/scripts/master/box/rewrite/boxjs.rewrite.quanx.conf)
- > boxjs模块开启后访问`http://boxjs.com`,添加下面的链接订阅boxjs应用
- > [boxjs内订阅](https://raw.githubusercontent.com/zqzess/rule_for_quantumultX/master/js/Mine/boxjs.json)

[token获取重写订阅](https://raw.githubusercontent.com/zqzess/rule_for_quantumultX/master/js/Mine/aDriveCheckIn/aDriveCheckIn_token.qxrewrite)
[定时任务gallery订阅(HTTP请求)](https://raw.githubusercontent.com/zqzess/rule_for_quantumultX/master/QuantumultX/task/zqzess_taskgallery.json)
### 配置文件手动添加
QuantumultX配置文件`[task_local]`   添加以下链接
```editorconfig
10 0 * * * https://raw.githubusercontent.com/zqzess/rule_for_quantumultX/master/js/Mine/aDriveCheckIn/aDriveCheckIn.js
```
**token获取，重写订阅**
```editorconfig
^https:\/\/auth\.aliyundrive\.com\/v2\/account\/token url script-request-body https://raw.githubusercontent.com/zqzess/rule_for_quantumultX/master/js/Mine/aDriveCheckIn/aDriveCheckIn.js
[MITM]
hostname = auth.aliyundrive.com
```
---------
【Loon】
---------
**BoxJs可查看refresh_token**
- > [BoxJs说明文档](https://github.com/chavyleung/boxjs-doc)
- > [BoxJs插件](https://raw.githubusercontent.com/chavyleung/scripts/master/box/rewrite/boxjs.rewrite.loon.plugin)
- > boxjs插件开启后访问`http://boxjs.com`,添加下面的链接订阅boxjs应用
- > [boxjs内订阅](https://raw.githubusercontent.com/zqzess/rule_for_quantumultX/master/js/Mine/boxjs.json)

token获取后可前往插件关闭token获取

[签到插件订阅 -->](https://raw.githubusercontent.com/zqzess/rule_for_quantumultX/master/js/Mine/aDriveCheckIn/aDriveCheckIn.plugin)

[token获取订阅 -->](https://raw.githubusercontent.com/zqzess/rule_for_quantumultX/master/js/Mine/aDriveCheckIn/aDriveCheckIn_token.plugin)

### 配置文件手动添加
```ini
[Script]
cron "10 0 * * *" script-path=https://raw.githubusercontent.com/zqzess/rule_for_quantumultX/master/js/Mine/aDriveCheckIn/aDriveCheckIn.js, tag=阿里网盘签到

```
**token获取**
```ini
[Script]
http-request ^https:\/\/auth\.aliyundrive\.com\/v2\/account\/token script-path=https://raw.githubusercontent.com/zqzess/rule_for_quantumultX/master/js/Mine/aDriveCheckIn/aDriveCheckIn.js, requires-body=true, timeout=10, enabled=false, tag=阿里网盘token获取

[MITM]
hostname = auth.aliyundrive.com
```
---------

【Stash】
---

**BoxJs可查看refresh_token**

- > [BoxJs说明文档](https://github.com/chavyleung/boxjs-doc)
- > [BoxJs复写](https://github.com/chavyleung/scripts/raw/master/box/rewrite/boxjs.rewrite.stash.stoverride)
- > boxjs模块开启后访问`http://boxjs.com`,添加下面的链接订阅boxjs应用
- > [boxjs内订阅](https://raw.githubusercontent.com/zqzess/rule_for_quantumultX/master/js/Mine/boxjs.json)
  

[token获取复写](https://raw.githubusercontent.com/zqzess/rule_for_quantumultX/master/js/Mine/aDriveCheckIn/aDriveCheckIn_token.stoverride)

[签到复写](https://raw.githubusercontent.com/zqzess/rule_for_quantumultX/master/js/Mine/aDriveCheckIn/aDriveCheckIn.stoverride)

-----

【Shadowrocket】
---

**BoxJs可查看refresh_token**

- > [BoxJs说明文档](https://github.com/chavyleung/boxjs-doc)
- > [BoxJs复写](https://github.com/chavyleung/scripts/raw/master/box/rewrite/boxjs.rewrite.surge.sgmodule)
- > boxjs模块开启后访问`http://boxjs.com`,添加下面的链接订阅boxjs应用
- > [boxjs内订阅](https://raw.githubusercontent.com/zqzess/rule_for_quantumultX/master/js/Mine/boxjs.json)

只支持定时任务，通知推送信息

[签到及token获取模块](https://raw.githubusercontent.com/zqzess/rule_for_quantumultX/master/js/Mine/aDriveCheckIn/aDriveCheckIn.module)
