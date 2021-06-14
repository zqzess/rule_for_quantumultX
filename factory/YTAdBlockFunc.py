#!/usr/bin/env python
# ‐*‐ coding:utf‐8 ‐*‐
"""code_info
@Time : 2020 12/31/2020 9:49 PM
@Author : zqzess
@File : YTAdBlockFunc.py.py
"""
import os
import re
import sys
import time

import requests


def YTAdBlockFun():
    rules_url = [
        'https://raw.githubusercontent.com/pSandeep2020/youtubeAdlist/master/adlist.txt',
        'https://gist.githubusercontent.com/Ewpratten/a25ae63a7200c02c850fede2f32453cf/raw/f0778c8ff53345e6dbf8fe2987e70f4a6a8aacd6/hosts-yt-ads',
        'https://raw.githubusercontent.com/zqzess/YouTuBe_AdBlock/main/list.txt'
    ]
    rule = ''
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
            sys.exit('error in request %s\n\treturn code: %d' % (rule_url, r.status_code))

        rule = rule + r.text + '\n'

    # parse rule
    # print(rule)
    rule = rule.split('\n')
    for row in rule:
        row = row.strip()
        if row == '' or row.startswith('#'):
            print("注释" + row)
            continue
        elif re.search(r'advertisment', row):
            print('ignore: ' + row)
            continue
        elif re.match('0.0.0.0 ', row):
            # row0 = row
            row0 = row.replace("0.0.0.0 ", "HOST,")
            # print(row0)
            row0 = row0 + ",AdBlock"
            domains.append(row0)
        elif re.findall('googleusercontent', row):
            row0 = row
            row0="HOST,"+row0+",AdBlock"
            domains.append(row0)
        elif re.match('suggestqueries.google.com', row):
            row0 = row
            row0="HOST-SUFFIX,"+row0+",AdBlock"
            domains.append(row0)
        else:
            row0=row
            row0="HOST,"+row0+",AdBlock"
            domains.append(row0)

    print('规则处理完成..')
    print('wirte begin...写入开始')
    if not os.path.exists('../rules'):
        os.makedirs('../rules')
    file_ad = sys.stdout
    try:
        if sys.version_info.major == 3:
            file_ad = open('../QuantumultX/rules/AdBlock.list', 'a', encoding='utf-8')
        else:
            file_ad = open('../QuantumultX/rules/AdBlock.list', 'a')
    except:
        pass

    file_ad.write('\n' + '# YoutubeAdBlock rules refresh time: ' + time.strftime("%Y-%m-%d %H:%M:%S") + '\n\n')

    domains = list(set(domains))
    domains.sort()

    for item in domains:
        file_ad.write(item + '\n')
    print("write success...写入成功")


if __name__ == '__main__':
    YTAdBlockFun()
