#!/usr/bin/env python
# ‐*‐ coding:utf‐8 ‐*‐
"""code_info
@Time : 2020 2020/11/4 20:47
@Author : zqzess
@File : Mainland.py
"""
import os
import sys
import time
import wget
import re

in_fname='./rtmp/Mainland.list'
in_fname2='./rtmp/China.list'
in_fname3='./rtmp/ChinaIPs.list'
# in_fname4='./rtmp/ChinaTest.list'
out_fname='../QuantumultX/rules/Mainland.list'
out_fname2='./rtmp/MainlandTmp.list'

def download():
    DATA_URL='https://raw.githubusercontent.com/GeQ1an/Rules/master/QuantumultX/Filter/Mainland.list'
    DATA_URL2='https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/QuantumultX/China/China.list'
    DATA_URL3='https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/QuantumultX/ChinaIPs/ChinaIPs.list'
    # DATA_URL4='https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/QuantumultX/ChinaTest/ChinaTest.list'
    if os.path.exists(in_fname):
        os.remove(in_fname)
        print("CMedia.list临时文件存在，已执行删除")
    if os.path.exists(in_fname2):
        os.remove(in_fname2)
        print("China.list文件存在，已执行删除")
    if os.path.exists(in_fname3):
        os.remove(in_fname3)
        print("ChinaIPs.list文件存在，已执行删除")
    # if os.path.exists(in_fname4):
    #     os.remove(in_fname4)
    #     print("ChinaTest.list文件存在，已执行删除")
    if os.path.exists(out_fname):
        os.remove(out_fname)
        print("Mainland.list文件存在，已执行删除")
    if os.path.exists(out_fname2):
        os.remove(out_fname2)
        print("MainlandTmp.list文件存在，已执行删除")

    wget.download(DATA_URL, out=in_fname)
    wget.download(DATA_URL2, out=in_fname2)
    wget.download(DATA_URL3, out=in_fname3)
    # wget.download(DATA_URL4, out=in_fname4)

def Mainland():
    print("Mainland")
    try:
        if sys.version_info.major == 3:
            f1 = open(in_fname, "r", encoding="utf-8")
            f2 = open(out_fname2, "w+", encoding="utf-8")
        else:
            f1 = open(in_fname, "r")
            f2 = open(out_fname2, "w+")
    except:
        print("Error: 没有找到文件或读取文件失败")
    else:
        # f2.write('# CMedia rules refresh time: ' + time.strftime("%Y-%m-%d %H:%M:%S") + '\n')
        for lineTmp in f1.readlines():
            if lineTmp.find('#') == 0:
                print("注释:" + lineTmp)
                continue
            else:
                f2.write(lineTmp)
        f1.close()
        f2.close()
def China():
    print("China")
    try:
        if sys.version_info.major == 3:
            f1 = open(in_fname2, "r", encoding="utf-8")
            f2 = open(out_fname2, "a+", encoding="utf-8")
        else:
            f1 = open(in_fname2, "r")
            f2 = open(out_fname2, "a+")
    except:
        print("Error: 没有找到文件或读取文件失败")
    else:
        f2.write("\n")
        for lineTmp in f1.readlines():
            if lineTmp.find('#') == 0:
                print("注释:" + lineTmp)
                continue
            keywords = lineTmp
            result = re.search('China', keywords)
            # print(result)
            if result != None:
                keywords = keywords.replace("China", "Mainland")
                f2.write(keywords)
                continue
        f1.close()
        f2.close()

def ChinaIPs():
    print("ChinaIPs")
    try:
        if sys.version_info.major == 3:
            f1 = open(in_fname3, "r", encoding="utf-8")
            f2 = open(out_fname2, "a+", encoding="utf-8")
        else:
            f1 = open(in_fname3, "r")
            f2 = open(out_fname2, "a+")
    except:
        print("Error: 没有找到文件或读取文件失败")
    else:
        f2.write("\n")
        for lineTmp in f1.readlines():
            if lineTmp.find('#') == 0:
                print("注释:" + lineTmp)
                continue
            keywords = lineTmp
            result = re.search('ChinaIPs', keywords)
            if result != None:
                keywords = keywords.replace("ChinaIPs", "Mainland")
                f2.write(keywords)
                continue
        f1.close()
        f2.close()
# def ChinaTest():
#     print("ChinaTest")
#     try:
#         if sys.version_info.major == 3:
#             f1 = open(in_fname4, "r", encoding="utf-8")
#             f2 = open(out_fname2, "a+", encoding="utf-8")
#         else:
#             f1 = open(in_fname4, "r")
#             f2 = open(out_fname2, "a+")
#     except:
#         print("Error: 没有找到文件或读取文件失败")
#     else:
#         f2.write("\n")
#         for lineTmp in f1.readlines():
#             if lineTmp.find('#') == 0:
#                 print("注释:" + lineTmp)
#                 continue
#             keywords = lineTmp
#             result = re.search('ChinaTest', keywords)
#             if result != None:
#                 keywords = keywords.replace("ChinaTest", "Mainland")
#                 f2.write(keywords)
#                 continue
#         f1.close()
#         f2.close()

def mainchange():
    download()
    Mainland()
    China()
    # ChinaIPs()
    # ChinaTest()
#去重
    a = 0
    lines_seen = set()
    outfile = open(out_fname, "w+")
    outfile.write('# Mainland rules refresh time: ' + time.strftime("%Y-%m-%d %H:%M:%S") + '\n\n')
    f = open(out_fname2, "r")
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
    mainchange()