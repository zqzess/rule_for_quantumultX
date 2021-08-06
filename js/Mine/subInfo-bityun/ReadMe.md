# 机场订阅信息查询

由于surge订阅信息看不到，一开始用Peng-YM大佬的机场流量查询脚本，后来发现某云看不到订阅有效期，所以就改写了Peng-YM大佬的脚本，
主要添加某云的的订阅信息获取，顺便改了一下通知显示


```ruby
账号信息需要填写在boxjs脚本配置里面
```

************************
Surge 4.2.0+ 脚本配置:


```
[Script]
机场订阅信息 = type=cron,cronexp=2 9 * * *,script-path=https://raw.githubusercontent.com/zqzess/rule_for_quantumultX/master/js/Mine/subInfo-bityun/subInfoForBY.js,script-update-interval=0
```

************************