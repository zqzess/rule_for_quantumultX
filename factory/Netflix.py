#!/usr/bin/env python
# ‐*‐ coding:utf‐8 ‐*‐
"""code_info
@Time : 2020 2020/11/4 18:33
@Author : zqzess
@File : Netflix.py
"""
import os
import sys
import time
import wget

in_fname='./rtmp/Netflix.list'
out_fname='../QuantumultX/rules/Netflix.list'

def download():
    DATA_URL='https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/QuantumultX/Netflix/Netflix.list'
    if os.path.exists(in_fname):
        os.remove(in_fname)
        print("Netflix.list临时文件存在，已执行删除")
    if os.path.exists(out_fname):
        os.remove(out_fname)
        print("Netflix.list文件存在，已执行删除")
    wget.download(DATA_URL, out=in_fname)

def change():
    download()
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
        f2.write('# Netflix rules refresh time: ' + time.strftime("%Y-%m-%d %H:%M:%S") + '\n')
        for lineTmp in f1.readlines():
            if lineTmp.find('#') == 0:
                print("注释:" + lineTmp)
                continue
            else:
                f2.write(lineTmp)
        f1.close()
        f2.close()
if __name__ == '__main__':
    change()