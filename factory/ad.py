#!/usr/bin/env python
# ‐*‐ coding:utf‐8 ‐*‐
"""code_info
@Time : 2020 2020/10/23 15:32
@Author : zqzess
@File : ad.py.py
"""

# -*- coding: utf-8 -*-

#
# 提取广告规则，并且只提取对全域禁止的那种规则
#

# 参考 ADB 广告规则格式：https://adblockplus.org/filters
import os
import time
import sys
import requests
import re
import ad_quanX

import YTAdBlockFunc
import ad_surge
import ad_clash

rules_url = [
    # EasyList China
    #'https://easylist-downloads.adblockplus.org/easylistchina.txt',
    # EasyList + China
    'https://easylist-downloads.adblockplus.org/easylistchina+easylist.txt',
    # # 乘风 去视频广告
    # 'https://gitee.com/xinggsf/Adblock-Rule/raw/master/mv.txt',
    # #乘风 去广告
    # 'https://gitee.com/xinggsf/Adblock-Rule/raw/master/rule.txt',
    #乘风广告屏蔽github源
    'https://raw.githubusercontent.com/xinggsf/Adblock-Plus-Rule/master/rule.txt',
    # anti-ad-easylist  adguradhome
    # 'https://raw.githubusercontent.com/privacy-protection-tools/anti-AD/master/anti-ad-easylist.txt',
    # anti-ad-easylist  adgurad
    'https://anti-ad.net/adguard.txt',
    #Adbyby-lazy
    'https://raw.githubusercontent.com/adbyby/xwhyc-rules/master/lazy.txt',
    #Adbyby-video
    'https://raw.githubusercontent.com/adbyby/xwhyc-rules/master/video.txt',
    #AdGuard DNS filter
    'https://adguardteam.github.io/AdGuardSDNSFilter/Filters/filter.txt'

]

rule = ''

# contain both domains and ips
domains = []


for rule_url in rules_url:
    print('loading... ' + rule_url)

    # get rule text
    success = False
    try_times = 0
    r = None
    while try_times < 5 and not success:
        r = requests.get(rule_url)
        if r.status_code != 200:
            time.sleep(1)
            try_times = try_times + 1
        else:
            success = True
            break

    if not success:
        sys.exit('error in request %s\n\treturn code: %d' % (rule_url, r.status_code) )

    rule = rule + r.text + '\n'


# parse rule
rule = rule.split('\n')
for row in rule:
    row = row.strip()
    row0 = row

    # 处理广告例外规则

    if row.startswith('@@'):
        i = 0
        while i < len(domains):
            domain = domains[i]
            if domain in row:
                del domains[i]
            else:
                i = i + 1

        continue


    # 处理广告黑名单规则

    # 直接跳过
    if row=='' or row.startswith('!') or "$" in row or "##" in row:
        continue

    # 清除前缀
    row = re.sub(r'^\|?https?://', '', row)
    row = re.sub(r'^\|\|', '', row)
    row = row.lstrip('.*')

    # 清除后缀
    row = row.rstrip('/^*')
    row = re.sub(r':\d{2,5}$', '', row)  # 清除端口

    # 不能含有的字符
    if re.search(r'[/^:*]', row):
        print('ignore: '+row0)
        continue

    # 只匹配域名或 IP
    if re.match(r'^([a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,9}$', row) or re.match(r'^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$', row):
        domains.append(row)

print('done.')


# write into files
if not os.path.exists('./rtmp'):
    os.makedirs('./rtmp')
file_ad = sys.stdout
try:
    if sys.version_info.major == 3:
        file_ad = open('./rtmp/ad.list', 'w+', encoding='utf-8')
    else:
        file_ad = open('./rtmp/ad.list', 'w+')
except:
    pass

file_ad.write('# adblock rules refresh time: ' + time.strftime("%Y-%m-%d %H:%M:%S") + '\n')

domains = list( set(domains) )
domains.sort()

for item in domains:
    file_ad.write(item + '\n')

# #去重
# out_fname = './rtmp/adtmp.list'
# out_fname2 ='./rtmp/ad.list'
# a = 0
# lines_seen = set()
# outfile = open(out_fname2, "w+")
# outfile.write('# AdBlock rules refresh time: ' + time.strftime("%Y-%m-%d %H:%M:%S") + '\n\n')
# f = open(out_fname, "r")
# for line in f:
#     if line not in lines_seen:
#         a += 1
#         outfile.write(line)
#         lines_seen.add(line)
#         # print(a)
#         # print('\n')
# outfile.close()
# print(a)
# print("去重success")

print("转换开始")
ad_quanX.Change()
print("添加youtube去广告")
# YTAdBlockFunc.YTAdBlockFun()
print("Surge广告屏蔽转换开始")
ad_surge.SurgeAdChange()
print("Clash广告屏蔽转换开始")
ad_clash.ClashAdChange()
print("工作结束")
