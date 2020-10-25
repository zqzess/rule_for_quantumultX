#!/usr/bin/env python
# ‐*‐ coding:utf‐8 ‐*‐
"""code_info
@Time : 2020 2020/10/23 16:06
@Author : zqzess
@File : ad_quanX.py
"""
import os
import re
import sys

import wget


def Change():
    if not os.path.exists('../rules'):
        os.makedirs('../rules')
    out_fname = '../rules/AdBlock.list'
    in_fname = './rtmp/ad.list'
    out_fname2='./rtmp/Advertising.list'
    DATA_URL='https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/QuantumultX/Advertising/Advertising.list'
    if os.path.exists(out_fname):
        os.remove(out_fname)
        print("文件存在，已执行删除")

    if os.path.exists(out_fname2):
        os.remove(out_fname2)
        print("文件存在，已执行删除")
    wget.download(DATA_URL, out=out_fname2)
    try:
        if sys.version_info.major == 3:
            f1 = open(in_fname, "r", encoding="utf-8")
            f2 = open(out_fname, "w+", encoding="utf-8")
            f3 = open(out_fname2, "r", encoding="utf-8")
        else:
            f1 = open(in_fname, "r")
            f2 = open(out_fname, "w+")
            f3 = open(out_fname2, "r")
    except:
        print("Error: 没有找到文件或读取文件失败")
    else:
        for lineTmp in f1.readlines():
            if lineTmp.find('# adblock rules refresh time') == 0:
                f2.write(lineTmp)
                f2.write("\n")
                print("注释:" + lineTmp)
                continue
            keywords = lineTmp
            # pattern = re.compile(r'[a-zA-z]+')
            result = re.search(r'[a-zA-z]+', keywords)
            result2 = re.findall(r'\.', keywords)
            # print(keywords)
            # print(result2)
            # print(result2.__len__())
            # if result == None:
            #     # print(keywords)
            #     keywords = keywords.replace("\n", "").replace(" ", "")
            #     keywords = "IP-CIDR," + keywords + ",AdBlock"
            #     f2.write(keywords + "\n")
            #     continue
            if result2.__len__() == 1:
                keywords = keywords.replace("\n", "").replace(" ", "")
                keywords = "HOST-SUFFIX," + keywords + ",AdBlock"
                f2.write(keywords + "\n")
            elif result2.__len__() == 2 | result2.__len__() == 3:
                keywords = keywords.replace("\n", "").replace(" ", "")
                keywords = "HOST," + keywords + ",AdBlock"
                f2.write(keywords + "\n")
        for lineTmp in f3.readlines():
            keywords = lineTmp
            # pattern = re.compile(r'[a-zA-z]+')
            result = re.search('IP-CIDR', keywords)
            result2 = re.search('HOST-KEYWORD', keywords)
            # print(result)
            # print(result2)
            if result != None:
                keywords = keywords.replace("Advertising", "AdBlock")
                f2.write(keywords)
                continue
            if result2 != None:
                keywords = keywords.replace("Advertising", "AdBlock")
                f2.write(keywords)
        f1.close()
        f2.close()



if __name__ == '__main__':
    Change()
