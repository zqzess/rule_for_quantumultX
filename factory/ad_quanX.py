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


def Change():
    if not os.path.exists('../rules'):
        os.makedirs('../rules')
    out_fname = '../rules/AdBlock.list'
    in_fname = '../rtmp/ad.list'
    if os.path.exists(out_fname):
        os.remove(out_fname)
        print("文件存在，已执行删除")

    file_ad = sys.stdout
    try:
        if sys.version_info.major == 3:
            f1 = open(in_fname, "r", encoding="utf-8")
            f2 = open(out_fname, "w+", encoding="utf-8")
        else:
            f1 = open(in_fname, "r")
            f2 = open(out_fname, "w+")
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
            if result == None:
                # print(keywords)
                keywords = keywords.replace("\n", "").replace(" ", "")
                keywords = "IP-CIDR," + keywords + ",AdBlock"
                f2.write(keywords + "\n")
                continue
            if result2.__len__() == 1:
                keywords = keywords.replace("\n", "").replace(" ", "")
                keywords = "HOST-SUFFIX," + keywords + ",AdBlock"
                f2.write(keywords + "\n")
            elif result2.__len__() == 2 | result2.__len__() == 3:
                keywords = keywords.replace("\n", "").replace(" ", "")
                keywords = "HOST," + keywords + ",AdBlock"
                f2.write(keywords + "\n")
        f1.close()
        f2.close()


if __name__ == '__main__':
    Change()
