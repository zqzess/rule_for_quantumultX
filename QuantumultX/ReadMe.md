# Quantumult X  
**去广告**
```ruby
去广告重写开启后请先清除缓存,QuantumultX重写需配合对应的.snippet文件
```

## 目录说明
rewrite 重写

rules 分流规则，每周自动更新

snippet 部分细分广告分流片段，手动维护

task 脚本定时任务

---
### 分流规则手动添加

<details>

```
[policy]

url-latency-benchmark=♻️ 自动选择, server-tag-regex=(?=.*)^((?!(专线|手游|游戏|(?i)IPLC|IEPL|game)).)*$, img-url=https://raw.githubusercontent.com/Koolson/Qure/master/IconSet/Auto.png
static=🚀 手动切换, resource-tag-regex=.*, img-url=https://raw.githubusercontent.com/Koolson/Qure/master/IconSet/Static.png
round-robin=🔮 负载均衡, server-tag-regex=.*, img-url=https://raw.githubusercontent.com/Koolson/Qure/master/IconSet/Round_Robin.png

#节点地区分类
static=🇭🇰 香港节点, server-tag-regex=(?=.*(香港|HK|(?i)Hong))^((?!(专线|手游|游戏|(?i)IPLC|IEPL|game)).)*$, img-url=https://raw.githubusercontent.com/Koolson/Qure/master/IconSet/Hong_Kong.png
static=🇯🇵 日本节点, server-tag-regex=(?=.*(日本|JP|(?i)Japan))^((?!(专线|手游|游戏|(?i)IPLC|IEPL|game)).)*$, img-url=https://raw.githubusercontent.com/Koolson/Qure/master/IconSet/Japan.png
static=🇺🇲 美国节点, server-tag-regex=(?=.*(美国|美國|洛杉矶|西雅图|费利蒙|US|(?i)States|American))^((?!(专线|手游|游戏|(?i)IPLC|IEPL|game)).)*$, img-url=https://raw.githubusercontent.com/Koolson/Qure/master/IconSet/United_States.png
static=🇨🇳 台湾节点, server-tag-regex=(?=.*(台湾|台灣|TW|(?i)Taiwan))^((?!(专线|手游|游戏|(?i)IPLC|IEPL|game)).)*$, img-url=https://raw.githubusercontent.com/Koolson/Qure/master/IconSet/TW.png
static=🇰🇷 韩国节点, server-tag-regex=(?=.*(韩国|韓國|南朝鲜|KR|(?i)Korean))^((?!(专线|手游|游戏|(?i)IPLC|IEPL|game)).)*$, img-url=https://raw.githubusercontent.com/Koolson/Qure/master/IconSet/Korea.png
static=🇷🇺 俄罗斯节点, server-tag-regex=(?=.*(俄罗斯|俄羅斯|RU|(?i)Russia))^((?!(专线|手游|游戏|(?i)IPLC|IEPL|game)).)*$, img-url=https://cdn.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Russia.png
static=🇸🇬 新加坡节点, server-tag-regex=(?=.*(新加坡|狮城|SG|(?i)Singapore))^((?!(专线|手游|游戏|(?i)IPLC|IEPL|game)).)*$, img-url=https://cdn.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Singapore.png

# 其中 CMedia 策略组为中国媒体，GMedia 为国际媒体，Outside 为境外链接，Mainland 为大陆链接，Others 为最终规则
static=AdBlock, reject, direct, img-url=https://raw.githubusercontent.com/GeQ1an/Rules/master/QuantumultX/IconSet/AdBlock.png
static=Apple, direct, Outside, 🚀 节点选择,img-url=https://raw.githubusercontent.com/GeQ1an/Rules/master/QuantumultX/IconSet/Apple.png
static=AppleIOSUpdate, reject, direct,img-url=https://raw.githubusercontent.com/GeQ1an/Rules/master/QuantumultX/IconSet/Apple.png
static=Microsoft, direct, Outside, 🚀 节点选择,img-url=https://raw.githubusercontent.com/GeQ1an/Rules/master/QuantumultX/IconSet/Microsoft.png
static=Netflix, Outside, direct, 🚀 节点选择,img-url=https://raw.githubusercontent.com/GeQ1an/Rules/master/QuantumultX/IconSet/Netflix.png
static=YouTube, Outside, direct, 🚀 节点选择,img-url=https://raw.githubusercontent.com/GeQ1an/Rules/master/QuantumultX/IconSet/YouTube.png
static=GMedia, Outside, direct, 🚀 节点选择,img-url=https://raw.githubusercontent.com/GeQ1an/Rules/master/QuantumultX/IconSet/GMedia.png
static=CMedia, direct, proxy, img-url=https://raw.githubusercontent.com/GeQ1an/Rules/master/QuantumultX/IconSet/CMedia.png
static=Speedtest, Outside, direct, 🚀 节点选择,img-url=https://raw.githubusercontent.com/GeQ1an/Rules/master/QuantumultX/IconSet/Speedtest.png
static=Outside, proxy, direct, ♻️ 自动选择,🔮 负载均衡,🚀 手动切换,🇭🇰 香港节点,🇯🇵 日本节点,🇨🇳 台湾节点,🇺🇲 美国节点,🇰🇷 韩国节点,🇷🇺 俄罗斯节点,🇸🇬 新加坡节点,img-url=https://raw.githubusercontent.com/GeQ1an/Rules/master/QuantumultX/IconSet/Outside.png
static=Mainland, direct, proxy, img-url=https://raw.githubusercontent.com/GeQ1an/Rules/master/QuantumultX/IconSet/Mainland.png
static=Others, Outside, direct, ♻️ 自动选择,🔮 负载均衡,🚀 手动切换,🇭🇰 香港节点,🇯🇵 日本节点,🇨🇳 台湾节点,🇺🇲 美国节点,🇰🇷 韩国节点,🇷🇺 俄罗斯节点,🇸🇬 新加坡节点,🚀 节点选择,img-url=https://raw.githubusercontent.com/GeQ1an/Rules/master/QuantumultX/IconSet/Others.png
```
```
[filter_remote]
#广告屏蔽
https://raw.githubusercontent.com/zqzess/rule_for_quantumultX/master/QuantumultX/rules/AdBlock.list, force-policy=AdBlock,tag=AdBlock , enabled=true
https://raw.githubusercontent.com/zqzess/rule_for_quantumultX/master/QuantumultX/rules/FanQieNovel.list, tag=番茄小说广告, update-interval=86400, enabled=true
#苹果服务
https://raw.githubusercontent.com/zqzess/rule_for_quantumultX/master/QuantumultX/rules/Apple.list, force-policy=Apple,tag=Apple , enabled=true
#苹果ios更新屏蔽
https://raw.githubusercontent.com/zqzess/rule_for_quantumultX/master/QuantumultX/rules/AppleIOSUpdate.list, force-policy=AppleIOSUpdate,tag=AppleIOSUpdate,enabled=true
#微软
https://raw.githubusercontent.com/zqzess/rule_for_quantumultX/master/QuantumultX/rules/Microsoft.list, force-policy=Microsoft,tag=Microsoft , enabled=true
#奈飞
https://raw.githubusercontent.com/zqzess/rule_for_quantumultX/master/QuantumultX/rules/Netflix.list, force-policy=Netflix,tag=Netflix , enabled=true
#油管
https://raw.githubusercontent.com/zqzess/rule_for_quantumultX/master/QuantumultX/rules/YouTube.list, force-policy=YouTube,tag=YouTube , enabled=true
#spotify
https://raw.githubusercontent.com/DivineEngine/Profiles/master/Quantumult/Filter/StreamingMedia/Music/Spotify.list, tag=Spotify, force-policy=Spotify, update-interval=86400, opt-parser=false, enabled=true
#国际媒体
https://raw.githubusercontent.com/zqzess/rule_for_quantumultX/master/QuantumultX/rules/GMedia.list, force-policy=GMedia,tag=GMedia , enabled=true
#国内媒体
https://raw.githubusercontent.com/zqzess/rule_for_quantumultX/master/QuantumultX/rules/CMedia.list, force-policy=CMedia,tag=CMedia , enabled=true
#speedtest测速
https://raw.githubusercontent.com/GeQ1an/Rules/master/QuantumultX/Filter/Speedtest.list, force-policy=Speedtest,tag=Speedtest , enabled=true
#国外网站
https://raw.githubusercontent.com/zqzess/rule_for_quantumultX/master/QuantumultX/rules/Outside.list, force-policy=Outside,tag=Outside , enabled=true
#大陆
https://raw.githubusercontent.com/zqzess/rule_for_quantumultX/master/QuantumultX/rules/Mainland.list, force-policy=Mainland,tag=Mainland , enabled=true
```
```
[filter_local]
host-suffix, local, direct
ip-cidr, 10.0.0.0/8, direct
ip-cidr, 17.0.0.0/8, direct
ip-cidr, 100.64.0.0/10, direct
ip-cidr, 127.0.0.0/8, direct
ip-cidr, 172.16.0.0/12, direct
ip-cidr, 192.168.0.0/16, direct
geoip, cn, Mainland
final, Others
```
</details>

