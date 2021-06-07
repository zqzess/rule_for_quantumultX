#!/usr/bin/env python
# ‐*‐ coding:utf‐8 ‐*‐
"""code_info
@Time : 2021 2021/06/07 19:48
@Author : zqzess
@File : ad_surge_lite.py
"""

import os
import re
import sys


def SurgeAdChange():
    if not os.path.exists('../Surge/List'):
        os.makedirs('../Surge/List')
    out_fname = '../Surge/List/AdBlock_lite.list'
    in_fname = '../QuantumultX/rules/AdBlock_lite.list'

    if os.path.exists(out_fname):
        os.remove(out_fname)
        print("AdBlock_lite.list文件存在，已执行删除")
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
            # if lineTmp.find('#') == 0:
            #     print("注释:" + lineTmp)
            #     f2.write(lineTmp)
            #     continue
            keywords = lineTmp
            result1 = re.search(r'HOST,', keywords)
            result2 = re.search(r'HOST-SUFFIX', keywords)
            result3 = re.search(r'IP-CIDR', keywords)
            result4 = re.search(r'HOST-KEYWORD', keywords)
            result5 = re.search(r'IP-CIDR', keywords)
            if re.search(r'#',keywords) is not None:
                f2.write(keywords)
                continue
            elif result1 is not None:
                keywords = keywords.replace("\n", "").replace("HOST,","DOMAIN,").replace(",AdBlock", "")
                f2.write(keywords + "\n")
                continue
            elif result2 is not None:
                keywords = keywords.replace("\n", "").replace("HOST-SUFFIX,","DOMAIN-SUFFIX,").replace(",AdBlock","")
                f2.write(keywords + "\n")
                continue
            elif result3 is not None:
                keywords = keywords.replace("\n", "").replace(",AdBlock",",no-resolve")
                f2.write(keywords + "\n")
                continue
            elif result4 is not None:
                keywords = keywords.replace("\n", "").replace("HOST-KEYWORD,","DOMAIN-KEYWORD,").replace(",AdBlock","")
                f2.write(keywords + "\n")
                continue
            elif result5 is not None:
                keywords = keywords.replace("\n", "").replace("IP6-CIDR,","IP-CIDR6,").replace(",AdBlock","")
                f2.write(keywords + "\n")
        f1.close()
        f2.close()


if __name__ == '__main__':
    SurgeAdChange()