#!/usr/bin/env python
# ‐*‐ coding:utf‐8 ‐*‐
"""code_info
@Time : 2021 2021/06/07 19:48
@Author : zqzess
@File : ad_quanX_lite.py
"""
import os
import re
import sys
import time
import wget


def Change():
    if not os.path.exists('../QuantumultX/rules'):
        os.makedirs('../QuantumultX/rules')
    out_fname = './rtmp/AdBlockTmp_lite.list'
    out_fname2 = '../QuantumultX/rules/AdBlock_lite.list'
    in_fname = './rtmp/ad_lite.list'
    in_fname3 = './rtmp/hosts'
    in_fname4 = './rtmp/1024hosts.txt'
    in_fname5 = './rtmp/Zhihu.txt'
    in_fname6 = './rtmp/adawayhosts.txt'

    # # 大圣净化
    # DATA_URL2 = 'https://raw.githubusercontent.com/jdlingyu/ad-wars/master/hosts'
    # # 1024_hosts - 1024网站和澳门皇家赌场
    # DATA_URL3 = 'https://raw.githubusercontent.com/Goooler/1024_hosts/master/hosts'
    # # 知乎
    # DATA_URL4 = 'https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/QuantumultX/ZhihuAds/ZhihuAds.list'
    # # AdAway Default Blocklist
    # DATA_URL5 = 'https://adaway.org/hosts.txt'
    #
    if os.path.exists(out_fname):
        os.remove(out_fname)
        print("AdBlockTmp_lite.list文件存在，已执行删除")
    if os.path.exists(out_fname2):
        os.remove(out_fname2)
        print("AdBlock_lite.list文件存在，已执行删除")
    # if os.path.exists(in_fname3):
    #     os.remove(in_fname3)
    #     print("hosts文件存在，已执行删除")
    # if os.path.exists(in_fname4):
    #     os.remove(in_fname4)
    #     print("1024hosts文件存在，已执行删除")
    # if os.path.exists(in_fname5):
    #     os.remove(in_fname5)
    #     print("zhihu文件存在，已执行删除")
    # if os.path.exists(in_fname6):
    #     os.remove(in_fname6)
    #     print("adawayhosts文件存在，已执行删除")
    # try:
    #     print("loading...." + DATA_URL2)
    #     wget.download(DATA_URL2, out=in_fname3)
    #     print("loading...." + DATA_URL3)
    #     wget.download(DATA_URL3, out=in_fname4)
    #     print("loading...." + DATA_URL4)
    #     wget.download(DATA_URL4, out=in_fname5)
    #     print("loading...." + DATA_URL5)
    #     wget.download(DATA_URL5, out=in_fname6)
    #     print("download success 下载完成")
    # except:
    #     print("download err 下载错误")

    try:
        if sys.version_info.major == 3:
            f1 = open(in_fname, "r", encoding="utf-8")
            f2 = open(out_fname, "w+", encoding="utf-8")
            f4 = open(in_fname3, "r", encoding="utf-8")
            f5 = open(in_fname4, "r", encoding="utf-8")
            f6 = open(in_fname5, "r", encoding="utf-8")
            f7 = open(in_fname6, "r", encoding="utf-8")
        else:
            f1 = open(in_fname, "r")
            f2 = open(out_fname, "w+")
            f4 = open(in_fname3, "r")
            f5 = open(in_fname4, "r")
            f6 = open(in_fname5, "r")
            f7 = open(in_fname6, "r")
    except:
        print("Error: 没有找到文件或读取文件失败")
    else:
        for lineTmp in f1.readlines():
            if lineTmp.find('# Adblock rules refresh time') == 0:
                # f2.write(lineTmp)
                # f2.write("\n")
                print("注释:" + lineTmp)
                continue
            keywords = lineTmp
            # pattern = re.compile(r'[a-zA-z]+')
            # result = re.search(r'[a-zA-z]+', keywords)
            result2 = re.findall(r'\.', keywords)
            result = re.match(r'^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$', keywords)  # 只匹配IP
            chineseWord=re.search(r'[\u4E00-\u9FFF]', keywords)
            # print(keywords)
            # print(result)
            # print(result2)
            # print(result2.__len__())
            if result is not None:
                # print(keywords)
                # print("IP放弃")
                if chineseWord is not None:
                    print("放弃,有汉字")
                else:
                    keywords = keywords.replace("\n", "").replace(" ", "")
                    keywords = "HOST," + keywords + ",AdBlock"
                    f2.write(keywords + "\n")
                continue
            if result2.__len__() == 1:
                if chineseWord is not None:
                    print("放弃,有汉字")
                else:
                    keywords = keywords.replace("\n", "").replace(" ", "")
                    keywords = "HOST-SUFFIX," + keywords + ",AdBlock"
                    f2.write(keywords + "\n")
            elif result2.__len__() == 2 | result2.__len__() == 3:
                if chineseWord is not None:
                    print("放弃,有汉字")
                else:
                    keywords = keywords.replace("\n", "").replace(" ", "")
                    keywords = "HOST," + keywords + ",AdBlock"
                    f2.write(keywords + "\n")

        # 大圣净化
        for lineTmp in f4.readlines():
            if re.search('localhost', lineTmp) is not None:
                print("注释:" + lineTmp)
                continue
            # if lineTmp.find('#') == 0:
            if re.search('#', lineTmp) is not None:
                # f2.write(lineTmp)
                print("注释:" + lineTmp)
                if re.search(r'[\u4E00-\u9FFF]', lineTmp) is not None:
                    print("放弃,有汉字")
                else:
                    f2.write(lineTmp)
                continue
            keywords = lineTmp
            # pattern = re.compile(r'[a-zA-z]+')
            result = re.search('127.0.0.1', keywords)
            chineseWord = re.search(r'[\u4E00-\u9FFF]', keywords)
            if result != None:
                if chineseWord is not None:
                    print("放弃,有汉字")
                else:
                    keywords = keywords.replace("127.0.0.1 ", "HOST,").replace("\n", "")
                    keywords = keywords + ",AdBlock\n"
                    f2.write(keywords)
                continue
        # 1024
        for lineTmp in f5.readlines():
            if re.search('localhost', lineTmp) is not None:
                print("注释:" + lineTmp)
                continue
            if re.search('#', lineTmp) is not None:
                # f2.write(lineTmp)
                print("注释:" + lineTmp)
                if re.search(r'[\u4E00-\u9FFF]', lineTmp) is not None:
                    print("放弃,有汉字")
                else:
                    f2.write(lineTmp)
                continue
            keywords = lineTmp
            # pattern = re.compile(r'[a-zA-z]+')
            result = re.findall('127.0.0.1', keywords)
            chineseWord = re.search(r'[\u4E00-\u9FFF]', keywords)
            if result != None:
                if result.__len__() == 1:
                    if chineseWord is not None:
                        print("放弃,有汉字")
                    else:
                        keywords = keywords.replace("127.0.0.1 ", "HOST,").replace("\n", "")
                        keywords = keywords + ",AdBlock\n"
                        f2.write(keywords)
                elif result.__len__() >= 2:
                    print("错误:" + keywords)
                continue
        # zhihu
        for lineTmp in f6.readlines():
            if lineTmp.find('#') == 0:
                print("注释:" + lineTmp)
                if re.search(r'[\u4E00-\u9FFF]', lineTmp) is not None:
                    print("放弃,有汉字")
                else:
                    f2.write(lineTmp)
                continue
            keywords = lineTmp
            result = re.search('Zhihu', keywords)
            chineseWord = re.search(r'[\u4E00-\u9FFF]', keywords)
            # print(result)
            if result != None:
                if chineseWord is not None:
                    print("放弃,有汉字")
                else:
                    keywords = keywords.replace("ZhihuAds", "AdBlock")
                    f2.write(keywords)
                continue

        # AdAway Default Blocklist
        for lineTmp in f7.readlines():
            if re.search('localhost', lineTmp) is not None:
                print("注释:" + lineTmp)
                continue
            # if lineTmp.find('#') == 0:
            if re.search('#', lineTmp) is not None:
                # f2.write(lineTmp)
                print("注释:" + lineTmp)
                if re.search(r'[\u4E00-\u9FFF]', lineTmp) is not None:
                    print("放弃,有汉字")
                else:
                    f2.write(lineTmp)
                continue
            keywords = lineTmp
            # pattern = re.compile(r'[a-zA-z]+')
            result = re.search('127.0.0.1', keywords)
            chineseWord = re.search(r'[\u4E00-\u9FFF]', keywords)
            if result != None:
                if chineseWord is not None:
                    print("放弃,有汉字")
                else:
                    keywords = keywords.replace("127.0.0.1 ", "HOST,").replace("\n", "")
                    keywords = keywords + ",AdBlock\n"
                    f2.write(keywords)
                continue

        f1.close()
        f2.close()
        f4.close()
        f5.close()
        f6.close()
        f7.close()

    # 去重
    a = 0
    lines_seen = set()
    outfile = open(out_fname2, "w+")
    outfile.write('# AdBlock rules refresh time: ' + time.strftime("%Y-%m-%d %H:%M:%S") + '\n\n')
    f = open(out_fname, "r")
    for line in f:
        if line not in lines_seen:
            a += 1
            outfile.write(line)
            lines_seen.add(line)
            # print(a)
            # print('\n')
    outfile.close()
    print(a)
    print("去重success")


if __name__ == '__main__':
    Change()