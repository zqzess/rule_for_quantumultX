# rule_for_quantumultX
自用圈X规则，GithubAction定期自动从上游拉取资源整合更新，部分手动维护

**去广告**

```ruby
去广告重写开启后请先清除缓存,QuantumultX重写需配合ReFix修正规则
```
 > - [x] 一般化广告
 > - [ ] spotify去广告加强
 > - [x] youtube去广告加强(已修复短视频无法加载问题)
 > - [x] 书旗小说去广告(规则与重写较多,可能误杀,文章内‘全场畅读无广告’清除缓存无效请卸载重装书旗)
 > - [x] 番茄小说去章内末广告(且用且珍惜)
 > - [x] 每日优鲜、百度地图开屏广告屏蔽(不起作用先清缓存)
 > - [x] 百度云盘广告屏蔽(会员与非会员开屏广告不同，测试的是会员，可能需要重装app)
 > - [ ] 更多

***ps:***
-->[详细广告屏蔽列表](https://github.com/zqzess/rule_for_quantumultX/blob/master/AdBlockList.md)
## 项目地址

---------------------
[github-->](https://github.com/zqzess/rule_for_quantumultX)

[gitee-->](https://gitee.com/zqzess/rule_for_quantumult-x)

[我的博客-->](https://www.whitemoon.top)

[推荐一套彩色图标](https://github.com/Semporia/Hand-Painted-icon)


## 目录
------------------------
```ruby
 谷歌搜索重定向已经整合至重写规则
```
- ->~~[Google搜索中国，香港，日本重定向](./谷歌搜索重定向.md)~~
- ->[自制脚本](#自制脚本)
- ->[圈x配置文件](#QuantumultX配置文件)
- ->[Loon配置文件](#Loon配置文件)
- ->[Surge配置文件](#Surge配置文件)
- ->[参考](#参考)
  
    -------------------------------
### QuantumultX配置文件

[详细介绍--->](https://github.com/zqzess/rule_for_quantumultX/tree/master/QuantumultX)

**重写规则合集订阅**

```
[rewrite_remote]
https://raw.githubusercontent.com/zqzess/rule_for_quantumultX/master/QuantumultX/rewrite/MyRewrite.conf, tag=zqzess自用rewrite, update-interval=86400, opt-parser=false, enabled=true
```
youtube 广告屏蔽单文件订阅，已修复短视频无法加载问题
```
[rewrite_remote]
https://raw.githubusercontent.com/zqzess/rule_for_quantumultX/master/QuantumultX/rewrite/youtube.qxrewrite, tag=youtube广告屏蔽, update-interval=86400, opt-parser=false, enabled=true
```
谷歌重定向
```
[rewrite_remote]
https://raw.githubusercontent.com/zqzess/rule_for_quantumultX/master/QuantumultX/rewrite/googleRedirect.qxrewrite, tag=谷歌重定向, update-interval=86400, opt-parser=false, enabled=true
```

**完整配置文件**
```ruby
两个版本配置文件均无定时任务
```

- [简洁版-->](https://raw.githubusercontent.com/zqzess/rule_for_quantumultX/master/QuantumultX/zqzess_lite.conf)

- [策略组复杂带节点地区分类-->](https://raw.githubusercontent.com/zqzess/rule_for_quantumultX/master/QuantumultX/zqzess.conf)

    --------------------
### Loon配置文件
- [完整配置文件](https://raw.githubusercontent.com/zqzess/rule_for_quantumultX/master/Loon/zqzess_Loon.conf)
- [脚本订阅](https://raw.githubusercontent.com/zqzess/rule_for_quantumultX/master/Loon/js/js.conf)
- [复写订阅](https://raw.githubusercontent.com/zqzess/rule_for_quantumultX/master/Loon/Rewrite/zqzess_Rewrite.conf)
- [广告屏蔽插件](https://raw.githubusercontent.com/zqzess/rule_for_quantumultX/master/Loon/Plugin/AdBlock.plugin)
- [哔哩哔哩增强插件搬运整合](https://raw.githubusercontent.com/zqzess/rule_for_quantumultX/master/Loon/Plugin/bilibili.plugin)
- [酷我增强插件整合](https://raw.githubusercontent.com/zqzess/rule_for_quantumultX/master/Loon/Plugin/kuwo.plugin)
- [知乎增强插件搬运整合](https://raw.githubusercontent.com/zqzess/rule_for_quantumultX/master/Loon/Plugin/zhihu.plugin)
- [百度系广告屏蔽](https://raw.githubusercontent.com/zqzess/rule_for_quantumultX/master/Loon/Plugin/BaiduAdBlock.plugin)
- [波点音乐mv屏蔽](https://raw.githubusercontent.com/zqzess/rule_for_quantumultX/master/Loon/Plugin/bodianMusic.plugin)
- [youtube广告屏蔽](https://raw.githubusercontent.com/zqzess/rule_for_quantumultX/master/Loon/Plugin/YouTubeAd.plugin)
-[spotify会员解锁 by app2smile](https://raw.githubusercontent.com/app2smile/rules/master/plugin/spotify.plugin)

    -----------------
### Surge配置文件
```ruby
 配置文件仅供参考，导入后须自行修改才能正常使用
```
- [完整配置文件](https://raw.githubusercontent.com/zqzess/rule_for_quantumultX/master/Surge/zqzess_surge.conf)
- [广告屏蔽模组](https://raw.githubusercontent.com/zqzess/rule_for_quantumultX/master/Surge/Module/AdBlock.sgmodule)
- [哔哩哔哩增强插件搬运整合](https://raw.githubusercontent.com/zqzess/rule_for_quantumultX/master/Surge/Module/bilibili.sqmodule)
- [酷我增强插件整合](https://raw.githubusercontent.com/zqzess/rule_for_quantumultX/master/Surge/Module/kuwo.sgmodule)
- [知乎增强插件搬运整合](https://raw.githubusercontent.com/zqzess/rule_for_quantumultX/master/Surge/Module/zhihu.sgmodule)
- [百度系广告屏蔽](https://raw.githubusercontent.com/zqzess/rule_for_quantumultX/master/Surge/Module/BaiduAdBlock.sgmodule)
- [波点音乐mv屏蔽](https://raw.githubusercontent.com/zqzess/rule_for_quantumultX/master/Surge/Module/bodianMusic.sgmodule)
- [safari全能聚合搜索-百度搜索引擎版](https://raw.githubusercontent.com/zqzess/rule_for_quantumultX/master/Surge/Module/Qsearch.sqmodule)
- [Peng-YM油猴脚本转换器surge订阅修正版](https://raw.githubusercontent.com/zqzess/rule_for_quantumultX/master/Surge/Module/GreasyFork.sgmodule)
- [youtube广告屏蔽](https://raw.githubusercontent.com/zqzess/rule_for_quantumultX/master/Surge/Module/YouTubeAd.sgmodule)
 
surge搬运：
- [高级订阅管理工具-必装](https://raw.githubusercontent.com/Peng-YM/Sub-Store/master/config/Surge.sgmodule)
- [NetFlix显示IMDB评分](https://kinta.ma/surge/netflix_rating.sgmodule)
- [BoxJs](https://raw.githubusercontent.com/chavyleung/scripts/master/box/rewrite/boxjs.rewrite.surge.sgmodule)
- [TextFight区域限制解除](https://raw.githubusercontent.com/NobyDa/Script/master/Surge/Module/TestFlightDownload.sgmodule)
- [多个app广告屏蔽合集](https://github.com/app2smile/rules/blob/master/module/ad.sgmodule)
- [spotify会员解锁](https://raw.githubusercontent.com/app2smile/rules/master/module/spotify.module)
### 自制脚本

- [目录地址-->](https://github.com/zqzess/rule_for_quantumultX/tree/master/js/Mine)

    ------------------
### 参考鸣谢
- [@h2y](https://github.com/h2y)
- [@blackmatrix7](https://github.com/blackmatrix7/ios_rule_script)
- [@jdlingyu](https://github.com/jdlingyu/ad-wars/blob/master/hosts)
- [@Tartarus2014](https://github.com/Tartarus2014/QuantumultX-Script)
- [@GeQ1an](https://github.com/GeQ1an/Rules/tree/master)
- [@Koolson](https://github.com/Koolson/Qure)
- [@NobyDa](https://github.com/NobyDa/Script)
- [@TributePaulWalker](https://github.com/TributePaulWalker/Profiles)
- [@Peng-YM](https://github.com/Peng-YM)
- [@lhie1](https://github.com/lhie1/Rules)

    -----------------
### 访问量

![](http://profile-counter.glitch.me/zqzess/count.svg)

## 项目 Star 数增长趋势

[![Stargazers over time](https://starchart.cc/zqzess/rule_for_quantumultX.svg)](https://starchart.cc/zqzess/rule_for_quantumultX)
