#!/usr/bin/env python
# ‐*‐ coding:utf‐8 ‐*‐
"""code_info
@Time : 2020 2020/11/4 20:12
@Author : zqzess
@File : GMedia.py
"""
import os
import sys
import time
import wget
import re

in_fname='./rtmp/GMedia.list'
in_fname2='./rtmp/GlobalMedia.list'
out_fname='../QuantumultX/rules/GMedia.list'
out_fname2='./rtmp/GMediaTmp.list'

def download():
    DATA_URL='https://raw.githubusercontent.com/GeQ1an/Rules/master/QuantumultX/Filter/GMedia.list'
    DATA_URL2='https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/QuantumultX/GlobalMedia/GlobalMedia.list'
    if os.path.exists(in_fname):
        os.remove(in_fname)
        print("GMedia.list临时文件存在，已执行删除")
    if os.path.exists(in_fname2):
        os.remove(in_fname2)
        print("GlobalMedia.list文件存在，已执行删除")
    if os.path.exists(out_fname):
        os.remove(out_fname)
        print("GMedia.list文件存在，已执行删除")
    if os.path.exists(out_fname2):
        os.remove(out_fname2)
        print("GMediaTmp.list文件存在，已执行删除")

    wget.download(DATA_URL, out=in_fname)
    wget.download(DATA_URL2, out=in_fname2)

def GMedia():
    print("GMedia")
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
def GlobalMedia():
    print("GlobalMedia")
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
            result = re.search('GlobalMedia', keywords)
            # print(result)
            if result != None:
                keywords = keywords.replace("GlobalMedia", "GMedia").replace(",foreignmedia","")
                f2.write(keywords)
                continue
        f1.close()
        f2.close()

def mainchange():
    download()
    GMedia()
    GlobalMedia()

#去重
    a = 0
    lines_seen = set()
    outfile = open(out_fname, "w+")
    outfile.write('# GMedia rules refresh time: ' + time.strftime("%Y-%m-%d %H:%M:%S") + '\n\n')
    f = open(out_fname2, "r")
    for line in f:
        if line not in lines_seen:
            a += 1
            outfile.write(line)
            lines_seen.add(line)
            print(a)
            print('\n')
    outfile.close()
    print("去重success")

if __name__ == '__main__':
    mainchange()