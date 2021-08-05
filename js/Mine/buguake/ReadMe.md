# 不挂科app签到领爱奇艺会员脚本

***使用脚本有黑号风险**

***兼容***: 理论上兼容QuantumultX, Surge4, Loon，但是目前只在surge4上做过测试


获取Cookie说明：

打开不挂科App后(AppStore中国区, 非内部版)，点击"我的->签到福利"或者点击"首页"搜索框右上角鸟图标, 如通知成功获取cookie和url, 则可以使用此签到脚本.

获取Cookie后, 请将Cookie脚本重写禁用并移除主机名，以免产生不必要的MITM.

脚本将在每天上午9:00执行, 您可以修改执行时间。



************************
Surge 4.2.0+ 脚本配置:
************************
```
[Script]
不挂科签到 = type=cron,cronexp=0 9 * * *,script-path=https://raw.githubusercontent.com/zqzess/rule_for_quantumultX/master/js/Mine/buguake/buguake.js
不挂科获取Cookie = type=http-request,pattern=https:\/\/appwk\.baidu\.com\/naapi\/stsign\/activity\?bid,script-path=https://raw.githubusercontent.com/zqzess/rule_for_quantumultX/master/js/Mine/buguake/buguake.js
[MITM] 
hostname= appwk.baidu.com
```
************************
QuantumultX 远程脚本配置:
************************
```
[task_local]
# 不挂科签到
0 9 * * * [https://](https://raw.githubusercontent.com/zqzess/rule_for_quantumultX/master/js/Mine/buguake/buguake.js)
[rewrite_local]
# 获取Cookie
https:\/\/appwk\.baidu\.com\/naapi\/stsign\/activity\?bid url script-request-header [https://](https://raw.githubusercontent.com/zqzess/rule_for_quantumultX/master/js/Mine/buguake/buguake.js)
[mitm] 
hostname= appwk.baidu.com
```
************************
Loon 2.1.0+ 脚本配置:
************************
```
[Script]
# 不挂科签到
cron "0 9 * * *" script-path=https://raw.githubusercontent.com/zqzess/rule_for_quantumultX/master/js/Mine/buguake/buguake.js,tag=不挂科签到
# 获取Cookie
http-request https:\/\/appwk\.baidu\.com\/naapi\/stsign\/activity\?bid script-path=https://raw.githubusercontent.com/zqzess/rule_for_quantumultX/master/js/Mine/buguake/buguake.js, tag=不挂科cookie
[Mitm] 
hostname= appwk.baidu.com
```