-----
### 订阅
- 番茄小说广告屏蔽
  + 分流片段: [FanQieNovel.snippet](https://raw.githubusercontent.com/zqzess/rule_for_quantumultX/master/QuantumultX/snippet/FanQieNovel.snippet)
  + 重写: [FanQieNovel.qxrewrite](https://raw.githubusercontent.com/zqzess/rule_for_quantumultX/master/QuantumultX/rewrite/FanQieNovel.qxrewrite)
  + 说明: 两者配合使用
- Safari聚合搜索百度版
  + 重写: [Qsearch.qxrewrite](https://raw.githubusercontent.com/zqzess/rule_for_quantumultX/master/QuantumultX/rewrite/Qsearch.qxrewrite)
  + 说明: 
- Safari聚合搜索Mac平台
  + 重写: [QsearchMac](https://raw.githubusercontent.com/zqzess/rule_for_quantumultX/master/QuantumultX/rewrite/QsearchMac.qxrewrite)
  + 说明: 
- 谷歌搜索重定向
  + 重写: [googleRedirect.qxrewrite](https://raw.githubusercontent.com/zqzess/rule_for_quantumultX/master/QuantumultX/rewrite/googleRedirect.qxrewrite)
  + 说明: 
- 百度系app广告屏蔽
  + 分流片段: [baiduApp.snippet](https://raw.githubusercontent.com/zqzess/rule_for_quantumultX/master/QuantumultX/snippet/baiduApp.snippet)
  + 重写: [baiduAd.qxrewrite](https://raw.githubusercontent.com/zqzess/rule_for_quantumultX/master/QuantumultX/rewrite/baiduAd.qxrewrite)
  + 说明: 两者配合使用
- QQ音乐开屏广告
  + 分流片段: [QMusic.snippet](https://raw.githubusercontent.com/zqzess/rule_for_quantumultX/master/QuantumultX/snippet/QMusicAd.snippet)
- backiee壁纸广告
  + 分流片段: [backiee.snippet](https://raw.githubusercontent.com/zqzess/rule_for_quantumultX/master/QuantumultX/snippet/backiee.snippet)

**其他未列出请详见仓库**
----
### 定时任务
使用方法：
1. 打开QuantumultX，点击右下角风车
2. 向下滑动，找到 工具&分析 下的HTTP请求
3. 点击 HTTP请求，顶部一共有5个按钮，从左往右，第一个是返回，第二个是任务库，第三个是持久化数据，第四个开关定时任务，第五个新增
4. 从左往右，点击第二个按钮，点击顶部右边+号按钮
5. 第一次使用，弹出的窗口会默认填充app作者的示例仓库，点击 好的 添加。(内置示例仓库可添加可不添加)
6. 复制 [任务仓库](https://raw.githubusercontent.com/zqzess/rule_for_quantumultX/master/QuantumultX/task/zqzess_taskgallery.json) 链接并倒入app

### 完整配置文件参考示例

**两个版本配置文件均无定时任务**
- [简洁版-->](https://raw.githubusercontent.com/zqzess/rule_for_quantumultX/master/QuantumultX/zqzess_lite.conf)
- [策略组复杂带节点地区分类-->](https://raw.githubusercontent.com/zqzess/rule_for_quantumultX/master/QuantumultX/zqzess.conf)

**使用方法：**
Quan X主界面，点击右下角风车，然后弹出界面下拉至 配置文件-下载，点击下载,将任一配置文件地址粘贴

```ruby
PS:
 要开启重写功能需先配置证书并信任再开启MitM证书
```